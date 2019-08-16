const axios = require('axios');
const oauth = require('axios-oauth-client');
const tokenProvider = require('axios-token-interceptor');
const log = require('npmlog');

class RealmAdminService {
  constructor({realmId, realmBaseUrl, clientId, clientSecret}) {
    log.info('RealmAdminService ', `${realmId}, ${realmBaseUrl}, ${clientId}, secret`);
    this.grantType = 'client_credentials';
    this.realmId = realmId;
    this.realmBaseUrl = realmBaseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    this.tokenUrl = `${this.realmBaseUrl}/auth/realms/${this.realmId}/protocol/openid-connect/token`;
    this.realmAdminUrl = `${this.realmBaseUrl}/auth/admin/realms/${this.realmId}`;

    this.axios = axios.create();
    this.axios.interceptors.request.use(
      // Wraps axios-token-interceptor with oauth-specific configuration,
      // fetches the token using the desired claim method, and caches
      // until the token expires
      oauth.interceptor(tokenProvider, oauth.client(axios.create(), {
        url: this.tokenUrl,
        grant_type: this.grantType,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: ''
      }))
    );
  }

  async getRealm() {
    const response = await this.axios.get(this.realmAdminUrl)
      .catch(e => {
        log.error('RealmAdminService.getRealm', JSON.stringify(e));
        throw e;
      });
    return response.data;
  }

  async getClients() {
    const response = await this.axios.get(`${this.realmAdminUrl}/clients`)
      .catch(e => {
        log.error('RealmAdminService.getClients', JSON.stringify(e));
        throw e;
      });
    return response.data;
  }

  async getClient(id) {
    const response = await this.axios.get(`${this.realmAdminUrl}/clients/${id}`)
      .catch(e => {
        log.error('RealmAdminService.getClient', JSON.stringify(e));
        throw e;
      });
    return response.data;
  }

  async createClient(clientId, name, description) {
    const defaults = {
      'clientId': '',
      'name': '',
      'description': '',
      'authorizationServicesEnabled': true,
      'surrogateAuthRequired': false,
      'enabled': true,
      'clientAuthenticatorType': 'client-secret',
      'redirectUris': [],
      'webOrigins': [],
      'notBefore': 0,
      'bearerOnly': false,
      'consentRequired': false,
      'standardFlowEnabled': false,
      'implicitFlowEnabled': false,
      'directAccessGrantsEnabled': false,
      'serviceAccountsEnabled': true,
      'publicClient': false,
      'frontchannelLogout': false,
      'protocol': 'openid-connect',
      'attributes': {
        'saml.assertion.signature': 'false',
        'saml.multivalued.roles': 'false',
        'saml.force.post.binding': 'false',
        'saml.encrypt': 'false',
        'saml.server.signature': 'false',
        'saml.server.signature.keyinfo.ext': 'false',
        'exclude.session.state.from.auth.response': 'false',
        'saml_force_name_id_format': 'false',
        'saml.client.signature': 'false',
        'tls.client.certificate.bound.access.tokens': 'false',
        'saml.authnstatement': 'false',
        'display.on.consent.screen': 'false',
        'saml.onetimeuse.condition': 'false'
      },
      'authenticationFlowBindingOverrides': {},
      'fullScopeAllowed': false,
      'nodeReRegistrationTimeout': -1,
      'protocolMappers': [
        {
          'name': 'Client ID',
          'protocol': 'openid-connect',
          'protocolMapper': 'oidc-usersessionmodel-note-mapper',
          'consentRequired': false,
          'config': {
            'user.session.note': 'clientId',
            'id.token.claim': 'true',
            'access.token.claim': 'true',
            'claim.name': 'clientId',
            'jsonType.label': 'String'
          }
        },
        {
          'name': 'Client Host',
          'protocol': 'openid-connect',
          'protocolMapper': 'oidc-usersessionmodel-note-mapper',
          'consentRequired': false,
          'config': {
            'user.session.note': 'clientHost',
            'id.token.claim': 'true',
            'access.token.claim': 'true',
            'claim.name': 'clientHost',
            'jsonType.label': 'String'
          }
        },
        {
          'name': 'Client IP Address',
          'protocol': 'openid-connect',
          'protocolMapper': 'oidc-usersessionmodel-note-mapper',
          'consentRequired': false,
          'config': {
            'user.session.note': 'clientAddress',
            'id.token.claim': 'true',
            'access.token.claim': 'true',
            'claim.name': 'clientAddress',
            'jsonType.label': 'String'
          }
        }
      ],
      'defaultClientScopes': [
        'web-origins',
        'roles'
      ],
      'optionalClientScopes': [],
      'access': {
        'view': true,
        'configure': true,
        'manage': true
      }
    };

    const applicationDetails = {
      'clientId': clientId,
      'name': name,
      'description': description
    };

    const requestBody = {...defaults, ...applicationDetails};
    const response = await this.axios.post(
      `${this.realmAdminUrl}/clients`,
      JSON.stringify(requestBody),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).catch(e => {
      log.error('RealmAdminService.createClient', JSON.stringify(e));
      throw e;
    });

    // check for 201, get the location header... it'll have the id
    const resourceUrl = response.headers.location;
    const fetchResponse = await this.axios.get(resourceUrl);
    return fetchResponse.data;
  }

  async updateClientDetails(client, name, description) {
    const applicationDetails = {
      'name': name,
      'description': description
    };

    const requestBody = {...client, ...applicationDetails};
    await this.axios.put(
      `${this.realmAdminUrl}/clients/${client.id}`,
      JSON.stringify(requestBody),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).catch(e => {
      log.error('RealmAdminService.updateClientDetails', JSON.stringify(e));
      throw e;
    });
    // response should be 204... go fetch the updated client...
    return await this.getClient(client.id);
  }

  async getClientSecret(id) {
    const response = await this.axios.get(`${this.realmAdminUrl}/clients/${id}/client-secret`
    ).catch(e => {
      log.error('RealmAdminService.getClientSecret', JSON.stringify(e));
      throw e;
    });
    return response.data;
  }

  async getServiceAccountUser(id) {
    const response = await this.axios.get(`${this.realmAdminUrl}/clients/${id}/service-account-user`)
      .catch(e => {
        log.error('RealmAdminService.getServiceAccountUser', JSON.stringify(e));
        throw e;
      });
    return response.data;
  }

  async getClientRoles(id) {
    const response = await this.axios.get(`${this.realmAdminUrl}/clients/${id}/roles`
    ).catch(e => {
      log.error('RealmAdminService.getClientRoles', JSON.stringify(e));
      throw e;
    });
    return response.data;
  }

  async removeClientRole(id, roleName) {
    const response = await this.axios.delete(
      `${this.realmAdminUrl}/clients/${id}/roles/${roleName}`
    ).catch(e => {
      log.error('RealmAdminService.removeClientRole', JSON.stringify(e));
      throw e;
    });
    return response;
  }

  async addClientRole(id, roleName) {
    const requestBody = {
      'name': roleName,
      'composite': true,
      'clientRole': true,
      'attributes': {}
    };
    await this.axios.post(
      `${this.realmAdminUrl}/clients/${id}/roles`,
      JSON.stringify(requestBody),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).catch(e => {
      log.error('RealmAdminService.addClientRole', JSON.stringify(e));
      throw e;
    });
    //response should be 201 created... return the list of roles
    return await this.getClientRoles(id);
  }

  async addServiceAccountRole(serviceAccountUserId, clientId, role) {
    const response = await this.axios.post(
      `${this.realmAdminUrl}/users/${serviceAccountUserId}/role-mappings/clients/${clientId}`,
      JSON.stringify([role]),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).catch(e => {
      log.error('RealmAdminService.addServiceAccountRole', JSON.stringify(e));
      throw e;
    });
    return response.data;
  }

  async setRoleComposites(client, roleName, roles) {
    const response = await this.axios.post(
      `${this.realmAdminUrl}/clients/${client.id}/roles/${roleName}/composites`,
      JSON.stringify(roles),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).catch(e => {
      log.error('RealmAdminService.setRoleComposites', JSON.stringify(e));
      throw e;
    });
    //204 created...
    return response;
  }
}

module.exports = RealmAdminService;
