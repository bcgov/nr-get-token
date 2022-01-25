const axios = require('axios');
const config = require('config');
const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);

const RealmAdminService = require('../../../src/components/realmAdminSvc');

let realmConfig = {};

beforeEach(() => {
  const {
    endpoint: realmBaseUrl,
    username: clientId,
    password: clientSecret,
    realm: realmId,
  } = config.get('serviceClient.keycloak.dev');
  realmConfig = { realmId, realmBaseUrl, clientId, clientSecret };
});

describe('RealmAdminService create', () => {
  it('should throw an error without realmId', async () => {
    expect(() => {
      const badConfig = { ...realmConfig };
      delete badConfig.realmId;
      new RealmAdminService(badConfig);
    }).toThrow();
  });
  it('should throw an error without realmBaseUrl', async () => {
    expect(() => {
      const badConfig = { ...realmConfig };
      delete badConfig.realmBaseUrl;
      new RealmAdminService(badConfig);
    }).toThrow();
  });
  it('should throw an error without clientId', async () => {
    expect(() => {
      const badConfig = { ...realmConfig };
      delete badConfig.clientId;
      new RealmAdminService(badConfig);
    }).toThrow();
  });
  it('should throw an error without clientSecret', async () => {
    expect(() => {
      const badConfig = { ...realmConfig };
      delete badConfig.clientSecret;
      new RealmAdminService(badConfig);
    }).toThrow();
  });

  it('should return a connection and realm admin url', async () => {
    const result = new RealmAdminService(realmConfig);

    expect(result).toBeTruthy();
    expect(result.axios).toBeTruthy();
    expect(result.realmAdminUrl).toBeTruthy();
    expect(result.tokenUrl).toBeTruthy();
  });
});

describe('RealmAdminService getRealm', () => {
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    await expect(svc.getRealm()).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    await expect(svc.getRealm()).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(svc.getRealm()).rejects.toThrow();
  });

  it('should return realm information with valid connection', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios.onGet(svc.realmAdminUrl).reply(200, 'truthy');

    const result = await svc.getRealm();
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService getClients', () => {
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    await expect(svc.getClients()).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    await expect(svc.getClients()).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(svc.getClients()).rejects.toThrow();
  });

  it('should return clients', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios.onGet(`${svc.realmAdminUrl}/clients`).reply(200, 'truthy');

    const result = await svc.getClients();
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService getClient', () => {
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    await expect(svc.getClient('1')).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    await expect(svc.getClient('1')).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(svc.getClient('1')).rejects.toThrow();
  });

  it('should throw an error when null id parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.getClient(undefined)).rejects.toThrow();
  });

  it('should return a client', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios.onGet(`${svc.realmAdminUrl}/clients/1`).reply(200, 'truthy');

    const result = await svc.getClient('1');
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService createClient', () => {
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    await expect(svc.createClient('A', 'B', 'C')).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    await expect(svc.createClient('A', 'B', 'C')).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(svc.createClient('A', 'B', 'C')).rejects.toThrow();
  });

  it('should throw an error when null client id parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.createClient(undefined, 'B', 'C')).rejects.toThrow();
  });

  it('should throw an error when null client name parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.createClient('A', undefined, 'C')).rejects.toThrow();
  });

  it('should throw an error when null client description parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.createClient('A', 'B', undefined)).rejects.toThrow();
  });

  it('should return a new client', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios
      .onPost(`${svc.realmAdminUrl}/clients`)
      .reply(201, 'truthy', { location: `${svc.realmAdminUrl}/clients/1` });
    mockAxios.onGet(`${svc.realmAdminUrl}/clients/1`).reply(200, 'truthy');

    const result = await svc.createClient('A', 'B', 'C');
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService updateClientDetails', () => {
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    const client = { id: '1' };
    await expect(svc.updateClientDetails(client, 'B', 'C')).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    const client = { id: '1' };
    await expect(svc.updateClientDetails(client, 'B', 'C')).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    const client = { id: '1' };
    await expect(svc.updateClientDetails(client, 'B', 'C')).rejects.toThrow();
  });

  it('should throw an error when null client parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(
      svc.updateClientDetails(undefined, 'B', 'C')
    ).rejects.toThrow();
  });

  it('should throw an error when null client name parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    const client = { id: '1' };
    await expect(
      svc.updateClientDetails(client, undefined, 'C')
    ).rejects.toThrow();
  });

  it('should throw an error when null client description parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    const client = { id: '1' };
    await expect(
      svc.updateClientDetails(client, undefined, undefined)
    ).rejects.toThrow();
  });

  it('should return a new client', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios.onPut(`${svc.realmAdminUrl}/clients/1`).reply(204);
    mockAxios.onGet(`${svc.realmAdminUrl}/clients/1`).reply(200, 'truthy');

    const client = { id: '1' };
    const result = await svc.updateClientDetails(client, 'B', 'C');
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService getClientSecret', () => {
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    await expect(svc.getClientSecret('1')).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    await expect(svc.getClientSecret('1')).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(svc.getClientSecret('1')).rejects.toThrow();
  });

  it('should throw an error when null id parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.getClientSecret(undefined)).rejects.toThrow();
  });

  it('should return a client', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios
      .onGet(`${svc.realmAdminUrl}/clients/1/client-secret`)
      .reply(200, 'truthy');

    const result = await svc.getClientSecret('1');
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService generateNewClientSecret', () => {
  it('should throw an error if axios undefined', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    await expect(svc.generateNewClientSecret('1')).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    await expect(svc.generateNewClientSecret('1')).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(svc.generateNewClientSecret('1')).rejects.toThrow();
  });

  it('should throw an error when null id parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.generateNewClientSecret(undefined)).rejects.toThrow();
  });

  it('should return a secret update response', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios
      .onPost(`${svc.realmAdminUrl}/clients/1/client-secret`)
      .reply(200, 'truthy');

    const result = await svc.generateNewClientSecret('1');
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService getServiceAccountUser', () => {
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    await expect(svc.getServiceAccountUser('1')).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    await expect(svc.getServiceAccountUser('1')).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(svc.getServiceAccountUser('1')).rejects.toThrow();
  });

  it('should throw an error when null id parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.getServiceAccountUser(undefined)).rejects.toThrow();
  });

  it('should return a service account user', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios
      .onGet(`${svc.realmAdminUrl}/clients/1/service-account-user`)
      .reply(200, 'truthy');

    const result = await svc.getServiceAccountUser('1');
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService getClientRoles', () => {
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    await expect(svc.getClientRoles('1')).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    await expect(svc.getClientRoles('1')).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(svc.getClientRoles('1')).rejects.toThrow();
  });

  it('should throw an error when null id parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.getClientRoles(undefined)).rejects.toThrow();
  });

  it('should return client roles', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios
      .onGet(`${svc.realmAdminUrl}/clients/1/roles`)
      .reply(200, 'truthy');

    const result = await svc.getClientRoles('1');
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService removeClientRole', () => {
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    await expect(svc.removeClientRole('1', 'theRole')).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    await expect(svc.removeClientRole('1', 'theRole')).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(svc.removeClientRole('1', 'theRole')).rejects.toThrow();
  });

  it('should throw an error when null id parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.removeClientRole(undefined, 'theRole')).rejects.toThrow();
  });

  it('should throw an error when null roleName parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.removeClientRole('1', undefined)).rejects.toThrow();
  });

  it('should return client roles', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios
      .onDelete(`${svc.realmAdminUrl}/clients/1/roles/theRole`)
      .reply(204, 'truthy');

    const result = await svc.removeClientRole('1', 'theRole');
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService addClientRole', () => {
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    await expect(svc.addClientRole('1', 'theRole')).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    await expect(svc.addClientRole('1', 'theRole')).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(svc.addClientRole('1', 'theRole')).rejects.toThrow();
  });

  it('should throw an error when null id parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.addClientRole(undefined, 'theRole')).rejects.toThrow();
  });

  it('should throw an error when null roleName parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.addClientRole('1', undefined)).rejects.toThrow();
  });

  it('should return client roles', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios
      .onPost(`${svc.realmAdminUrl}/clients/1/roles`)
      .reply(201, 'truthy');

    const result = await svc.addClientRole('1', 'theRole');
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService addServiceAccountRole', () => {
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    await expect(
      svc.addServiceAccountRole('SA', '1', { id: '2' })
    ).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    await expect(
      svc.addServiceAccountRole('SA', '1', { id: '2' })
    ).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(
      svc.addServiceAccountRole('SA', '1', { id: '2' })
    ).rejects.toThrow();
  });

  it('should throw an error when null service account id parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(
      svc.addServiceAccountRole(undefined, '1', { id: '2' })
    ).rejects.toThrow();
  });

  it('should throw an error when null client id parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(
      svc.addServiceAccountRole('SA', undefined, { id: '2' })
    ).rejects.toThrow();
  });

  it('should throw an error when null role parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(
      svc.addServiceAccountRole('SA', '1', undefined)
    ).rejects.toThrow();
  });

  it('should return client roles', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios
      .onPost(`${svc.realmAdminUrl}/users/SA/role-mappings/clients/1`)
      .reply(204, 'truthy');

    const result = await svc.addServiceAccountRole('SA', '1', { id: '2' });
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService setRoleComposites', () => {
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = undefined;
    await expect(
      svc.setRoleComposites({ id: '1' }, 'theRole', [{ id: '2' }])
    ).rejects.toThrow();
  });
  it('should throw an error connection is not set', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.realmAdminUrl = undefined;
    await expect(
      svc.setRoleComposites({ id: '1' }, 'theRole', [{ id: '2' }])
    ).rejects.toThrow();
  });
  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(
      svc.setRoleComposites({ id: '1' }, 'theRole', [{ id: '2' }])
    ).rejects.toThrow();
  });

  it('should throw an error when null client parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(
      svc.setRoleComposites(undefined, 'theRole', [{ id: '2' }])
    ).rejects.toThrow();
  });

  it('should throw an error when null role name parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(
      svc.setRoleComposites({ id: '1' }, undefined, [{ id: '2' }])
    ).rejects.toThrow();
  });

  it('should throw an error when null roles parameter...', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(
      svc.setRoleComposites({ id: '1' }, 'theRole', undefined)
    ).rejects.toThrow();
  });

  it('should return client roles', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios
      .onPost(`${svc.realmAdminUrl}/clients/1/roles/theRole/composites`)
      .reply(204, 'truthy');

    const result = await svc.setRoleComposites({ id: '1' }, 'theRole', [
      { id: '2' },
    ]);
    expect(result).toBeTruthy();
  });
});

describe('RealmAdminService getRoleComposites', () => {
  it('should throw an error if no clientId provided', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.getRoleComposites(undefined, '')).rejects.toThrow();
  });
  it('should throw an error if no role name provided', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.getRoleComposites('abc-123', '')).rejects.toThrow();
  });

  it('should return composite roles', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    mockAxios
      .onGet(`${svc.realmAdminUrl}/clients/1/roles/theRole/composites`)
      .reply(204, 'yes returned');

    const result = await svc.getRoleComposites('1', 'theRole');
    expect(result).toBeTruthy();
  });

  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(svc.getRoleComposites('1', 'theRole')).rejects.toThrow();
  });
});

describe('RealmAdminService getUsers', () => {
  it('should throw an error if non object query provided', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.getUsers('user')).rejects.toThrow(
      'Cannot get users: optional searchParams parameter must be an object.'
    );
  });

  it('should throw an error if array provided', async () => {
    const svc = new RealmAdminService(realmConfig);
    await expect(svc.getUsers(['abcd'])).rejects.toThrow(
      'Cannot get users: optional searchParams parameter must be an object.'
    );
  });

  it('should return users searched on', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    const testQuery = { username: 'me@idir' };
    mockAxios
      .onGet(`${svc.realmAdminUrl}/users`, { params: testQuery })
      .reply(204, 'yes returned');

    const result = await svc.getUsers(testQuery);
    expect(result).toBeTruthy();
    expect(result).toEqual('yes returned');
  });

  it('should handle multiple query params', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    const testQuery = {
      username: 'me@idir',
      firstname: 'test',
      lastname: 'test',
    };
    mockAxios
      .onGet(`${svc.realmAdminUrl}/users`, { params: testQuery })
      .reply(204, 'yes returned');

    const result = await svc.getUsers(testQuery);
    expect(result).toBeTruthy();
    expect(result).toEqual('yes returned');
  });

  it('should handle empty query params object', async () => {
    const svc = new RealmAdminService(realmConfig);
    svc.axios = axios.create();
    const testQuery = {};
    mockAxios
      .onGet(`${svc.realmAdminUrl}/users`, { params: testQuery })
      .reply(204, 'yes returned');

    const result = await svc.getUsers(testQuery);
    expect(result).toBeTruthy();
    expect(result).toEqual('yes returned');
  });

  it('should throw an error when realm url is bad...', async () => {
    const svc = new RealmAdminService(realmConfig);
    mockAxios.onGet(svc.realmAdminUrl).reply(500);
    await expect(svc.getUsers({ users: 'me@idir' })).rejects.toThrow();
  });
});
