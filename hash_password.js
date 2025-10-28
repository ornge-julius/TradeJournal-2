const bcrypt = require('bcrypt');

async function hashPassword(password) {
  try {
    // Generate a salt with 10 rounds (good balance of security and performance)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('Original password:', password);
    console.log('Hashed password:', hashedPassword);
    
    // Verify the hash works correctly
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password verification:', isMatch ? 'SUCCESS' : 'FAILED');
    
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

// Hash the password "password1"
hashPassword('password1');
