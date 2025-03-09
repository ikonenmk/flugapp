import Cookies from "js-cookie";
import {useEffect, useState} from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionActions from "@mui/material/AccordionActions";
import {useAuth} from "../contexts/authContext.jsx";
import AddIcon from '@mui/icons-material/Add';

export default function UserAccordion({username}) {
    // Read from AuthContext
    const userStatus = useAuth();
    const token = Cookies.get("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const [patterns, setPatterns] = useState([]);
    const [materialsData, setMaterialsData] = useState({});
    const [speciesData, setSpeciesData] = useState({});
    const [speciesDataLoading, setSpeciesDataLoading] = useState(true);
    const [materialsDataLoading, setMaterialsDataLoading] = useState(true);
    const [openAccordion, setOpenAccordion] = useState(null); // Keep track of which accordion that is open
    const [isEditing, setIsEditing] = useState(false);
    const [activeUser, setActiveUser] = useState("");
    const [userPatterns, setUserPatterns] = useState();

    // Clear material and species data when switching views
    useEffect(() => {
        setMaterialsData({});
        setSpeciesData({});
    }, []);

    // Get username of logged in user
    useEffect(() => {
        axios
            .get('/api/auth/username', config)
            .then((response) => {
                setActiveUser(response.data);
            })
            .catch((error) => {
                console.log('Axios request error: ', error);
            });
    }, []);

    // Get logged in users saved patterns
    useEffect(() => {
        if (activeUser) {
            let url = `/api/user/getpatterns?username=${activeUser}`;
            if (url) {
                axios
                    .get(url, {
                        headers: { Authorization: `Bearer ${token}` },
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
    }, [activeUser]);

    // Get creators saved patterns
    useEffect(() => {
        if(!username || username === "") {
            // return if username is undefined or empty
            return;
        }
        let url = `/api/user/getcreatedpatterns?username=${username}`;


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
    }, [username]);

    // Function returning true if a patternId is in userPattern
    function checkIfAdded(patternId) {
        if(userPatterns && userPatterns.some(pattern => pattern.id === patternId)) {
            return true;
        } else {
            return false;
        }
    }
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

    // Function for adding
    async function addToLibrary(patternId) {
        try {
            const response = await axios
                .post(`/api/user/addpattern?username=${activeUser}&pattern_id=${patternId}`,
                    null, {headers: {Authorization: `Bearer ${token}`}})
            console.log(response);
            if (response.data.success) {
                // Update userPatterns with the added pattern
                const addedPattern = patterns.find(pattern => pattern.id === patternId);
                if (addedPattern) {
                    setUserPatterns(prevUserPatterns => [...prevUserPatterns, addedPattern]);
                }
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
                    <ul className="material-list">
                        {speciesData[pattern.id] && speciesData[pattern.id].map((species) => (
                            <li key={species.id}>
                                {species.name.charAt(0).toUpperCase() + species.name.slice(1)}
                            </li>
                        ))}
                    </ul>

                    <h2>Description:</h2>
                    <p>{pattern.descr}</p>

                    <h2>Tying instructions:</h2>
                    <p>{pattern.instr}</p>
                    <AccordionActions>
                        {checkIfAdded(pattern.id) ? (
                            ""
                        ) : (
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
                                }}
                            >
                                Add to Library
                            </Button>
                        )}

                    </AccordionActions>
                </AccordionDetails>
            </Accordion>
        );
    });

    return <div>{accordionItems}</div>;
}