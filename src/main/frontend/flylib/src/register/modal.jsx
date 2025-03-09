import "./modal.css"
export default function Modal ({setModalOpen}) {
    function onCloseClick() {
        setModalOpen(false);
    }
    return (
        <div className="modal-container">
            <div className="modal">
                <div className="modal-header">
                    <span className="close" onClick={onCloseClick}>&times;</span>
                </div>
                <div className="modal-content">
                    <h2>Privacy Policy</h2>

                    <p>Effective Date: 2025-02-06</p>

                    <h3>What Data We Collect:</h3>
                    <p>
                        <b>Username & Password:</b> For account authentication (passwords are securely stored).
                    </p>
                    <p>
                        <b>Email Address:</b> Used for password resets and important website updates.
                    </p>

                    <h3>Why We Collect It:</h3>
                    <p>To manage your account and allow login.<br />
                        To send necessary account-related communications and information about Flyxicon.com.</p>

                    <h3>How We Protect Your Data:</h3>
                    <p>
                        Passwords are securely hashed. <br />
                        Your data is never sold or shared for marketing.
                    </p>

                    <h3>Your Rights:</h3>
                    <p>
                        You can request access, correction, or deletion of your data at any time. </p>
                    <p>
                        For any questions, contact flyxicon@gmail.com.
                    </p>


                </div>
            </div>
        </div>
    );
}