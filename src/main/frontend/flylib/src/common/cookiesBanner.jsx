import Cookies from "js-cookie";
import "./cookiesBanner.css";
import {useEffect, useState} from "react";
export default function CookiesBanner() {
    const [hasAccepted, setHasAccepted] = useState(false);

    // Check if user has already given consent to use of cookies
    useEffect(() => {
        const cookieValue = Cookies.get('consentCookie');
        if(cookieValue === 'true') {
            setHasAccepted(true)
        } else {
            setHasAccepted(false)
        }
    }, []);

    // Add cookie on button click
    function addCookie() {
        Cookies.set('consentCookie', 'true', {secure: false, sameSite: 'lax'});
        setHasAccepted(true);
    }

    return (
        <div className={`${hasAccepted ? 'no-banner' : 'consent-banner'}`}>
            <div className="cookies-info-container">
                <div className="cookies-info-text">
                    <h2>Cookie Notice</h2>
                    <p>
                        This site uses a cookie to manage user registration and login. This cookie stores a JSON Web
                        Token
                        (JWT), which allows us to verify your identity securely and maintain your session as you
                        navigate
                        through the site.
                    </p>
                    <p>
                        <b>Purpose</b>: The JWT stored in this cookie is used solely to authenticate your account,
                        ensuring you
                        have access to personalized features and secure content.
                    </p>
                    <p>
                        <b>Expiration</b>: The cookie will expire after 7 days or when you log out,
                        whichever comes first.
                    </p>
                    <p>
                        By accepting, you consent to the use of this cookie to enable secure registration and login
                        functionality.
                    </p>


                </div>
                <button className="accept-button" onClick={addCookie}>I accept use of cookies</button>
            </div>
        </div>
    )
}