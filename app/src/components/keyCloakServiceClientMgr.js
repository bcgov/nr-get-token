const log = require('./log')(module.filename);

const { acronymService } = require('../services');

const COMMON_SVC_COMPOSITE = 'COMMON_SERVICES';

class KeyCloakServiceClientManager {
  constructor(realmAdminService) {
    if (!realmAdminService) {
      log.error(
        'KeyCloakServiceClientManager - no realm admin service provided.',
        { function: 'constructor' }
      );
      throw new Error(
        'KeyCloakServiceClientManager requires RealmAdminService.  Check configuration.'
      );
    }
    this.svc = realmAdminService;
  }

  async manage({
    applicationAcronym,
    applicationName,
    applicationDescription,
    commonServices,
  }) {
    log.debug(
      `${applicationAcronym}, ${applicationName}, ${applicationDescription}, [${commonServices}]`,
      { function: 'manage' }
    );
    if (!applicationAcronym) {
      log.error(
        'KeyCloakServiceClientManager - no applicationAcronymprovided.',
        { function: 'manage' }
      );
      throw new Error(
        'Cannot manage service clients in KeyCloak realm: applicationAcronym required.'
      );
    }
    if (!applicationName) {
      log.error('KeyCloakServiceClientManager - no applicationName provided.', {
        function: 'manage',
      });
      throw new Error(
        'Cannot manage service clients in KeyCloak realm: applicationName required.'
      );
    }
    if (!applicationDescription) {
      log.error(
        'KeyCloakServiceClientManager - no applicationDescription provided.',
        { function: 'manage' }
      );
      throw new Error(
        'Cannot manage service clients in KeyCloak realm: applicationDescription required.'
      );
    }
    if (!commonServices) {
      log.error('KeyCloakServiceClientManager - no commonServices provided.', {
        function: 'manage',
      });
      throw new Error(
        'Cannot manage service clients in KeyCloak realm: commonServices required.'
      );
    }

    const clientId = `${applicationAcronym.toUpperCase()}_SERVICE_CLIENT`;
    const clientRoleName = COMMON_SVC_COMPOSITE;

    const clients = await this.svc.getClients();
    let serviceClient = clients.find((x) => x.clientId === clientId);
    if (!serviceClient) {
      serviceClient = await this.svc.createClient(
        clientId,
        applicationName,
        applicationDescription
      );
    } else {
      // may have changed the name and description...
      serviceClient = await this.svc.updateClientDetails(
        serviceClient,
        applicationName,
        applicationDescription
      );
      // generate new password
      // TODO: if this gets moved to a separate action, where it's not updating client details at the same time
      // move this generate new call out of manage to a separate call through this class
      await this.svc.generateNewClientSecret(serviceClient.id);
    }

    // get all the selected common services and their roles
    // add roles to the lob COMMON_SERVICE role
    // commonServices is an array of clientIds

    // was an inline function, but that's a code smell...
    // eslint-disable-next-line no-inner-declarations
    function getCmnSrvClient(clientId) {
      return clients.find((y) => {
        return clientId === y.clientId;
      });
    }

    let commonServiceRoles = [];
    if (commonServices && commonServices.length > 0) {
      for (const cmnSrvClientId of commonServices) {
        const cmnSrvClient = getCmnSrvClient(cmnSrvClientId);
        if (cmnSrvClient) {
          const cmnSrvClientRoles = await this.svc.getClientRoles(
            cmnSrvClient.id
          );
          commonServiceRoles = commonServiceRoles.concat(cmnSrvClientRoles);
        }
      }
    }

    // this is an easier way than reading which roles and composites are in place.
    // just remove the service client role (if exists) and start from scratch each time.
    let clientRoles = await this.svc.getClientRoles(serviceClient.id);
    let commonServicesRole = clientRoles.find((x) => x.name === clientRoleName);
    if (commonServicesRole) {
      await this.svc.removeClientRole(serviceClient.id, clientRoleName);
    }

    // add in new role...
    clientRoles = await this.svc.addClientRole(
      serviceClient.id,
      clientRoleName
    );
    // get the common service role for service client
    commonServicesRole = clientRoles.find((x) => x.name === clientRoleName);

    // pass in the list of roles from the common services (if any).
    // this will set the composite roles, the service client will have access to all of these common service roles.
    await this.svc.setRoleComposites(
      serviceClient,
      clientRoleName,
      commonServiceRoles
    );

    // get the service account user...
    const serviceAccountUser = await this.svc.getServiceAccountUser(
      serviceClient.id
    );
    //  add the service account role to them...
    await this.svc.addServiceAccountRole(
      serviceAccountUser.id,
      serviceClient.id,
      commonServicesRole
    );

    // now go get the lob client secret, and we will return it
    const clientSecret = await this.svc.getClientSecret(serviceClient.id);

    // Update the acronym details stored in the GETOK DB
    await acronymService.updateDetails(
      applicationAcronym,
      applicationName,
      applicationDescription
    );

    // return information for logging in as this new service client.
    return {
      generatedPassword: clientSecret.value,
      generatedServiceClient: serviceClient.clientId,
      oidcTokenUrl: this.svc.tokenUrl,
    };
  }

  async fetchClients(applicationAcronymList) {
    log.debug(applicationAcronymList, { function: 'fetchClients' });
    if (!applicationAcronymList || !Array.isArray(applicationAcronymList)) {
      log.error('No applicationAcronymList provided.', {
        function: 'fetchClients',
      });
      throw new Error(
        'Cannot find service clients in KeyCloak realm: applicationAcronymList array required.'
      );
    }
    if (!applicationAcronymList.length) {
      log.error('No applicationAcronymList contents provided.', {
        function: 'fetchClients',
      });
      throw new Error(
        'Cannot find service clients in KeyCloak realm: applicationAcronymList containing acronyms required.'
      );
    }

    const clients = await this.svc.getClients();
    const clientIdsNeeded = applicationAcronymList.map(
      (acr) => `${acr.toUpperCase()}_SERVICE_CLIENT`
    );
    const serviceClientList = clients.filter((x) =>
      clientIdsNeeded.includes(x.clientId)
    );

    const unresolvedPromises = serviceClientList.map((sc) =>
      this.makeClientDetails(sc)
    );
    return await Promise.all(unresolvedPromises);
  }

  async makeClientDetails(serviceClient) {
    if (serviceClient && serviceClient.id) {
      // get the service account user.
      const serviceAccountUser = await this.svc.getServiceAccountUser(
        serviceClient.id
      );
      const roleComposites = await this.svc.getRoleComposites(
        serviceClient.id,
        COMMON_SVC_COMPOSITE
      );

      // return desired info for the GETOK API for this service client.
      const detailObject = {
        id: serviceClient.id,
        clientId: serviceClient.clientId,
        enabled: serviceClient.enabled,
        name: serviceClient.name,
        description: serviceClient.description,
        serviceAccountEmail: serviceAccountUser ? serviceAccountUser.email : '',
      };
      if (roleComposites && roleComposites.length) {
        detailObject.commonServiceRoles = roleComposites
          .filter((role) => role.name !== 'uma_protection')
          .map((role) => ({
            name: role.name,
            description: role.description,
          }));
      }
      return detailObject;
    } else {
      log.debug('No service client id', { function: 'fetchClients' });
      return undefined;
    }
  }

  // Get all users based on search param, supply undefined as searchParams to get ALL users in realm
  async findUsers(searchParams) {
    log.debug(`Params: ${JSON.stringify(searchParams)}`, {
      function: 'findUsers',
    });

    const users = await this.svc.getUsers(searchParams);

    if (users && users.length) {
      return users;
    } else {
      log.debug(`No users found for ${JSON.stringify(searchParams)}`, {
        function: 'findUsers',
      });
      return undefined;
    }
  }

  async fetchAllClients() {
    log.debug('KeyCloakServiceClientManager.fetchAllClients');

    //get all service clients
    const clients = await this.svc.getClients();

    // return clients that match '*_SERVICE_CLIENT';
    return clients.filter((cl) => cl.clientId.match(/.*_SERVICE_CLIENT$/));
  }
}

module.exports = KeyCloakServiceClientManager;
