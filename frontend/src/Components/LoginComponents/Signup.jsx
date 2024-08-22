import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Store/AuthToken';
import { toast } from 'react-toastify';

const Signup = () => {
    const { storeTokenInLS } = useAuth();
    const navigate = useNavigate();

    const [signupInput, setsignupInput] = useState({
        name: '',
        email: '',
        password: ''

    });

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setsignupInput({ ...signupInput, [name]: value });
    };

    const handlelogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://fb-clone-beryl.vercel.app/signup', signupInput);

            if (response.status) {
                storeTokenInLS(response.data.token);
                navigate('/')
                toast.success(response.data.details ? response.data.details : response.data.message)
            }
            else {
                toast.error(response.data.details ? response.data.details : response.data.message)
            }
        } catch (error) {
            toast.error('An error occurred while logging in.');
            console.log('Error for loging user:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <form className='py-20 px-14 rounded w-full max-w-lg flex flex-col items-center justify-center shadow-md gap-y-12 bg-white' onSubmit={handlelogin} >
                <input className=' bg-gray-100 border rounded w-full py-3 px-6  leading-tight focus:outline-none focus:shadow-outline' type="text" name='name' value={signupInput.name} placeholder='Enter your name' onChange={onChangeHandler} required />
                <input className='bg-gray-100 border rounded w-full py-3 px-6  leading-tight focus:outline-none focus:shadow-outline' type="text" name='email' value={signupInput.email} placeholder='Enter your email' onChange={onChangeHandler} required />
                <input className='bg-gray-100 border rounded w-full py-3 px-6  leading-tight focus:outline-none focus:shadow-outline' type="password" name='password' value={signupInput.password} placeholder='Enter your Password' onChange={onChangeHandler} required />
                <button className='text-white bg-blue-500 hover:bg-blue-700 w-full font-bold py-3 px-8 rounded-xl'>Signup</button>
            </form>
        </div>

    )
}

export default Signup

