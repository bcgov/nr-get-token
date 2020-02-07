const axios = require('axios');
const log = require('npmlog');
const oauth = require('axios-oauth-client');
const tokenProvider = require('axios-token-interceptor');


class RealmAdminService {
  constructor({ realmId, realmBaseUrl, clientId, clientSecret }) {
    log.info('RealmAdminService ', `${realmId}, ${realmBaseUrl}, ${clientId}, secret`);
    if (!realmId || !realmBaseUrl || !clientId || !clientSecret) {
      log.error('RealmAdminService - invalid configuration.');
      throw new Error('RealmAdminService is not configured.  Check configuration.');
    }

    this.tokenUrl = `${realmBaseUrl}/auth/realms/${realmId}/protocol/openid-connect/token`;
    this.realmAdminUrl = `${realmBaseUrl}/auth/admin/realms/${realmId}`;
    this.realmId = realmId;

    this.axios = axios.create();
    this.axios.interceptors.request.use(
      // Wraps axios-token-interceptor with oauth-specific configuration,
      // fetches the token using the desired claim method, and caches
      // until the token expires
      oauth.interceptor(tokenProvider, oauth.client(axios.create(), {
        url: this.tokenUrl,
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
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
    if (!id) {
      log.error('RealmAdminService getClient id parameter is null.');
      throw new Error('Cannot get client: id parameter cannot be null.');
    }
    const response = await this.axios.get(`${this.realmAdminUrl}/clients/${id}`)
      .catch(e => {
        log.error('RealmAdminService.getClient', JSON.stringify(e));
        throw e;
      });
    return response.data;
  }

  async createClient(clientId, name, description) {
    if (!clientId || !name || !description) {
      log.error('RealmAdminService createClient a parameter is null.');
      throw new Error('Cannot create client: clientId, name, and description cannot be null.');
    }
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

    const requestBody = { ...defaults, ...applicationDetails };
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
    if (!client) {
      log.error('RealmAdminService updateClientDetails no client provided.');
      throw new Error('Cannot update client: client cannot be null.');
    }

    if (!name || !description) {
      log.error('RealmAdminService updateClientDetails a parameter is null.');
      throw new Error('Cannot update client: name, and description cannot be null.');
    }

    const applicationDetails = {
      'name': name,
      'description': description
    };

    const requestBody = { ...client, ...applicationDetails };
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
    if (!id) {
      log.error('RealmAdminService getClientSecret id parameter is null.');
      throw new Error('Cannot get client secret: id parameter cannot be null.');
    }

    const response = await this.axios.get(`${this.realmAdminUrl}/clients/${id}/client-secret`
    ).catch(e => {
      log.error('RealmAdminService.getClientSecret', JSON.stringify(e));
      throw e;
    });
    return response.data;
  }

  async getServiceAccountUser(id) {
    if (!id) {
      log.error('RealmAdminService getServiceAccountUser id parameter is null.');
      throw new Error('Cannot get client service account user: id parameter cannot be null.');
    }

    const response = await this.axios.get(`${this.realmAdminUrl}/clients/${id}/service-account-user`)
      .catch(e => {
        log.error('RealmAdminService.getServiceAccountUser', JSON.stringify(e));
        throw e;
      });
    return response.data;
  }

  async getClientRoles(id) {
    if (!id) {
      log.error('RealmAdminService getClientRoles id parameter is null.');
      throw new Error('Cannot get client roles: id parameter cannot be null.');
    }

    const response = await this.axios.get(`${this.realmAdminUrl}/clients/${id}/roles`
    ).catch(e => {
      log.error('RealmAdminService.getClientRoles', JSON.stringify(e));
      throw e;
    });
    return response.data;
  }

  async removeClientRole(id, roleName) {
    if (!id) {
      log.error('RealmAdminService removeClientRole id parameter is null.');
      throw new Error('Cannot remove client role: id parameter cannot be null.');
    }
    if (!roleName) {
      log.error('RealmAdminService removeClientRole roleName parameter is null.');
      throw new Error('Cannot remove client role: roleName parameter cannot be null.');
    }

    const response = await this.axios.delete(
      `${this.realmAdminUrl}/clients/${id}/roles/${roleName}`
    ).catch(e => {
      log.error('RealmAdminService.removeClientRole', JSON.stringify(e));
      throw e;
    });
    return response;
  }

  async addClientRole(id, roleName) {
    if (!id) {
      log.error('RealmAdminService addClientRole id parameter is null.');
      throw new Error('Cannot add client role: id parameter cannot be null.');
    }
    if (!roleName) {
      log.error('RealmAdminService addClientRole roleName parameter is null.');
      throw new Error('Cannot add client role: roleName parameter cannot be null.');
    }

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
    if (!serviceAccountUserId) {
      log.error('RealmAdminService addServiceAccountRole serviceAccountUserId parameter is null.');
      throw new Error('Cannot add service account role: serviceAccountUserId parameter cannot be null.');
    }
    if (!clientId) {
      log.error('RealmAdminService addServiceAccountRole clientId parameter is null.');
      throw new Error('Cannot add service account role: clientId parameter cannot be null.');
    }
    if (!role) {
      log.error('RealmAdminService addServiceAccountRole role parameter is null.');
      throw new Error('Cannot add service account role: role parameter cannot be null.');
    }

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

  async getRoleComposites(clientId, roleName) {
    if (!clientId) {
      log.error('RealmAdminService.getRoleComposites', 'clientId parameter is null.');
      throw new Error('Cannot get role composites for client roles: clientId parameter cannot be null.');
    }
    if (!roleName) {
      log.error('RealmAdminService.getRoleComposites', 'roleName parameter is null.');
      throw new Error('Cannot get service composites for client roles: roleName parameter cannot be null.');
    }

    const url = `${this.realmAdminUrl}/clients/${clientId}/roles/${roleName}/composites`;
    log.error(url);
    const response = await this.axios.get(url)
      .catch(e => {
        log.error('RealmAdminService.getRoleComposites', JSON.stringify(e));
        throw e;
      });
    return response.data;
  }

  async setRoleComposites(client, roleName, roles) {
    if (!client) {
      log.error('RealmAdminService setRoleComposites client parameter is null.');
      throw new Error('Cannot add service roles to client roles: client parameter cannot be null.');
    }
    if (!roleName) {
      log.error('RealmAdminService setRoleComposites roleName parameter is null.');
      throw new Error('Cannot add service roles to client roles: roleName parameter cannot be null.');
    }
    if (!roles) {
      log.error('RealmAdminService setRoleComposites roles parameter is null.');
      throw new Error('Cannot add service roles to client roles: roles parameter cannot be null.');
    }

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
