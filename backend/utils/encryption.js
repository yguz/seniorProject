const crypto = require('crypto');
require('dotenv').config();

const secretKey = process.env.ENCRYPTION_KEY;

if (!secretKey) {
  console.error("ENCRYPTION_KEY is missing from environment variables.");
  process.exit(1);
}

console.log("Using ENCRYPTION_KEY:", secretKey);

const encryptEmail = (email) => {
  if (!email) {
    throw new Error("Email cannot be empty");
  }

  const normalizedEmail = email.trim().toLowerCase();
  console.log("🔍 Email before hashing:", normalizedEmail);

  const hash = crypto.createHash('sha256').update(normalizedEmail + secretKey, 'utf8').digest('hex').substring(0, 255);
  console.log("Generated Encrypted Email:", hash);
  
  return hash;
};

module.exports = { encryptEmail };
