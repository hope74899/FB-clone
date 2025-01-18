import uploadOnCloudinary from "../middleware/cloudinary.js";
import SignupUser from "../models/login.js";
export const updateUser = async (req, res) => {
    try {
        const { name, email, bio } = req.body;
        const user = await SignupUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }
        let profileImage;
        if (req.files?.profileImage) {
            const profileLocalPath = req.files.profileImage[0]?.path;

            if (!profileLocalPath) {
                return res
                    .status(400)
                    .json({ message: "Error with the profile image upload." });
            }

            profileImage = await uploadOnCloudinary(profileLocalPath);
            if (!profileImage) {
                return res
                    .status(400)
                    .json({ message: "Error while uploading images to Cloudinary" });
            }
        }

        const updatedUser = await SignupUser.findOneAndUpdate(
            { email },
            {
                email,
                name,
                bio,
                profileImage: profileImage || user.profileImage,
            },
            { new: true }
        );
        return res.status(200).json({
            message: "User profile updated successfully",
            user: updatedUser,
            token: await user.generateToken(),
            userId: updatedUser._id.toString(),
        });
    } catch (error) {
        console.log(error);

        return res
            .status(500)
            .json({ message: "An error occurred while updating the user" });
    }
};
