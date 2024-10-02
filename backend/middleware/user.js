const {jwt_secret} = require("../config");
const jwt = require('jsonwebtoken')
function userMiddleware(req, res, next) {
    //  user auth 

    const token = req.headers.authorization;

    const words = token.split(" ");
    const jwtToken = words[1];

    const decodedValue = jwt.verify( jwtToken, jwt_secret);

        if(decodedValue.username){
            req.username = decodedValue.username;
            next();
        }
        else{
            res.status(403).json({
                message : "User not authenticated!"
            })
        }
}

module.exports = userMiddleware;