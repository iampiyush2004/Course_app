const jwt = require("jsonwebtoken");
const User = require("../models/user.model")

async function verifyJwt (req, res, next) {
    const token =  req.cookies?.token
   // console.log(token)
    //const token =  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzI2MjU5YTVlZWJlNGY4NGIxYWQ5YzIiLCJlbWFpbCI6ImlhbXBpeXVzaDIwMDRAZ21haWwuY29tIiwiaWF0IjoxNzMwNTU0MTM4fQ.gBNnDrs19NScJmOi-B2HuU9OZkBrjJCN0nsO6ls992U
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }
    try {
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedValue._id).select("-password")
        if (user) {
            req.user = user;  
            next();  
        } else {
            return res.status(403).json({ message: "You are not authenticated!" });
        }
    } catch (error) {
        return res.status(400).json({ message: "Invalid Token" });
    }
}

module.exports = verifyJwt;
