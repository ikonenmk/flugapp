import UserAccordion from "./userAccordion.jsx";
import "./user.css";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import {InputValidation} from "../utils/inputValidation.jsx";
import AddIcon from "@mui/icons-material/Add";
import ImageResize from "../utils/imageResize.jsx";
import defaultProfileImage from '../utils/defprof.jpg';
import {useAuth, useAuthDispatch} from "../contexts/authContext.jsx";

export default function User() {
    // Auth
    // Read from AuthContext
    const userStatus = useAuth();
    const dispatch = useAuthDispatch();
    const token = Cookies.get("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    // User Data
    const {username} = useParams();
    const [userData, setUserData] = useState({});
    const [mostPopularPattern, setMostPopularPattern] = useState("");
    const [joinDate, setJoinDate] = useState("");
    const [activeUsername, setActiveUsername] = useState("");
    const [formattedUsername, setFormattedUsername] = useState(""); // username to use in render
    // Editing
    const [isEditingInstagram, setIsEditingInstagram] = useState(false);
    const [isEditingYoutube, setIsEditingYoutube] = useState(false);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    // Error handling
    const [inputErrorMsg, setInputErrorMsg] = useState("");
    const [inputError, setInputError] = useState(false);
    // Image upload
    const fileRef = useRef();
    const imageRef = useRef();
    const allowedImageTypes = ['image/png', 'image/gif', 'image/jpeg', 'image/bmp']
    const [profilePictureChanged, setProfilePictureChanged] = useState(false);
    // Navigate
    const navigate = useNavigate();

    // Get username from server
    useEffect(() => {
        axios
            .get('/api/auth/username', config)
            .then((response) => {
                setActiveUsername(response.data.toLowerCase());
            })
            .catch((error) => {
                console.log('Axios request error: ', error);
            });
    }, []);

    // Get user's data
    useEffect(() => {
        if(username !== null || username !== "") {
            axios.get(`/api/user/getuserdata?username=${username}`,
                config).then ((response) => {
                    setUserData(response.data);
                    setJoinDate(response.data.join_date.slice(0,10));
            }).catch((error) => {
                console.log("Axios request error: ", error);
            });
        }
    }, [username]);

    // Set most popular pattern name
    useEffect( () => {
        if(userData && userData.mostPopularPattern && userData.mostPopularPattern !== 0) {
            axios.get(`/api/pattern/${userData.mostPopularPattern}`)
                .then((response) => {
                    setMostPopularPattern(response.data);
                })
                .catch((error) => {
                    console.log("Axios request error: ", error);
                })
        }
    }, [userData])

    // Set profile picture
    useEffect(() => {
        const canvasWidth = imageRef.current.offsetWidth;
        const canvasHeight = imageRef.current.offsetHeight;

        if (userData && userData.img_url) {
            if (userData.img_url !== "" && userData.img_url !== null) {
                // Use uploaded image
                const img = new Image();
                img.src = `/images/${userData.img_url}`;
                img.onload = () => {
                    const resizedImage = ImageResize(img, canvasWidth, canvasHeight, "profile-image");
                    imageRef.current.style.backgroundImage = `url(${resizedImage})`;
                };
            } else {
                // Handle empty or null img_url (draw default)
                const img = new Image();
                img.src = defaultProfileImage;
                img.onload = () => {
                    const resizedDefaultImage = ImageResize(img, canvasWidth, canvasHeight, "profile-image");
                    imageRef.current.style.backgroundImage = `url(${resizedDefaultImage})`;
                };
            }
        } else {
            // Handle missing userData or img_url (draw default)
            const img = new Image();
            img.src = defaultProfileImage;
            img.onload = () => {
                const resizedDefaultImage = ImageResize(img, canvasWidth, canvasHeight, "profile-image");
                imageRef.current.style.backgroundImage = `url(${resizedDefaultImage})`;
            };
        }
    }, [userData, profilePictureChanged]);

    // Format username for nicer rendering
    useEffect(() => {
        if(username && username !== "") {
            const upperCase = username.charAt(0).toUpperCase() + username.slice(1);
            if(upperCase.endsWith('s')) {
                setFormattedUsername(upperCase+"'");
            } else {
                setFormattedUsername(upperCase+"'s");
            }
        }
    }, [username])
    // Handle input changes
   async function handleInput(e) {
        const value = e.target.value;
        const position = e.target.id;
        if(value !== "") {
            const isValid = await InputValidation(value, position);
            if (isValid === true) {
                setInputError(false);
                setInputErrorMsg("");
                setUserData({
                    ...userData,
                    [position]: value
                })
            } else {
                setInputError(true);
                setInputErrorMsg(isValid);
            }
        } else {
            setUserData({
                ...userData,
                [position]: value
            })
            setInputError(false);
            setInputErrorMsg("");
        }
    }

    // Handle click on edit or done button
    async function toggleEdit(e) {
        const target = e.currentTarget.id;
        if (target === "location-done") {
            setIsEditingLocation(!isEditingLocation);
            await updateUserData("location", userData.location);
        }
        if (target === "instagram-done") {
            setIsEditingInstagram(!isEditingInstagram);
            await updateUserData("instagram", userData.instagram);
        }
        if (target === "youtube-done") {
            setIsEditingYoutube(!isEditingYoutube);
            await updateUserData("youtube", userData.youtube);
        }
        if (target === "youtube-edit") {
            setIsEditingYoutube(!isEditingYoutube);
        }
        if (target === "instagram-edit") {
            setIsEditingInstagram(!isEditingInstagram);
        }
        if (target === "location-edit") {
            setIsEditingLocation(!isEditingLocation);
        }
    }

    // Api call for updating user data
    async function updateUserData(typeOfData, data) {
        axios.post(`/api/user/updateuserdata?typeOfData=${typeOfData}&data=${data}&user=${username}`, {}, config)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log("Axios request error: ", error);
            })
    }

    // Handle change picture click
    const handleButtonClick = () => {
        fileRef.current.click(); // Programmatically click the hidden file input
    };

    const handleDeleteButtonClick = async () => {
        await updateUserData("img_url", "");
        updateImageState();
    }

    function updateImageState() {
        setProfilePictureChanged(!profilePictureChanged)
        setUserData({
            ...userData,
            img_url: ""
        });
    }

    // function for storing image on submit and returning image name to be used for img url
    const storeImage = async () => {
        const files = fileRef.current.files;
        const formData = new FormData();
        let imageUrl = "";
        // Add chosen file to formData
        [...files].forEach((file) => {
            // Transform name of file to random and replace special characters and whitespace
            const originalFileName = file.name;  // Get the original file name
            const fileExtension = originalFileName.slice(originalFileName.lastIndexOf('.'));  // Extract file extension
            const baseFileName = originalFileName.replaceAll(/[^\w\s]/g, "").replaceAll(/\s/g, "");
            // Create new file name with transformed name
            const newFileName = Math.random().toString(36).slice(2) + "_" + baseFileName + fileExtension;
            const newFile = new File([file], newFileName, { type: file.type });
            // Append to form data
            formData.append('file', newFile);
            // Set the image URL to the new file name
            imageUrl = newFile.name;
        })
        // post to DB
        try {
            const response = await axios.post(`/api/pattern/uploadimage`, formData, {
                headers: {Authorization: `Bearer ${token}`},
            });
            return imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    }
    // Image upload
    async function uploadImage(e) {

        let files = e.target.files; // file input

        if (files) {
            [...files].forEach((file, i) => {
                // Check file size
                const fileSize = file.size / 1024;
                if (fileSize > 10240) {
                    alert("File size is too large, maximum 10 mb allowed.")
                } else {
                    // Check if file is of accepted image format
                    if (allowedImageTypes.includes(file.type)) {
                        // Change preview image to chosen image
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            // Create an image object for resizing
                            const img = new Image();
                            img.src = e.target.result;
                            // Resize image when it finishes loading
                            img.onload = () => {
                                const canvasWidth = imageRef.current.offsetWidth;
                                const canvasHeight = imageRef.current.offsetHeight;
                                // Resize for the preview canvas
                                const resizedImage = ImageResize(img, canvasWidth, canvasHeight, "profile-image");
                                imageRef.current.style.backgroundImage = `url(${resizedImage})`;

                            };
                        };
                        reader.readAsDataURL(file);

                    } else {
                        console.log("File is not an image");
                    }
                }
            });
        } else {
            console.log("No files found");
        }
        // Upload image to DB
        const imgUrl = await storeImage();
        // Change user's user data to include new image url
        await updateUserData("img_url", imgUrl);
        // Update state
        setUserData({
            ...userData,
            img_url: imgUrl
        });
    }

    async function handleDeleteAccountButtonClick() {
        const result = window.confirm("If you click 'OK' your account and all added patterns will be deleted");
        if (result) {
            try {
                const response= await axios
                    .delete(`/api/user/delete?username=${activeUsername}`, {
                        headers: { Authorization: `Bearer ${token}`
                        },})
                if(response.data.success === true) {
                    alert("Your account has been deleted.")
                    dispatch({ type: 'logout' });
                    const userToken = Cookies.get('token');
                    Cookies.remove('token', userToken, {expires: 7, secure: true, sameSite: 'Strict'});
                    navigate('/');

                } else {
                    alert(response.data.message);
                }
            } catch(error) {
                console.log("Axios error: ", error);
            }
        }
    }


    return(
        <>
            <div className="rubric">
                <h1>{formattedUsername} Profile</h1>
            </div>
            <div className="profile-container">
                <div className="profile-image-container">
                    <canvas
                        className="profile-image"
                        id="profile-image"
                        ref={imageRef}>
                    </canvas>
                    <div className="photo-button-container">
                        {activeUsername.toLowerCase() === username.toLowerCase() ? (
                            <>
                                <input
                                    type="file"
                                    ref={fileRef}
                                    id="uploadButton"
                                    name="uploadButton"
                                    style={{display: 'none'}} // Hide the file input
                                    onInput={uploadImage}
                                />
                                {userData.img_url !== "" && userData.img_url !== null ? (
                                    <Button
                                        onClick={handleDeleteButtonClick}
                                        variant="outlined"
                                        startIcon={<DeleteIcon/>}
                                        sx={{
                                            color: "grey",
                                            borderColor: "grey",
                                            borderBlockColor: "grey",
                                            margin: 0.5
                                        }}
                                    >Delete picture</Button>
                                ) : (
                                    "")}

                                <Button
                                    onClick={handleButtonClick}
                                    variant="outlined"
                                    startIcon={<AddAPhotoIcon/>}
                                    sx={{
                                        color: "grey",
                                        borderColor: "grey",
                                        borderBlockColor: "grey",
                                        margin: 0.5
                                    }}
                                >Change profile picture</Button>
                                <p className="info-text">Recommended size 255x300 pixels</p>
                            </>

                        ) : (
                            ""
                        )

                        }
                    </div>

                </div>
                <div className="profile-card">
                    <h3>
                        Location
                        {activeUsername.toLowerCase() === username.toLowerCase() ? (
                            isEditingLocation === true ? (
                                inputError ? (
                                    <Button
                                        disabled
                                        id="location-done"
                                        onClick={(e) => toggleEdit(e)}
                                        startIcon={<DoneIcon/>}
                                        size="small"
                                        sx={{
                                            margin: 0,
                                            padding: 0,
                                            color: "grey"
                                        }}
                                    >
                                    </Button>
                                ) : (
                                    <Button
                                        id="location-done"
                                        onClick={(e) => toggleEdit(e)}
                                        startIcon={<DoneIcon/>}
                                        size="small"
                                        sx={{
                                            margin: 0,
                                            padding: 0,
                                            color: "grey"
                                        }}
                                    >
                                    </Button>
                                )

                            ) : (
                                isEditingInstagram === true || isEditingYoutube === true ? (
                                    <Button
                                        disabled
                                        id="location-edit"
                                        onClick={(e) => toggleEdit(e)}
                                        startIcon={<EditIcon/>}
                                        size="small"
                                        sx={{
                                            margin: 0,
                                            padding: 0,
                                            color: "grey"
                                        }}
                                    >
                                    </Button>
                                ) : (
                                    <Button
                                        id="location-edit"
                                        onClick={(e) => toggleEdit(e)}
                                        startIcon={<EditIcon/>}
                                        size="small"
                                        sx={{
                                            margin: 0,
                                            padding: 0,
                                            color: "grey"
                                        }}
                                    >
                                    </Button>
                                )

                            )

                        ) : (
                            ""
                        )}
                    </h3>
                    {isEditingLocation === true ? (
                        <>
                            <input
                                defaultValue={userData.location}
                                type="text"
                                id="location"
                                className="location-edit-input"
                                onChange={(e) => handleInput(e)}
                            />
                            <p className="error-text">{inputErrorMsg}</p>
                        </>
                    ) : (
                        userData.location !== null && userData.location !== "" ? (
                            <p>{userData.location}</p>
                        ) : (
                            <p>Unknown</p>
                        )
                    )}


                    <h3>Member since</h3>
                    {joinDate}
                    <h3>Number of patterns added</h3>
                    {userData.patternCount}
                    <h3>Most added pattern</h3>
                    {mostPopularPattern === "" ? (
                        <p>No patterns has been added by other users yet</p>
                    ) : (
                        <NavLink to={`/pattern/${userData.mostPopularPattern}`}>{mostPopularPattern.name}</NavLink>
                    )}
                    <h3>
                        Social media

                    </h3>
                    <div className="social-media-container">
                        <div className="instagram-container">
                            <div className="instagram-button-container">
                                {userData.instagram !== null && userData.instagram !== "" ? (
                                    <a href={userData.instagram} target="_blank" rel="noopener noreferrer">
                                        <Button
                                            size="large"
                                            startIcon={<InstagramIcon/>}
                                        >
                                            Instagram
                                        </Button>
                                    </a>
                                ) : (
                                    <Button
                                        size="large"
                                        startIcon={<InstagramIcon/>}
                                        sx={{
                                            color: 'lightgrey'
                                        }}
                                        disabled
                                    >
                                        Instagram
                                    </Button>
                                )}
                                {activeUsername.toLowerCase() === username.toLowerCase() ? (
                                    isEditingInstagram === true ? (
                                        inputError ? (
                                            <Button
                                                disabled
                                                id="instagram-done"
                                                onClick={(e) => toggleEdit(e)}
                                                startIcon={<DoneIcon/>}
                                                size="small"
                                                sx={{
                                                    margin: 0,
                                                    padding: 0,
                                                    color: "grey"
                                                }}
                                            >
                                            </Button>
                                        ) : (
                                            <Button
                                                id="instagram-done"
                                                onClick={(e) => toggleEdit(e)}
                                                startIcon={<DoneIcon/>}
                                                size="small"
                                                sx={{
                                                    margin: 0,
                                                    padding: 0,
                                                    color: "grey"
                                                }}
                                            >
                                            </Button>
                                        )

                                    ) : (
                                        isEditingYoutube === true || isEditingLocation === true ? (
                                            <Button
                                                disabled
                                                id="instagram-edit"
                                                onClick={(e) => toggleEdit(e)}
                                                startIcon={<EditIcon/>}
                                                size="small"
                                                sx={{
                                                    margin: 0,
                                                    padding: 0,
                                                    color: "grey"
                                                }}
                                            >
                                            </Button>
                                        ) : (
                                            <Button
                                                id="instagram-edit"
                                                onClick={(e) => toggleEdit(e)}
                                                startIcon={<EditIcon/>}
                                                size="small"
                                                sx={{
                                                    margin: 0,
                                                    padding: 0,
                                                    color: "grey"
                                                }}
                                            >
                                            </Button>
                                        )

                                    )
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="instagram-edit-field">
                                {isEditingInstagram === true ? (
                                    <>
                                        <input
                                            defaultValue={userData.instagram}
                                            className="instagram-edit-input"
                                            id="instagram"
                                            onChange={(e) => handleInput(e)}
                                        />
                                        <p className="error-text">{inputErrorMsg}</p>
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        <div className="youtube-container">
                            <div className="social-buttion-container">
                                {userData.youtube !== null && userData.youtube !== "" ? (
                                    <a href={userData.youtube} target="_blank" rel="noopener noreferrer">
                                        <Button
                                            size="large"
                                            startIcon={<YouTubeIcon/>}
                                            sx={{
                                                color: 'red'
                                            }}>
                                            Youtube
                                        </Button>
                                    </a>
                                ) : (
                                    <Button
                                        size="large"
                                        startIcon={<YouTubeIcon/>}
                                        sx={{
                                            color: 'lightgrey'
                                        }}
                                        disabled>
                                        Youtube
                                    </Button>
                                )}
                                {activeUsername.toLowerCase() === username.toLowerCase() ? (
                                    isEditingYoutube === true ? (
                                        inputError ? (
                                            <Button
                                                disabled
                                                id="youtube-done"
                                                onClick={(e) => toggleEdit(e)}
                                                startIcon={<DoneIcon/>}
                                                size="small"
                                                sx={{
                                                    margin: 0,
                                                    padding: 0,
                                                    color: "grey"
                                                }}
                                            >
                                            </Button>
                                        ) : (
                                            <Button
                                                id="youtube-done"
                                                onClick={(e) => toggleEdit(e)}
                                                startIcon={<DoneIcon/>}
                                                size="small"
                                                sx={{
                                                    margin: 0,
                                                    padding: 0,
                                                    color: "grey"
                                                }}
                                            >
                                            </Button>
                                        )

                                    ) : (
                                        isEditingInstagram === true || isEditingLocation === true ? (
                                            <Button
                                                disabled
                                                id="youtube-edit"
                                                onClick={(e) => toggleEdit(e)}
                                                startIcon={<EditIcon/>}
                                                size="small"
                                                sx={{
                                                    margin: 0,
                                                    padding: 0,
                                                    color: "grey"
                                                }}
                                            >
                                            </Button>
                                        ) : (
                                            <Button
                                                id="youtube-edit"
                                                onClick={(e) => toggleEdit(e)}
                                                startIcon={<EditIcon/>}
                                                size="small"
                                                sx={{
                                                    margin: 0,
                                                    padding: 0,
                                                    color: "grey"
                                                }}
                                            >
                                            </Button>
                                        )

                                    )

                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="youtube-edit-field">
                                {isEditingYoutube === true ? (
                                    <>
                                        <input
                                            defaultValue={userData.youtube}
                                            className="youtube-edit-input"
                                            id="youtube"
                                            onChange={(e) => handleInput(e)}
                                        />
                                        <p className="error-text">{inputErrorMsg}</p>
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>

                        </div>
                    </div>
                    <div className="edit-fields">


                    </div>
                </div>
            </div>
            <div className="accordion-container">
                <div className="accordion-card">
                    <h3>{formattedUsername} Patterns</h3>
                    <UserAccordion username={username}/>
                </div>
                <div className="delete-account-container">
                    {activeUsername.toLowerCase() === username.toLowerCase() ? (
                        <Button
                            onClick={handleDeleteAccountButtonClick}
                            variant="outlined"
                            startIcon={<DeleteIcon/>}
                            sx={{
                                color: "grey",
                                borderColor: "grey",
                                borderBlockColor: "grey",
                            }}
                        >Delete Account</Button>
                    ) : (
                        ""
                    ) }

                </div>
            </div>

        </>
    )

}