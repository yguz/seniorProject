const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password cannot be empty");
  }

  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    return false;
  }

  console.log("Comparing:", plainPassword, "with", hashedPassword);
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
