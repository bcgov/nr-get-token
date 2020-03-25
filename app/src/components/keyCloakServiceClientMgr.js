const log = require('npmlog');

const { acronymService } = require('../services');

const COMMON_SVC_COMPOSITE = 'COMMON_SERVICES';

class KeyCloakServiceClientManager {
  constructor(realmAdminService) {
    if (!realmAdminService) {
      log.error('KeyCloakServiceClientManager - no realm admin service provided.');
      throw new Error('KeyCloakServiceClientManager requires RealmAdminService.  Check configuration.');
    }
    this.svc = realmAdminService;
  }

  async manage({ applicationAcronym, applicationName, applicationDescription, commonServices }) {
    log.debug('KeyCloakServiceClientManager.manage', `${applicationAcronym}, ${applicationName}, ${applicationDescription}, [${commonServices}]`);
    if (!applicationAcronym) {
      log.error('KeyCloakServiceClientManager - no applicationAcronymprovided.');
      throw new Error('Cannot manage service clients in KeyCloak realm: applicationAcronym required.');
    }
    if (!applicationName) {
      log.error('KeyCloakServiceClientManager - no applicationName provided.');
      throw new Error('Cannot manage service clients in KeyCloak realm: applicationName required.');
    }
    if (!applicationDescription) {
      log.error('KeyCloakServiceClientManager - no applicationDescription provided.');
      throw new Error('Cannot manage service clients in KeyCloak realm: applicationDescription required.');
    }
    if (!commonServices) {
      log.error('KeyCloakServiceClientManager - no commonServices provided.');
      throw new Error('Cannot manage service clients in KeyCloak realm: commonServices required.');
    }

    const clientId = `${applicationAcronym.toUpperCase()}_SERVICE_CLIENT`;
    const clientRoleName = COMMON_SVC_COMPOSITE;

    const clients = await this.svc.getClients();
    let serviceClient = clients.find(x => x.clientId === clientId);
    if (!serviceClient) {
      serviceClient = await this.svc.createClient(clientId, applicationName, applicationDescription);
    } else {
      // may have changed the name and description...
      serviceClient = await this.svc.updateClientDetails(serviceClient, applicationName, applicationDescription);
    }

    // get all the selected common services and their roles
    // add roles to the lob COMMON_SERVICE role
    // commonServices is an array of clientIds

    // was an inline function, but that's a code smell...
    // eslint-disable-next-line no-inner-declarations
    function getCmnSrvClient(clientId) {
      return clients.find(y => { return clientId === y.clientId; });
    }

    let commonServiceRoles = [];
    if (commonServices && commonServices.length > 0) {
      for (const cmnSrvClientId of commonServices) {
        const cmnSrvClient = getCmnSrvClient(cmnSrvClientId);
        if (cmnSrvClient) {
          const cmnSrvClientRoles = await this.svc.getClientRoles(cmnSrvClient.id);
          commonServiceRoles = commonServiceRoles.concat(cmnSrvClientRoles);
        }
      }
    }

    // this is an easier way than reading which roles and composites are in place.
    // just remove the service client role (if exists) and start from scratch each time.
    let clientRoles = await this.svc.getClientRoles(serviceClient.id);
    let commonServicesRole = clientRoles.find(x => x.name === clientRoleName);
    if (commonServicesRole) {
      await this.svc.removeClientRole(serviceClient.id, clientRoleName);
    }

    // add in new role...
    clientRoles = await this.svc.addClientRole(serviceClient.id, clientRoleName);
    // get the common service role for service client
    commonServicesRole = clientRoles.find(x => x.name === clientRoleName);

    // pass in the list of roles from the common services (if any).
    // this will set the composite roles, the service client will have access to all of these common service roles.
    await this.svc.setRoleComposites(serviceClient, clientRoleName, commonServiceRoles);

    // get the service account user...
    const serviceAccountUser = await this.svc.getServiceAccountUser(serviceClient.id);
    //  add the service account role to them...
    await this.svc.addServiceAccountRole(serviceAccountUser.id, serviceClient.id, commonServicesRole);

    // now go get the lob client secret, and we will return it
    const clientSecret = await this.svc.getClientSecret(serviceClient.id);

    // Update the acronym details stored in the GETOK DB
    await acronymService.updateDetails(applicationAcronym, applicationName, applicationDescription);

    // return information for logging in as this new service client.
    return {
      generatedPassword: clientSecret.value,
      generatedServiceClient: serviceClient.clientId,
      oidcTokenUrl: this.svc.tokenUrl
    };
  }

  async fetchClients(applicationAcronymList) {
    log.debug('KeyCloakServiceClientManager.fetchClients', applicationAcronymList);
    if (!applicationAcronymList || !Array.isArray(applicationAcronymList)) {
      log.error('KeyCloakServiceClientManager.fetchClients', 'No applicationAcronymList provided.');
      throw new Error('Cannot find service clients in KeyCloak realm: applicationAcronymList array required.');
    }
    if (!applicationAcronymList.length) {
      log.error('KeyCloakServiceClientManager.fetchClients', 'No applicationAcronymList contents provided.');
      throw new Error('Cannot find service clients in KeyCloak realm: applicationAcronymList containing acronyms required.');
    }

    const clients = await this.svc.getClients();
    const clientIdsNeeded = applicationAcronymList.map(acr => `${acr.toUpperCase()}_SERVICE_CLIENT`);
    const serviceClientList = clients.filter(x => clientIdsNeeded.includes(x.clientId));

    const unresolvedPromises = serviceClientList.map(sc => this.makeClientDetails(sc));
    return await Promise.all(unresolvedPromises);
  }

  async makeClientDetails(serviceClient) {
    if (serviceClient && serviceClient.id) {
      // get the service account user.
      const serviceAccountUser = await this.svc.getServiceAccountUser(serviceClient.id);
      const roleComposites = await this.svc.getRoleComposites(serviceClient.id, COMMON_SVC_COMPOSITE);

      // return desired info for the GETOK API for this service client.
      const detailObject = {
        id: serviceClient.id,
        clientId: serviceClient.clientId,
        enabled: serviceClient.enabled,
        name: serviceClient.name,
        description: serviceClient.description,
        serviceAccountEmail: serviceAccountUser ? serviceAccountUser.email : ''
      };
      if (roleComposites && roleComposites.length) {
        detailObject.commonServiceRoles = roleComposites
          .filter(role => role.name !== 'uma_protection')
          .map(role => ({
            name: role.name,
            description: role.description
          }));
      }
      return detailObject;

    } else {
      log.debug('KeyCloakServiceClientManager.fetchClient', 'No service client id');
      return undefined;
    }
  }

  async findUser(username) {
    log.debug('KeyCloakServiceClientManager.findUser', username);
    if (!username) {
      log.error('KeyCloakServiceClientManager.findUser', 'No user provided.');
      throw new Error('Cannot get a user in KeyCloak realm: username required.');
    }

    const users = await this.svc.getUsers(username);

    if (users && users.length) {
      // Can only be one user by identified username (idir or github or whatever)
      return users[0];
    } else {
      log.debug('KeyCloakServiceClientManager.findUser', `No user found for ${username}`);
      return undefined;
    }
  }

  async fetchAllClients() {
    log.info('KeyCloakServiceClientManager.fetchAllClients');

    //get all service clients
    // NOTE: this seems to return all the service clinets but shows a ERR 400 in the console for all the methods in the reamlAdminSvc class
    const clients = await this.svc.getClients();

    // get details for each service client
    const clientsWithDetails = clients.map(sc => this.makeClientDetails(sc));

    return await Promise.all(clientsWithDetails);
  }

}

module.exports = KeyCloakServiceClientManager;
