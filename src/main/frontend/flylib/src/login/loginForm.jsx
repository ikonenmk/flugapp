import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import {useAuth, useAuthDispatch} from "../contexts/authContext.jsx";
import {NavLink, useNavigate} from "react-router-dom";
import "./login.css";
import LoginButton from "./loginButton.jsx";
import {useNotificationContext, useNotificationDispatch} from "../contexts/notificationContext.jsx";

export default function LoginForm() {
    // Read from AuthContext
    const userStatus = useAuth();
    const dispatch = useAuthDispatch();

    // useNavigate hook for forwarding
    const navigate = useNavigate();

    // States for login information
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // States for error handling
    const [loginError, setLoginError] = useState(false);
    const [loginErrorMsg, setLoginErrorMsg] = useState("");

    // track changes to userStatus state
    useEffect(() => {
        if (userStatus === 'authorized') {
            navigate(`/user/${username}`);
        }
    }, [userStatus, navigate]);

    // Handling change of username
    const handleUsername = (e) => {
        setUsername(e.target.value);
    }
    // Handling change of password
    const handlePassword = (e) => {
        setPassword(e.target.value);
    }
    // Handling form submission
    const handleSubmit = async (e) => {
        if(e) {
            e.preventDefault();
            // Check if user has accepted cookies before proceeding
            const hasAcceptedCookies = Cookies.get('consentCookie');
            if (hasAcceptedCookies === 'true') {
                // Post request to backend
                try {
                    const response = await axios.post('/api/auth/token', {
                        username: username,
                        password: password
                    });
                    // Create cookie storing JWT
                    const token = response.data;
                    Cookies.set('token', token, {expires: 7, secure: true, sameSite: 'Strict'});
                    //Change userStatus in AuthContext
                    if (userStatus === 'unauthorized') {
                        dispatch({ type: 'login' });
                    }
                } catch (error) {
                    console.log("Error: " +error);
                    setLoginError(true);
                    setLoginErrorMsg("Login failed. Please make sure to type in the correct username and password.");
                }
            } else {
                alert("You must accept the use of cookies to login");
            }
        }
    }

    // Function for handling enter click
    function handleEnterClick(e) {
        if (e.key === "Enter") {
            e.target.blur();
        }
    }

    return (
        <>
            <div className="rubric">
                <h1>Login</h1>
            </div>
            <div className="login-form-container">
                <div className="form-container">
                    <form className="login-form">
                        <label className="label">Username</label>
                        <input
                            onChange={handleUsername}
                            className="input"
                            value={username}
                            type="text"
                            enterKeyHint="done"
                            onKeyDown={(e) => handleEnterClick(e)}
                        />

                        <label className="label">Password</label>
                        <input
                            onChange={handlePassword}
                            className="input"
                            value={password}
                            type="password"
                            enterKeyHint="done"
                            onKeyDown={(e) => handleEnterClick(e)}
                        />
                        <LoginButton handleSubmit={handleSubmit}/>
                        <p className="forgot-password-text"><NavLink to="/forgotpassword">Forgot password</NavLink></p>
                    </form>
                    <p className="login-error-text">
                        {loginError ? loginErrorMsg : ""}
                    </p>
                </div>
            </div>

        </>
    )
}