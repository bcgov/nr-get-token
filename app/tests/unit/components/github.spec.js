const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const helper = require('../../common/helper');

const github = require('../../../src/components/github');

helper.logHelper();

const mockAxios = new MockAdapter(axios);

describe('sendRequest', () => {
  const axiosSpy = jest.spyOn(axios, 'post');

  beforeEach(() => {
    axiosSpy.mockClear();
  });

  it('should post to the github endpoint', async () => {

    const res = {
      url: 'https://api.github.com/repos/bcgov/nr-get-token/issues/xxx',
      title: 'IGNORE_TESTING',
      user: {
        login: 'bcgov-nr-csst',
      },
      labels: [
        {
          name: 'some label'
        }
      ],
      state: 'open',
      body: 'blah <p>test</p>'
    };

    mockAxios.onPost().reply(201, res);

    await github.createRequestIssue('ABC', 'comment', 'my.email@gov.bc.ca', 'me@idir');

    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception if the response is 403', async () => {
    mockAxios.onPost().reply(403, { test: 123 });

    await expect(github.createRequestIssue('ABC', 'comment', 'my.email@gov.bc.ca', 'me@idir'))
      .rejects
      .toThrow('Error calling github issue creation endpoint. Error: Request failed with status code 403');

    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });
});
