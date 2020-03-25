const statsRouter = require('express').Router();
const Problem = require('api-problem');
//const log = require('npmlog');

const stats = require('../../components/stats');

// fetches all the service clients for all acronyms in all KC realms
statsRouter.get('/serviceClients', async (req, res) => {

  // requires user role "GETOK_ADMIN"
  // havent figured out how to get role from bearer token in header
  // if (!req.user.jwt.realm_access.roles.includes('GETOK_ADMIN')) {
  //   return new Problem(403).json({
  //     message: 'user is does not have GETOK_ADMIN role'
  //   });
  // }

  // call a stats service
  const result = await stats.getAllServiceClients();

  if (result === null) {
    return new Problem(404).send(res);
  } else {
    res.status(200).json(result);
  }

});

module.exports = statsRouter;
