import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Vue from 'vue';

import userService from '@/services/userService';

const mockInstance = axios.create();
const mockAxios = new MockAdapter(mockInstance);
const zeroUuid = '00000000-0000-0000-0000-000000000000';

jest.mock('@/services/interceptors', () => {
  return {
    getokAxios: () => mockInstance
  };
});

describe('getUserAcronyms', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  afterEach(() => {
    if (Vue.prototype.$keycloak) {
      delete Vue.prototype.$keycloak;
    }
  });

  it('calls getUserAcronyms endpoint when logged in', async () => {
    Object.defineProperty(Vue.prototype, '$keycloak', {
      configurable: true, // Needed to allow deletions later
      get() {
        return {
          authenticated: true,
          ready: true,
          subject: zeroUuid
        };
      }
    });
    const data = [
      { acronym: 'PEN_RETRIEVAL', owner: false },
      { acronym: 'GETOK', owner: false },
      { acronym: 'MSSC', owner: false }
    ];
    mockAxios.onGet().reply(200, data);

    const result = await userService.getUserAcronyms();

    expect(result.data).toEqual(expect.any(Array));
    expect(result.data.length).toBe(3);
    expect(result.data).toEqual(data);
    expect(mockAxios.history.get.length).toBe(1);
  });

  it('returns an empty array when not logged in', async () => {
    const result = await userService.getUserAcronyms();

    expect(result.data).toEqual(expect.any(Array));
    expect(result.data.length).toBe(0);
    expect(mockAxios.history.get.length).toBe(0);
  });
});
