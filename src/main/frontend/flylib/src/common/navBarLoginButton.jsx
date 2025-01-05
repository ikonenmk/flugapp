import Cookies from "js-cookie";
import {NavLink} from "react-router-dom";
import {useAuth, useAuthDispatch} from "../contexts/authContext.jsx";

export default  function NavBarLoginButton() {
    // Auth
    const userStatus = useAuth();
    const dispatch = useAuthDispatch();
    // Get user token
    const userToken = Cookies.get('token');

    // Handling click on log out button
    function logOutButtonClicked() {
        Cookies.remove('token', userToken, {expires: 7, secure: true, sameSite: 'Strict'});
        // change user status in context
        dispatch({type: 'logout'})
    }
    if (userStatus === 'authorized') {
        return <NavLink to="/" onClick={logOutButtonClicked} > Log out </NavLink>
    } else {
        return <NavLink to="/login" > Log in </NavLink>
    }
}