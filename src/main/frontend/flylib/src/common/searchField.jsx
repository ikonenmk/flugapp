import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {ReactSearchAutocomplete} from "react-search-autocomplete";
import Cookies from "js-cookie";
import "./searchField.css"

/** Input field with autocomplete based on stored data, takes a parameter ("endpoint") for which
 * endpoint that should be used to make the api call
 * **/
export default function SearchField({endpoint, setSearchInput, updateFilter, isEditing, pattern, speciesData, materialsData}) {
    const [availableData, setAvailableData] = useState([]);
    const token = Cookies.get("token");
    // State for enable/disable add button
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
    const [materialSpeciesError, setMaterialSpeciesError] = useState(false);
    // States for storing search field input
    const [searchString, setSearchString] = useState("");
    const [searchStringArray, setSearchStringArray] = useState([]);
    // State to force re-render of component on add button click (deletes input text)
    const [searchKey, setSearchKey] = useState(0);
    // Load available data into const availableData
    useEffect(() => {
        axios
            .get(`/api/${endpoint}`)
            .then((response) => {
                setAvailableData(response.data);
            })
            .catch((error) => {
                console.log('Axios request error: ', error);
            });
    }, []);

    // If SearchField is called from editPattern, add already added items
    useEffect(() => {
        if(isEditing === true) {
            let itemData;
            if(endpoint === "material") {
                itemData = materialsData;
            }
            if(endpoint === "species") {
                itemData = speciesData;
            }
            // Add materials or species to itemdata
            let itemString;
            if(itemData) {
                for (let i = 0; i < itemData.length; i++) {
                    // update searchStringArray to add buttons
                    itemString = itemData[i].name;

                    if (itemString !== "") {
                        handleAddButton(true, itemString);
                    }
                }
            }

        }
    }, []);


    //Handel input in search field
    const handleSearch = (item, itemType) => {
        setIsAddButtonDisabled(false)
        // If endpoint is material or species
        if(itemType === "material" || itemType === "species") {
            if(item.length > 100) {
                setMaterialSpeciesError(true);
                setIsAddButtonDisabled(true);
                return;
            } else {
                setMaterialSpeciesError(false);
                setIsAddButtonDisabled(false);
            }
        }
        setSearchString(item);
        // If gallery is the parent component, update search filter
        if (updateFilter) {
            if (endpoint === "name" || endpoint === "creator") {
                if(typeof item === 'object') { // if selected from list
                    updateFilter(item.name, itemType);
                } else {
                    updateFilter(item, itemType);
                }
            }
            if (endpoint !== "name" && endpoint !== "creator") {
                // Check that length is not more than 100 characters
                if(typeof item === 'object' && item !== null && 'id' in item) {
                    setIsAddButtonDisabled(false)
                } else {
                    setIsAddButtonDisabled(true);
                }
            }
        }
    }

    //Add new item to list
    const handleAddButton = (editing, materialName) => {
        // check if called from GUI or Edit useEffect, set searchItem accordingly
        let searchItem = searchString;
        if(editing === true) {
            searchItem = materialName;
        }

        // If search filter provided (component has gallery as parent)
        if (updateFilter) {
            // If parent component is gallery, only allow adding of existing materials (objects)
            if(typeof searchItem === 'object' && searchItem !== null && 'id' in searchItem) {
                if(!searchStringArray.some(item => item.toLowerCase() === searchItem.name)) {
                    updateFilter(searchItem.id, endpoint)
                    const updatedArray = [...searchStringArray, searchItem.name];
                    setSearchStringArray(updatedArray);
                    setSearchInput(updatedArray, endpoint);
                }
            }
        } else {
            // if search item is a string
            if (typeof searchItem === 'string') {
                // check for duplicates
                setSearchStringArray((prevArray) => {
                    // Check if string already exists in prevArray
                    if (prevArray.some(item => item.toLowerCase() === searchItem.toLowerCase())) {
                        return prevArray;
                    }
                    const updatedArray = [...prevArray, searchItem];
                    return updatedArray;
                });
            }
            // if search item is an object
            else if (typeof searchItem === 'object' && searchItem !== null && 'name' in searchItem) {
                // check for duplicates
                setSearchStringArray((prevArray) => {
                    if (prevArray.some(item => item.toLowerCase() === searchItem.name.toLowerCase())) {
                        return prevArray;
                    }
                    const updatedArray = [...prevArray, searchItem.name];
                    return updatedArray;
                });
            }
        }
        clearInputField();
    }

    //Delete item from list
    const handleDeleteButtonClick = (value) => {
        // Remove string from searchStringArray equal to value
        const filteredArray = searchStringArray.filter(
            (element) => element.toLowerCase() !== value.toLowerCase());
        // Search for objects in searchString with name equal to value
        const filteredObjectArray = availableData.filter(
            (material) => material.name.toLowerCase() === value.toLowerCase());
        setSearchStringArray(filteredArray);
        setSearchInput(filteredArray, endpoint);

        if (updateFilter && typeof filteredObjectArray[0] === 'object') {
            // Call updateFilter when filteredElement has an id
            updateFilter(filteredObjectArray[0].id, endpoint, "delete");
        }
    };

    // Clear input field
    function clearInputField() {
        setSearchString("");
        setSearchKey((prevKey) => prevKey + 1); // Change key to force re-render
    }

    return (
        <>
            <div className="search-field">
                <ReactSearchAutocomplete items={availableData}
                                         key={searchKey} // Force re-render when add btn is clicked and searchKey changes
                                         id={endpoint}
                                         onSearch={(item) => handleSearch(item, endpoint)}
                                         onSelect={(item) => {
                                             handleSearch(item, endpoint)
                                         }}
                                         styling={{
                                             height: '38px',
                                             border: '1px solid #213547',
                                             color: "grey",
                                             hoverBackgroundColor: "lightgrey",
                                             borderRadius: '4px',
                                             backgroundColor: "#292e37",
                                             placeholderColor: "grey",
                                             lineColor: "white",
                                         }}
                                         className="auto-search"
                                         placeholder={`Type in ${endpoint}`}
                                         onClear={clearInputField}

                />
                {materialSpeciesError ? (
                    <p className="error-text">
                        Input can be max 100 characters long.
                    </p>) : ("")}

            </div>
            <div className="button-container">
                { endpoint === "name" || endpoint === "creator" ? (
                    ""
                ) : (
                    <button className={isAddButtonDisabled ? 'add-button-disabled' : 'add-button-enabled'} onClick={handleAddButton} disabled={isAddButtonDisabled}>Add</button>
                )
                }

                {searchStringArray.map((value, index) => (
                    <button className="delete-button" key={`${value}-${index}`} onClick={() => handleDeleteButtonClick(value)}>
                        {value}
                    </button>
                ))}
            </div>
        </>

    )
}