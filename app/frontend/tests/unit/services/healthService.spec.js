import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import healthService from '@/services/healthService';
import { ApiRoutes } from '@/utils/constants';

const mockInstance = axios.create();
const mockAxios = new MockAdapter(mockInstance);

jest.mock('@/services/interceptors', () => {
  return {
    getokAxios: () => mockInstance
  };
});

describe.skip('getHealthCheck', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('calls health check endpoint', async () => {
    mockAxios.onGet(ApiRoutes.HEALTH).reply(200, {});

    const result = await healthService.getHealthCheck();
    expect(result).toBeTruthy();
    expect(result.data).toEqual({});
    expect(mockAxios.history.get.length).toBe(1);
  });
});
