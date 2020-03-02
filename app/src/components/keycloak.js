const Keycloak = require('keycloak-connect');

module.exports = new Keycloak({}, {
  bearerOnly: true,
  'confidential-port': 0,
  clientId: 'YOURCLIENTHERE',
  'policy-enforcer': {},
  realm: 'YOURREALMHERE',
  serverUrl: 'YOURAUTHURLHERE',
  'ssl-required': 'external',
  'use-resource-role-mappings': true,
  'verify-token-audience': true
});
