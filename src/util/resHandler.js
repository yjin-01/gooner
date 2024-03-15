module.exports = {
  SuccessResponse: (res, resultData, statusCode, code = '01') => {
    return res.status(statusCode).send({ result: resultData, code });
  },

  FailedResponse: (res, ErrorMessage, statusCode) => {
    return res.status(statusCode).send({ Error: ErrorMessage });
  },
};
