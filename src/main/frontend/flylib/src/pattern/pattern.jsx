
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {NavLink, useLocation, useParams} from 'react-router-dom';
import "./pattern.css";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {useAuth} from "../contexts/authContext.jsx";
import Cookies from "js-cookie";
import ResizableTextArea from "../common/resizableTextArea/resizableTextArea.jsx";
import ValidateCommentString from "../utils/validateCommentString.jsx";
import CleanTextInput from "../utils/cleanTextInput.jsx";
import PostedComment from "./comment/comment.jsx";
import DeleteIcon from '@mui/icons-material/Delete';
export default function Pattern () {
    const {patternId} = useParams(); // get pattern id from url param
    const [pattern, setPattern] = useState("");
    const [patterns, setPatterns] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [materialNames, setMaterialNames] = useState([]);
    const [species, setSpecies] = useState([]);
    const [speciesNames, setSpeciesNames] = useState([]);
    // Read from AuthContext
    const userStatus = useAuth();
    const token = Cookies.get("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    // Map all species to speciesListItems
    const speciesListItems = speciesNames.map((species) => {
        return <li className="species-list-item" key={species.id}>{species.name.charAt(0).toUpperCase() + species.name.slice(1)}</li>;
    });
    // Map all materials to materialListItems
    const materialListItems = materialNames.map((material) => {
        return <li className="material-list-item" key={material.id}>{material.name.charAt(0).toUpperCase() + material.name.slice(1)}</li>;
    });
    // Username of logged in user
    const [username, setUsername] = useState("");
    // Delete button state
    const [addDelButtonClicked, setAddDelButtonClicked] = useState(false);
    // Patterns added to user's library
    const [userPatterns, setUserPatterns] = useState();
    // ref for textbox height adjustment
    const textarea = useRef(null);
    // state for all added comments
    const [comments, setComments] = useState([{}]);
    // state for updating comments hooks (true false for toggeling function)
    const [updatePostedComments, setUpdatePostedComments] = useState(false);

    // Get username
    useEffect(() => {
        if(userStatus === "authorized") {
            axios
                .get('/api/auth/username', config)
                .then((response) => {
                    setUsername(response.data);
                })
                .catch((error) => {
                    console.log('Axios request error: ', error);
                });
        }
    }, [userStatus]);

    // Get logged in users saved patterns
    useEffect(() => {
        if (username !== "") {
            let url = `/api/user/getpatterns?username=${username}`;
            if (url) {
                axios
                    .get(url, {
                        headers: {Authorization: `Bearer ${token}`},
                    })
                    .then((response) => {
                        setUserPatterns(response.data || []);
                    })
                    .catch((error) => {
                        console.log("Axios request error: ", error);
                    });
            } else {
                console.log("No URL existing");
            }
        }
    }, [username, addDelButtonClicked]);

    // Get creators saved patterns
    useEffect(() => {
        if (!username || username === "") {
            // return if username is undefined or empty
            return;
        }
        let url = `/api/user/getcreatedpatterns?username=${username}`;


        if (url) {
            axios
                .get(url, {
                    headers: {Authorization: `Bearer ${token}`},
                })
                .then((response) => {
                    setPatterns(response.data || []);
                })
                .catch((error) => {
                    console.log("Axios request error: ", error);
                });
        } else {
            console.log("No URL existing");
        }
    }, [username]);

    // Function returning true if a patternId is in userPattern
    function checkIfAdded(patternId) {
        // check if user is authorized
        if(userStatus === "authorized") {
            if (userPatterns && userPatterns.some(pattern => pattern.id === patternId)) {
                return true;
            } else {
                return false;
            }
        }

    }

    // Get pattern based on id
    useEffect(() => {
        axios
            .get(`/api/pattern/${patternId}`)
            .then((response) => {
                if (response.data !== null) {
                    setPattern(response.data);
                }
            })
            .catch((error) => {
                console.log('Axios request error: ', error);
            })
    }, [patternId]);

    // Get all materials for the pattern
    useEffect(() => {
        axios
            .get(`/api/patternmaterial/${patternId}`)
            .then((response) => {
                if (response.data !== null) {
                    setMaterials(response.data);
                } else {
                    console.log("Error: no materials in db for this pattern");
                }
            })
            .catch((error) => {
                console.log('Axios request error: ', error);
            })
    }, [patternId]);

    // Get names of materials
    useEffect(() => {
        const materialsString = materials.map(material => material.material).join(',');
        if (materialsString) {
            axios
                .get(`/api/material/names/${materialsString}`)
                .then((response) => {
                    if (response.data !== null) {
                        setMaterialNames(response.data);
                    }
                })
                .catch((error) => {
                    console.log('Axios request error: ', error);
                });
        }
    }, [materials]);

    // Get all species for the pattern
    useEffect(() => {
        axios
            .get(`/api/patternspecies/${patternId}`)
            .then((response) => {
                if (response.data !== null) {
                    setSpecies(response.data);
                } else {
                    console.log("Error: no species in db for this pattern");
                }
            })
            .catch((error) => {
                console.log('Axios request error: ', error);
            })
    }, []);

    // Get names of species
    useEffect(() => {
        const speciesString = species.map(spec => spec.species).join(',');
        if (speciesString) {
            axios
                .get(`/api/species/names/${speciesString}`)
                .then((response) => {
                    if (response.data !== null) {
                        setSpeciesNames(response.data);
                    }
                })
                .catch((error) => {
                    console.log('Axios request error: ', error);
                });
        }
    }, [species]);

    // Get all comments for pattern
    useEffect(() => {
        axios
            .get(`/api/pattern/comment?pattern_id=${patternId}`, null,
                {headers: {Authorization: `Bearer ${token}`}})
            .then((response) => {
                setComments(response.data);
            })
    }, [patterns, updatePostedComments]);


    // Function for adding
    async function addToLibrary(patternId) {
        try {
            const response = await axios
                .post(`/api/user/addpattern?username=${username}&pattern_id=${patternId}`,
                    null, {headers: {Authorization: `Bearer ${token}`}})
            if (response.data.success) {
                // Reload userPatterns with the added pattern
                setAddDelButtonClicked(!addDelButtonClicked);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    console.log(error.response.data.message);
                }
                console.log("Response error: ", error.response.data.message);
                console.log("Status: ", error.response.status);
            } else if (error.request) {
                console.log("Request error: ", error.request);
            } else {
                console.log("Error", error.message);
            }
        }
    }

    // Function for deleting
    async function deleteFromLibrary(patternId) {
        try {
            const response= await axios
                .delete(`/api/user/deletepattern?username=${username}&patternId=${patternId}`, {
                    headers: { Authorization: `Bearer ${token}`
                    },})
            if(response.data.success === true) {
                setAddDelButtonClicked(!addDelButtonClicked);
            } else {
                alert(response.data.message);
            }
        } catch(error) {
            console.log("Axios error: ", error);
        }
    }


    return (
        <>
            {pattern ? (
                <>
                    <div className="rubric">
                        <h1>{pattern.name}</h1>
                    </div>
                    <div className="patternContainer">
                        <div className="imageContainer ">
                            <img
                                src={`/images/${pattern.img_url}`}
                                className="patternImage"
                            />

                            {userStatus === "authorized" ? (
                                checkIfAdded(pattern.id) ? (<Button
                                        onClick={() => deleteFromLibrary(pattern.id)}
                                        startIcon={<DeleteIcon/>}
                                        variant="outlined"
                                        sx={{
                                            color: 'grey',
                                            borderColor: 'lightgrey',
                                            '&:hover': {
                                                backgroundColor: 'lightgrey',
                                                borderColor: 'grey',
                                            },
                                            maxWidth: '30em',
                                            marginTop: '1em'
                                        }}
                                    >
                                        Delete from Library
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => addToLibrary(pattern.id)}
                                            startIcon={<AddIcon/>}
                                            variant="outlined"
                                            sx={{
                                                color: 'grey',
                                                borderColor: 'lightgrey',
                                                '&:hover': {
                                                    backgroundColor: 'lightgrey',
                                                    borderColor: 'grey',
                                                },
                                                maxWidth: '30em',
                                                marginTop: '1em'
                                            }}
                                        >
                                            Add to Library
                                        </Button>
                                    </>
                                )
                            ) : (
                                "")}

                        </div>
                        <div className="materialsContainer">
                            <h2>Fly type: </h2>
                            <p>{pattern.type}</p>
                            <h2>Hook size: </h2>
                            <p>{pattern.hook_size_from} - {pattern.hook_size_to}</p>
                            <h2>Materials: </h2>
                            <ul className="material-list">
                                {materialListItems}
                            </ul>
                            <h2>Species:</h2>
                            <ul className="species-list">
                                {speciesListItems}
                            </ul>
                        </div>

                        <div className="descriptionAndInstructionContainer">
                            {pattern.descr !== "" ? (
                                <div className="descriptionContainer">
                                    <h2>Description:</h2>
                                    <p>{pattern.descr}</p>
                                </div>
                            ) : (
                                "")}

                            {pattern.instr !== "" ? (
                                <div className="instructionContainer">
                                    <h2>Tying instructions:</h2>
                                    <p>{pattern.instr}</p>
                                </div>
                            ) : (
                                "")}
                        </div>
                        <div className="creator-container">
                            <h2>Created by:</h2>
                            <p>{pattern.created_by_user}</p>
                            <NavLink to={`/user/${pattern.created_by_user}`} className="user-navlink">
                                See all patterns created by {pattern.created_by_user}
                            </NavLink>
                        </div>

                        <div className="comments-container" id="comments">
                            <h2>Comments</h2>

                            {userStatus === 'authorized' ? (
                                <>
                                    <div className="comment-input-field-container">
                                        <ResizableTextArea
                                            username={username}
                                            patternId={patternId}
                                            token={token}
                                            updatePostedComments={updatePostedComments}
                                            setUpdatePostedComments={setUpdatePostedComments}/>
                                    </div>

                                </>
                            ):(
                                <div className="login-text-div">
                                    <NavLink to="/login">Login</NavLink> or <NavLink to="/register">register</NavLink> to post a new comment
                                </div>
                            )}

                            {comments.map(comment => <PostedComment key={comment.id} comment={comment} token={token}
                                                                    userStatus={userStatus} setUpdatedPostedComments={setUpdatePostedComments} updatedPostedComments={updatePostedComments}/>)}

                        </div>

                    </div>


                </>
            ) : (
                <h2>Pattern was not found</h2>
            )}
        </>
    );
}