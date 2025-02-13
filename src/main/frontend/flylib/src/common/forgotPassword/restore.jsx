import Cookies from "js-cookie";
import axios from "axios";
import {useEffect, useState} from "react";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import NewPasswordButton from "./newPasswordButton.jsx";
import {InputValidation} from "../../utils/inputValidation.jsx";
import "./restore.css";
export default function Restore() {
    // Input states
    const [loginError, setLoginError] = useState(false);
    const [loginErrorMsg, setLoginErrorMsg] = useState("");
    const [passError, setPassError] = useState(true);
    const [passErrorMsg, setPassErrorMsg] = useState();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    // Validation states
    const [restoreTokenIsValid, setRestoreTokenIsValid] = useState(true);
    const { restoretoken} = useParams();

    // Check if restore token is valid
    useEffect(() => {
        const checkRestoreToken = async () => {
            if (restoretoken) {
                try {
                    const response = await axios.get(`/api/auth/restore?token=${restoretoken}`);
                    setRestoreTokenIsValid(response.data);
                } catch (error) {
                    console.error("Error validating restore token:", error);
                }
            }
        };
        checkRestoreToken();
    }, [restoretoken]);

    // Get username connected to token
    useEffect(() => {
        const getUsername = async () => {
            if (restoreTokenIsValid) {
                try {
                    const response = await axios.get(`/api/auth/restore/email?token=${restoretoken}`);
                    setUsername(response.data);
                } catch (error) {
                    console.error("Error validating restore token:", error);
                }
            }
        };
        getUsername();
    }, []);

    // Input validation
    const handleInput = async (e) => {
        const inputString = e.target.value;
        const inputType = e.target.id;
        setPassword(inputString);

        if(inputString !== "") {
            const inputIsValid = await InputValidation(inputString, inputType);
            if(inputIsValid !== true) {
                setPassError(true);
                setPassErrorMsg(inputIsValid);

            } else {
                setPassError(false);
            }
        } else {
            setPassErrorMsg("");
            setPassError(true);
        }
    }
    // Update password
    const handleSubmit = async (e) => {
        e.preventDefault();
            try {
                const update = await axios.post(
                    `/api/user/updatepassword?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
                if(update.status === 204) {
                    setSubmitted(true);
                } else {
                    setSubmitted(false);
                }
                } catch (error) {
                setSubmitted(false);
                setLoginError(true);
                setLoginErrorMsg("Password change failed.");
                }
        }
    // Function for minimizing the phone keyboard on enter hit
    function handleEnterClick(e) {
        if (e.key === "Enter") {
            e.target.blur();
        }
    }
        return (
            <>
                <div className="rubric">
                    <h2>Create a new password </h2>
                </div>
                {restoreTokenIsValid ? (
                    submitted ? (
                        <>
                            <div className="form-container">
                                <form className="login-form">
                                    <h3>Password changed</h3>
                                    <p className="login-text"><NavLink to="/login">Log in</NavLink> to access your account</p>
                                </form>
                            </div>
                        </>
                    ):(
                        <>
                            <div className="form-container">
                                <form className="login-form">
                                    <h3>Enter a new password for <b>{username}</b></h3>
                                    <input
                                        id="password"
                                        onChange={handleInput}
                                        className="input"
                                        value={password}
                                        type="password"
                                        enterKeyHint="done"
                                        onKeyDown={(e) => handleEnterClick(e)}
                                    />
                                    <p className="error-text">{passError ? passErrorMsg : ""}</p>
                                    <NewPasswordButton passError={passError} handleSubmit={handleSubmit}/>
                                </form>
                                <p className="error-text">
                                    {loginError ? loginErrorMsg : ""}
                                </p>
                            </div>
                        </>
                        )

                ):(
                    <>
                        <p className="link-not-active">
                            This link is no longer active. Please <NavLink to="/forgotpassword">request a new restoration link </NavLink>.
                        </p>


                        </>)}
                </>
        );
    }