const { validationResult } = require('express-validator');
const resHandler = require('../util/resHandler');

const validatorMiddleware = {
  validatorErrorCheck: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return resHandler.FailedResponse(res, errors.array()[0].msg, 400);
    }
    return next();
  },
};

module.exports = validatorMiddleware;
