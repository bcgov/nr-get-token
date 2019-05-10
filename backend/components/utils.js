const axios = require('axios');
const log = require('npmlog');

const utils = {
  getWebAdeToken: async (username, password, scope) => {
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

      log.verbose(utils.prettyStringify(response.data));
      return response.data.access_token;
    } catch (error) {
      log.error(error);
    }
  },

  prettyStringify: obj => JSON.stringify(obj, null, 2)
};

module.exports = utils;
