const axios = require('axios');
const config = require('config');
const log = require('npmlog');
const MockAdapter = require('axios-mock-adapter');

const checks = require('../../../src/components/checks');
const utils = require('../../../src/components/utils');

log.level = config.get('server.logLevel');
const mockAxios = new MockAdapter(axios);

describe('getWebAdeOauth2Status', () => {
  const username = config.get('serviceClient.getokInt.username');
  const password = config.get('serviceClient.getokInt.password');
  const scope = 'WEBADE-REST';
  const webadeEnv = 'INT';

  const spy = jest.spyOn(utils, 'getWebAdeToken');
  jest.mock('../../../src/components/utils');

  afterEach(() => {
    spy.mockClear();
  });

  it('should return the state of endpoint', async () => {
    utils.getWebAdeToken.mockResolvedValue({
      access_token: '00000000-0000-0000-0000-000000000000',
      token_type: 'bearer',
      expires_in: 43199,
      scope: 'WEBADE-REST.UPDATEAPPLICATIONS',
      jti: '00000000-0000-0000-0000-000000000000'
    });

    const result = await checks.getWebAdeOauth2Status();

    expect(result).toBeTruthy();
    expect(result.authenticated).toBeTruthy();
    expect(result.authorized).toBeTruthy();
    expect(result.healthCheck).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(username, password, scope, webadeEnv);
  });

  it('should gracefully fail and return the state of the endpoint', async () => {
    utils.getWebAdeToken.mockRejectedValue('Unauthorized');

    const result = await checks.getWebAdeOauth2Status();

    expect(result).toBeTruthy();
    expect(result.authenticated).toBeFalsy();
    expect(result.authorized).toBeFalsy();
    expect(result.healthCheck).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(username, password, scope, webadeEnv);
  });
});

describe('getChesStatus', () => {
  const endpoint = config.get('serviceClient.ches.tokenEndpoint');
  const username = config.get('serviceClient.ches.username');
  const password = config.get('serviceClient.ches.password');

  const spy = jest.spyOn(utils, 'getKeyCloakToken');
  jest.mock('../../../src/components/utils');

  const axiosSpy = jest.spyOn(axios, 'get');

  afterEach(() => {
    spy.mockClear();
    axiosSpy.mockClear();
  });

  it('should return the state of endpoint', async () => {
    utils.getKeyCloakToken.mockResolvedValue({
      'access_token': 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5Rm5UcVlVRkxnbTFIbTJIOThnWEJhWnpPcXBnMFlWU1NvNHBESlVuNXZ3In0.eyJqdGkiOiJjNjU5ZDgzMC0yNzI1LTRhZjktODc4NC1kZGViNmQyNmQyN2QiLCJleHAiOjE1NzkzMDMyMjYsIm5iZiI6MCwiaWF0IjoxNTc5MzAyOTI2LCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvamJkNnJueHciLCJhdWQiOlsiQ0RPR1MiLCJDSEVTIl0sInN1YiI6IjMyNzNmZTA2LTM1ZWMtNDI2Yy1hYmE3LTgxYWMxNDIzZjU5OCIsInR5cCI6IkJlYXJlciIsImF6cCI6IkRHUlNDX1NFUlZJQ0VfQ0xJRU5UIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiNjkyZWQ0YTAtY2Y2Yy00ZmQ2LWI5M2UtYzAxOWI0NTk4NWNiIiwiYWNyIjoiMSIsInJlc291cmNlX2FjY2VzcyI6eyJDRE9HUyI6eyJyb2xlcyI6WyJHRU5FUkFUT1IiLCJ1bWFfcHJvdGVjdGlvbiJdfSwiQ0hFUyI6eyJyb2xlcyI6WyJFTUFJTEVSIiwidW1hX3Byb3RlY3Rpb24iXX0sIkRHUlNDX1NFUlZJQ0VfQ0xJRU5UIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIiwiQ09NTU9OX1NFUlZJQ0VTIl19fSwic2NvcGUiOiIiLCJjbGllbnRJZCI6IkRHUlNDX1NFUlZJQ0VfQ0xJRU5UIiwiY2xpZW50SG9zdCI6IjE0Mi4yNC43Ny4yMjQiLCJjbGllbnRBZGRyZXNzIjoiMTQyLjI0Ljc3LjIyNCJ9.F1YLwOl3yS_AN_XQJ0V80-XFXLmYE91rRlLwIhQtKJcK4V1uJx4uJGxHQTf_RCG-y87D5k0HdjmjA52dS1qY3Hh9Y3hhbluP9hvC11Z18IfrA8drkdp-49pJ9jWfkpXXZuUYcjqBt-BvKpSZgWSeYOruoZ7F14GpWyDUYUMPzieUNCVIOmuKlJohKTA-RWxT9pBLMZIh22mmK-a0q8-gFLYWYzcz85Rp0LtwZ-XHV3xUs0fr8qaDhv85uLBXEIB9fIssi1IljPbOoh9YtapOJxFF1Hataf2AQTBzpO4Lxwq5-6QfGhWqp3hTPeorGgbirbtwx7_Fg-pU1kHQQEDC7g',
      'expires_in': 300,
      'refresh_expires_in': 1800,
      'refresh_token': 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwZTJjY2IxMi1lNDExLTRkM2ItOWUxOC0wNDk2N2EzYzFlODIifQ.eyJqdGkiOiJkYzkzNmE5Zi0zZjVhLTQzMTgtOWEyNi1jMjU1OTc5MTIyODEiLCJleHAiOjE1NzkyOTUwMDAsIm5iZiI6MCwiaWF0IjoxNTc5MjkzMjAwLCJpc3MiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvamJkNnJueHciLCJhdWQiOiJodHRwczovL3Nzby1kZXYucGF0aGZpbmRlci5nb3YuYmMuY2EvYXV0aC9yZWFsbXMvamJkNnJueHciLCJzdWIiOiIzMjczZmUwNi0zNWVjLTQyNmMtYWJhNy04MWFjMTQyM2Y1OTgiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoiREdSU0NfU0VSVklDRV9DTElFTlQiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiJhN2FkODI3MC1kY2U0LTQzN2ItYjc2ZS0yNjMxMmJiMmE2ZWQiLCJyZXNvdXJjZV9hY2Nlc3MiOnsiQ0RPR1MiOnsicm9sZXMiOlsiR0VORVJBVE9SIiwidW1hX3Byb3RlY3Rpb24iXX0sIkNIRVMiOnsicm9sZXMiOlsiRU1BSUxFUiIsInVtYV9wcm90ZWN0aW9uIl19LCJER1JTQ19TRVJWSUNFX0NMSUVOVCI6eyJyb2xlcyI6WyJ1bWFfcHJvdGVjdGlvbiIsIkNPTU1PTl9TRVJWSUNFUyJdfX0sInNjb3BlIjoiIn0.bMSRuPHYUYMVNllD4NwjxHnWudVqCZ5BrVdrLoEVRZ4',
      'token_type': 'bearer',
      'not-before-policy': 0,
      'session_state': 'a7ad8270-dce4-437b-b76e-26312bb2a6ed',
      'scope': ''
    });

    mockAxios.onGet().reply(200, {
      data: { '123': 'abc' }
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
      'error': 'unauthorized_client',
      'error_description': 'Invalid client secret'
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
