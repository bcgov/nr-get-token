const KeyCloakServiceClientManager = require('../../../src/components/keyCloakServiceClientMgr');
jest.mock('../../../src/components/keyCloakServiceClientMgr');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  KeyCloakServiceClientManager.mockClear();
});

it('We can check the class constructor', () => {
  // eslint-disable-next-line no-unused-vars
  const mgr = new KeyCloakServiceClientManager();
  expect(KeyCloakServiceClientManager).toHaveBeenCalledTimes(1);
});


it('We can manage a service client', async () => {
  // eslint-disable-next-line no-unused-vars
  const mgr = new KeyCloakServiceClientManager();

  mgr.manage.mockResolvedValue({
    blah: '00000000-0000-0000-0000-000000000000'
  });

  const form = {applicationAcronym: 'TST', applicationName: 'Test', applicationDescription: 'Test!!!', commonServices: ['cmn-srv']};
  const r = await mgr.manage(form);
  expect(r).toBeTruthy();

  expect(KeyCloakServiceClientManager).toHaveBeenCalledTimes(1);
});
