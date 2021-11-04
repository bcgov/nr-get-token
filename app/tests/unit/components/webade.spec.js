const axios = require('axios');
const config = require('config');
const crypto = require('crypto');
const cryptico = require('cryptico-js');
const MockAdapter = require('axios-mock-adapter');

const { acronymService, deploymentHistoryService } = require('../../../src/services');
const helper = require('../../common/helper');
const permissionHelpers = require('../../../src/components/permissionHelpers');
const utils = require('../../../src/components/utils');
const webade = require('../../../src/components/webade');

helper.logHelper();

const mockAxios = new MockAdapter(axios);

const uniqueSeed = crypto.randomBytes(20).toString('hex');
const pubKey = cryptico.generateRSAKey(uniqueSeed, 1024);
const pubKeyString = cryptico.publicKeyString(pubKey);

describe('buildWebAdeCfg', () => {
  it('should yield a configuration and encrypted password with cmsg', async () => {
    const result = await webade.buildWebAdeCfg({
      applicationAcronym: 'TEST',
      applicationName: 'name',
      applicationDescription: 'description',
      commonServices: ['cmsg'],
      deploymentMethod: 'deploymentDirect',
      clientEnvironment: 'INT'
    }, pubKeyString);

    expect(result).toBeTruthy();
    expect(result.unencryptedPassword).toBeTruthy();
    expect(result.encryptedPassword).toBeTruthy();
    expect(result.webAdeCfg).toBeTruthy();
    expect(result.webAdeCfg.serviceClients[0].authorizations.length).toBeGreaterThan(0);
    expect(result.webAdeCfg.actions.length).toBeGreaterThan(0);
    expect(result.webAdeCfg.roles.length).toBeGreaterThan(0);
    expect(result.webAdeCfg.profiles.length).toBeGreaterThan(0);
    expect(result.webAdeCfg.profiles[0].profileRoles).toStrictEqual([{
      applicationCode: 'TEST',
      name: 'TEST_ROLE'
    },
    {
      applicationCode: 'CMSG',
      name: 'SENDER'
    }]);
  });

  it('should yield a configuration and encrypted password with nros-dms', async () => {
    const result = await webade.buildWebAdeCfg({
      applicationAcronym: 'TEST',
      applicationName: 'name',
      applicationDescription: 'description',
      commonServices: ['nros-dms'],
      deploymentMethod: 'deploymentDirect',
      clientEnvironment: 'INT'
    }, pubKeyString);

    expect(result.webAdeCfg.profiles[0].profileRoles).toStrictEqual([
      {
        applicationCode: 'TEST',
        name: 'TEST_ROLE'
      },
      {
        applicationCode: 'DMS',
        name: 'CONTRIBUTOR'
      },
      {
        applicationCode: 'DMS',
        name: 'STAFF_USER_READ'
      },
      {
        applicationCode: 'NRS_AS',
        name: 'READ_ANY_DMS'
      }
    ]);
  });

  it('should yield a configuration and encrypted password without a common service', async () => {
    const result = await webade.buildWebAdeCfg({
      applicationAcronym: 'TEST',
      applicationName: 'name',
      applicationDescription: 'description',
      commonServices: [],
      deploymentMethod: 'deploymentDirect',
      clientEnvironment: 'INT'
    }, pubKeyString);

    expect(result).toBeTruthy();
    expect(result.unencryptedPassword).toBeTruthy();
    expect(result.encryptedPassword).toBeTruthy();
    expect(result.webAdeCfg).toBeTruthy();
    expect(result.webAdeCfg.serviceClients[0].authorizations.length).toBe(0);
  });
});

describe('postAppConfig', () => {
  const accountName = 'TEST_SERVICE_CLIENT';
  const encryptedPass = 'encryptedPassword';
  const token = '00000000-0000-0000-0000-000000000000';
  const userId = '00000000-0000-0000-0000-000000000000';
  const url = config.get('serviceClient.webAde.int.endpoint') + '/applicationConfigurations';

  deploymentHistoryService.create = jest.fn().mockResolvedValue();
  acronymService.updateDetails = jest.fn().mockResolvedValue();

  const spy = jest.spyOn(axios, 'post');
  const spyHistory = jest.spyOn(deploymentHistoryService, 'create');
  const spyAcronym = jest.spyOn(acronymService, 'updateDetails');

  beforeEach(() => {
    spy.mockClear();
    spyHistory.mockClear();
    spyAcronym.mockClear();
  });

  it('should error if unable to acquire access token', async () => {
    utils.getWebAdeToken = jest.fn().mockReturnValue({
      error: 'error'
    });

    await expect(webade.postAppConfig({
      clientEnvironment: 'INT'
    }, pubKeyString)).rejects.toThrowError('Unable to acquire access_token');
    expect(spy).toHaveBeenCalledTimes(0);
    expect(spyHistory).not.toHaveBeenCalled();
  });

  it('should error if WebADE post returned an error', async () => {
    utils.getWebAdeToken = jest.fn().mockResolvedValue({
      access_token: token
    });

    const generatedConfig = {
      webAdeCfg: {
        serviceClients: [{
          accountName: accountName
        }]
      },
      unencryptedPassword: 'unencryptedPassword',
      encryptedPassword: encryptedPass
    };
    webade.buildWebAdeCfg = jest.fn().mockReturnValue(generatedConfig);

    mockAxios.onPost(url).reply(500);

    await expect(webade.postAppConfig({
      clientEnvironment: 'INT'
    }, pubKeyString)).rejects.toThrowError(/^WebADE \/applicationConfigurations returned an error./);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(url, generatedConfig.webAdeCfg, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    expect(spyHistory).not.toHaveBeenCalled();
  });

  it('should yield a response upon successful WebADE post', async () => {
    const appAcronym = 'TEST';
    const webadeEnv = 'INT';

    utils.getWebAdeToken = jest.fn().mockResolvedValue({
      access_token: token
    });

    const generatedConfig = {
      webAdeCfg: {
        serviceClients: [{
          accountName: accountName
        }]
      },
      unencryptedPassword: 'unencryptedPassword',
      encryptedPassword: encryptedPass
    };
    webade.buildWebAdeCfg = jest.fn().mockReturnValue(generatedConfig);

    const response = 'webAdeResponseObject';
    mockAxios.onPost(url).reply(200, response);

    const result = await webade.postAppConfig({
      applicationAcronym: appAcronym,
      applicationName: 'name',
      applicationDescription: 'description',
      commonServices: ['cmsg'],
      deploymentMethod: 'deploymentDirect',
      clientEnvironment: webadeEnv
    }, pubKeyString, userId);

    expect(result).toBeTruthy();
    expect(result.webAdeResponse).toEqual(response);
    expect(result.generatedPassword).toEqual(encryptedPass);
    expect(result.generatedServiceClient).toEqual(accountName);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(url, generatedConfig.webAdeCfg, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    expect(spyHistory).toHaveBeenCalledTimes(1);
    expect(spyHistory).toHaveBeenCalledWith(appAcronym, generatedConfig.webAdeCfg, webadeEnv, userId);
    expect(spyAcronym).toHaveBeenCalledTimes(1);
    expect(spyAcronym).toHaveBeenCalledWith(appAcronym, 'name', 'description');
  });
});

describe('getAppConfig', () => {
  const token = '00000000-0000-0000-0000-000000000000';
  const url = config.get('serviceClient.webAde.int.endpoint') + '/applicationConfigurations';
  const sampleAcronym = 'MSSC';
  const resourceToGet = url + '/' + sampleAcronym;

  const spy = jest.spyOn(axios, 'get');

  beforeEach(() => {
    spy.mockClear();
  });

  it('should error if unable to acquire access token', async () => {
    utils.getWebAdeToken = jest.fn().mockReturnValue({
      error: 'error'
    });

    await expect(webade.getAppConfig('INT', sampleAcronym)).rejects.toThrowError('Unable to acquire access_token');
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should error if WebADE GET returned an error', async () => {
    utils.getWebAdeToken = jest.fn().mockResolvedValue({
      access_token: token
    });

    mockAxios.onGet(resourceToGet).reply(500);

    await expect(webade.getAppConfig('INT', sampleAcronym)).rejects.toThrowError(/^WebADE \/applicationConfigurations\/MSSC returned an error./);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(resourceToGet, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  });

  it('should yield a response upon successful WebADE get', async () => {
    utils.getWebAdeToken = jest.fn().mockResolvedValue({
      access_token: token
    });

    const response = 'webAdeResponseObject';
    mockAxios.onGet(resourceToGet).reply(200, response);

    const result = await webade.getAppConfig('INT', sampleAcronym);

    expect(result).toBeTruthy();
    expect(result).toEqual(response);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(resourceToGet, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  });

  it('should yield a empty response upon a 404 WebADE get', async () => {
    utils.getWebAdeToken = jest.fn().mockResolvedValue({
      access_token: token
    });

    const response = '';
    mockAxios.onGet(resourceToGet).reply(404, response);

    const result = await webade.getAppConfig('INT', sampleAcronym);

    expect(result).toBeFalsy();
    expect(result).toEqual(response);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(resourceToGet, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  });
});

describe('getAppConfigs', () => {
  const token = '00000000-0000-0000-0000-000000000000';
  const url = config.get('serviceClient.webAde.int.endpoint') + '/applicationConfigurations';

  const spy = jest.spyOn(axios, 'get');

  beforeEach(() => {
    spy.mockClear();
  });

  it('should error if unable to acquire access token', async () => {
    utils.getWebAdeToken = jest.fn().mockReturnValue({
      error: 'error'
    });

    await expect(webade.getAppConfigs('INT')).rejects.toThrowError('Unable to acquire access_token');
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should error if WebADE GET returned an error', async () => {
    utils.getWebAdeToken = jest.fn().mockResolvedValue({
      access_token: token
    });

    mockAxios.onGet(url).reply(500);

    await expect(webade.getAppConfigs('INT')).rejects.toThrowError();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  });

  it('should yield a response upon successful WebADE get', async () => {
    utils.getWebAdeToken = jest.fn().mockResolvedValue({
      access_token: token
    });

    const response = 'webAdeResponseObject';
    mockAxios.onGet(url).reply(200, response);

    const result = await webade.getAppConfigs('INT');

    expect(result).toBeTruthy();
    expect(result).toEqual(response);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  });
});

describe('getPermissionError', () => {
  const acronymDetailFixture = require('./fixtures/acronymDetail.json');
  const configFormFixture = require('./fixtures/configForm.json');
  const tokenFixture = require('./fixtures/token.json');

  // Spy/mock the DB access 'find' method on the acronym table
  const spy = jest.spyOn(acronymService, 'find');
  const permSpy = jest.spyOn(permissionHelpers, 'checkAcronymPermission');
  jest.mock('../../../src/services/acronym');

  beforeEach(() => {
    spy.mockReset();
    permSpy.mockReset();
  });

  it('should return no error message if permissions are all good', async () => {
    spy.mockResolvedValue(acronymDetailFixture);
    permSpy.mockResolvedValue(undefined);

    const tokenCopy = JSON.parse(JSON.stringify(tokenFixture));
    tokenCopy.realm_access.roles.push(...['WEBADE_PERMISSION', 'WEBADE_PERMISSION_NROS_DMS']);

    const configFormCopy = JSON.parse(JSON.stringify(configFormFixture));
    configFormCopy.commonServices.push('nros-dms');

    const result = await webade.getPermissionError(tokenCopy, configFormCopy);

    expect(result).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(permSpy).toHaveBeenCalledTimes(1);
  });

  it('should return an error if lacking permissions', async () => {
    spy.mockResolvedValue(acronymDetailFixture);
    permSpy.mockResolvedValue(undefined);

    const result = await webade.getPermissionError(tokenFixture, configFormFixture);

    expect(result).toEqual('User is not permitted to submit WebADE config, missing role WEBADE_PERMISSION');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(permSpy).toHaveBeenCalledTimes(1);
  });

  it('should return an error message if acronym cannot be found', async () => {
    spy.mockResolvedValue(undefined);

    const result = await webade.getPermissionError(tokenFixture, configFormFixture);

    expect(result).toEqual('Acronym WORG could not be found in GETOK database');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(permSpy).toHaveBeenCalledTimes(0);
  });

  it('should return an error message if no acronym is supplied', async () => {
    const result = await webade.getPermissionError(null, { applicationAcronym: undefined });

    expect(result).toEqual('No app acronym determined during permission check');
    expect(spy).toHaveBeenCalledTimes(0);
    expect(permSpy).toHaveBeenCalledTimes(0);
  });

});
