const axios = require('axios');
const log = require('./log')(module.filename);
const oauth = require('axios-oauth-client');
const tokenProvider = require('axios-token-interceptor');

class RealmAdminService {
  constructor({ realmId, realmBaseUrl, clientId, clientSecret }) {
    log.debug(`${realmId}, ${realmBaseUrl}, ${clientId}, secret`, {
      function: 'constructor',
    });
    if (!realmId || !realmBaseUrl || !clientId || !clientSecret) {
      log.error('Invalid configuration.', { function: 'constructor' });
      throw new Error(
        'RealmAdminService is not configured.  Check configuration.'
      );
    }

    this.tokenUrl = `${realmBaseUrl}/auth/realms/${realmId}/protocol/openid-connect/token`;
    this.realmAdminUrl = `${realmBaseUrl}/auth/admin/realms/${realmId}`;
    this.realmId = realmId;

    this.axios = axios.create();
    this.axios.interceptors.request.use(
      // Wraps axios-token-interceptor with oauth-specific configuration,
      // fetches the token using the desired claim method, and caches
      // until the token expires
      oauth.interceptor(
        tokenProvider,
        oauth.client(axios.create(), {
          url: this.tokenUrl,
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: '',
        })
      )
    );
  }

  async getRealm() {
    const response = await this.axios.get(this.realmAdminUrl).catch((e) => {
      log.error('Failed to get realm', { function: 'getRealm', error: e });
      throw e;
    });
    return response.data;
  }

  async getClients() {
    const response = await this.axios
      .get(`${this.realmAdminUrl}/clients`)
      .catch((e) => {
        log.error('Failed to get clients', { function: 'getClients', error: e });
        throw e;
      });
    return response.data;
  }

  async getClient(id) {
    if (!id) {
      log.error('id parameter is null.', { function: 'getClient' });
      throw new Error('Cannot get client: id parameter cannot be null.');
    }
    const response = await this.axios
      .get(`${this.realmAdminUrl}/clients/${id}`)
      .catch((e) => {
        log.error('Failed to get client', { function: 'getClient', error: e });
        throw e;
      });
    return response.data;
  }

  async createClient(clientId, name, description) {
    if (!clientId || !name || !description) {
      log.error('A parameter is null.', { function: 'createClient' });
      throw new Error(
        'Cannot create client: clientId, name, and description cannot be null.'
      );
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
        'manage': true
      }
    };

    const applicationDetails = {
      clientId: clientId,
      name: name,
      description: description,
    };

    const requestBody = { ...defaults, ...applicationDetails };
    const response = await this.axios
      .post(`${this.realmAdminUrl}/clients`, JSON.stringify(requestBody), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .catch((e) => {
        log.error('Failed to create client', { function: 'createClient', error: e });
        throw e;
      });

    // check for 201, get the location header... it'll have the id
    const resourceUrl = response.headers.location;
    const fetchResponse = await this.axios.get(resourceUrl);
    return fetchResponse.data;
  }

  async updateClientDetails(client, name, description) {
    if (!client) {
      log.error('No client provided.', { function: 'updateClientDetails' });
      throw new Error('Cannot update client: client cannot be null.');
    }

    if (!name || !description) {
      log.error('A parameter is null.', { function: 'updateClientDetails' });
      throw new Error(
        'Cannot update client: name, and description cannot be null.'
      );
    }

    const applicationDetails = {
      name: name,
      description: description,
    };

    const requestBody = { ...client, ...applicationDetails };
    await this.axios
      .put(
        `${this.realmAdminUrl}/clients/${client.id}`,
        JSON.stringify(requestBody),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .catch((e) => {
        log.error('Failed to update client details', { function: 'updateClientDetails', error: e });
        throw e;
      });
    // response should be 204... go fetch the updated client...
    return await this.getClient(client.id);
  }

  async getClientSecret(id) {
    if (!id) {
      log.error('id parameter is null.', { function: 'getClientSecret' });
      throw new Error('Cannot get client secret: id parameter cannot be null.');
    }

    const response = await this.axios
      .get(`${this.realmAdminUrl}/clients/${id}/client-secret`)
      .catch((e) => {
        log.error('Failed to get client secret', { function: 'getClientSecret', error: e });
        throw e;
      });
    return response.data;
  }

  async generateNewClientSecret(id) {
    if (!id) {
      log.error('id parameter is null.', {
        function: 'generateNewClientSecret',
      });
      throw new Error(
        'Cannot update client secret: id parameter cannot be null.'
      );
    }

    const response = await this.axios
      .post(`${this.realmAdminUrl}/clients/${id}/client-secret`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .catch((e) => {
        log.error('Failed to generate new client secret', { function: 'generateNewClientSecret', error: e });
        throw e;
      });
    return response.data;
  }

  async getServiceAccountUser(id) {
    if (!id) {
      log.error('id parameter is null.', { function: 'getServiceAccountUser' });
      throw new Error(
        'Cannot get client service account user: id parameter cannot be null.'
      );
    }

    const response = await this.axios
      .get(`${this.realmAdminUrl}/clients/${id}/service-account-user`)
      .catch((e) => {
        log.error('Failed to get service account user', { function: 'getServiceAccountUser', error: e });
        throw e;
      });
    return response.data;
  }

  async getClientRoles(id) {
    if (!id) {
      log.error('id parameter is null.', { function: 'getClientRoles' });
      throw new Error('Cannot get client roles: id parameter cannot be null.');
    }

    const response = await this.axios
      .get(`${this.realmAdminUrl}/clients/${id}/roles`)
      .catch((e) => {
        log.error('Failed to get client roles', { function: 'getClientRoles', error: e });
        throw e;
      });
    return response.data;
  }

  async removeClientRole(id, roleName) {
    if (!id) {
      log.error('id parameter is null.', { function: 'removeClientRole' });
      throw new Error(
        'Cannot remove client role: id parameter cannot be null.'
      );
    }
    if (!roleName) {
      log.error('roleName parameter is null.', {
        function: 'removeClientRole',
      });
      throw new Error(
        'Cannot remove client role: roleName parameter cannot be null.'
      );
    }

    const response = await this.axios
      .delete(`${this.realmAdminUrl}/clients/${id}/roles/${roleName}`)
      .catch((e) => {
        log.error('Failed to remove client role', { function: 'removeClientRole', error: e });
        throw e;
      });
    return response;
  }

  async addClientRole(id, roleName) {
    if (!id) {
      log.error('id parameter is null.', { function: 'addClientRole' });
      throw new Error('Cannot add client role: id parameter cannot be null.');
    }
    if (!roleName) {
      log.error('roleName parameter is null.', { function: 'addClientRole' });
      throw new Error(
        'Cannot add client role: roleName parameter cannot be null.'
      );
    }

    const requestBody = {
      name: roleName,
      composite: true,
      clientRole: true,
      attributes: {},
    };
    await this.axios
      .post(
        `${this.realmAdminUrl}/clients/${id}/roles`,
        JSON.stringify(requestBody),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .catch((e) => {
        log.error('Failed to add client role', { function: 'addClientRole', error: e });
        throw e;
      });
    //response should be 201 created... return the list of roles
    return await this.getClientRoles(id);
  }

  async addServiceAccountRole(serviceAccountUserId, clientId, role) {
    if (!serviceAccountUserId) {
      log.error('serviceAccountUserId parameter is null.', {
        function: 'addServiceAccountRole',
      });
      throw new Error(
        'Cannot add service account role: serviceAccountUserId parameter cannot be null.'
      );
    }
    if (!clientId) {
      log.error('clientId parameter is null.', {
        function: 'addServiceAccountRole',
      });
      throw new Error(
        'Cannot add service account role: clientId parameter cannot be null.'
      );
    }
    if (!role) {
      log.error('role parameter is null.', {
        function: 'addServiceAccountRole',
      });
      throw new Error(
        'Cannot add service account role: role parameter cannot be null.'
      );
    }

    const response = await this.axios
      .post(
        `${this.realmAdminUrl}/users/${serviceAccountUserId}/role-mappings/clients/${clientId}`,
        JSON.stringify([role]),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .catch((e) => {
        log.error('Failed to add service account role', { function: 'addServiceAccountRole', error: e });
        throw e;
      });
    return response.data;
  }

  async getRoleComposites(clientId, roleName) {
    if (!clientId) {
      log.error('clientId parameter is null.', {
        function: 'getRoleComposites',
      });
      throw new Error(
        'Cannot get role composites for client roles: clientId parameter cannot be null.'
      );
    }
    if (!roleName) {
      log.error('roleName parameter is null.', {
        function: 'getRoleComposites',
      });
      throw new Error(
        'Cannot get service composites for client roles: roleName parameter cannot be null.'
      );
    }

    const url = `${this.realmAdminUrl}/clients/${clientId}/roles/${roleName}/composites`;
    const response = await this.axios.get(url).catch((e) => {
      log.error('Failed to get role composites', { function: 'getRoleComposites', error: e });
      throw e;
    });
    return response.data;
  }

  async setRoleComposites(client, roleName, roles) {
    if (!client) {
      log.error('client parameter is null.', { function: 'setRoleComposites' });
      throw new Error(
        'Cannot add service roles to client roles: client parameter cannot be null.'
      );
    }
    if (!roleName) {
      log.error('roleName parameter is null.', {
        function: 'setRoleComposites',
      });
      throw new Error(
        'Cannot add service roles to client roles: roleName parameter cannot be null.'
      );
    }
    if (!roles) {
      log.error('roles parameter is null.', { function: 'setRoleComposites' });
      throw new Error(
        'Cannot add service roles to client roles: roles parameter cannot be null.'
      );
    }

    const response = await this.axios
      .post(
        `${this.realmAdminUrl}/clients/${client.id}/roles/${roleName}/composites`,
        JSON.stringify(roles),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .catch((e) => {
        log.error('Failed to set role composites', { function: 'setRoleComposites', error: e });
        throw e;
      });
    //204 created...
    return response;
  }

  // Get from the users list filtered by optional query parameters
  // Available search parameters: https://www.keycloak.org/docs-api/5.0/rest-api/index.html#_users_resource
  async getUsers(queryParams) {
    if (
      (queryParams && typeof queryParams !== 'object') ||
      queryParams instanceof Array
    ) {
      log.error('optional searchParams parameter must be an object.', {
        function: 'getUsers',
      });
      throw new Error(
        'Cannot get users: optional searchParams parameter must be an object.'
      );
    }

    const url = `${this.realmAdminUrl}/users`;
    const response = await this.axios
      .get(url, { params: queryParams })
      .catch((e) => {
        log.error('Failed to get users', { function: 'getUsers', error: e });
        throw e;
      });
    return response.data;
  }
}

module.exports = RealmAdminService;
