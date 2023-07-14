const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

/**
 * Verify the token
 * @param {string} token JWT Token
 * @returns {Payload} payload class model
 */
function verifyToken(token) {
    if (!token) {
        return false;
    }
    const validate = jwt.verify(token, privateKey, { complete: true });

    if (validate) {
        return validate.payload;
    }

    return null;
}

/**
 * Encrypt String to hash
 * @param {String} decriptedString Password of user
 *  @returns {String} String to encrypt
 */
async function encryptString(decriptedString) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(decriptedString, salt)
};

/**
 * Verify Encrypted Hash String
 * @param {String} addedPass Password from request
 * @param {String} userPassword Password of user
 * @returns {boolean} True if valid else false
 */
async function validateHashString(addedPass, userPassword) {
    return await bcrypt.compare(addedPass, userPassword);
}

/**
 * this function is used to generate the payload
 * @param {Payload} payload Payload to generate the token with
 * @Return JWT Token
 */
function createToken(payload) {
    if (!payload) {
        return "payload not found";
    }
    return jwt.sign(JSON.stringify(payload), process.env.API_KEY);
}

module.exports = {
    verifyToken,
    encryptString,
    validateHashString,
    createToken
}