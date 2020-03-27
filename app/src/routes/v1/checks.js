const checksRouter = require('express').Router();
const Problem = require('api-problem');

const checks = require('../../components/checks');

/** Returns status of correspondent APIs */
checksRouter.get('/status', async (_req, res) => {
  const result = await checks.getStatus();

  if (result instanceof Array) {
    res.status(200).json({ endpoints: result });
  } else {
    return new Problem(500, { detail: 'Unable to get api status list' }).send(res);
  }
});

module.exports = checksRouter;
