const acronyms = require('../../../src/components/acronyms');
const helper = require('../../common/helper');
const { acronymService } = require('../../../src/services');
const utils = require('../../../src/components/utils');

helper.logHelper();


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

describe('getUserAcronymClients', () => {
  const getClientsSpy = jest.spyOn(utils, 'getClientsFromEnv');

  beforeEach(() => {
    getClientsSpy.mockClear();
  });

  it('should return null service clients when no clients are found', async () => {
    getClientsSpy.mockResolvedValue([]);

    const result = await acronyms.getAcronymClients('ZZZ');

    expect(result).toEqual({ acronym: 'ZZZ', dev: null, test: null, prod: null });
    expect(getClientsSpy).toHaveBeenCalledTimes(3);
  });

  it('should map service clients to envs when a client is found', async () => {
    const mockClient = {
      environment: 'fake', id: '1234', clientId: 'XXX_SERVICE_CLIENT', enabled: true, name: 'XXX name',
      description: 'XXX desc', serviceAccountEmail: 'a@b.com'
    };
    getClientsSpy.mockResolvedValue([mockClient]);

    const result = await acronyms.getAcronymClients('XXX');

    expect(result).toEqual({ acronym: 'XXX', dev: mockClient, test: mockClient, prod: mockClient });
    expect(getClientsSpy).toHaveBeenCalledTimes(3);
  });
});
