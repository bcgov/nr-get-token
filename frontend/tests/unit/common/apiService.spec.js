import axios from 'axios';
import { apiService2 } from '@/common/apiService2';

import * as healthCheckFixture from './fixtures/healthCheck.json';
import * as apiCheckFixture from './fixtures/apiCheck.json';

jest.mock('axios');

describe('getAPICheck()', () => {
  it('calls `getAPICheck() endpoint with a route', async () => {
    axios.get.mockResolvedValueOnce(apiCheckFixture.response);
    //const check = await apiService2.getHealthCheck(apiCheckFixture.request);
    console.log(apiCheckFixture.route); // eslint-disable-line no-console

    const res = await apiService2.getApiCheck(apiCheckFixture.route);

    expect(res).toEqual(apiCheckFixture.formattedResult);
    expect(axios.get).toHaveBeenCalledWith(apiCheckFixture.route);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});

describe('getHealthCheck()', () => {
  it('calls `getHealthCheck() endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: healthCheckFixture });
    const check = await apiService2.getHealthCheck();

    expect(check).toEqual(healthCheckFixture);
    expect(axios.get).toHaveBeenCalledWith('/api/v1/checks/status');
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});

