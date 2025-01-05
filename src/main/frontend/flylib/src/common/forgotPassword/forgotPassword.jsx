import {useState} from "react";
import {InputValidation} from "../../utils/inputValidation.jsx";
import SendEmailButton from "./sendEmailButton.jsx";
import axios from "axios";
import Cookies from "js-cookie";
import {useAuth, useAuthDispatch} from "../../contexts/authContext.jsx";

export default function ForgotPassword() {
    // Auth states
    const userStatus = useAuth();
    const dispatch = useAuthDispatch();
    // Input states
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(true);
    const [emailErrorMsg, setEmailErrorMsg] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [noInput, setNoInput] = useState(true);
    const [dataBaseError, setDataBaseError] = useState(false);
    const [dataBaseErrorMsg, setDataBaseErrorMsg] = useState("");

    // Input validation
    const handleInput = async(e) => {
        e.preventDefault();
        const inputString = e.target.value;
        const inputType = e.target.id;

        if (inputString !== "") {
            setNoInput(false);
            if(inputType === "email") {
                setEmail(inputString);
            }

            if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputString)) { // Validate format for email
                setEmailError(true);
                setEmailErrorMsg("Please state a correct e-mail address");
            } else {
                const inputIsValid = await InputValidation(inputString, inputType);
                if(inputIsValid === true) {
                    setEmailError(true);
                    setEmailErrorMsg("The e-mail address cannot be linked to an account, try another one");
                } else {
                    setEmailError(false);
                    setEmailErrorMsg("");
                    setNoInput(false);
                }
            }
            } else {
                    setNoInput(true);
                    setEmail(inputString);
                    setEmailError(true);

            }

        }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!emailError) {
            // Send api call to generate restore link
            try {
                const sendEmail = await axios.post(`/api/auth/restore?email=${email}`);
                if(sendEmail.status === 201) {
                    setSubmitted(true); // If server returns OK, confirm submitted to user
                    // Delete existing login cookies
                    const userToken = Cookies.get('token');
                    if (userToken) {
                        Cookies.remove('token', { expires: 7, secure: false, sameSite: 'lax' });
                        if (userStatus === 'authorized') {
                            dispatch({ type: 'logout' });
                        }
                    }
                } else {
                    setDataBaseError(true);
                    setDataBaseErrorMsg("Error: unexpected response from server");
                }
            } catch (error) {
                console.error("An error occurred while sending request to api ", error);
                setDataBaseError(true);
                setDataBaseErrorMsg("Error: Server failed");
            }
        }

    }
    // Minimize mobile keyboard on done
    function handleEnterClick(e) {
        if (e.key === "Enter") {
            e.target.blur();
        }
    }

    return (
        <>
            <div className="rubric">
                <h1>Forgot Password</h1>
            </div>
            {submitted ? (
                <div className="status-text-container">
                    <h2>Password Restoration Link Sent </h2>
                    <p className="status-text"> A password restoration link has been sent to the e-mail linked to your account. Follow the directions in the e-mail to change your password.
                    The link is active for 1 hour. </p>
                </div>
            ) : (
                <>
                <div className="form-container">
                    <form className="login-form">
                        <label className="label">Type in the e-mail registered for the account</label>
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
                        <SendEmailButton
                            noInput={noInput}
                            emailError={emailError}
                            handleSubmit={handleSubmit}/>
                        <p className="error-text"> {dataBaseError ? dataBaseErrorMsg : ""} </p>
                    </form>
                </div>
                </>)
            }
        </>
   );
}
