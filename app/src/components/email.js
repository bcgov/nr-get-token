const axios = require('axios');
const config = require('config');
const fs = require('fs');
const log = require('./log')(module.filename);
const path = require('path');

const utils = require('./utils');

const email = {

  _getChesToken: async () => {
    try {
      const tokenEndpoint = config.get('serviceClient.ches.tokenEndpoint');
      const username = config.get('serviceClient.ches.username');
      const password = config.get('serviceClient.ches.password');

      const token = await utils.getKeyCloakToken(
        username,
        password,
        tokenEndpoint
      );

      return token;

    } catch (error) {
      log.error(error.message, { function: '_getToken' });
      throw new Error(`Error getting token for CHES. Error: ${error.message}`);
    }
  },

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
      const token = await email._getChesToken();
      const response = await axios.post(
        apiEndpoint + '/v1/email',
        {
          body: `<p>Request from GETOK for acronym creation/access</p> <p><strong>User comments:</strong><br/>${comments}`,
          bodyType: 'html',
          from: from,
          priority: 'high',
          to: ['NR.CommonServiceShowcase@gov.bc.ca'],
          subject: `GETOK Registration for ${acronym} - ${idir}`,
        },
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }
      );

      if (response.status == 201) {
        return response.data;
      } else {
        throw new Error(
          `Error from POST to CHES /v1/email. Response Code: ${response.status}`
        );
      }
    } catch (error) {
      log.error(error.message, { function: 'sendRequest' });
      throw new Error(`Error calling CHES email endpoint. Error: ${error.message}`);
    }
  },

  /**
  * @function sendConfirmationEmail
  * Sends an email request through CHES to the user saying they've been registered to an acronym. CC's team inbox.
  * @param {string} acronym The requestor's requested application acronym
  * @param {string} idir The requestor's IDIR
  * @param {string} comments The optional comment
  * @param {string} status The status text
  * @param {string} nextSteps The Next Steps text
  * @param {string} to The requestor registered email
  */
  sendConfirmationEmail: async (acronym, idir, comments, status, nextSteps, to) => {
    try {
      const apiEndpoint = config.get('serviceClient.ches.apiEndpoint');
      const token = await email._getChesToken();
      const template = fs.readFileSync(
        `${path.join(
          __dirname,
          'assets'
        )}/confirmation-email-template.html`,
        'utf8'
      );
      const data = {
        body: template,
        bodyType: 'html',
        contexts: [{
          context: { acronym: acronym, idir: idir, comments: comments, status: status, nextSteps: nextSteps },
          to: [to],
        }],
        from: 'NR.CommonServiceShowcase@gov.bc.ca',
        cc: ['NR.CommonServiceShowcase@gov.bc.ca'],
        subject: `RE: GETOK Registration for ${acronym} - ${idir}`,
      };

      const response = await axios.post(
        apiEndpoint + '/v1/emailMerge',
        data,
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }
      );

      if (response.status == 201) {
        return response.data;
      } else {
        throw new Error(
          `Error from POST to CHES /v1/emailMerge. Response Code: ${response.status}`
        );
      }
    } catch (error) {
      log.error(error.message, { function: 'sendConfirmationEmail' });
      throw new Error(`Error calling CHES merge endpoint. Error: ${error.message}`);
    }
  },
};

module.exports = email;
