const axios = require('axios');
const config = require('config');
const log = require('npmlog');

const utils = require('./utils');

const email = {
  /**
   * @function sendRequest
   * Sends an email request through CHES
   * @param {string} acronym The sender's requested application acronym
   * @param {string} comments The sender's unformatted comment text
   * @param {string} from The sender's registered email
   * @param {string} idir The sender's IDIR
   */
  sendRequest: async (acronym, comments, from, idir) => {
    try {
      const apiEndpoint = config.get('serviceClient.ches.apiEndpoint');
      const tokenEndpoint = config.get('serviceClient.ches.tokenEndpoint');
      const username = config.get('serviceClient.ches.username');
      const password = config.get('serviceClient.ches.password');

      const token = await utils.getKeyCloakToken(username, password, tokenEndpoint);
      const response = await axios.post(apiEndpoint + '/v1/email', {
        body: `<p>Request from GETOK for acronym creation/access</p> <p><strong>User comments:</strong><br/>${comments}`,
        bodyType: 'html',
        from: from,
        priority: 'high',
        to: ['NR.CommonServiceShowcase@gov.bc.ca'],
        subject: `GETOK Registration for ${acronym} - ${idir}`
      }, {
        headers: { Authorization: `Bearer ${token.access_token}` }
      });

      if (response.status == 201) {
        return response.data;
      } else {
        throw new Error(`Error from POST to CHES. Response Code: ${response.status}`);
      }
    } catch (error) {
      log.error('email.sendRequest', error.message);
      throw new Error(`Error calling email endpoint. Error: ${error.message}`);
    }
  },
};

module.exports = email;
