import Cookies from "js-cookie";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {InputValidation} from "../utils/inputValidation.jsx";
import ImageUpload from "../create/imageUpload.jsx";
import SearchField from "../common/searchField.jsx";
import "../create/createPattern.css";

export default function EditPattern({pattern, speciesData, materialsData, setIsEditing}) {
    //Data for auth
    const token = Cookies.get("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // Input data
    const [patternState, setPatternState] = useState({
        id: pattern.id,
        name: pattern.name,
        type: pattern.type,
        img_url: pattern.img_url,
        hook_size_from: pattern.hook_size_from,
        hook_size_to: pattern.hook_size_to,
        descr: pattern.descr,
        instr: pattern.instr,
        for_sale: pattern.for_sale,
        price: pattern.price

    })
    useEffect(() => {
        setPatternState({
            id: pattern.id,
            name: pattern.name,
            type: pattern.type,
            img_url: pattern.img_url,
            hook_size_from: pattern.hook_size_from,
            hook_size_to: pattern.hook_size_to,
            descr: pattern.descr,
            instr: pattern.instr,
            for_sale: pattern.for_sale,
            price: pattern.price
        });
    }, [pattern]);

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

    // Error handling
    const [errors, setErrors] = useState([
        {hasError: false, errorType: "patternName", errorMsg: "This field cannot be empty"},
        {hasError: false, errorType: "type", errorMsg: "This field cannot be empty"},
        {hasError: false, errorType: "hookSizeFrom", errorMsg: "This field cannot be empty"},
        {hasError: false, errorType: "hookSizeTo", errorMsg: "This field cannot be empty"},
        {hasError: false, errorType: "description", errorMsg: ""},
        {hasError: false, errorType: "instruction", errorMsg: ""},
        {hasError: false, errorType: "image", errorMsg: "Please chose an image file to upload"},
        {hasError: false, errorType: "price", errorMsg: ""},
    ]);
    // Button state
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    // File changed state
    const [fileChanged, setFileChanged] = useState();
    // Type of flies available for user to pick
    const selectListData = ['Dryfly', 'Wetfly', 'Streamer', "Nymph"];
    // Username state
    const [username, setUsername] = useState("");

    // Listen for file change through image upload component
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
        // Call back functions
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

    // Input validation
    // Description and instruction input
    const handleTextInput = async (e) => {
        console.log(e.target.id);
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
                        // change error specific to this type of input
                        return newError;
                    } else {
                        // leave rest of error array unchanged
                        return error;
                    }
                })
                setErrors(updatedErrors);
                // Check which type of input, then change variable
                if (inputType === "description") {
                    setPatternState((prevState) => ({
                        ...prevState,
                        descr: inputString,
                    }));
                }
                if (inputType === "instruction") {
                    setPatternState((prevState) => ({
                        ...prevState,
                        instr: inputString,
                    }));
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
        } else {
            // Allow descr and instr to set to empty value
            if (inputType === "description") {
                setPatternState((prevState) => ({
                    ...prevState,
                    descr: inputString,
                }));
            }
            if (inputType === "instruction") {
                setPatternState((prevState) => ({
                    ...prevState,
                    instr: inputString,
                }));
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
                    // change error specific to this type of input
                    return newError;
                } else {
                    // leave rest of error array unchanged
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
                        // change error specific to this type of input
                        return newError;
                    } else {
                        // leave rest of error array unchanged
                        return error;
                    }
                })
                setErrors(updatedErrors);
                // Check which type of input, then change variable
                if (inputType === "patternName") {
                    setPatternState((prevState) => ({
                        ...prevState,
                        name: inputString,
                    }));
                }
                if (inputType === "type") {
                    setSelectOptionValue(inputString);
                }
                if (inputType === "hookSizeFrom") {
                    setPatternState((prevState) => ({
                        ...prevState,
                        hook_size_from: inputString,
                    }));
                }
                if (inputType === "hookSizeTo") {
                    setPatternState((prevState) => ({
                        ...prevState,
                        hook_size_to: inputString,
                    }));
                }
                if (inputType === "description") {
                    setPatternState((prevState) => ({
                        ...prevState,
                        descr: inputString,
                    }));
                }
                if (inputType === "instruction") {
                    setPatternState((prevState) => ({
                        ...prevState,
                        instr: inputString,
                    }));
                }
                if (inputType === "price") {
                    setPatternState((prevState) => ({
                        ...prevState,
                        price: inputString,
                    }));
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
        setPatternState((prevState) => ({
            ...prevState,
            type: selectedType,
        }));

    }

    // For sale checkbox handler
    const handleIsForSaleCheckBoxChange = () => {
        setPatternState((prevState) => {
            const newForSale = prevState.for_sale === 1 ? 0 : 1;

            // Update errors if for_sale is unchecked
            if (newForSale === 0) {
                setErrors((prevErrors) =>
                    prevErrors.map((error) =>
                        error.errorType === "price" ? { ...error, hasError: false } : error
                    )
                );
            }
            // Update states
            return {
                ...prevState,
                for_sale: newForSale, // Toggle for_sale
                price: newForSale === 0 ? "" : prevState.price, // Reset price if for_sale is unchecked
            };
        });
    };

    // Function for storing image on submit and returning image name to be used for img url
    const storeImage = async () => {
        const files = fileRef.current.files;
        console.log("files: ", files);
        let imageUrl = "";
        // if a new file has been chosen
        if(files.length <= 0) {
            imageUrl = patternState.img_url // use old img url
            return imageUrl;
        } else {
            const formData = new FormData();
            // add chosen file to formData
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

    }

    // Submit
    const handleSubmit = async () => {
        // Store image and generate img url
        const imgUrl = await storeImage();
        setPatternState((prevState) => ({
            ...prevState,
            img_url: imgUrl,

        }))
        // Alert user if image upload failed
        if(!imgUrl) {
            alert("Image upload failed, try again");
            return;
        }

        //Create date and timestamp and convert to (java) LocalDateTime format
        const dateTime = new Date().toISOString();
        //User input data
        const patternData = {
            "id" : patternState.id,
            "name": patternState.name,
            "descr": patternState.descr,
            "instr": patternState.instr,
            "hook_size_from": patternState.hook_size_from,
            "hook_size_to": patternState.hook_size_to,
            "type": patternState.type,
            "img_url": patternState.img_url,
            "for_sale": patternState.for_sale,
            "price" : patternState.price,
            "created_by_user" : username,
            "created": dateTime
        }
        //Send request to add pattern to DB
        // Convert arrays to comma separated strings to match endpoint
        const speciesString = species.join(",");
        const materialsString = materials.join(",");

        // Construct query string
        console.log("Making api call, using patternId = ", pattern.id);
        console.log("speciesString = ", speciesString);
        console.log("materialsString = ", materialsString);
        console.log("patternData is =", patternData);
        const queryString = `speciesArray=${encodeURIComponent(speciesString)}&materialsArray=${encodeURIComponent(materialsString)}`;
        axios
            .put(`/api/pattern/${pattern.id}?${queryString}`, patternData,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setIsEditing(false);
            })
            .catch((error) => {
                console.log('Axios error: ', error);
            });
    }


    return (
        <>
            <div className="create-form">
                <fieldset>
                    <legend>Pattern name</legend>
                    <input type="text" defaultValue={patternState.name} className="form-input-text" id="patternName" onChange={(e) => handleInput(e)}/>
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
                            defaultValue={patternState.type}
                    >

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
                <fieldset>
                    <legend>Image</legend>
                    <ImageUpload patternId={patternState.id} fileRef={fileRef} setFileChanged={setFileChanged} isEditing={true} img_url={patternState.img_url}/>
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
                    <p>From (hook size number):</p>
                    <input type="text" id="hookSizeFrom" defaultValue={patternState.hook_size_from} className="form-input-text" onChange={(e) => handleInput(e)} />
                    {
                        errors.find((error) => error.errorType === "hookSizeFrom").hasError ?
                            <p className="error-text">
                                {errors.find((error) => error.errorType === "hookSizeFrom").errorMsg}
                            </p>
                            :
                            ""
                    }
                    <p>To (hook size number):</p>
                    <input type="text" id="hookSizeTo" defaultValue={patternState.hook_size_to} className="form-input-text" onChange={(e)=> handleInput(e)} />
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
                        <SearchField
                            endpoint="material"
                            id="material"
                            setSearchInput={setSearchInput}
                            isEditing={true}
                            pattern={pattern}
                            materialsData={materialsData}
                        />
                    </div>
                </fieldset>
                <fieldset className="species-fieldset">
                    <div className="species-search-field">
                        <legend>Species</legend>
                        <SearchField
                            endpoint="species"
                            id="species"
                            setSearchInput={setSearchInput}
                            isEditing={true}
                            pattern={pattern}
                            speciesData={speciesData}
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Description</legend>
                    <textarea className="form-textarea" defaultValue={patternState.descr} id="description" onChange={(e) => handleTextInput(e)}></textarea>
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
                    <textarea className="form-textarea" defaultValue={patternState.instr} id="instruction" onChange={(e) => handleTextInput(e)}></textarea>
                    {
                        errors.find((error) => error.errorType === "instruction").hasError ?
                            <p className="error-text">
                                {errors.find((error) => error.errorType === "instruction").errorMsg}
                            </p>
                            :
                            ""
                    }
                </fieldset>
                <fieldset>
                    <div className="for-sale-container">
                        <label>For sale</label>
                        <div className="checkbox-wrapper">
                            <input className="for-sale-checkbox" type="checkbox" defaultChecked={patternState.for_sale === 1} onChange={handleIsForSaleCheckBoxChange}/>
                        </div>
                    </div>
                    <div className="for-sale-container-dropdown">
                        {patternState.for_sale === 1 ? (<label>Price</label>):("")}
                        {patternState.for_sale === 1 ?(<input  type="text" id="price" className="form-input-text" onChange={(e) => handleTextInput(e)} />) : ("") }
                    </div>
                    {
                        errors.find((error) => error.errorType === "price").hasError ?
                            <p className="error-text">
                                {errors.find((error) => error.errorType === "price").errorMsg}
                            </p>
                            :
                            ""
                    }
                </fieldset>
                <div className="add-button-container">
                    <button disabled={isButtonDisabled} className={isButtonDisabled ? 'button-disabled' : 'button-enabled'} onClick={handleSubmit}>Upload pattern</button>
                </div>
            </div>
        </>
    );

}