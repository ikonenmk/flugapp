export default function SendEmailButton({noInput, emailError, handleSubmit}) {

    if (noInput || emailError) {
        return <button className="register-button-disabled" disabled>Send reset password link</button>
    } else {
            return <button className="register-button" onClick={handleSubmit}>Send reset password link</button>
        }
}