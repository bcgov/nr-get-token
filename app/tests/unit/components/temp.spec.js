
describe('sendRequest', () => {

  it('yrdy', async () => {
    const result = [
      {
        environment: 'TEST',
        id: 'd288f328-3d0e-4bd0-8d89-8beccdace260',
        clientId: 'ZZZZ_SERVICE_CLIENT',
        enabled: true,
        name: 'ZZZ Application',
        description: 'This application does some work',
      },
      {
        environment: 'DEV',
        id: 'd288f328-3d0e-4bd0-8d89-8beccdace260',
        clientId: 'ZZZZ_SERVICE_CLIENT',
        enabled: true,
        name: 'ZZZ Application',
        description: 'This application does some work',
      },
      {
        environment: 'DEV',
        id: 'd288f328-3d0e-4bd0-8d89-8beccdace260',
        clientId: 'XXX_SERVICE_CLIENT',
        enabled: true,
        name: 'ZZZ Application',
        description: 'This application does some work',
      },
      {
        environment: 'TEST',
        id: 'd288f328-3d0e-4bd0-8d89-8beccdace260',
        clientId: 'XXX_SERVICE_CLIENT',
        enabled: true,
        name: 'ZZZ Application',
        description: 'This application does some work',
      },
      {
        environment: 'PROD',
        id: 'd288f328-3d0e-4bd0-8d89-8beccdace260',
        clientId: 'XXX_SERVICE_CLIENT',
        enabled: true,
        name: 'ZZZ Application',
        description: 'This application does some work',
      },
      {
        environment: 'PROD',
        id: 'd288f328-3d0e-4bd0-8d89-8beccdace260',
        clientId: 'DDD_SERVICE_CLIENT',
        enabled: true,
        name: 'ZZZ Application',
        description: 'This application does some work',
      }
    ];
    const res = result.reduce((a, b) => {
      if (!a[b.clientId]) a[b.clientId] = []; //If this type wasn't previously stored
      a[b.clientId].push(b.environment);
      return a;
    }, {});
    const r2 = Object.keys(res).map(k => { return { client: k, environments: res[k] }; });

    console.log(JSON.stringify(r2, 0, 2));
  });

});
