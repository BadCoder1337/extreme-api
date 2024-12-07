import {createContext, useState, useEffect, useRef} from 'react'
import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('access') ? JSON.parse(localStorage.getItem('access')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('access') ? jwt_decode(localStorage.getItem('access')) : null)
    const isMountedRef = useRef(true);
    const navigate = useNavigate()

    function getCookie(name) {
        return new RegExp('(?:^|;\\s*)' + name
            .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)')
            .exec(document.cookie)?.[1];
    }

    let loginUser = async (e) => {
        e.preventDefault()
        let response = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value, 'stay_logged_in': e.target.remember.checked})
        })

        try {
            let data = await response.json();
            if (data.hasOwnProperty('access') && data.hasOwnProperty('user')) {
                setAuthTokens(data.access)
                setUser(data.user)
                localStorage.setItem('access', JSON.stringify(data.access))
                navigate('/profile')
            } else {
                alert('Something went wrong!')
            }
        } catch (e) {
            console.log(e)
        }
    }

    let logoutUser = async (e) => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('access');
        let response = await fetch('http://localhost:8000/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: null
        })
        try {
            let data = await response.json();
            console.log(data)
        } catch (e) {
            console.log(e)
        }
        navigate('/login')
    }

    let updateToken = async () => {
        let response = await fetch('http://localhost:8000/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({'access': authTokens})
        })

        try {
            let data = await response.json();

            if (data.hasOwnProperty('access')) {
                setAuthTokens(data.access)
                localStorage.setItem('access', JSON.stringify(data.access))
            } else {
                logoutUser()
            }
        } catch (e) {
            console.log(e)
        }
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    useEffect(() => {
        let refresh_interval = 1000 * 60 * 1 // 1 минута

        if (isMountedRef.current) {
            isMountedRef.current = false;
            return;
        }

        let interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, refresh_interval)
        return () => clearInterval(interval)

    }, [authTokens])

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}


