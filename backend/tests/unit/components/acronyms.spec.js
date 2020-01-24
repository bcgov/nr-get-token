const config = require('config');
const log = require('npmlog');

const acronyms = require('../../../src/components/acronyms');
const {
  acronymService
} = require('../../../src/services');

log.level = config.get('server.logLevel');

describe('getAcronym', () => {
  const acronymDetailFixture = require('./fixtures/acronymDetail.json');

  // Spy/mock the DB access 'find' method on the acronym table
  const spy = jest.spyOn(acronymService, 'find');
  jest.mock('../../../src/services/acronym');

  afterEach(() => {
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
