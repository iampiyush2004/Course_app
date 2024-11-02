const User = require("../models/user.model");
const bcrypt = require("bcrypt");


const signin = async (req, res) => {
    const { username, password } = req.body;
  
    try {
        const user = await User.findOne({ username, password }).select("-password");
        console.log(user)
        if (user) {
            const token = await user.generateToken()
  
            res.setHeader('Authorization', `Bearer ${token}`);
            const options = {
              httpOnly : true,
              secure : false,
              maxAge: 30 * 24 * 60 * 60 * 1000 
            }
            return res
            .status(200)
            .cookie("token",token,options)
            .json({ token,user });
        } else {
            return res.status(401).json({ message: "Invalid username/Password" });
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const signup = async (req, res) => {
    const { username, email, fullName, password, dob, gender, avatar, institution } = req.body;
    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                message: 'username or Email already taken. Please choose a different one.'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create({
            username,
            email,
            fullName,
            password: hashedPassword,
            dob,
            gender,
            avatar,
            institution
        });

        // Generate token for the user
        const token = newUser.generateToken();

        res.json({
            message: 'User created successfully!',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating User. Please try again.',
            error: error.message
        });
    }
};

const logout = async (req,res) => {
    res.status(200).clearCookie("token").json({
        "message" : "User Logged Out successfully!!!"
    })
}

module.exports = {signin , signup , logout}