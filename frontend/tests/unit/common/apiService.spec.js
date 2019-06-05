import axios from 'axios';
import { ApiService } from '@/common/apiService';

import * as healthCheckFixture from './fixtures/healthCheck.json';
import * as apiCheckFixture from './fixtures/apiCheck.json';

jest.mock('axios');

describe('getAPICheck()', () => {
  it('calls `getAPICheck() endpoint with a route', async () => {
    axios.get.mockResolvedValueOnce(apiCheckFixture.response);
    const res = await ApiService.getApiCheck(apiCheckFixture.route);

    expect(res).toContain(`URL: ${apiCheckFixture.route}`);
    expect(axios.get).toHaveBeenCalledWith(apiCheckFixture.route);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});

describe('getHealthCheck()', () => {
  it('calls `getHealthCheck() endpoint', async () => {
    axios.get.mockResolvedValueOnce({ data: healthCheckFixture });
    const check = await ApiService.getHealthCheck();

    expect(check).toEqual(healthCheckFixture);
    expect(axios.get).toHaveBeenCalledWith('/api/v1/checks/status');
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});

