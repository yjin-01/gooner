module.exports = {
  SuccessResponse: (res, resultData, statusCode, code = 'suc01') => {
    return res.status(statusCode).send({ result: resultData, code });
  },

  FailedResponse: (res, ErrorMessage, statusCode) => {
    return res.status(statusCode).send({ error: ErrorMessage });
  },
};
