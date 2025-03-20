// generateHash.js
const bcrypt = require('bcrypt');

const plaintextPassword = '053187Ln!';

bcrypt.hash(plaintextPassword, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed Password:', hash);
  }
});
