module.exports = {
  logErrorHandler: (err, req, res, next) => {
    console.error('[ Request : ' + req.method + ']' + new Date() + err.stack);
    next(err);
  },
  logSuccessHandler: (req, res, next) => {
    console.log('[ Request : ' + req.method + ']' + new Date());
    next();
  },
};
