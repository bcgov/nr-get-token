const checks = {};

checks.getStatus = (endpoint) => {
  return {
    'endpoint': endpoint,
    'healthCheck': true,
    'authenticated': true,
    'authorized': true
  };
};

module.exports = checks;
