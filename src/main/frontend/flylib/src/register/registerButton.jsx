// Function for conditional rendering of registration button based on passed error props
export default function RegisterButton({emailError, passError, dataBaseError, usernameError, handleSubmit, hasAccepted}) {

    if (emailError || passError || dataBaseError || usernameError || !hasAccepted) {
        return <button className="register-button-disabled" disabled>Register</button>
    } else {
        return <button className="register-button" onClick={handleSubmit}>Register</button>
    }
}