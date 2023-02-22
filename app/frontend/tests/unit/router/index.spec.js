import getRouter from '@/router';

describe('Router', () => {
  const router = getRouter();
  const routes = router.options.routes;

  it('has the correct number of routes', () => {
    expect(routes).toHaveLength(8);
  });

  it('has the expected routes', () => {
    const routeSet = new Set(routes);
    expect(routeSet).toContainEqual(expect.objectContaining({ name: 'About' }));
    expect(routeSet).toContainEqual(expect.objectContaining({ name: 'Admin' }));
    expect(routeSet).toContainEqual(expect.objectContaining({ name: 'MyApps' }));
    expect(routeSet).toContainEqual(expect.objectContaining({ name: 'Application' }));
    expect(routeSet).toContainEqual(expect.objectContaining({ name: 'RequestAccount' }));
    expect(routeSet).toContainEqual(expect.objectContaining({ name: 'Documentation' }));
    expect(routeSet).toContainEqual(expect.objectContaining({ name: 'NotFound' }));
  });
});
