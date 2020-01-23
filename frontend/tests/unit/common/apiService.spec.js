import axios from 'axios';
import ApiService from '@/common/apiService';
import MockAdapter from 'axios-mock-adapter';

import * as healthCheckFixture from './fixtures/healthCheck.json';
import * as apiCheckFixture from './fixtures/apiCheck.json';

const mockAxios = new MockAdapter(ApiService.apiAxios);

describe('getAPICheck()', () => {
  const spy = jest.spyOn(ApiService.apiAxios, 'get');

  beforeEach(() => {
    ApiService.apiAxios.interceptors.response.eject(ApiService.intercept);
  });

  afterEach(() => {
    spy.mockClear();
  });

  it('calls `getAPICheck() endpoint with a route', async () => {
    mockAxios.onGet(apiCheckFixture.route).reply(200, {
      hello: 'world',
      request: {
        responseUrl: 'test'
      }
    });
    const res = await ApiService.getApiCheck(apiCheckFixture.route);

    // TODO: see about re-adding these conditions
    // expect(res).toContain(`URL: ${apiCheckFixture.route}`);
    // eslint-disable-next-line no-console
    console.log(res);
    // expect(axios.get).toHaveBeenCalledWith(apiCheckFixture.route);
    // expect(axios.get).toHaveBeenCalledTimes(1);
  });
});

describe.skip('getHealthCheck()', () => {
  it('calls `getHealthCheck() endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: healthCheckFixture });
    const check = await ApiService.getHealthCheck();

    expect(check).toEqual(healthCheckFixture);
    expect(axios.get).toHaveBeenCalledWith('/api/v1/checks/status');
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});

describe('sendRegistrationEmail()', () => {
  const spy = jest.spyOn(ApiService.apiAxios, 'post');

  beforeEach(() => {
    ApiService.apiAxios.interceptors.response.eject(ApiService.intercept);
  });

  afterEach(() => {
    spy.mockClear();
  });

  it('calls `sendRegistrationEmail() endpoint with a route', async () => {
    mockAxios.onPost('/api/v1/email').reply(201, { hello: 'world' });
    const res = await ApiService.sendRegistrationEmail(apiCheckFixture.route);

    expect(res).toEqual({ hello: 'world' });
  });
});
