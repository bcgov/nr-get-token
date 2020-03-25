import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import testerService from '@/services/testerService';

const mockInstance = axios.create();
const mockAxios = new MockAdapter(mockInstance);

jest.mock('@/services/interceptors', () => {
  return {
    getokAxios: () => mockInstance
  };
});

describe('getTestResponse', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('calls email endpoint', async () => {
    mockAxios.onGet().reply(200, 'ok');

    const result = await testerService.getTestResponse('');
    expect(result).toBeTruthy();
    expect(result.data).toEqual('ok');
    expect(mockAxios.history.get.length).toBe(1);
  });
});
