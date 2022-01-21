const axios = require('axios');
const config = require('config');
const MockAdapter = require('axios-mock-adapter');

const checks = require('../../../src/components/checks');
const utils = require('../../../src/components/utils');

const mockAxios = new MockAdapter(axios);

describe('getChesStatus', () => {
  const endpoint = config.get('serviceClient.ches.tokenEndpoint');
  const username = config.get('serviceClient.ches.username');
  const password = config.get('serviceClient.ches.password');

  const spy = jest.spyOn(utils, 'getKeyCloakToken');
  jest.mock('../../../src/components/utils');

  const axiosSpy = jest.spyOn(axios, 'get');

  beforeEach(() => {
    spy.mockClear();
    axiosSpy.mockClear();
  });

  it('should return the state of endpoint', async () => {
    utils.getKeyCloakToken.mockResolvedValue({
      access_token:
        'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5Rm5UcVlVRkxnbTFIbTJIOThnWEJhWnpPcXBnMFlWU1NvNHBESlVuNXZ3In0.eyJqdGkiOiJjNjU5ZDgzMC0yNzI1LTRhZjktODc4NC1kZGViNmQyNmQyN2QiLCJleHAiOjE1NzkzMDMyMjYsIm5iZiI6MCwiaWF0IjoxNTc5MzAyOTI2LCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvamJkNnJueHciLCJhdWQiOlsiQ0RPR1MiLCJDSEVTIl0sInN1YiI6IjMyNzNmZTA2LTM1ZWMtNDI2Yy1hYmE3LTgxYWMxNDIzZjU5OCIsInR5cCI6IkJlYXJlciIsImF6cCI6IkRHUlNDX1NFUlZJQ0VfQ0xJRU5UIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiNjkyZWQ0YTAtY2Y2Yy00ZmQ2LWI5M2UtYzAxOWI0NTk4NWNiIiwiYWNyIjoiMSIsInJlc291cmNlX2FjY2VzcyI6eyJDRE9HUyI6eyJyb2xlcyI6WyJHRU5FUkFUT1IiLCJ1bWFfcHJvdGVjdGlvbiJdfSwiQ0hFUyI6eyJyb2xlcyI6WyJFTUFJTEVSIiwidW1hX3Byb3RlY3Rpb24iXX0sIkRHUlNDX1NFUlZJQ0VfQ0xJRU5UIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIiwiQ09NTU9OX1NFUlZJQ0VTIl19fSwic2NvcGUiOiIiLCJjbGllbnRJZCI6IkRHUlNDX1NFUlZJQ0VfQ0xJRU5UIiwiY2xpZW50SG9zdCI6IjE0Mi4yNC43Ny4yMjQiLCJjbGllbnRBZGRyZXNzIjoiMTQyLjI0Ljc3LjIyNCJ9.F1YLwOl3yS_AN_XQJ0V80-XFXLmYE91rRlLwIhQtKJcK4V1uJx4uJGxHQTf_RCG-y87D5k0HdjmjA52dS1qY3Hh9Y3hhbluP9hvC11Z18IfrA8drkdp-49pJ9jWfkpXXZuUYcjqBt-BvKpSZgWSeYOruoZ7F14GpWyDUYUMPzieUNCVIOmuKlJohKTA-RWxT9pBLMZIh22mmK-a0q8-gFLYWYzcz85Rp0LtwZ-XHV3xUs0fr8qaDhv85uLBXEIB9fIssi1IljPbOoh9YtapOJxFF1Hataf2AQTBzpO4Lxwq5-6QfGhWqp3hTPeorGgbirbtwx7_Fg-pU1kHQQEDC7g',
    });

    mockAxios.onGet().reply(200, {
      data: { 123: 'abc' },
    });

    const result = await checks.getChesStatus();

    expect(result).toBeTruthy();
    expect(result.authenticated).toBeTruthy();
    expect(result.authorized).toBeTruthy();
    expect(result.healthCheck).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(username, password, endpoint);
  });

  it('should gracefully fail and return the state of the endpoint', async () => {
    utils.getKeyCloakToken.mockRejectedValue({
      error: 'unauthorized_client',
      error_description: 'Invalid client secret',
    });

    const result = await checks.getChesStatus();

    expect(result).toBeTruthy();
    expect(result.authenticated).toBeFalsy();
    expect(result.authorized).toBeFalsy();
    expect(result.healthCheck).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(username, password, endpoint);
  });
});

describe('getStatus', () => {
  const getChesStatusSpy = jest.spyOn(checks, 'getChesStatus');

  beforeEach(() => {
    getChesStatusSpy.mockClear();
  });

  afterAll(() => {
    getChesStatusSpy.mockRestore();
  });

  it('should return an array', () => {
    getChesStatusSpy.mockResolvedValue({});

    const result = checks.getStatus();

    expect(result).resolves.toBeTruthy();
    expect(result).resolves.toEqual(expect.any(Array));
  });
});
