const bcrypt = require('bcryptjs');
const logger = require('./logger');

const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password cannot be empty");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    logger.error("Invalid password comparison inputs - missing required parameters");
    return false;
  }

  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
