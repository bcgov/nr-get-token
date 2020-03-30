const keycloakRouter = require('express').Router();
const Problem = require('api-problem');

const keycloak = require('../../components/keycloak');
const clients = require('../../components/clients');

// fetches all the service clients for all KC realms
// current user must have role GETOK_ADMIN
keycloakRouter.get('/serviceClients', keycloak.protect('realm:GETOK_ADMIN'), async (req, res) => {

  const serviceClients = await Promise.all([
    clients.getClientsFromEnv('dev'),
    clients.getClientsFromEnv('test'),
    clients.getClientsFromEnv('prod')
  ]);
  // join them all into one array
  const result = serviceClients.flat();

  if (result === null) {
    return new Problem(404).send(res);
  } else {
    res.status(200).json(result);
  }
});

module.exports = keycloakRouter;
