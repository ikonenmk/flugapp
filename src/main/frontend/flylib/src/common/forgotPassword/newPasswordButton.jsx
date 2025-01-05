// Function for conditional rendering of registration button based on passed error props
export default function NewPasswordButton({passError, handleSubmit}) {

    if (passError) {
        return <button className="register-button-disabled" disabled>Create new password</button>
    } else {
        return <button className="register-button" onClick={handleSubmit}>Create new password</button>
    }
}