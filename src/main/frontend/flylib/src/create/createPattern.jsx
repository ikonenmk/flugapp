import SearchField from "../common/searchField.jsx";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./createPattern.css";
import ImageUpload from "./imageUpload.jsx";
import {InputValidation} from "../utils/inputValidation.jsx";
import {useNavigate} from "react-router-dom";
export default function CreatePattern() {
    // Data for auth
    const token = Cookies.get("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    // Navigate
    const navigate = useNavigate();

    // Input data from user
    const [isForSale, setIsForSale] = useState(false);
    const [patternName, setPatternName] = useState("");
    const [hookSizeFrom, setHookSizeFrom] = useState("");
    const [hookSizeTo, setHookSizeTo] = useState("");
    const [description, setDescription] = useState("");
    const [instruction, setInstruction] = useState("");
    const [price, setPrice] = useState("");
    const [materials, setMaterials] = useState([]);
    const [species, setSpecies] = useState([]);
    const [type, setType] = useState("");
    const [searchInputArray, setSearchInputArray] = useState([]);
    const fileRef = useRef(null);
    // Type of flies available for user to pick
    const selectListData = ['Dryfly', 'Wetfly', 'Streamer', "Nymph"];
    // Button state
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    // Username state
    const [username, setUsername] = useState("");

    // Error handling
    const [errors, setErrors] = useState([
        {hasError: true, errorType: "patternName", errorMsg: "This field cannot be empty"},
        {hasError: true, errorType: "type", errorMsg: "This field cannot be empty"},
        {hasError: true, errorType: "hookSizeFrom", errorMsg: "This field cannot be empty"},
        {hasError: true, errorType: "hookSizeTo", errorMsg: "This field cannot be empty"},
        {hasError: false, errorType: "description", errorMsg: ""},
        {hasError: false, errorType: "instruction", errorMsg: ""},
        {hasError: true, errorType: "image", errorMsg: "Please chose an image file to upload"},
    ]);

    // Listen for file change through image upload component
    const [fileChanged, setFileChanged] = useState();
    useEffect(() => {
        // if a file has been selected, remove image error
        if(fileRef.current &&  fileRef.current.files.length > 0) {
            const newError = {hasError: false, errorType: "image", errorMsg: ""};
            const updatedErrors = errors.map(error => {
                if(error.errorType === "image") {
                    // change error specific to this type of input
                    return newError;
                } else {
                    // leave rest of error array unchanged
                    return error;
                }
            })
            setErrors(updatedErrors);
        }
    },[fileChanged]);

    // Button enable/disable based on errors
    useEffect(() => {
        // Check if there are any errors, if so disable button
        if(errors.some((error) => error.hasError === true)) {
            setIsButtonDisabled(true);
        } else { // if no errors, enable submit button
            setIsButtonDisabled(false);
        }
    }, [errors]);

    // Get username from server
    useEffect(() => {
        axios
            .get('/api/auth/username', config)
            .then((response) => {
                setUsername(response.data);
            })
            .catch((error) => {
                console.log('Axios request error: ', error);
            });
    }, []);

    // Preventing default action of opening files dropped outside of dropzone
    useEffect(() => {
        const handleDragOver = (e) => {
            e.preventDefault();
        };
        const handleDrop = (e) => {
            e.preventDefault();
        }
        // Add event listeners
        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("drop", handleDrop);

        // cleanup function
        return () => {
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("drop", handleDrop);
        };
    }, []);

    //Function for updating material and species arrays based on events in SearchField component
    const setSearchInput = (updatedArray, endpointString) => {
        //Update array based on endpoint
        if (endpointString === "material") {
            setMaterials(updatedArray);
            setSearchInputArray(updatedArray);
        } else if (endpointString === "species") {
            setSpecies(updatedArray);
            setSearchInputArray(updatedArray);
        } else {
            console.log("Endpoint value mismatch");
        }
    }

    // Description and instruction input
    const handleTextInput = async (e) => {
        const inputString = e.target.value;
        const inputType = e.target.id;
        // Check is empty, if not validate input
        if (inputString !== "") {
            const inputIsValid = await InputValidation(inputString, inputType);
            // If valid, set variables to input
            if (inputIsValid === true) {
                const newError = {hasError: false, errorType: inputType, errorMsg: ""};
                const updatedErrors = errors.map(error => {
                    if(error.errorType === inputType) {
                        // Change error specific to this type of input
                        return newError;
                    } else {
                        // Leave rest of error array unchanged
                        return error;
                    }
                })
                setErrors(updatedErrors);
                // Check which type of input, then change variable
                if (inputType === "description") {
                    setDescription(inputString);
                }
                if (inputType === "instruction") {
                    setInstruction(inputString);
                }
            }
            else { // If validation fails, set error
                const newError = {hasError: true, errorType: inputType, errorMsg: inputIsValid};
                const updatedErrors = errors.map(error => {
                    if(error.errorType === inputType) {
                        // change error specific to this type of input
                        return newError;
                    } else {
                        // leave rest of error array unchanged
                        return error;
                    }
                })
                setErrors(updatedErrors);
            }
        }
    }

    // All other input fields
    const handleInput = async (e) => {
        const inputString = e.target.value;
        const inputType = e.target.id;
        // Check if input is empty, if so create error
        if(inputString === "") {
            const newError = {hasError: true, errorType: inputType, errorMsg: "This field cannot be empty"};
            const updatedErrors = errors.map(error => {
                if(error.errorType === inputType) {
                    // Change error specific to this type of input
                    return newError;
                } else {
                    // Leave rest of error array unchanged
                    return error;
                }
            })
            setErrors(updatedErrors);
        }
        // Check is empty, if not validate input
        if (inputString !== "") {
            const inputIsValid = await InputValidation(inputString, inputType);
            // If valid, set variables to input
            if (inputIsValid === true) {
                const newError = {hasError: false, errorType: inputType, errorMsg: ""};
                const updatedErrors = errors.map(error => {
                    if(error.errorType === inputType) {
                        // Change error specific to this type of input
                        return newError;
                    } else {
                        // Leave rest of error array unchanged
                        return error;
                    }
                })
                setErrors(updatedErrors);
                // Check which type of input, then change variable
                if (inputType === "patternName") {
                    setPatternName(inputString);
                }
                if (inputType === "type") {
                    setSelectOptionValue(inputString);
                }
                if (inputType === "hookSizeFrom") {
                    setHookSizeFrom(inputString);
                }
                if (inputType === "hookSizeTo") {
                    setHookSizeTo(inputString);
                }
                if (inputType === "description") {
                    setDescription(inputString);
                }
                if (inputType === "instruction") {
                    setInstruction(inputString);
                }
            }
            else { // If validation fails, set error
                const newError = {hasError: true, errorType: inputType, errorMsg: inputIsValid};
                const updatedErrors = errors.map(error => {
                    if(error.errorType === inputType) {
                        // change error specific to this type of input
                        return newError;
                    } else {
                        // leave rest of error array unchanged
                        return error;
                    }
                })
                setErrors(updatedErrors);
            }
        }
    }

    //Function for updating type value based on select option value
    const setSelectOptionValue = (selectedType) => {
        setType(selectedType);

    }
    //Handlers
    const handleIsForSaleCheckBoxChange = () => {
        setIsForSale(!isForSale);
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

    // Submit
    const handleSubmit = async () => {
        // Store image and generate img url
        const imgUrl = await storeImage();
        // Alert user if image upload failed
        if(!imgUrl) {
            alert("Image upload failed, try again");
            return;
        }

        // Create date and timestamp and convert to LocalDateTime format
        const dateTime = new Date().toISOString();
        // User input data
        const patternData = {
            "name": patternName,
            "descr": description,
            "instr": instruction,
            "hook_size_from": hookSizeFrom,
            "hook_size_to": hookSizeTo,
            "type": type,
            "img_url": imgUrl,
            "for_sale": isForSale,
            "price" : price,
            "created_by_user" : username,
            "created": dateTime
        }
        // Send request to add pattern to DB
        const speciesString = species.join(",");
        const materialsString = materials.join(",");
        const queryString = `speciesArray=${encodeURIComponent(speciesString)}&materialsArray=${encodeURIComponent(materialsString)}`;
        axios
            .post(`/api/pattern?${queryString}`, patternData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                navigate("/library", { state: { activeTab: "createdPatternTab" } });
            })
            .catch((error) => {
                console.log('Axios error: ', error);
            });
    }

    // Function for minimizing the phone keyboard on enter hit
    function handleEnterClick(e) {
        if (e.key === "Enter") {
            e.target.blur();
        }
    }


    return (
        <>
            <div className="rubric">
                <h1>Upload a new pattern</h1>
            </div>
            <div className="create-form">
            <fieldset>
                <legend>Pattern name</legend>
                <input
                    type="text"
                    className="form-input-text"
                    id="patternName"
                    enterKeyHint="done"
                    onKeyDown={(e) => handleEnterClick(e)}
                    onChange={(e) => handleInput(e)}/>
                    {
                       errors.find((error) => error.errorType === "patternName").hasError ?
                        <p className="error-text">
                            {errors.find((error) => error.errorType === "patternName").errorMsg}
                        </p>
                            :
                            ""
                    }

            </fieldset>
                <fieldset>
                    <legend>Type of fly</legend>
                    <select className="select-type" id="type"
                            onChange={(e) => handleInput(e)}
                            defaultValue=""
                    >
                        <option value="" disabled>
                            Choose fly type
                        </option>
                        {selectListData.map((type) =>
                            <option key={type} value={type}>{type}</option>
                        )}
                    </select>
                    {
                        errors.find((error) => error.errorType === "type").hasError ?
                            <p className="error-text">
                                {errors.find((error) => error.errorType === "type").errorMsg}
                            </p>
                            :
                            ""
                    }
                </fieldset>
                <fieldset className="image-upload-container">
                    <legend>Click or drag image to upload</legend>
                    <ImageUpload fileRef={fileRef} setFileChanged={setFileChanged} />
                    {
                        errors.find((error) => error.errorType === "image").hasError ?
                            <p className="error-text">
                                {errors.find((error) => error.errorType === "image").errorMsg}
                            </p>
                            :
                            ""
                    }
                </fieldset>

                <fieldset>
                    <legend className="hook-container">Hook size</legend>
                    <p>From (largest hook size number):</p>
                    <input type="text" enterKeyHint="done" id="hookSizeFrom" className="form-input-text" onChange={(e) => handleInput(e)} />
                    {
                        errors.find((error) => error.errorType === "hookSizeFrom").hasError ?
                            <p className="error-text">
                                {errors.find((error) => error.errorType === "hookSizeFrom").errorMsg}
                            </p>
                            :
                            ""
                    }
                    <p>To (smallest hook size number):</p>
                   <input type="text" enterKeyHint="done" id="hookSizeTo" className="form-input-text" onChange={(e)=> handleInput(e)} />
                    {
                        errors.find((error) => error.errorType === "hookSizeTo").hasError ?
                            <p className="error-text">
                                {errors.find((error) => error.errorType === "hookSizeTo").errorMsg}
                            </p>
                            :
                            ""
                    }
                </fieldset>
                <fieldset className="material-fieldset">
                    <legend>Material</legend>
                    <div className="material-search-field">
                        <SearchField endpoint="material" id="material" setSearchInput={setSearchInput}/>
                    </div>
                </fieldset>
                <fieldset className="species-fieldset">
                <div className="species-search-field">
                    <legend>Species</legend>
                    <SearchField endpoint="species" id="species" setSearchInput={setSearchInput}/>
                </div>
            </fieldset>
            <fieldset>
                <legend>Description</legend>
                <textarea className="form-textarea" enterKeyHint="done" id="description" onChange={(e) => handleTextInput(e)}></textarea>
                {
                    errors.find((error) => error.errorType === "description").hasError ?
                        <p className="error-text">
                            {errors.find((error) => error.errorType === "description").errorMsg}
                        </p>
                        :
                        ""
                }
            </fieldset>
            <fieldset>
                <legend>Tying instructions</legend>
                <textarea className="form-textarea" enterKeyHint="done" id="instruction" onChange={(e) => handleTextInput(e)}></textarea>
                {
                    errors.find((error) => error.errorType === "instruction").hasError ?
                        <p className="error-text">
                            {errors.find((error) => error.errorType === "instruction").errorMsg}
                        </p>
                        :
                        ""
                }
            </fieldset>
                {/* FOR LATER UPDATES
                    <fieldset>
                <div className="for-sale-container">
                    <label>For sale</label>
                    <div className="checkbox-wrapper">
                        <input className="for-sale-checkbox" type="checkbox" onChange={handleIsForSaleCheckBoxChange}/>
                    </div>
                </div>
                <div className="for-sale-container-dropdown">
                {isForSale && <label>Price</label>}
                    {isForSale && <input  type="text" enterKeyHint="done" className="form-input-text" onChange={(e) => setPrice(e.target.value)} />}
                </div>
            </fieldset>
                */}
                <div className="add-button-container">
                    <button disabled={isButtonDisabled} className={isButtonDisabled ? 'button-disabled' : 'button-enabled'} onClick={handleSubmit}>Upload pattern</button>
                </div>
            </div>
        </>
    );
}