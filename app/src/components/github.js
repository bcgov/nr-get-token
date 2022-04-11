const axios = require('axios');
const config = require('config');
const log = require('./log')(module.filename);

const github = {
  /**
   * @function createRequestIssue
   * Raise a github issue for an access request in the nr-get-token repo
   * @param {string} acronym The sender's requested application acronym
   * @param {string} comments The sender's unformatted comment text
   * @param {string} from The sender's registered email
   * @param {string} idir The sender's IDIR
   */
  createRequestIssue: async (acronym, ministry, comments, from, idir) => {
    try {
      const accessToken = config.get('serviceClient.github.token');
      const githubApi = config.get('serviceClient.github.apiEndpoint');

      // See https://docs.github.com/en/rest/reference/issues
      return axios.post(
        githubApi + '/issues',
        {
          owner: 'bcgov-nr-csst',
          repo: 'nr-get-token',
          title: `GETOK Registration for ${acronym} - ${idir}`,
          body: `<p>Request from GETOK for acronym creation/access</p> <p>Acronym: ${acronym} <br /> Ministry: ${ministry} <br /> IDIR: ${idir} <br /> Email: ${from}</p> <p><strong>User comments:</strong><br/>${comments}`,
          labels: ['Acronym Request'],
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    } catch (error) {
      log.error(error.message, { function: 'createRequestIssue' });
      throw new Error(
        `Error calling github issue creation endpoint. Error: ${error.message}`
      );
    }
  },
};

module.exports = github;
