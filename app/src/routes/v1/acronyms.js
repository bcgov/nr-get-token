const acronymsRouter = require('express').Router();
const { validationResult } = require('express-validator');
const Problem = require('api-problem');

const acronyms = require('../../components/acronyms');

/** Returns clients from KC for the supplied acronym*/
acronymsRouter.get('/:acronym/clients',
  async (req, res) => {
    // TODO: Move this into middleware or equivalent
    // Validate for Bad Requests
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return new Problem(422, {
        detail: 'Validation failed',
        errors: errors.array()
      }).send(res);
    }

    const result = await acronyms.getClients(req.params.acronym);
    if (result === null) {
      return new Problem(404).send(res);
    } else {
      res.status(200).json(result);
    }
  });

module.exports = acronymsRouter;
