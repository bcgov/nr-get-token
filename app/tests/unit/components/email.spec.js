const axios = require('axios');
const config = require('config');
const MockAdapter = require('axios-mock-adapter');

const helper = require('../../common/helper');

const email = require('../../../src/components/email');
const utils = require('../../../src/components/utils');

helper.logHelper();

const mockAxios = new MockAdapter(axios);

const tokenEndpoint = config.get('serviceClient.ches.tokenEndpoint');
const username = config.get('serviceClient.ches.username');
const password = config.get('serviceClient.ches.password');

describe('sendRequest', () => {
  const utilSpy = jest.spyOn(utils, 'getKeyCloakToken');
  const axiosSpy = jest.spyOn(axios, 'post');

  beforeEach(() => {
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

    const result = await email.sendRequest('ABC', 'comment', 'my.email@gov.bc.ca', 'me@idir');

    expect(result).toBeTruthy();
    expect(result).toEqual(res);

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(username, password, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception if the response is 200', async () => {
    utils.getKeyCloakToken.mockResolvedValue('token1234');
    mockAxios.onPost().reply(200, { test: 123 });

    await expect(email.sendRequest('ABC', 'comment', 'my.email@gov.bc.ca', 'me@idir'))
      .rejects
      .toThrow('Error calling email endpoint. Error: Error from POST to CHES. Response Code: 200');

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(username, password, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception if the response is 403', async () => {
    utils.getKeyCloakToken.mockResolvedValue('token1234');
    mockAxios.onPost().reply(403, { test: 123 });

    await expect(email.sendRequest('ABC', 'comment', 'my.email@gov.bc.ca', 'me@idir'))
      .rejects
      .toThrow('Error calling email endpoint. Error: Request failed with status code 403');

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(username, password, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception if the token fetch fails', async () => {
    utils.getKeyCloakToken.mockImplementation(() => {
      throw new Error('TOKENERR');
    });

    await expect(email.sendRequest('ABC', 'comment', 'my.email@gov.bc.ca', 'me@idir'))
      .rejects
      .toThrow('Error calling email endpoint. Error: TOKENERR');

    expect(utilSpy).toHaveBeenCalledTimes(1);
    expect(utilSpy).toHaveBeenCalledWith(username, password, tokenEndpoint);
    expect(axiosSpy).toHaveBeenCalledTimes(0);
  });
});
