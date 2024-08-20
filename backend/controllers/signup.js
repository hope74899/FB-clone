import SignupUser from "../models/login.js";
import bcrypt from 'bcrypt'
export const CreateUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const userexist = await SignupUser.findOne({ email })
        if (userexist) {
            return res.status(400).json({ message: "User with that email already exist" });
        }
        const user = await SignupUser.create({
            name,
            email,
            password,
        });
        console.log('user :', user);
        return res.status(201).json({
            message: "User created successfully",
            user: user,
            token: await user.generateToken(),
            userId: user._id.toString()
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while creating the user" });
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const user = await SignupUser.find({}, { password: 0 });
        if (!user || user.length === 0) {
            return res.status(404).json({ message: "No users found" });
        } else {
            return res.status(200).json(user);
        }
    } catch (error) {
        next(error);
    }
};

export const deleteuser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await SignupUser.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted successfully', deletedUser: user });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userexist = await SignupUser.findOne({ email })
        if (!userexist) {
            return res.status(400).json({ message: "Email not found" });
        }
        const user1 = await bcrypt.compare(password, userexist.password);
        if (!user1) {
            return res.status(400).json({ message: 'invalid password...' })
        }
        else {
            res.status(200).json(
                {
                    message: 'Login successfully',
                    user: userexist,
                    token: await userexist.generateToken(),
                    userId: userexist._id.toString()
                }
            );
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};