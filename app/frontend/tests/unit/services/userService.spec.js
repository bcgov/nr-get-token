import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import userService from '@/services/userService';
import { ApiRoutes } from '@/utils/constants';

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

  it('calls getUserAcronyms endpoint with valid uuid', async () => {
    const data = [
      { acronym: 'PEN_RETRIEVAL', owner: false },
      { acronym: 'GETOK', owner: false },
      { acronym: 'MSSC', owner: false }
    ];
    mockAxios.onGet(`${ApiRoutes.USERS}/${zeroUuid}/acronyms`).reply(200, data);

    const result = await userService.getUserAcronyms(zeroUuid);

    expect(result.data).toEqual(expect.any(Array));
    expect(result.data.length).toBe(3);
    expect(result.data).toEqual(data);
    expect(mockAxios.history.get.length).toBe(1);
  });

  it('rejects with no keycloakId', async () => {
    const result = () => userService.getUserAcronyms();

    await expect(result()).rejects.toEqual('keycloakId must be a valid UUID');
    expect(mockAxios.history.get.length).toBe(0);
  });
});
