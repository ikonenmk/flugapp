import "./navBarTop.css"
import React, {useEffect, useRef, useState} from 'react';
import {NavLink, useNavigate, useParams} from 'react-router-dom';
import NavBarLoginButton from "./navBarLoginButton.jsx";
import {useAuth, useAuthDispatch} from "../contexts/authContext.jsx";
import Cookies from "js-cookie";
import {CheckJwt} from "../utils/checkJwt.jsx";
import axios from "axios";
import Logo from "../utils/flyxiconweblogo.png"
import SmallLogo from "../utils/flyxiconweblogo.png"
export default function NavBarTop() {
    const navigate = useNavigate();
    const menuRef = useRef(null); // Ref for the menu container
    const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false); // menu state
    const [username, setUsername] = useState("");
    const dispatch = useAuthDispatch();
    const userStatus = useAuth();
    const [loading, setLoading] = useState(true);
    const token = Cookies.get("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // Check user status for correct rendering of menu buttons
    useEffect(() => {
        async function validateToken() {
            const token = Cookies.get("token");
            if (token) {
                try {
                    const isValid = await CheckJwt(token, dispatch, userStatus);

                } catch (error) {
                    console.error("Error while validating token:", error);
                }
            }
        }

        validateToken();
    }, [dispatch, userStatus]);

    // Get username from server
    useEffect(() => {
        if(userStatus === 'authorized') {
            axios
                .get('/api/auth/username', config)
                .then((response) => {
                    setUsername(response.data.toLowerCase());
                    setLoading(false);
                })
                .catch((error) => {
                    console.log('Axios request error: ', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }

    }, [userStatus]);

    // Toggle hamburger menu
    function toggleMenu() {
        setIsHamburgerMenuOpen(!isHamburgerMenuOpen);
        if (!isHamburgerMenuOpen) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    }
    function menuItemClick() {
        setIsHamburgerMenuOpen(false);
        document.body.classList.remove("no-scroll");
    }

    // Close hamburger menu on click outside of menu
    useEffect(() => {
        function handleOutSideClick(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsHamburgerMenuOpen(false);
                document.body.classList.remove("no-scroll");
            }
        }
        document.addEventListener('mousedown', handleOutSideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutSideClick);
        }
    }, []);

    if (loading) {
        return <div className="menu-container">Loading...</div>; // Or any loading indicator you prefer
    }

    function logoButtonClicked() {
        menuItemClick();
        navigate(`/`);

    }

    return (
        <>
            <div className="menu-container">
                <nav className="large-menu">
                    <ul>
                        <li><NavLink to="/">
                            <img src={Logo} alt="Logo" className="logo"/>
                        </NavLink></li>
                        {userStatus === 'authorized' ? (
                            <>
                                <li className="menu-link-button">
                                    <NavLink to={`/user/${username}`}> Profile</NavLink>
                                </li>
                            </>
                        ) : (
                            ""
                        )}
                        <li className="menu-link-button"><NavLink to="/"> Search </NavLink></li>
                        <li className="menu-link-button"><NavLink to="/create"> Upload </NavLink></li>
                        <li className="menu-link-button"><NavLink to="/library"> Library </NavLink></li>
                        <li className="menu-link-button"><NavBarLoginButton/></li>
                        {userStatus !== 'authorized' ? (
                            <li className="menu-link-button"><NavLink to="register"> Register </NavLink></li>
                        ) : (
                            ""
                        )}
                        <li className="menu-link-button"><NavLink to="/about"> About </NavLink></li>

                    </ul>
                </nav>
                <div className="hamburger-menu-container" ref={menuRef}>
                    <div className="small-button-container">
                        <button onClick={logoButtonClicked} className="hamburgerButton">
                            <img src={SmallLogo} alt="SmallLogo" className="small-logo"/>
                        </button>
                        <button className="hamburgerButton" onClick={toggleMenu}>
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                        </button>
                    </div>

                    <nav className={`${isHamburgerMenuOpen ? 'hamburger-' : 'no-'}menu`}>
                        <ul>
                            {userStatus === 'authorized' ? (
                                <li onClick={menuItemClick}>
                                    <NavLink className="menu-link-button" to={`/user/${username}`}> Profile</NavLink>
                                </li>
                            ) : (
                                ""
                            )}
                            <li className="menu-link-button" onClick={menuItemClick}><NavLink to="/"> Search </NavLink>
                            </li>
                            <li className="menu-link-button" onClick={menuItemClick}><NavLink
                                to="/create"> Upload </NavLink></li>
                            <li className="menu-link-button" onClick={menuItemClick}><NavLink
                                to="/library"> Library </NavLink></li>
                            <li className="menu-link-button" onClick={menuItemClick}><NavBarLoginButton/></li>
                            {userStatus !== 'authorized' ? (
                                <li className="menu-link-button" onClick={menuItemClick}><NavLink
                                    to="register"> Register </NavLink></li>
                            ) : (
                                ""
                            )}
                        </ul>
                    </nav>

                </div>
                <NavLink to="/about" className="about-button"> About </NavLink>


            </div>
        </>
    );
}