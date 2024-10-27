const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config");

function tokenMiddleware(req, res, next) {
    // Extract token from Authorization header
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        const words = token.split(" ");
        const jwtToken = words[1];

        // Verify the token
        const decodedValue = jwt.verify(jwtToken, jwt_secret);

        if (decodedValue.username) {
            req.user = decodedValue;  // Attach user data to the request
            next();  // Token is valid, proceed
        } else {
            res.status(403).json({ message: "You are not authenticated!" });
        }
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
}

module.exports = tokenMiddleware;
