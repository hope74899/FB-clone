import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Store/AuthToken';
import { toast } from 'react-toastify';

const Signin = () => {
    const { storeTokenInLS } = useAuth();
    const navigate = useNavigate();

    const [loginInput, setloginInput] = useState({
        email: '',
        password: ''
    });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setloginInput({ ...loginInput, [name]: value });
    };

    const handlelogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://fb-clone-beryl.vercel.app/login', loginInput);
            if (response.status) {
                toast.success(response.data.details ? response.data.details : response.data.message)
                storeTokenInLS(response.data.token);
                navigate('/')
            }
            else {
                response.data
                toast.error(response.data.details ? response.data.details : response.data.message)
            }
        } catch (error) {
            toast.error('An error occurred while logging in.');
            console.log('Error for registering user:', error);
        }
    };
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <form className='py-20 px-14 rounded w-full max-w-lg flex flex-col items-center justify-center  shadow-md gap-y-12 bg-white ' onSubmit={handlelogin}>
                <input className='border rounded w-full py-3 px-6  bg-gray-100 leading-tight focus:outline-none focus:shadow-outline' type="email" name='email' value={loginInput.email} placeholder='Enter your email' onChange={onChangeHandler} required />
                <input className='border rounded w-full py-3 px-6 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline' type="password" name='password' value={loginInput.password} placeholder='Enter your Password' onChange={onChangeHandler} required />
                <button className='text-white bg-blue-500 hover:bg-blue-700 w-full font-bold py-3 px-8 rounded-xl '>Get Started</button>
                <p className='text-lg font-semibold'><span>Don&apos;t have an account? </span><Link className='text-blue-500 hover:underline' to='/Signup'>Create a free account</Link></p>
            </form>
        </div>
    )
}


export default Signin