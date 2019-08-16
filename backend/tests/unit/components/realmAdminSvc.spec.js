const RealmAdminService = require('../../../src/components/realmAdminSvc');
jest.mock('../../../src/components/realmAdminSvc');

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  RealmAdminService.mockClear();
});

it('We can check the class constructor', () => {
  // eslint-disable-next-line no-unused-vars
  const realmAdminService = new RealmAdminService();
  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});

it('We can query the realm', async () => {
  const realmAdminService = new RealmAdminService();

  realmAdminService.getRealm.mockResolvedValue({
    blah: '00000000-0000-0000-0000-000000000000'
  });

  const r = await realmAdminService.getRealm();
  expect(r).toBeTruthy();

  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});

it('We can get all clients', async () => {
  const realmAdminService = new RealmAdminService();

  realmAdminService.getClients.mockResolvedValue({
    blah: '00000000-0000-0000-0000-000000000000'
  });

  const r = await realmAdminService.getClients();
  expect(r).toBeTruthy();

  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});

it('We can get a client', async () => {
  const realmAdminService = new RealmAdminService();

  realmAdminService.getClient.mockResolvedValue({
    id: '00000000-0000-0000-0000-000000000000'
  });

  const r = await realmAdminService.getClient('00000000-0000-0000-0000-000000000000');
  expect(r).toBeTruthy();

  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});

it('We can get a client secret', async () => {
  const realmAdminService = new RealmAdminService();

  realmAdminService.getClientSecret.mockResolvedValue({
    id: '00000000-0000-0000-0000-000000000000'
  });

  const r = await realmAdminService.getClientSecret('00000000-0000-0000-0000-000000000000');
  expect(r).toBeTruthy();

  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});

it('We can get a service account user', async () => {
  const realmAdminService = new RealmAdminService();

  realmAdminService.getServiceAccountUser.mockResolvedValue({
    id: '00000000-0000-0000-0000-000000000000'
  });

  const r = await realmAdminService.getServiceAccountUser('00000000-0000-0000-0000-000000000000');
  expect(r).toBeTruthy();

  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});

it('We can get client roles', async () => {
  const realmAdminService = new RealmAdminService();

  realmAdminService.getClientRoles.mockResolvedValue({
    id: '00000000-0000-0000-0000-000000000000'
  });

  const r = await realmAdminService.getClientRoles('00000000-0000-0000-0000-000000000000');
  expect(r).toBeTruthy();

  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});

it('We can remove client role', async () => {
  const realmAdminService = new RealmAdminService();

  realmAdminService.removeClientRole.mockResolvedValue({
    id: '00000000-0000-0000-0000-000000000000'
  });

  const r = await realmAdminService.removeClientRole('00000000-0000-0000-0000-000000000000', 'roleName');
  expect(r).toBeTruthy();

  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});

it('We can add client role', async () => {
  const realmAdminService = new RealmAdminService();

  realmAdminService.addClientRole.mockResolvedValue({
    id: '00000000-0000-0000-0000-000000000000'
  });

  const r = await realmAdminService.addClientRole('00000000-0000-0000-0000-000000000000', 'roleName');
  expect(r).toBeTruthy();

  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});

it('We can add service account role', async () => {
  const realmAdminService = new RealmAdminService();

  realmAdminService.addServiceAccountRole.mockResolvedValue({
    id: '00000000-0000-0000-0000-000000000000'
  });

  const r = await realmAdminService.addServiceAccountRole('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'roleName');
  expect(r).toBeTruthy();

  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});


it('We can set composite roles', async () => {
  const realmAdminService = new RealmAdminService();

  realmAdminService.setRoleComposites.mockResolvedValue({
    id: '00000000-0000-0000-0000-000000000000'
  });

  const client = {};
  const roles = [];
  const r = await realmAdminService.setRoleComposites(client, 'roleName', roles);
  expect(r).toBeTruthy();

  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});

it('We can create a client', async () => {
  const realmAdminService = new RealmAdminService();

  realmAdminService.createClient.mockResolvedValue({
    id: '00000000-0000-0000-0000-000000000000'
  });

  const clientId = 'id';
  const name = 'name';
  const description = 'description';
  const r = await realmAdminService.createClient(clientId, name, description);
  expect(r).toBeTruthy();

  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});

it('We can update a client', async () => {
  const realmAdminService = new RealmAdminService();

  realmAdminService.updateClientDetails.mockResolvedValue({
    id: '00000000-0000-0000-0000-000000000000'
  });

  const client = {};
  const name = 'name';
  const description = 'description';
  const r = await realmAdminService.updateClientDetails(client, name, description);
  expect(r).toBeTruthy();

  expect(RealmAdminService).toHaveBeenCalledTimes(1);
});
