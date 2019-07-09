// const axios = require('axios');
const config = require('config');
const crypto = require('crypto');
const cryptico = require('cryptico-js');
const log = require('npmlog');
// const MockAdapter = require('axios-mock-adapter');

const appConfig = require('../../../src/components/appConfig');
// const utils = require('../../../src/components/utils');

log.level = config.get('server.logLevel');
// const mockAxios = new MockAdapter(axios);

const uniqueSeed = crypto.randomBytes(20).toString('hex');
const pubKey = cryptico.generateRSAKey(uniqueSeed, 1024);
const pubKeyString = cryptico.publicKeyString(pubKey);

describe('buildWebAdeCfg', () => {
  it('should yield a configuration and encrypted password with a common service', async () => {
    const result = await appConfig.buildWebAdeCfg({
      applicationAcronym: 'DOMO',
      applicationName: 'name',
      applicationDescription: 'description',
      commonServices: ['cmsg'],
      deploymentMethod: 'deploymentDirect',
      webadeEnvironment: 'INT'
    }, pubKeyString);
    expect(result).toBeTruthy();
    expect(result.webAdeCfg).toBeTruthy();
    expect(result.unencryptedPassword).toBeTruthy();
    expect(result.encryptedPassword).toBeTruthy();
  });

  it('should yield a configuration and encrypted password without a common service', async () => {
    const result = await appConfig.buildWebAdeCfg({
      applicationAcronym: 'DOMO',
      applicationName: 'name',
      applicationDescription: 'description',
      commonServices: [],
      deploymentMethod: 'deploymentDirect',
      webadeEnvironment: 'INT'
    }, pubKeyString);
    expect(result).toBeTruthy();
    expect(result.webAdeCfg).toBeTruthy();
    expect(result.unencryptedPassword).toBeTruthy();
    expect(result.encryptedPassword).toBeTruthy();
  });
});
