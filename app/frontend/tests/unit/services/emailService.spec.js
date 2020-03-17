import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import emailService from '@/services/emailService';

const mockInstance = axios.create();
const mockAxios = new MockAdapter(mockInstance);

jest.mock('@/services/interceptors', () => {
  return {
    getokAxios: () => mockInstance
  };
});

describe('sendRegistrationEmail', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('calls email endpoint', async () => {
    const data = {
      applicationAcronym: 'TEST',
      comments: 'comment',
      from: 'test@example.com',
      idir: 'user@idir'
    };
    mockAxios.onPost('/email').reply(201, data);

    const result = await emailService.sendRegistrationEmail(data);
    expect(result).toBeTruthy();
    expect(result.data).toEqual(data);
    expect(mockAxios.history.post.length).toBe(1);
  });
});
