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
import Button from "@mui/material/Button";
import AnnouncementIcon from '@mui/icons-material/Announcement';
import {useNotificationContext, useNotificationDispatch} from "../contexts/notificationContext.jsx";
export default function NavBarTop() {
    const navigate = useNavigate();
    const menuRef = useRef(null); // Ref for the menu container
    const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false); // menu state
    const notificationMenuRef = useRef(null); // ref for notification container
    const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false); // state for notification menu
    const [notifications, setNotifications] = useState([]) // state for user's notfications
    const [username, setUsername] = useState("");
    // Read from AuthContext
    const dispatch = useAuthDispatch();
    const userStatus = useAuth();
    // state for updating notifications on delete
    const [updatedNotifications, setUpdatedNotifications] = useState(false);
    // Loading state
    const [loading, setLoading] = useState(true);
    // Set token and config for api calls
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

    // Update user notifications every 10 second
    useEffect(() => {
        if(userStatus === 'authorized' && username !== "" && token !== "") {
            const intervalId = setInterval(() => {
                axios
                    .get(`/api/user/notifications?username=${username}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((response) => {
                        setNotifications(response.data);
                    })
                    .catch((error) => {
                        console.error('Error fetching notifications:', error);
                    });
            }, 10000);
            // Clean up
            return () => clearInterval(intervalId);
        }

    }, [username, token]);

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

            if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
                setIsNotificationMenuOpen(false);
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

    // Toggle notifications menu
    function toggleNotifications() {
        setIsNotificationMenuOpen(!isNotificationMenuOpen);
    }

    // Fetch notifications
    async function fetchNotifications() {
        try {
            const response = await axios.get(`/api/user/notifications?username=${username}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    // Delete a notification
    async function deleteNotification(notificationId) {
        try {
            const response = await axios
                .delete(`/api/user/notifications?notificationId=${notificationId}`,
                    {headers: {Authorization: `Bearer ${token}`},})
            if(response.data.success === true) {
                fetchNotifications(); // re-fetch notifications

                /* Close notification drop-down if the deleted element was the last to avoid unwanted dropdowns when
                a new comment is added again */
                if(notifications.length === 1) {
                    setIsNotificationMenuOpen(false);
                }
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log("Axios error: ", error);
        }
    }

    function closeMenu() {
        setIsNotificationMenuOpen(false);
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

                {notifications && notifications.length > 0 ? (
                    <div className="notification-menu-container" ref={notificationMenuRef}>
                        <Button
                            className="toggle-notifications-button"
                            onClick={toggleNotifications}
                            size="large"
                            startIcon={<AnnouncementIcon/>}
                            sx={{
                                float: "left",
                                padding: "15px 12px",
                                color: "white",
                                "&:hover": {
                                    color: "grey"
                                }
                            }}
                        />
                        <div className={isNotificationMenuOpen ? 'notification-menu' : 'no-notificationmenu'}>
                            <ul>
                                {notifications.map(notification => (
                                    <li key={notification.id}>
                                        <button
                                            value={notification.id}
                                            className="delete-notification-button"
                                            onClick={(e) =>
                                                deleteNotification(e.target.value)
                                            }
                                        >
                                            &times;
                                        </button>
                                        {notification.patternName} has a {' '}
                                        <NavLink
                                            onClick={closeMenu}
                                            className="pattern-link"
                                            key={notification.patternId}
                                            to={`/pattern/${notification.patternId}`}
                                        >
                                            new comment
                                        </NavLink>

                                    </li>
                                ))}
                            </ul>

                        </div>
                    </div>
                ): (
                    ""
                )}


            </div>

        </>
    );
}