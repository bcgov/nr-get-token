const log = require('npmlog');

const { acronymService } = require('../services');

class KeyCloakServiceClientManager {
  constructor(realmAdminService) {
    if (!realmAdminService) {
      log.error('KeyCloakServiceClientManager - no realm admin service provided.');
      throw new Error('KeyCloakServiceClientManager requires RealmAdminService.  Check configuration.');
    }
    this.svc = realmAdminService;
  }

  async manage({ applicationAcronym, applicationName, applicationDescription, commonServices }) {
    log.info('KeyCloakServiceClientManager.manage ', `${applicationAcronym}, ${applicationName}, ${applicationDescription}, [${commonServices}]`);
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
    const clientRoleName = 'COMMON_SERVICES';

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
}

module.exports = KeyCloakServiceClientManager;
