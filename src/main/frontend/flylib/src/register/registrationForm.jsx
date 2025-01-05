import {useState} from "react";
import axios from "axios";
import {InputValidation} from "../utils/inputValidation.jsx";
import RegisterButton from "./registerButton.jsx";
import {Link} from "react-router-dom";
import "./register.css";
import Cookies from "js-cookie";

export default function RegistrationForm() {
    //States for registration information
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    //State for submission status
    const [submitted, setSubmitted] = useState(false);
    //States for error messages
    const [usernameError, setUsernameError] = useState(true);
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
    const [emailError, setEmailError] = useState(true);
    const [emailErrorMsg, setEmailErrorMsg] = useState("");
    const [passError, setPassError] = useState(true);
    const [passErrorMsg, setPassErrorMsg] = useState();
    const [dataBaseError, setDataBaseError] = useState(false);
    const [dataBaseErrorMsg, setDataBaseErrorMsg] = useState("");

    //Handling change of username
    const handleInput = async (e) => {
        const inputString = e.target.value; // set inputString to input value
        const inputType = e.target.id; //set inputType based on input element id
        // Check if user is not empty, then validate username
        if (inputString !== "") {
            if(inputType === "email") {
                setEmail(inputString);
            } else if (inputType === "password") {
                setPassword(inputString);
            } else if(inputType === "username") {
                setUsername(inputString);
            }
            const inputIsValid = await InputValidation(inputString, inputType);
            //If validation fails, set error messages
            if (inputIsValid !== true) {
                switch (inputType) {
                    case "email":
                        setEmailError(true);
                        setEmailErrorMsg(inputIsValid);
                        break;
                    case "password":
                        setPassError(true);
                        setPassErrorMsg(inputIsValid);
                        break;
                    case "username":
                        setUsernameError(true);
                        setUsernameErrorMsg(inputIsValid);
                }
            } else {
                switch(inputType) {
                    case "email":
                        setEmailError(false);
                        break;
                    case "password":
                        setPassError(false);
                        break;
                    case "username":
                        setUsernameError(false);
                }
            }
        } else {
            switch(inputType) {
                case "email":
                    setEmail(inputString);
                    setEmailError(true);
                    break;
                case "password":
                    setPassword(inputString)
                    setPassError(true);
                    break;
                case "username":
                    setUsername(inputString);
                    setUsernameError(true);
            }

        }
    }

    // Handling form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if user has accepted cookies before proceeding
        const hasAcceptedCookies = Cookies.get('consentCookie');
        if (hasAcceptedCookies === 'true') {
            if(username === "" || password === "" || email === "") {
                alert("No fields can be empty")
                setSubmitted(false);
            } else if (emailError || passError || usernameError) {
                alert("Please fill in the form according to error messages");
            } else {
                try {
                    const registerNewUser = await axios.post('/api/user/register', {
                        username: username, password: password, email: email
                    });
                    //Check response status of post
                    if(registerNewUser.status === 201) {
                        setSubmitted(true);
                    } else {
                        setDataBaseErrorMsg("Error: unexpected response from server");
                    }
                } catch (error) {
                    console.error("An error occurred while sending request to register ", error);
                    setDataBaseErrorMsg("Error: sending of request to server failed");
                }
            }
        } else {
            alert("You must accept cookies in order to register");
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
                    <h1>Register</h1>
            </div>
            {submitted ? (
                <div className="status-text-container">
                    <h2>Successfully registered</h2>
                    <p className="status-text"> You have been registered. Please <Link to="/login">login</Link></p>
                </div>
            ) : (
                    <>
                    <div className="form-container">
                        <form className="login-form">
                            <label className="label">Username</label>
                            <input
                                id="username"
                                onChange={handleInput}
                                className="input"
                                value={username}
                                type="text"
                                enterKeyHint="done"
                                onKeyDown={(e) => handleEnterClick(e)}
                            />
                            <p className="error-text">{usernameError ? usernameErrorMsg : ""}</p>
                            <label className="label">E-mail</label>
                            <input
                                id="email"
                                onChange={handleInput}
                                className="input"
                                value={email}
                                type="text"
                                enterKeyHint="done"
                                onKeyDown={(e) => handleEnterClick(e)}
                            />
                            <p className="error-text">{emailError ? emailErrorMsg : ""}</p>

                            <label className="label">Password</label>
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
                            <RegisterButton emailError={emailError} passError={passError} databaseError={dataBaseError}
                                            usernameError={usernameError} handleSubmit={handleSubmit}/>
                            {dataBaseError ? <p className="error-text">{dataBaseErrorMsg}</p> : ""}
                        </form>
                    </div>
                    </>)
            }
        </>
    )
}