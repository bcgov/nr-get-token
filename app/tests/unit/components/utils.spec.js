const axios = require('axios');
const config = require('config');
const MockAdapter = require('axios-mock-adapter');

const utils = require('../../../src/components/utils');

const mockAxios = new MockAdapter(axios);

describe('getKeyCloakToken', () => {
  const endpoint = config.get('serviceClient.ches.tokenEndpoint');
  const username = config.get('serviceClient.ches.username');
  const password = config.get('serviceClient.ches.password');

  beforeEach(() => {
    mockAxios.resetHistory();
  });

  it('should call KC endpoint to get a token', async () => {
    const tkn = 'hsdfs79fsdiufhew89ijsdf9.dshufu9dshf98dsfhsdf.89sdhfs8d9hfuh';
    mockAxios.onPost().reply(200, {
      data: {
        access_token: tkn,
        expires_in: 300,
        refresh_expires_in: 1800,
        refresh_token: 'sdklfjkdskjf87.sdiohfsduh8.sdfioj898',
        token_type: 'bearer',
        'not-before-policy': 0,
        session_state: 'f4464085-3cbc-498b-96d3-0a33837d2ae8',
        scope: '',
      },
    });

    const result = await utils.getKeyCloakToken(username, password, endpoint);

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    expect(result.data).toBeTruthy();
    expect(result.data.access_token).toEqual(tkn);
    expect(mockAxios.history.post).toHaveLength(1);
    expect(mockAxios.history.post[0].auth).toEqual({
      username: username,
      password: password,
    });
    expect(mockAxios.history.post[0].headers['Content-Type']).toMatch(
      'application/x-www-form-urlencoded'
    );
  });

  it('should gracefully fail if endpoint is down', async () => {
    mockAxios.onPost().reply(400, {
      data: {
        error: 'invalid_request',
        error_description: 'Invalid grant_type',
      },
    });

    const result = await utils.getKeyCloakToken(username, password, endpoint);

    expect(result).toBeTruthy();
    expect(mockAxios.history.post).toHaveLength(1);
  });
});
