import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const SignupSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: {
        type: String
    },
    isAdmin: {
        type: Boolean, default: false
    },
    bio: {
        type: String,
    }

})

// Hash the password before saving the user document
SignupSchema.pre('save', async function (next) {
    const user = this;
    // console.log(user);

    if (!user.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const securePassword = await bcrypt.hash(user.password, salt);
        user.password = securePassword;
        // console.log(user);
        next();
    } catch (error) {
        next(error);
    }
});
SignupSchema.methods.generateToken = async function () {
    try {
        const user = this;
        return jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
                isAdmin: user.isAdmin
            },
            process.env.PRIVATE_SECRET_KEY,
            {
                expiresIn: "24h",
            }
        )

    } catch (error) {
        console.log("error in jsonwebtoken", error)
    }
};

const SignupUser = model('SignupUser', SignupSchema)
export default SignupUser;