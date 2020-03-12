export default {
  /** WORK IN PROGRESS
   *  @function getUserAcronyms
   *  Fetch the acronyms the current user has access to from the DB
   *  @param {string} userGuid The current user
   */
  async getUserAcronyms() {
    // async getUserAcronyms(userGuid) {
    // try {
    return [{ acronym: 'PEN_RETRIEVAL', owner: false }, { acronym: 'GETOK', owner: false }, { acronym: 'MSSC', owner: false }];
    // } catch (e) {
    //   console.log(`Failed to get user's acronym mappings for guid ${userGuid} - ${e}`); // eslint-disable-line no-console
    //   throw e;
    // }
  }
};
