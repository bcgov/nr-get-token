import userService from '@/services/userService';

describe('getUserAcronyms()', () => {

  it('calls getUserAcronyms endpoint', async () => {
    const res = await userService.getUserAcronyms();
    expect(res).toEqual([{ acronym: 'PEN_RETRIEVAL', owner: false }, { acronym: 'GETOK', owner: false }, { acronym: 'MSSC', owner: false }]);
  });
});
