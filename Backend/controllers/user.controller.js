const User = require("../models/user.model");
const bcrypt = require("bcrypt");


const signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password }).select("-password"); // Directly match both username and password

        if (!user) {
            console.log("User not found or invalid password");
            return res.status(401).json({ message: "Invalid Username/Password" });
        }

        // Generate token without hashing comparison
        const token = user.generateToken();

        const options = {
            httpOnly: true,
            secure: false,
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        };
        res.setHeader('Authorization', `Bearer ${token}`);
        return res
            .status(200)
            .cookie("token", token, options)
            .json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const signup = async (req, res) => {
    const { username, email, fullName, password, dob, gender, avatar, institution } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken. Please choose a different one.' });
        }

        // Save user without hashing the password
        const newUser = await User.create({
            username,
            email,
            fullName,
            password,
            dob,
            gender,
            avatar,
            institution
        });

        res.json({ message: 'User created successfully!', user: { id: newUser._id, username: newUser.username } });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: 'Error creating User. Please try again.', error: error.message });
    }
};


const logout = async (req,res) => {
    res.status(200).clearCookie("token").json({
        "message" : "User Logged Out successfully!!!"
    })
}

module.exports = {signin , signup , logout}