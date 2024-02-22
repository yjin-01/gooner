module.exports = {
  SuccessResponse: (res, resultData, statusCode) => {
    return res.status(statusCode).send({ result: resultData });
  },

  FailedResponse: (res, ErrorMessage, statusCode) => {
    return res.status(statusCode).send({ Error: ErrorMessage });
  },
};
