//const axios = require('axios');
const config = require('config');
const log = require('npmlog');
//const MockAdapter = require('axios-mock-adapter');
//const mockAxios = new MockAdapter(axios);

const KeyCloakServiceClientManager = require('../../../src/components/keyCloakServiceClientMgr');
const RealmAdminService = require('../../../src/components/realmAdminSvc');

log.level = config.get('server.logLevel');

let realmConfig = {};
let realmAdminService = undefined;
let form = {};

jest.mock('../../../src/components/realmAdminSvc', () => {
  return jest.fn().mockImplementation(() => {
    return {
      tokenUrl: 'https://tokenurl',
      getClients: () => { return []; },
      createClient: () => { return {id: '1', clientId: 'generatedserviceclientid'}; },
      getClientRoles: () => { return []; },
      addClientRole: () => { return []; },
      setRoleComposites: () => {},
      getServiceAccountUser: () => { return {id: '2', 'clientId': '1'}; },
      addServiceAccountRole: () => {},
      getClientSecret: () => { return {value: 'itsasecret'}; }
    };
  });
});

beforeEach(() => {
  const {
    endpoint: realmBaseUrl,
    username: clientId,
    password: clientSecret,
    realm: realmId} = config.get('serviceClient.keyCloak.INT');
  realmConfig = {realmId, realmBaseUrl, clientId, clientSecret};
  realmAdminService = new RealmAdminService(realmConfig);
  form = {applicationAcronym: 'ABC', applicationName: 'Alphabet', applicationDescription: 'Easy as 1,2,3.', commonServices: ['cmn-srv-ex-a']};
});

describe('KeyCloakServiceClientManager create', () => {

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
    expect(r).toBeTruthy();
    expect(r.generatedPassword).toBeTruthy();
    expect(r.generatedServiceClient).toBeTruthy();
    expect(r.oidcTokenUrl).toBeTruthy();
    expect(r.generatedServiceClient).toEqual('generatedserviceclientid');
  }, 10000);

});
