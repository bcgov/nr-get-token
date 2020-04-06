//const axios = require('axios');
const config = require('config');
//const MockAdapter = require('axios-mock-adapter');
//const mockAxios = new MockAdapter(axios);

const KeyCloakServiceClientManager = require('../../../src/components/keyCloakServiceClientMgr');
const RealmAdminService = require('../../../src/components/realmAdminSvc');
const { acronymService } = require('../../../src/services');

const helper = require('../../common/helper');
helper.logHelper();

let realmConfig = {};
let realmAdminService = undefined;
let form = {};

jest.mock('../../../src/components/realmAdminSvc', () => {
  return jest.fn().mockImplementation(() => {
    return {
      tokenUrl: 'https://tokenurl',
      getClients: () => { return [{ id: 1, clientId: 'ZZZ_SERVICE_CLIENT' }, { id: 2, clientId: 'XXX_SERVICE_CLIENT' }, { id: 3, clientId: 'YYY_SERVICE_CLIENT' }]; },
      createClient: () => { return { id: '1', clientId: 'generatedserviceclientid' }; },
      getClientRoles: () => { return []; },
      addClientRole: () => { return []; },
      setRoleComposites: () => { },
      getRoleComposites: () => { return [{ id: '456', name: 'GENERATOR', description: 'This role is.' }]; },
      getServiceAccountUser: () => { return { id: '2', 'clientId': '1' }; },
      addServiceAccountRole: () => { },
      getUsers: () => { return [{ id: 1, username: 'me@idir' }]; },
      getClientSecret: () => { return { value: 'itsasecret' }; }
    };
  });
});

beforeEach(() => {
  const {
    endpoint: realmBaseUrl,
    username: clientId,
    password: clientSecret,
    realm: realmId
  } = config.get('serviceClient.keycloak.dev');
  realmConfig = { realmId, realmBaseUrl, clientId, clientSecret };
  realmAdminService = new RealmAdminService(realmConfig);
  form = { applicationAcronym: 'ABC', applicationName: 'Alphabet', applicationDescription: 'Easy as 1,2,3.', commonServices: ['cmn-srv-ex-a'] };
});

describe('KeyCloakServiceClientManager create', () => {
  acronymService.updateDetails = jest.fn().mockResolvedValue();

  it('should throw an error without realmAdminService', async () => {
    expect(() => {
      new KeyCloakServiceClientManager(undefined);
    }).toThrow();
  });

  it('should return a Service Client Manager', async () => {
    // eslint-disable-next-line no-unused-vars
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    expect(mgr).toBeTruthy();
  });

});

describe('KeyCloakServiceClientManager manage', () => {
  acronymService.updateDetails = jest.fn().mockResolvedValue();
  const spyAcronym = jest.spyOn(acronymService, 'updateDetails');

  afterEach(() => {
    spyAcronym.mockClear();
  });

  it('should throw an error without applicationAcronym', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    form.applicationAcronym = undefined;
    await expect(mgr.manage(form)).rejects.toThrow();
  });

  it('should throw an error without applicationName', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    form.applicationName = undefined;
    await expect(mgr.manage(form)).rejects.toThrow();
  });

  it('should throw an error without applicationDescription', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    form.applicationDescription = undefined;
    await expect(mgr.manage(form)).rejects.toThrow();
  });

  it('should throw an error without commonServices', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    form.commonServices = undefined;
    await expect(mgr.manage(form)).rejects.toThrow();
  });

  it('should return a Service Client Manager', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    const r = await mgr.manage(form);
    expect(spyAcronym).toHaveBeenCalledTimes(1);
    expect(r).toBeTruthy();
    expect(r.generatedPassword).toBeTruthy();
    expect(r.generatedServiceClient).toBeTruthy();
    expect(r.oidcTokenUrl).toBeTruthy();
    expect(r.generatedServiceClient).toEqual('generatedserviceclientid');
  }, 10000);

});

describe('KeyCloakServiceClientManager fetchClients', () => {
  it('should throw an error without applicationAcronymList', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    await expect(mgr.fetchClients(undefined)).rejects.toThrow();
  });

  it('should throw an error with empty applicationAcronymList', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    await expect(mgr.fetchClients([])).rejects.toThrow();
  });

  it('should return a Service Client when a single acronym is passed in', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    const r = await mgr.fetchClients(['ZZZ']);
    expect(r).toBeTruthy();
    expect(r.length).toEqual(1);
    expect(r[0].id).toEqual(1);
    expect(r[0].clientId).toEqual('ZZZ_SERVICE_CLIENT');
  });

  it('should return only the relevant Service Clients when multiple acronyms are passed in', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    const r = await mgr.fetchClients(['ZZZ', 'YYY', 'ABC', '123']);
    expect(r).toBeTruthy();
    expect(r.length).toEqual(2);
    expect(r[0].id).toEqual(1);
    expect(r[0].clientId).toEqual('ZZZ_SERVICE_CLIENT');
    expect(r[1].id).toEqual(3);
    expect(r[1].clientId).toEqual('YYY_SERVICE_CLIENT');
  });

  it('should return undefined if a service client not found', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    const r = await mgr.fetchClients(['SDFH']);
    expect(r).toEqual([]);
  });

});

describe('KeyCloakServiceClientManager findUsers', () => {
  it('should return a User', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    const r = await mgr.findUsers({username: 'me@idir'});
    expect(r[0]).toBeTruthy();
    expect(r[0].username).toEqual('me@idir');
  });

  it('should handle blank params', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    const r = await mgr.findUsers();
    expect(r[0]).toBeTruthy();
    expect(r[0].username).toEqual('me@idir');
  });

  it('should handle undefined params', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    const r = await mgr.findUsers(undefined);
    expect(r[0]).toBeTruthy();
    expect(r[0].username).toEqual('me@idir');
  });
});

describe('KeyCloakServiceClientManager makeClientDetails', () => {
  // Note: most tests of this method are excersized with fetchClients above
  it('should throw an error without username', async () => {
    const mgr = new KeyCloakServiceClientManager(realmAdminService);
    const res = await mgr.makeClientDetails(undefined);
    expect(res).toEqual(undefined);
  });
});
