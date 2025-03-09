// Function for conditional rendering of registration button based on passed error props
export default function LoginButton({ handleSubmit }) {
        return (
            <button
                className="register-button"
                onClick={handleSubmit}
                onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
            >
                    Login
            </button>
        );
}
