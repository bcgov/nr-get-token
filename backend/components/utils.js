const axios = require('axios');
const log = require('npmlog');

const utils = {
  // Returns the response body of a webade oauth token request
  getWebAdeToken: async function getWebAdeToken(username, password, scope) {
    const url = 'https://i1api.nrs.gov.bc.ca/oauth2/v1/oauth/token';

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

      log.verbose(arguments.callee.name, `WebAde Token: ${utils.prettyStringify(response.data)}`);
      return response.data;
    } catch (error) {
      log.error(arguments.callee.name, error.message);
      return error.response.data;
    }
  },

  // Returns a pretty JSON representation of an object
  prettyStringify: obj => JSON.stringify(obj, null, 2)
};

module.exports = utils;
