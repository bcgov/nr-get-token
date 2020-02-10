const axios = require('axios');
const config = require('config');
const log = require('npmlog');
const MockAdapter = require('axios-mock-adapter');

const email = require('../../../src/components/email');
const utils = require('../../../src/components/utils');

const mockAxios = new MockAdapter(axios);

log.level = config.get('server.logLevel');

const tokenEndpoint = config.get('serviceClient.ches.tokenEndpoint');
const scUser = config.get('serviceClient.ches.username');
const scPw = config.get('serviceClient.ches.password');

describe('sendContactEmail', () => {
  // Spy/mock the get token function
  const utilSpy = jest.spyOn(utils, 'getKeyCloakToken');
  jest.mock('../../../src/components/utils');

  const axiosSpy = jest.spyOn(axios, 'post');

  afterEach(() => {
    utilSpy.mockClear();
    axiosSpy.mockClear();
  });

  it('should post to the email endpoint', async () => {
    utils.getKeyCloakToken.mockResolvedValue('token1234');

    const res = {
      messages: [
        {
          msgId: '16b3e0f2-506c-4954-817e-be0969524ea0',
          to: ['emailhere@someemail.com']
        }
      ],
      txId: '9095c9e5-6f8a-4068-96b8-a6dd7178a3e4'
    };

    mockAxios.onPost().reply(201, res);

    const result = await email.sendContactEmail('ABC', 'comment', 'my.email@gov.bc.ca', 'me@idir');

    expect(result).toBeTruthy();
    expect(result).toEqual(res);

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(scUser, scPw, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception if the response is not a 201', async () => {
    utils.getKeyCloakToken.mockResolvedValue('token1234');

    mockAxios.onPost().reply(403, { test: 123 });

    await expect(email.sendContactEmail('ABC', 'comment', 'my.email@gov.bc.ca', 'me@idir'))
      .rejects
      .toThrow('Error calling email endpoint openshift. Error: Request failed with status code 403');

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(scUser, scPw, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception if the token fetch fails', async () => {
    utils.getKeyCloakToken.mockImplementation(() => {
      throw new Error('TOKENERR');
    });

    await expect(email.sendContactEmail('ABC', 'comment', 'my.email@gov.bc.ca', 'me@idir'))
      .rejects
      .toThrow('Error calling email endpoint openshift. Error: TOKENERR');

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(scUser, scPw, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(0);
  });
});
