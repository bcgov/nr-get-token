import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import acronymService from '@/services/acronymService';
import { ApiRoutes } from '@/utils/constants';

const mockInstance = axios.create();
const mockAxios = new MockAdapter(mockInstance);
const acronym = 'XXX';

jest.mock('@/services/interceptors', () => {
  return {
    getokAxios: () => mockInstance
  };
});

describe('getAcronym', () => {
  const data = {
    acronymId: '123-456',
    acronym: 'MSSC',
    name: '',
    description: 'None Entered',
    createdAt: '2019-08-15T20:14:41.966Z',
    updatedAt: '2019-08-15T20:14:41.966Z',
    deletedAt: null
  };

  beforeEach(() => {
    mockAxios.reset();
  });

  it('calls getAcronym endpoint', async () => {
    mockAxios.onGet(`${ApiRoutes.ACRONYMS}/${acronym}`).reply(200, data);

    const result = await acronymService.getAcronym(acronym);

    expect(result.data).toEqual(data);
    expect(mockAxios.history.get.length).toBe(1);
  });

  it('rejects with no acronym', async () => {
    const result = () => acronymService.getAcronym();

    await expect(result()).rejects.toEqual('No acronym supplied');
    expect(mockAxios.history.get.length).toBe(0);
  });
});

describe('getUsers', () => {
  const acronymUsersFixture = require('./fixtures/acronymUsers.json');

  beforeEach(() => {
    mockAxios.reset();
  });

  it('calls getUsers endpoint', async () => {
    mockAxios.onGet(`${ApiRoutes.ACRONYMS}/${acronym}/users`).reply(200, acronymUsersFixture);

    const result = await acronymService.getUsers(acronym);

    expect(result.data).toEqual(expect.any(Array));
    expect(result.data.length).toBe(2);
    expect(result.data).toEqual(acronymUsersFixture);
    expect(mockAxios.history.get.length).toBe(1);
  });

  it('rejects with no acronym', async () => {
    const result = () => acronymService.getUsers();

    await expect(result()).rejects.toEqual('No acronym supplied');
    expect(mockAxios.history.get.length).toBe(0);
  });
});
