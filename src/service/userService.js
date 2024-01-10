const uuid = require("../util/uuid");
const userModel = require("../model/user");
const logger = require("../util/logger");

module.exports = {
  findAll: async () => {
    try {
      const users = await userModel.getAllUser();
      return users;
    } catch (err) {
      console.error(err);
      logger.error("Error : ", err.stack);
    }
  },
}