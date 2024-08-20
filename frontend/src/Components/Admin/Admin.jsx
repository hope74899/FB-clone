// import React from 'react'
import { Outlet } from "react-router-dom"
// import { Navigate } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { FaUser } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
// import { useAuth } from "../../Store/AuthToken";


const Admin = () => {
    // const { admin } = useAuth();
    // if (!admin) {
    //     return <Navigate to="*" />

    // }
    return (
        <div className="flex">
            <nav className="w-64 min-h-screen bg-white">
                <ul className="space-y-4 p-6">
                    <li>
                        <NavLink to="/" className="flex items-center p-3 rounded">
                            <IoHomeSharp className="mr-2" />Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="users" className="flex items-center p-3 rounded">
                            <FaUser className="mr-2" />Users
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <main className="flex-1 border-r-2 border-gray-300 bg-white" >
                <Outlet />
            </main>
        </div>
    );
};

export default Admin;

