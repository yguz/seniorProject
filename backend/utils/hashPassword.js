const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password cannot be empty");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Generated Hashed Password:", hashedPassword);
  return hashedPassword;
};

const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    console.log("Invalid password comparison inputs.");
    return false;
  }

  console.log("Comparing:", plainPassword, "with", hashedPassword);
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
