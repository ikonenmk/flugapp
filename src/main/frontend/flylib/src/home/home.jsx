import {useEffect, useState} from "react";
import SearchField from "../common/searchField.jsx";
import axios from "axios";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import {IconButton} from "@mui/material";
import './home.css';
import {useAuth} from "../contexts/authContext.jsx";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {Pagination} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Button from "@mui/material/Button";
import InfoModal from "./infoModal.jsx";
export default function Home() {
    // Read from AuthContext
    const userStatus = useAuth();
    const [token, setToken] = useState(null);
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    useEffect(() => {
        const tokenFromCookies = Cookies.get("token");
        if (tokenFromCookies) {
            setToken(tokenFromCookies);
        }
    }, []);

    // useNavigate hook call
    const navigate = useNavigate();

    // Input variables
    const [searchString, setSearchString] = useState("");
    const [searchInputArray, setSearchInputArray] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [species, setSpecies] = useState([]);
    const [nameFilter, setNameFilter] = useState([]);
    const [materialsFilter, setMaterialsFilter] = useState([]);
    const [speciesFilter, setSpeciesFilter] = useState([]);
    const [selectListData, setSelectListData] = useState([]);
    // Gallery items and filtered items
    const [galleryItems, setGalleryItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    // Filtering object storing filter values for each filter option
    const [filter, setFilter] = useState([{
        creatorFilter: {creator: []},
        nameFilter: {name : []},
        materialsFilter: {material: []},
        speciesFilter: {species: []},
        typeFilter: {type : []}
    }]);
    // Username state
    const [username, setUsername] = useState("");
    // Pattern state (all patterns in db)
    const [patterns, setPatterns] = useState([]);
    // Pattern state (all user's patterns)
    const [userPatterns, setUserPatterns] = useState();

    // Loading status state
    const [isLoading, setIsLoading] = useState(true);
    const [pageLoaded, setPageLoaded] = useState(false);

    // State for info modal window
    const [modalOpen, setModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({top: 0, left: 0});
    const [activeModalContent, setActiveModalContent] = useState("");

    // Pagination
    const itemsPerPage = 12;
    const [page,  setPage] = useState(1);
    const startIndex = (page - 1) * itemsPerPage; // Start index for current page
    const endIndex = startIndex + itemsPerPage; // End index for current page
    const currentItems = galleryItems.slice(startIndex, endIndex); // Select gallery items to show on current page

    // Get all patterns from DB
        useEffect(() => {
            axios
                .get("/api/pattern/find")
                .then((response) => {
                    setPatterns(response.data);
                    setIsLoading(false);
                    setPageLoaded(true);
                })
                .catch((error) => {
                    console.log('Axios request error: ', error);
                })
        }, []);

    // Set type selectList data
    useEffect(() => {
        // Create an array of unique type values from patterns array with an empty first element
        const uniqueTypes = ['', ...new Set(patterns.map(pattern => pattern.type))];
        setSelectListData(uniqueTypes)
    }, [patterns]);

    // Get username
    useEffect(() => {
        if (token) {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            axios
                .get('/api/auth/username', config)
                .then((response) => {
                    setUsername(response.data);
                })
                .catch((error) => {
                    console.error('Axios request error: ', error);
                });
        }
    }, [token]);

    // Get patterns already added to users personal library
    useEffect(() => {
        if (username) {
            let url = `/api/user/getpatterns?username=${username}`;
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
        }, [username]);

    // Increment counter for number of times page has been loaded
    useEffect(() => {
        if(pageLoaded === true) {
            axios
                .get('/api/count')
                .then((response) => {console.log(response.data)})
                .catch((error) => {
                    console.log("Axios request error: ", error);
                })
        }
    }, [pageLoaded]);

    // Function returning true if a patternId is in userPattern
    function checkIfAdded(patternId) {
        if(userPatterns && userPatterns.some(pattern => pattern.id === patternId)) {
            return true;
        } else {
            return false;
        }
    }

    // Update search filter for gallery items
    const updateFilter = (newFilterItem, filterType, actionType) => {
        if (actionType === "delete") {
            // Delete item from filter
            if (filterType === 'material') {
                // Remove element based on id
                setFilter(prevFilter => {
                    return prevFilter.map(filterItem => {
                        return {
                            ...filterItem,
                            materialsFilter: {
                                ...filterItem.materialsFilter,
                                material: filterItem.materialsFilter.material.filter(materialsItem => materialsItem !== newFilterItem)
                            }
                        };
                    });
                });
            }
            if (filterType === 'species') {
                // Remove element based on id
                setFilter(prevFilter => {
                    return prevFilter.map(filterItem => {
                        return {
                            ...filterItem,
                            speciesFilter: {
                                ...filterItem.speciesFilter,
                                species: filterItem.speciesFilter.species.filter(speciesItem => speciesItem !== newFilterItem)
                            }
                        };
                    });
                });
            }
        } else {
            // Check filter type and add filter value to correct filter object
            switch (filterType) {
                case 'creator':
                    setFilter(prevFilter => {
                        return [{
                            ...prevFilter[0],
                            creatorFilter:
                                {
                                    ...prevFilter[0].creatorFilter,
                                    creator: newFilterItem
                                } // Replace value for creator, only one value at one time should be possible
                        }]
                    });
                    break;
                case 'name':
                    setFilter(prevFilter => {
                        return [{
                            ...prevFilter[0],
                            nameFilter:
                                {
                                    ...prevFilter[0].nameFilter,
                                    name: newFilterItem
                                } // Replace value for name, only one value at one time should be possible
                        }]
                    });
                    break;
                case 'material':
                    if (!filter[0].materialsFilter.material.includes(newFilterItem)) { // Check if material is not in filter
                        // update filter
                        setFilter(prevFilter => {
                            return [{
                                ...prevFilter[0],
                                materialsFilter: {
                                    ...prevFilter[0].materialsFilter,
                                    material: [...(prevFilter[0].materialsFilter.material || []), newFilterItem] // Append value if filter is not empty
                                }
                            }];
                        });
                    } else { // if already in filter, do nothing
                    }
                    break;
                case 'species':
                    if (!filter[0].speciesFilter.species.includes(newFilterItem)) { // Check if species is not in filter
                        // update filter
                        setFilter(prevFilter => {
                            return [{
                                ...prevFilter[0],
                                speciesFilter: {
                                    ...prevFilter[0].speciesFilter,
                                    species: [...(prevFilter[0].speciesFilter.species || []), newFilterItem]
                                }
                            }]
                        });
                    } else { // if already in filter, do nothing
                    }
                    break;
                case 'type':
                    setFilter(prevFilter => {
                        return [{
                            ...prevFilter[0],
                            typeFilter: {type: newFilterItem}

                        }]
                    });
            }
        }
        updateGallery();
    }

    // Update gallery items based on filters
    function updateGallery(filteredPatterns) {
        // Set pagination page to first page
        setPage(1);

        const filters = filter[0];
        let updatedFilter = patterns;
        // Apply creator filter
        if (filters.creatorFilter.creator.length > 0) {
            updatedFilter = updatedFilter.filter(pattern =>
                pattern.created_by_user.toLowerCase() === (filters.creatorFilter.creator.toLowerCase())
            );
        }
        // Apply name filter
        if (filters.nameFilter.name.length > 0) {
            updatedFilter = updatedFilter.filter(pattern =>
                pattern.name.toLowerCase().includes(filters.nameFilter.name.toLowerCase())
            );
        }

        // Apply material filter
        if (filters.materialsFilter.material.length > 0) {
            updatedFilter = updatedFilter.filter(pattern =>
                filters.materialsFilter.material.every(requiredMaterial =>
                    pattern.materials.some(materialItem =>
                        materialItem.material === requiredMaterial
                    )
                )
            );
        }

        // Apply species filter
        if (filters.speciesFilter.species.length > 0) {
            updatedFilter = updatedFilter.filter(pattern =>
                filters.speciesFilter.species.every(requiredSpecies =>
                    pattern.species.some((speciesItem) =>
                        speciesItem.species === requiredSpecies
                    )
                )
            );
        }

        // Apply type filter
        if (filters.typeFilter.type.length > 0) {
            updatedFilter = updatedFilter.filter(pattern =>
            pattern.type.toLowerCase().includes(filters.typeFilter.type.toLowerCase()));
        }

        // Set gallery items to the filtered patterns
        setGalleryItems(updatedFilter);
    }

    // useEffect hook for deciding which items to show in gallery based on the filter
    useEffect(() => {
        // Check if all filters are empty
        if (filter[0].creatorFilter.creator.length === 0 &&
            filter[0].nameFilter.name.length === 0 &&
            filter[0].materialsFilter.material.length === 0 &&
            filter[0].speciesFilter.species.length === 0 &&
            filter[0].typeFilter.type.length === 0
        ) {
            // Show all patterns i DB in gallery
            setGalleryItems(patterns);
        } else {
            updateGallery()
        }

    }, [patterns, filter]);

    const setSearchInput = (updatedArray, endpointString) => {
        //Update array based on endpoint
        if (endpointString === "material") {
            setMaterials(updatedArray);
            setSearchInputArray(updatedArray);
        } else if (endpointString === "species") {
            setSpecies(updatedArray);
            setSearchInputArray(updatedArray);
        } else {
        }
    }

    // Add pattern to user's library
    async function onIconButtonClick(patternId) {
        // Add to database
        if (username) {
            if (!checkIfAdded(patternId)) { // if pattern not added, add
                try {
                    const response = await axios
                        .post(`/api/user/addpattern?username=${username}&pattern_id=${patternId}`,
                            null, {headers: {Authorization: `Bearer ${token}`}})
                    if (response.data.success) {
                        // Update userPatterns with the added pattern
                        const addedPattern = patterns.find(pattern => pattern.id === patternId);
                        if (addedPattern) {
                            setUserPatterns(prevUserPatterns => [...prevUserPatterns, addedPattern]);
                        }

                        // Re-filter the gallery items
                        updateGallery();
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
            } else { // if pattern already added, delete
                try {
                    const response= await axios
                        .delete(`/api/user/deletepattern?username=${username}&patternId=${patternId}`, {
                            headers: { Authorization: `Bearer ${token}`
                            },})
                    if(response.data.success === true) {

                            setUserPatterns(prevUserPatterns => prevUserPatterns.filter(pattern => pattern.id !== patternId));
                        // Re-filter gallery items
                        updateGallery();
                    } else {
                        alert(response.data.message);
                    }
                } catch(error) {
                    console.log("Axios error: ", error);
                }
            }

        } else {
            console.log("Username not found");
        }
    }

    function onOpenClick(patternId) {
        // Navigate to page for pattern with id
        navigate(`/pattern/${patternId}`);
    }

    // Function for toggeling info modal windows
    function openModal(e, content) {
        // get position of button
        const buttonPos = e.target.getBoundingClientRect();
        setModalPosition({
            top: buttonPos.top,
            left: buttonPos.left,
        });
        // Disable scroll
        document.body.classList.add("no-scroll");
        // Set modal content and open
        setActiveModalContent(content);
        setModalOpen(true);
    }


    return (
        <>
            <div className="rubric">
                <h1>Pattern Search </h1>
            </div>
            <div className="gallery-container">
                <div className="filter-container">
                    <fieldset className="creator-fieldset">
                        <legend>
                            Creator
                            <Button
                                onClick={(e) => openModal(e,
                                    "To search for flies created by a certain user. Type in the username in this field.")}
                                size="medium"
                                className="info-button"
                                startIcon={<InfoOutlinedIcon/>}
                                sx={{
                                    color: 'grey',
                                    borderColor: 'lightgrey',
                                    minWidth: 'unset', // Remove default min-width
                                    margin: '0 0 0 4px', // Reduce left margin

                                }}
                            />

                        </legend>
                        <div className="creator-search-field">
                            <SearchField endpoint="creator" setSearchInput={setSearchInput}
                                         updateFilter={updateFilter}/>
                        </div>
                    </fieldset>
                    <fieldset className="name-fieldset">
                        <legend>
                           Name
                           <Button
                               onClick={(e) => openModal(e,
                                   "To search for a fly pattern based on the name of the pattern. Type in the name in this field.")}
                               size="medium"
                               className="info-button"
                               startIcon={<InfoOutlinedIcon/>}
                               sx={{
                                   color: 'grey',
                                   borderColor: 'lightgrey',
                                   minWidth: 'unset', // Remove default min-width
                                   margin: '0 0 0 4px', // Reduce left margin

                               }}
                           />
                        </legend>
                        <div className="name-search-field">
                            <SearchField endpoint="name" setSearchInput={setSearchInput} updateFilter={updateFilter}/>
                        </div>
                    </fieldset>
                    <fieldset className="material-fieldset">
                        <legend>Material
                            <Button
                                onClick={(e) => openModal(e,
                                    "Type in the name of the material you want to search for and click on Add. You can add several materials.")}
                                size="medium"
                                className="info-button"
                                startIcon={<InfoOutlinedIcon/>}
                                sx={{
                                    color: 'grey',
                                    borderColor: 'lightgrey',
                                    minWidth: 'unset', // Remove default min-width
                                    margin: '0 0 0 4px', // Reduce left margin

                                }}
                            />
                        </legend>
                        <div className="material-search-field">
                            <SearchField endpoint="material" setSearchInput={setSearchInput}
                                         updateFilter={updateFilter}/>
                        </div>
                    </fieldset>
                    <fieldset className="species-fieldset">
                        <legend>
                            Species
                            <Button
                                onClick={(e) => openModal(e,
                                    "Type in the name of the species you want to search for and click on Add. You can add several species.")}
                                size="medium"
                                className="info-button"
                                startIcon={<InfoOutlinedIcon/>}
                                sx={{
                                    color: 'grey',
                                    borderColor: 'lightgrey',
                                    minWidth: 'unset', // Remove default min-width
                                    margin: '0 0 0 4px', // Reduce left margin

                                }}
                            />
                        </legend>
                        <div className="species-search-field">
                            <SearchField endpoint="species" setSearchInput={setSearchInput}
                                         updateFilter={updateFilter}/>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            Type of fly
                            <Button
                                onClick={(e) => openModal(e,
                                    "Pick one of the available fly types in the dropdown list to filter patterns based on fly type.")}
                                size="medium"
                                className="info-button"
                                startIcon={<InfoOutlinedIcon/>}
                                sx={{
                                    color: 'grey',
                                    borderColor: 'lightgrey',
                                    minWidth: 'unset', // Remove default min-width
                                    margin: '0 0 0 4px', // Reduce left margin

                                }}
                            />
                            {modalOpen ? (
                                <InfoModal
                                    className="info-modal"
                                    modalPosition={modalPosition}
                                    setModalOpen={setModalOpen}
                                >
                                    <span className="modal-text">{activeModalContent}</span>
                                </InfoModal>
                            ):(
                                ""
                            )
                            }
                        </legend>
                        <select className="select-type" id="type"
                                onChange={(e) => updateFilter(e.target.value, "type")}
                                defaultValue=""
                        >
                            {selectListData.map((type) =>
                                <option key={type} value={type}>{type}</option>
                            )}
                        </select>
                    </fieldset>
                </div>
                {isLoading ? (
                    <div className="loading loading03">
                        <span>L</span>
                        <span>O</span>
                        <span>A</span>
                        <span>D</span>
                        <span>I</span>
                        <span>N</span>
                        <span>G</span>
                    </div>
                ) : (
                    <div className="image-container">
                        <ImageList sx={{
                            minWidth: 200, maxWidth: 800, background: 'white', borderStyle: 'none',
                            borderColor: '#213547'
                        }} gap={3} cols={3}
                                   rowHeight={164}>
                            {currentItems.map((pattern) => (
                                <ImageListItem
                                    key={pattern.id}

                                    className="gallery-image"
                                >
                                    <img
                                        srcSet={`/images/${pattern.img_url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        src={`/images/${pattern.img_url}?w=164&h=164&fit=crop&auto=format`}
                                        alt={pattern.name}
                                        loading="lazy"
                                        id={pattern.id}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => onOpenClick(pattern.id)}
                                    />


                                    <ImageListItemBar
                                        position="top"
                                        title={pattern.name}
                                        style={{
                                            background: "rgba(128, 128, 128, 0.5)"
                                        }}
                                        actionIcon={
                                            <div className="iconContainer"
                                                 style={{
                                                     background: "grey"

                                                 }}
                                            >
                                                {userStatus === 'authorized' ? (
                                                    <IconButton
                                                        aria-label={`add ${pattern.name}`}
                                                        sx={{
                                                            color: checkIfAdded(pattern.id) ? 'white' : 'white',
                                                            backgroundColor: 'transparent',
                                                            '&:hover':
                                                                {
                                                                    color: checkIfAdded(pattern.id) ? 'white' : 'white',
                                                                    backgroundColor: 'transparent'
                                                                },
                                                            fontSize: '2em'
                                                        }}
                                                        onClick={() => onIconButtonClick(pattern.id)}
                                                    > {checkIfAdded(pattern.id) ? ("x") : ("+")}
                                                    </IconButton>
                                                ) : ("")}
                                            </div>

                                        }
                                    />

                                </ImageListItem>
                            ))}
                        </ImageList>
                        <Pagination
                            count={Math.ceil(galleryItems.length / itemsPerPage)}
                            page={page}
                            onChange={(event, value) => setPage(value)}
                            color="grey"
                            sx={{mt: 2}}
                        />
                    </div>
                )}

            </div>
        </>
    )
}