import { useState, useEffect } from 'react';
import { useAuth } from '../../Store/AuthToken';
// import { toast } from 'react-toastify';
import axios from 'axios';

const AdminSignupUsers = () => {
    const { authorizationToken } = useAuth();
    const [users, setUsers] = useState([]);

    const userAuthentication = async () => {
        try {
            const response = await axios.get(`https://fb-clone-beryl.vercel.app/admin/users`, {
                headers: {
                    "Authorization": authorizationToken
                }
            });
            if (response.status === 200) {
                setUsers(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        userAuthentication();
    }, [authorizationToken]);

    const handleDelete = async (userId) => {
        try {
            const response = await axios.delete(`https://fb-clone-beryl.vercel.app/admin/users/delete/${userId}`, {
                headers: {
                    "Authorization": authorizationToken
                }
            });

            if (response.status === 200) {
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                // toast.success('User deleted successfully');
            } else {
                // toast.error('Failed to delete user');
            }
        } catch (error) {
            console.log(error);
            // toast.error('Server error occurred');
        }
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <div className="overflow-x-auto py-10 mx-20">
                <h2 className="text-3xl font-bold text-center py-10">Welcome to the Admin Dashboard</h2>
                <h2 className="text-3xl mb-4 font-semibold">Signup Users</h2>
                <table className="min-w-full bg-white rounded-md shadow-md">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-600 text-center">Profile</th>
                            <th className="py-2 px-4 border-b border-gray-600 text-center">Name</th>
                            <th className="py-2 px-4 border-b border-gray-600 text-center">Email</th>
                            <th className="py-2 px-4 border-b border-gray-600 text-center">Bio</th>
                            <th className="py-2 px-4 border-b border-gray-600 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b border-gray-600 text-center">
                                    <img src={user.profileImage || "defaultProfile.png"} alt="Profile" className="w-10 h-10 rounded-full" />
                                </td>
                                <td className="py-2 px-4 border-b border-gray-600 text-center">{user.name}</td>
                                <td className="py-2 px-4 border-b border-gray-600 text-center">{user.email}</td>
                                <td className="py-2 px-4 border-b border-gray-600 text-center">{user.bio}</td>
                                <td className="py-2 px-4 border-b border-gray-600 text-center">
                                    <button
                                        className='text-violet-700 hover:text-violet-950 font-medium'
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSignupUsers;
