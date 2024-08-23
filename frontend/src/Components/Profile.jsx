import { useEffect, useState } from "react";
import { MdCameraAlt } from "react-icons/md";
import { useAuth } from "../Store/AuthToken";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const handleEdit = () => {
        setIsEditing(true); // Enter edit mode
    };
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        bio: '',
        profileImage: "blankProfile.png",
    });

    useEffect(() => {
        if (user) {
            setUserData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                profileImage: user.profileImage || "blankProfile.png",
            });
        }
    }, [user]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setUserData(prev => ({
                ...prev,
                profileImage: file // Set the actual file object
            }));
        } else {
            console.error("Please upload a valid image file.");
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('email', userData.email);
            formData.append('bio', userData.bio);

            // Append the file if it exists
            if (userData.profileImage) {
                formData.append('profileImage', userData.profileImage);
            }

            const response = await axios.put("http://localhost:5000/profile/update", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (response.status) {
                toast.success(response.data.details ? response.data.details : response.data.message)
                setIsEditing(false);
            }
            else {
                toast.error(response.data.details ? response.data.details : response.data.message)
            }
        } catch (error) {
            toast.error('An error occurred while updating post.');
            console.log('An error occurred while updating post : ', error);
        }
    };


    return (
        <div className="w-80 min-h-screen bg-white p-4 shadow-lg rounded-lg">
            <div className="max-w-4xl">
                <div className="flex flex-col items-center">
                    {/* Profile Image */}
                    <div className="relative mb-4">
                        <img
                            className="w-32 h-32 rounded-full cursor-pointer shadow-lg"
                            src={userData.profileImage}
                            alt="Profile"
                        />
                        <label htmlFor="fileInput" className="absolute bottom-1 right-1 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer">
                            <MdCameraAlt className="text-xl" />
                        </label>
                        <input
                            id="fileInput"
                            name="profileImage"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Editable Name, Email, and Bio */}
                    {isEditing ? (
                        <div className="w-full space-y-4">
                            {/* Name Input */}
                            <div className="relative">
                                <label htmlFor="name" className="absolute -top-3 left-3 bg-white px-1 text-sm font-medium text-gray-500 transform scale-90">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleChange}
                                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100`}

                                />
                            </div>

                            {/* Email Input */}
                            <div className="relative">
                                <label htmlFor="email" className="absolute -top-3 left-3 bg-white px-1 text-sm font-medium text-gray-500 transform scale-90">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100`}
                                />
                            </div>

                            {/* Bio Textarea */}
                            <div className="relative">
                                <label htmlFor="bio" className="absolute -top-3 left-3 bg-white px-1 text-sm font-medium text-gray-500 transform scale-90">
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    placeholder="Tell us about yourself"
                                    value={userData.bio}
                                    onChange={handleChange}
                                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100`}
                                    rows={3}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full space-y-4 bg-white p-2  rounded-lg">
                            <h2 className="text-2xl text-center font-bold text-gray-800">{userData.name}</h2>
                            <h4 className="text-lg text-center text-gray-600">{userData.email}</h4>
                            <p className="text-base text-center text-gray-500">{userData.bio || 'Tell us about yourself'}</p>
                        </div>
                    )}

                    {/* Edit and Save Button */}
                    <button
                        onClick={isEditing ? handleSave : handleEdit}
                        className="text-lg font-semibold mt-4 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
                    >
                        {isEditing ? 'Save Info' : 'Edit Info'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
