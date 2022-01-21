const acronyms = require('../../../src/components/acronyms');
const {
  acronymService,
  deploymentHistoryService,
} = require('../../../src/services');
const usersComponent = require('../../../src/components/users');
const utils = require('../../../src/components/utils');

describe('getAcronym', () => {
  const acronymDetailFixture = require('./fixtures/acronymDetail.json');

  // Spy/mock the DB access 'find' method on the acronym table
  const spy = jest.spyOn(acronymService, 'find');

  beforeEach(() => {
    spy.mockClear();
  });

  it('should return an acronym found from the mocked data adapter', async () => {
    acronymService.find.mockResolvedValue(acronymDetailFixture);
    const appAcr = 'WORG';

    const result = await acronyms.getAcronym(appAcr);

    expect(result).toBeTruthy();
    expect(result).toEqual(acronymDetailFixture);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(appAcr);
  });

  it('should return null if the data adapter returns nothing found', async () => {
    acronymService.find.mockResolvedValue(undefined);
    const appAcr = 'ANY';

    const result = await acronyms.getAcronym(appAcr);

    expect(result).toBeNull();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(appAcr);
  });

  it('should error if no acronym passed to it', async () => {
    acronymService.find.mockResolvedValue(acronymDetailFixture);

    await expect(acronyms.getAcronym(undefined)).rejects.toThrow();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should re-throw if no catching an error from the data layer', async () => {
    acronymService.find.mockImplementation(() => {
      throw new Error();
    });

    await expect(acronyms.getAcronym('TEST')).rejects.toThrow();
  });
});

describe('getUsers', () => {
  const acronymUsersFixture = require('./fixtures/acronymUsers.json');
  const keycloakUsersFixture = require('./fixtures/keycloakUsers.json');

  // Spy/mock the DB access 'find' method on the acronym table
  const spy = jest.spyOn(acronymService, 'acronymUserList');
  const usersSpy = jest.spyOn(usersComponent, 'getAllGetokUsers');

  beforeEach(() => {
    spy.mockClear();
    usersSpy.mockClear();
  });

  it('should throw an error if no acronym supplied', async () => {
    await expect(acronyms.getUsers(undefined)).rejects.toThrow(
      'No app acronym supplied to getUsers'
    );
  });

  it('should return an empty array if the service returns undefined', async () => {
    acronymService.acronymUserList.mockResolvedValue(undefined);
    const acr = 'XXX';

    const result = await acronyms.getUsers(acr);

    expect(result).toEqual([]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(acr);
    expect(usersSpy).toHaveBeenCalledTimes(0);
  });

  it('should return an empty array if no userAcronym mappings exist', async () => {
    acronymService.acronymUserList.mockResolvedValue([]);
    const acr = 'XXX';

    const result = await acronyms.getUsers(acr);

    expect(result).toEqual([]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(acr);
    expect(usersSpy).toHaveBeenCalledTimes(0);
  });

  it('should return an empty array if no users are found from KC', async () => {
    acronymService.acronymUserList.mockResolvedValue(acronymUsersFixture);
    usersComponent.getAllGetokUsers.mockResolvedValue([]);
    const acr = 'XXX';

    const result = acronyms.getUsers(acr);
    await expect(result).rejects.toThrow(
      `An error occured fetching users for acronym ${acr}`
    );

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(acr);
    expect(usersSpy).toHaveBeenCalledTimes(1);
  });

  it('should return an appropriate combination of AcronymUser and Keycloak user records', async () => {
    acronymService.acronymUserList.mockResolvedValue(acronymUsersFixture);
    usersComponent.getAllGetokUsers.mockResolvedValue(keycloakUsersFixture);
    const acr = 'XXX';

    const result = await acronyms.getUsers(acr);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(acr);
    expect(usersSpy).toHaveBeenCalledTimes(1);

    expect(result).toBeTruthy();
    expect(result).toHaveLength(2);
    expect(result[0]).toBeTruthy();
    expect(result[0]).toEqual({
      userAcronymDetails: {
        acronym: 'XXX',
        owner: false,
        createdAt: '2020-03-17T20:53:06.565Z',
      },
      user: {
        userId: '1',
        keycloakGuid: 'k1',
        username: 'hherman@idir',
        firstName: 'Hank',
        lastName: 'Herman',
        email: 'hherman@gmail.com',
      },
    });
    expect(result[1]).toBeTruthy();
    expect(result[1]).toEqual({
      userAcronymDetails: {
        acronym: 'XXX',
        owner: false,
        createdAt: '2020-03-30T04:33:59.375Z',
      },
      user: {
        userId: '3',
        keycloakGuid: 'k2',
        username: 'lneil@idir',
        firstName: 'Luke',
        lastName: 'Neil',
        email: 'Luke.neil@gov.bc.ca',
      },
    });
  });
});

describe('getUserAcronymClients', () => {
  const getClientsSpy = jest.spyOn(utils, 'getClientsFromEnv');

  beforeEach(() => {
    getClientsSpy.mockClear();
  });

  it('should return null service clients when no clients are found', async () => {
    getClientsSpy.mockResolvedValue([]);

    const result = await acronyms.getAcronymClients('ZZZ');

    expect(result).toEqual({
      acronym: 'ZZZ',
      dev: null,
      test: null,
      prod: null,
    });
    expect(getClientsSpy).toHaveBeenCalledTimes(3);
  });

  it('should map service clients to envs when a client is found', async () => {
    const mockClient = {
      environment: 'fake',
      id: '1234',
      clientId: 'XXX_SERVICE_CLIENT',
      enabled: true,
      name: 'XXX name',
      description: 'XXX desc',
      serviceAccountEmail: 'a@b.com',
    };
    getClientsSpy.mockResolvedValue([mockClient]);

    const result = await acronyms.getAcronymClients('XXX');

    expect(result).toEqual({
      acronym: 'XXX',
      dev: mockClient,
      test: mockClient,
      prod: mockClient,
    });
    expect(getClientsSpy).toHaveBeenCalledTimes(3);
  });
});

describe('getAcronymHistory', () => {
  const findHistorySpy = jest.spyOn(deploymentHistoryService, 'findHistory');

  beforeEach(() => {
    findHistorySpy.mockClear();
  });

  it('should return empty array history when no history records', async () => {
    findHistorySpy.mockResolvedValue([]);

    const result = await acronyms.getAcronymHistory('ZZZ');

    expect(result).toEqual([]);
    expect(findHistorySpy).toHaveBeenCalledTimes(1);
  });

  it('should return a history object if there is one', async () => {
    const mockHistory = {
      env: 'dev',
      historyId: 1234,
      createdAt: '2021-11-04T22:50:10.997Z',
      enabled: true,
      name: 'XXX name',
    };
    findHistorySpy.mockResolvedValue([mockHistory]);

    const result = await acronyms.getAcronymHistory('XXX');

    expect(result).toEqual([mockHistory]);
    expect(findHistorySpy).toHaveBeenCalledTimes(1);
  });
});
