const helper = require('../../common/helper');
const acronyms = require('../../../src/components/acronyms');
const utils = require('../../../src/components/utils');

helper.logHelper();


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
