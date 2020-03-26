// import { getokAxios } from '@/services/interceptors';
// import { ApiRoutes } from '@/utils/constants';

export default {
  /**
   * @function getHealthCheck
   * Fetch the health statuses of associated endpoints
   * @returns {Promise} An axios response
   */
  getHealthCheck() {
    // return getokAxios().get(ApiRoutes.HEALTH);
    console.log('called'); // eslint-disable-line
    return Promise.resolve({
      status: 200,
      data: {
        'endpoints': [
          {
            'name': 'Test Name',
            'endpoint': 'https://example.com/v1/',
            'healthCheck': true,
            'authenticated': true,
            'authorized': false
          },
          {
            'name': 'Test Name',
            'endpoint': 'https://example.com/v2/',
            'healthCheck': true,
            'authenticated': true,
            'authorized': true
          }
        ]
      }
    });
  }
};
