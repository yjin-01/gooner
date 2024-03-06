const authService = require('../service/authService');
const {
  ACCESSTOKEN_INVALID,
  ACCESSTOKEN_EXPIRED,
} = require('../config/jwt/tokenStatusConfig');

const authMiddleware = {
  checkToken: async (req, res, next) => {
    try {
      const { accessToken, result } = await authService.verifyToken(req);

      if (result === ACCESSTOKEN_INVALID) {
        return res.status(403).send({
          err: 'accessToken is invalid',
          statusCode: 403,
          msg: 'Forbidden',
        });
      } else if (result === ACCESSTOKEN_EXPIRED) {
        return res.status(401).send({
          err: 'accessToken is invalid',
          statusCode: 401,
          msg: 'Forbidden',
        });
      }

      res.header('AccessToken', 'Bearer ' + accessToken);

      return next();
    } catch (err) {
      err.status = 500;
      err.msg = 'token is not found';
      next(err);
    }
  },
};
module.exports = authMiddleware;
