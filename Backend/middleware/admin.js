const jwt = require("jsonwebtoken");
require('dotenv').config();
const jwt_secret = process.env.JWT_SECRET;
// const { Admin } = require("../db"); // Ensure you import your Admin model
const Admin = require("../models/admin.model")
const User = require("../models/user.model")
const { json } = require("express");

function adminMiddleware(req, res, next) {
    // Check for token in the headers
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Split the token from the "Bearer" prefix
    const words = token.split(" ");
    const jwtToken = words[1];

    try {
        // Verify the token
        const decodedValue = jwt.verify(jwtToken, jwt_secret);

        // Fetch the admin's ID from the token
        req.adminId = decodedValue._id; // Use '_id' since that is what you're storing

        // Optional: You can verify if the admin exists
        Admin.findById(req.adminId)
            .then(admin => {
                if (!admin) {
                    return res.status(403).json({ message: "Admin not found" });
                }
                next();
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "Internal server error" });
            });

    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: "You are not authenticated!" });
    }
}

const verifyJWT = async(req,res,next) => {
  try{
      const token = req.cookies?.token
      if(!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
      }
      const decodedToken = await jwt.verify(token,process.env.JWT_SECRET)
      const user = await User.findById(decodedToken?._id).select("-password ")
      if(!user) {
        return res.status(401).json({
            "message" : "Unuthorized Access!!!"
        })
      }
      req.user = user
      next()
    }catch (error) {
      return res.status(401).json({
        "message": error?.message || "Unuthorized Access!!!"
      })
    }
}
module.exports = adminMiddleware;
