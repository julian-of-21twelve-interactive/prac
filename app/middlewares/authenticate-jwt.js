const { verifyToken } = require("../utils/authentication");

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1]; //remove 'Bearer ' from token
        const tokenData = verifyToken(token);
        if (tokenData && tokenData.payload) {
            req.headers.jwtPayload = tokenData.payload;
            next();
        } else {
            res.handler.unauthorized(MESSAGES.AUTH_REQUIRE, STATUS_CODES.UNAUTHORIZED, null, null);
        }
    } else {
        res.handler.unauthorized(MESSAGES.AUTH_REQUIRE, STATUS_CODES.UNAUTHORIZED, null, null);
    }
};

module.exports = {
    authenticateJWT
}