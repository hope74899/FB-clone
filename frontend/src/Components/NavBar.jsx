import { NavLink } from "react-router-dom";
import { useAuth } from "../Store/AuthToken";

function NavBar() {
    const { isloggedIn, admin } = useAuth();
    return (
        <div className="border-b border-gray-500 w-full text-black bg-white p-5">
            <div className="ml-14 mr-5 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">
                        LinkUp
                    </h2>
                </div>
                <div>
                    <ul className="text-lg font-medium flex space-x-8">
                        <li className="transition duration-300">
                            <NavLink to="/">
                                Home
                            </NavLink>
                        </li>
                        {admin && <li className="transition duration-300">
                            <NavLink to="/admin/users"  >
                                Admin
                            </NavLink>
                        </li>}
                        {isloggedIn &&<>
                            <li className="transition duration-300">
                                <NavLink to="/myposts"  >
                                    Porfile
                                </NavLink>
                            </li>
                            <li className="transition duration-300">
                                <NavLink to="/friends"  >
                                    Friends
                                </NavLink>
                            </li>
                            <li className="transition duration-300">
                                <NavLink to="/messages"  >
                                    Messenger
                                </NavLink>
                            </li>
                            </>
                        }
                    </ul>
                </div>
                <div>
                    {!isloggedIn ? (<button className="bg-blue-500 text-lg font-medium px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-700">
                        <NavLink to="/signin"  >
                            Login
                        </NavLink>
                    </button>) : (
                        <button className="bg-blue-500 text-lg font-medium px-4 py-2 rounded-lg transition duration-300 hover:bg-blue-700">
                            <NavLink to="/logout"  >
                                Logout
                            </NavLink>
                        </button>

                    )}
                </div>
            </div>
        </div>

    );
}

export default NavBar;