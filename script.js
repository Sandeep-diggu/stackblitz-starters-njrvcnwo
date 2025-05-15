const CryptoJS = require('crypto-js');

const SECRET_KEY = 'my_super_secret_key_123!'; // In production, use env vars
const IV = CryptoJS.enc.Utf8.parse('1234567890123456'); // 16 bytes for AES-256-CBC

const encrypt = (payload) => {
  // Convert payload to string if it's an object
  const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

const decrypt = (token) => {
  const decrypted = CryptoJS.AES.decrypt(token, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  const result = decrypted.toString(CryptoJS.enc.Utf8);
  try {
    return JSON.parse(result);
  } catch {
    return result;
  }
}

// Test
const testPayload = { user: 'alice', role: 'admin' };
const token = encrypt(testPayload);
const decoded = decrypt(token);
if (decoded.user === testPayload.user && decoded.role === testPayload.role) {
  console.log('Success');
} else {
  console.log('Failure');
}

module.exports = {
  encrypt,
  decrypt
}
