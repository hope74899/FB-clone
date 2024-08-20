import { Link } from "react-router-dom";

const Errorpage = () => {
    return (
        <div className="h-screen flex flex-col items-center bg-gray-100 text-black p-6">
            <div className="text-center mb-8 w-2/5">
                <h1 className="text-9xl font-bold text-red-600 mb-4">404</h1>
                <h3 className="text-xl font-semibold mb-2">Sorry! Page Not Found</h3>
                <p className="text-base">
                    Oops! It seems like the page you are trying to access does not exist. If you think there is an issue, feel free to report it, and we will look into it.
                </p>
            </div>
            <div className="flex space-x-4">
                <Link
                    to="/"
                    className="text-white bg-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}

export default Errorpage;
