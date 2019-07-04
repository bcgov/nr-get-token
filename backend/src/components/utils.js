const axios = require('axios');
const config = require('config');
const cryptico = require('cryptico-js');
const generator = require('generate-password');
const log = require('npmlog');

let discovery = null;

const utils = {
  // Returns the response body of a webade oauth token request
  async getWebAdeToken(username, password, scope, webadeEnv = 'INT') {
    const path = '/oauth/token';
    const endpoint = config.get(`serviceClient.getok${utils.toPascalCase(webadeEnv)}.endpoint`);
    const url = endpoint.replace('webade-api', 'oauth2') + path;

    try {
      const response = await axios.get(url, {
        auth: {
          username: username,
          password: password
        },
        params: {
          disableDeveloperFilter: true,
          grant_type: 'client_credentials',
          scope: scope
        }
      });

      log.verbose('getWebAdeToken', utils.prettyStringify(response.data));
      return response.data;
    } catch (error) {
      log.error('getWebAdeToken', error.message);
      return error.response.data;
    }
  },

  // Returns OIDC Discovery values
  async getOidcDiscovery() {
    if (!discovery) {
      try {
        const response = await axios.get(config.get('oidc.discovery'));

        log.verbose('getOidcDiscovery', utils.prettyStringify(response.data));
        discovery = response.data; // eslint-disable-line require-atomic-updates
      } catch (error) {
        log.error('getOidcDiscovery', `OIDC Discovery failed - ${error.message}`);
      }
    }

    return discovery;
  },

  // Creates a random password of a certain length and encrypts it with the key
  generateEncryptPassword: (key, len = 12) => {
    const pw = generator.generate({
      length: len,
      numbers: true
    });

    return {
      password: pw,
      encryptedPassword: cryptico.encrypt(pw, key).cipher
    };
  },

  // Returns a pretty JSON representation of an object
  prettyStringify: (obj, indent = 2) => JSON.stringify(obj, null, indent),

  // Returns a string in Pascal Case
  toPascalCase: str => str.toLowerCase().replace(/\b\w/g, t => t.toUpperCase())
};

module.exports = utils;
