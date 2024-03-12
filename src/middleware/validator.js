const { validationResult } = require('express-validator');

const validatorMiddleware = {
  validatorErrorCheck: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()[0].msg });
    }
    return next();
  },
};

module.exports = validatorMiddleware;
