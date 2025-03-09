import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./patternAccordion.css";
import EditPattern from "./editPattern.jsx";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BackspaceIcon from '@mui/icons-material/Backspace';
import {NavLink} from "react-router-dom";
import {Close, Done} from "@mui/icons-material";

export default function PatternAccordion({ username, typeOfView }) {
    const token = Cookies.get("token");
    const [patterns, setPatterns] = useState([]);
    const [materialsData, setMaterialsData] = useState({});
    const [speciesData, setSpeciesData] = useState({});
    const [speciesDataLoading, setSpeciesDataLoading] = useState(true);
    const [materialsDataLoading, setMaterialsDataLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [numberOfLibraries, setNumberOfLibraries] = useState([]);

    // Clear material and species data when switching views
    useEffect(() => {
        setMaterialsData({});
        setSpeciesData({});
    }, [typeOfView]);

    // Get user's saved patterns
    useEffect(() => {
        if(!username || username === "") {
            // return if username is undefined or empty
            return;
        }
        let url;

        if (typeOfView === "savedPatterns") {
            url = `/api/user/getpatterns?username=${username}`;
        } else if (typeOfView === "createdPatterns") {
            url = `/api/user/getcreatedpatterns?username=${username}`;
        }

        if (url) {
            axios
                .get(url, {
                    headers: { Authorization: `Bearer ${token}` },
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
    }, [username, token, typeOfView, isEditing]);


    // Get all materials for pattern
    const fetchMaterials = async (patternId) => {
        try {
            // Get materials id
            const materialResponse = await axios.get(`/api/patternmaterial/${patternId}`);

            // Extract ids and convert to string
            const materialIds = materialResponse.data.map(item => item.material).join(',');
            let namesResponse;
            if(materialIds.length > 0) {
                // Get materials name
                namesResponse = await axios.get(`/api/material/names/${materialIds}`);
            } else {
                namesResponse = [];
            }


            // Return  material names
            return namesResponse.data; // Return the material names
        } catch (error) {
            console.log("Axios error: ", error);
            return []; // Return an empty array on error
        }
    };

    // Fetch materials for all patterns
    useEffect(() => {
        const fetchAllMaterials = async () => {
            const materials = {};
            for (const pattern of patterns) {
                if (pattern.id) {
                    const names = await fetchMaterials(pattern.id);
                    materials[pattern.id] = names;
                }
            }
            setMaterialsData(materials);
            setMaterialsDataLoading(false);
        };

        if (patterns.length > 0) { // Run only if patterns exist
            setMaterialsDataLoading(true);
            fetchAllMaterials();
        }
    }, [patterns]);

    // Get all materials for pattern
    const fetchSpecies = async (patternId) => {
        try {
            // Get materials id
            const speciesResponse = await axios.get(`/api/patternspecies/${patternId}`);

            // Extract ids and convert to string
            const speciesIds = speciesResponse.data.map(item => item.species).join(',');
            let namesResponse;
            if(speciesIds.length > 0) {
                // Get materials name
                namesResponse = await axios.get(`/api/species/names/${speciesIds}`);
            } else {
                namesResponse = [];
            }

            // Return  species names
            return namesResponse.data; // Return the material names
        } catch (error) {
            console.log("Axios error: ", error);
            return []; // Return an empty array on error
        }
    };

    // Fetch species for all patterns
    useEffect(() => {
        const fetchAllSpecies = async () => {
            const species = {};
            for (const pattern of patterns) {
                if (pattern.id) {
                    const names = await fetchSpecies(pattern.id);
                    species[pattern.id] = names;
                }
            }
            setSpeciesData(species);
            setSpeciesDataLoading(false);
        };

        if (patterns.length > 0) { // Run only if patterns exist
            setSpeciesDataLoading(true);
            fetchAllSpecies();
        }
    }, [patterns]);

    // Get number of libraries the pattern has been added to
    useEffect(() => {
        const getNumberOfLibraries = async () => {
            for(let i = 0; i < patterns.length; i++) {
                const patternId = patterns[i].id;
                const response= await axios // get count for pattern id
                    .get(`/api/userpattern/${patternId}`, {
                        headers: { Authorization: `Bearer ${token}`
                        },});
                // Update numberOfLibraries with the count
                setNumberOfLibraries(prevState => {
                    const patternExists = prevState.some(pattern => pattern.pattern_id === patternId);
                    if (patternExists) {
                        // Update the existing pattern
                        return prevState.map(pattern => {
                            if (pattern.pattern_id === patternId) {
                                return { ...pattern, count: response.data }; // Update count for matching pattern
                            }
                            return pattern; // Return other patterns unchanged
                        });
                    } else {
                        // Add a new pattern object
                        return [...prevState, { pattern_id: patternId, count: response.data }];
                    }
                });
            }
        }
        if (typeOfView === "createdPatterns") { // Only check if created patterns view is active
            if(patterns.length > 0) {
                getNumberOfLibraries();
            }
        }

    }, [patterns, typeOfView]);

    // Function for deleting a pattern
    async function deleteFromLib(patternId) {
        try {
            const response= await axios
                .delete(`/api/user/deletepattern?username=${username}&patternId=${patternId}`, {
                    headers: { Authorization: `Bearer ${token}`
                    },})
            if(response.data.success === true) {
                setPatterns((prevPatterns) => prevPatterns.filter((pattern) => pattern.id !== patternId));
            } else {
                alert(response.data.message);
            }
        } catch(error) {
            console.log("Axios error: ", error);
        }
    }
    async function deleteFromDb(patternId) {
        try {
            const response= await axios
                .delete(`/api/pattern/${patternId}`, {
                    headers: { Authorization: `Bearer ${token}`
                    },})
            if(response.data.success === true) {
                setPatterns((prevPatterns) => prevPatterns.filter((pattern) => pattern.id !== patternId));
            } else {
                alert(response.data.message);
            }
        } catch(error) {
            console.log("Axios error: ", error);
        }
    }

    // Editing
    const EditButton = ({ toggleEdit, isEditing, index }) => {
        if(materialsDataLoading === true || setSpeciesDataLoading === true) {
            return (
                <Button onClick={toggleEdit} disabled>
                    {isEditing ? "Cancel" : "Edit"}
                </Button>
            );
        } else {
            return (
                isEditing === true ? (
                    <Button
                        onClick={toggleEdit}
                        variant="outlined"
                        startIcon={<Close />}
                        size="large"
                        sx={{
                            color: 'grey',
                            borderColor: 'lightgrey',
                            '&:hover': {
                                backgroundColor: 'lightgrey', // Change background on hover
                                borderColor: 'grey', // Keep border consistent
                            },
                        }}
                    >CANCEL</Button>
                ) : (
                    <Button
                        onClick={toggleEdit}
                        variant="outlined"
                        startIcon={<EditIcon />}
                        size="large"
                        sx={{
                            color: 'grey',
                            borderColor: 'lightgrey',
                            '&:hover': {
                                backgroundColor: 'lightgrey', // Change background on hover
                                borderColor: 'grey', // Keep border consistent
                            },
                        }}
                    >Edit</Button>
                )

            );
        }

    };
    function toggleEdit () {
        setIsEditing(!isEditing);
    }

    // Expand only one item at once
    const [expanded, setExpanded] = React.useState();
    const handleChange = (index) => (event, newExpanded) => {
        setExpanded(newExpanded ? index : false);
        if (isEditing === true) {
            setIsEditing(false);
        }
    };

    // Rendering functions of accordion items
    const accordionItems = patterns.map((pattern, index) => {
        return (
            <Accordion key={index} expanded={expanded === index} onChange={handleChange(index)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    className="accordion-item"
                >
                    {pattern.name}
                </AccordionSummary>
                {typeOfView === 'createdPatterns' && (
                    isEditing && expanded === index ? (
                            <>
                                <div className="edit-button-container">
                                    <EditPattern
                                        setIsEditing={setIsEditing}
                                        pattern={pattern}
                                        materialsData={materialsData[pattern.id]}
                                        speciesData={speciesData[pattern.id]}/>

                                    <EditButton toggleEdit={toggleEdit} isEditing={isEditing} pattern={pattern}/>
                                </div>
                            </>

                        )
                        :
                        (
                            <>
                                <AccordionDetails
                                >
                                    <h1>{pattern.name}</h1>
                                    <img
                                        src={`/images/${pattern.img_url}`}
                                        className="patternImage"
                                    />
                                    <h2>Fly type: </h2>
                                    <p>{pattern.type}</p>

                                    <h2>Hook size: </h2>
                                    <p>{pattern.hook_size_from} - {pattern.hook_size_to}</p>

                                    <h2>Materials: </h2>
                                    <ul className="material-list">
                                        {materialsData[pattern.id] && materialsData[pattern.id].map((material) => (
                                            <li key={material.id}>
                                                {material.name.charAt(0).toUpperCase() + material.name.slice(1)}
                                            </li>
                                        ))}
                                    </ul>

                                    <h2>Species: </h2>
                                    <ul className="species-list">
                                        {speciesData[pattern.id] && speciesData[pattern.id].map((species) => (
                                            <li key={species.id}>
                                                {species.name.charAt(0).toUpperCase() + species.name.slice(1)}
                                            </li>
                                        ))}
                                    </ul>

                                    {pattern.descr && pattern.descr.trim() !== "" && (
                                        <>
                                            <h2>Description:</h2>
                                            <p className="description-text">{pattern.descr}</p>
                                        </>
                                    )}

                                    {pattern.instr && pattern.instr.trim() !== "" && (
                                        <>
                                            <h2>Tying instructions:</h2>
                                            <p className="instruction-text">{pattern.instr}</p>
                                        </>
                                    )}

                                    <h2>Saved to number of libraries: {numberOfLibraries.map((library) => {
                                        if (library.pattern_id === pattern.id) {
                                            return library.count
                                        }
                                    })} </h2>


                                    <AccordionActions sx={{justifyContent: 'flex-start'}}>
                                        <EditButton toggleEdit={toggleEdit} isEditing={isEditing} pattern={pattern}/>
                                        <Button
                                            sx={{
                                                pl: 15,
                                                pr: 5

                                            }}
                                            onClick={() => deleteFromDb(pattern.id)}
                                            startIcon={<DeleteIcon/>}
                                            variant="outlined"
                                            sx={{
                                                color: 'grey',
                                                borderColor: 'lightgrey',
                                                '&:hover': {
                                                    backgroundColor: 'lightgrey',
                                                    borderColor: 'grey',
                                                },
                                            }}
                                        >
                                            Delete pattern
                                        </Button>
                                    </AccordionActions>
                                </AccordionDetails>
                            </>
                        ))}
                {typeOfView === 'savedPatterns' ? (
                    <>
                        <AccordionDetails
                        >
                            <h1>{pattern.name}</h1>
                            <img
                                src={`/images/${pattern.img_url}`}
                                className="patternImage"
                            />
                            <h2>Fly type: </h2>
                            <p>{pattern.type}</p>
                            <h2>Hook size: </h2>
                            <p>{pattern.hook_size_from} - {pattern.hook_size_to}</p>

                            <h2>Materials: </h2>
                            <ul className="material-list">
                                {materialsData[pattern.id] && materialsData[pattern.id].map((material) => (
                                    <li key={material.id}>
                                        {material.name.charAt(0).toUpperCase() + material.name.slice(1)}
                                    </li>
                                ))}
                            </ul>

                            <h2>Species: </h2>
                            <ul className="species-list">
                                {speciesData[pattern.id] && speciesData[pattern.id].map((species) => (
                                    <li key={species.id}>
                                        {species.name.charAt(0).toUpperCase() + species.name.slice(1)}
                                    </li>
                                ))}
                            </ul>

                            {pattern.descr && pattern.descr.trim() !== "" && (
                                <div className="descriptionContainer">
                                    <h2>Description:</h2>
                                    <p className="description-text">{pattern.descr}</p>
                                </div>
                            )}

                            {pattern.instr && pattern.instr.trim() !== "" && (
                                <div className="instructionContainer">
                                    <h2>Tying instructions:</h2>
                                    <p className="instruction-text">{pattern.instr}</p>
                                </div>
                            )}
                            <h2>Created by:</h2>
                            <p>{pattern.created_by_user}</p>
                            <NavLink to={`/user/${pattern.created_by_user}`} className="user-navlink">
                                See all patterns created by {pattern.created_by_user}
                            </NavLink>
                            <AccordionActions>
                                <Button
                                    onClick={() => deleteFromLib(pattern.id)}
                                    startIcon={<DeleteIcon/>}
                                    variant="outlined"
                                    sx={{
                                        color: 'grey',
                                        borderColor: 'lightgrey',
                                        '&:hover': {
                                            backgroundColor: 'lightgrey', // Change background on hover
                                            borderColor: 'grey', // Keep border consistent
                                        },
                                    }}
                                >
                                    Delete from Library
                                </Button>
                            </AccordionActions>
                        </AccordionDetails>
                    </>
                ) : ("")}
            </Accordion>
        );
    });

    return <div>{accordionItems}</div>;
}
