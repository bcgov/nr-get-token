import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import helloService from '@/services/helloService';

const mockInstance = axios.create();
const mockAxios = new MockAdapter(mockInstance);

jest.mock('@/services/interceptors', () => {
  return {
    getokAxios: () => mockInstance
  };
});

describe('getHello', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('calls getHello endpoint', async () => {
    const data = 'test';
    mockAxios.onGet('/hello').reply(200, data);

    const result = await helloService.getHello();
    expect(result.data).toEqual(data);
    expect(mockAxios.history.get.length).toBe(1);
  });
});
