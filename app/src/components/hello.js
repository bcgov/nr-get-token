const log = require('npmlog');

const hello = {
  /**
   * @function getHello
   * Returns hello world
   * @returns {string} A string
   */
  getHello: () => {
    const value = 'Hello World!';
    log.info('hello.getHello', value);
    return value;
  }
};

module.exports = hello;
