import { useContext, createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState("")
    const [admin, setAdmin] = useState(false)
    const [username, setUsername] = useState('username')
    let isloggedIn = !!token
    const authorizationToken = `Bearer ${token}`;


    const storeTokenInLS = (serverToken) => {
        setToken(serverToken);
        return localStorage.setItem('token', serverToken)
    };

    // JSONWEBTOKEN Authentication 
    const getCurrentUser = async () => {
        if (!isloggedIn) return;
        try {
            const response = await axios.get(`https://fb-clone-beryl.vercel.app/user`,
                {
                    headers: {
                        'Authorization': authorizationToken
                    }
                }
            );
            if (response.status) {
                // console.log(response.data)
                setUser(response.data);
                setUsername(response.data.name)
                setAdmin(response.data.isAdmin)
            }
        } catch (error) {
            console.error('Error getting login user :', error);
        }
    };
    useEffect(() => {
        if (isloggedIn) {
            getCurrentUser()
        }
    }, [isloggedIn])



    const LogoutUser = () => {
        setToken('')
        setUsername('username')
        setAdmin(false)
        return localStorage.removeItem('token');

    }
    return (
        <AuthContext.Provider value={{ storeTokenInLS, isloggedIn, LogoutUser, admin, username, user, authorizationToken }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    return useContext(AuthContext);
}