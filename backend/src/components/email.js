const axios = require('axios');
const config = require('config');
const log = require('npmlog');

const utils = require('./utils');

const email = {
  sendContactEmail: async (acronym, comments, from, idir) => {
    const emailEndpoint = config.get('serviceClient.ches.emailEndpoint');
    const tokenEndpoint = config.get('serviceClient.ches.tokenEndpoint');
    const scUser = config.get('serviceClient.ches.username');
    const scPw = config.get('serviceClient.ches.password');
    try {
      const token = await utils.getKeyCloakToken(scUser, scPw, tokenEndpoint);

      const body = `<p>Request from GETOK for acronym creation/access</p> <p><strong>User comments:</strong><br/>${comments}`;

      const response = await axios.post(emailEndpoint, {
        body: body,
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
      log.error('sendContactEmail', error.message);
      throw new Error(`Error calling email endpoint ${emailEndpoint}. Error: ${error.message}`);
    }
  },
};

module.exports = email;
