import React, {useEffect, useRef, useState} from 'react';
import "./imageUpload.css";
import ImageResize from "../utils/imageResize.jsx";

export default function ImageUpload({fileRef, setFileChanged, isEditing, img_url}) {
    // Allowed image types
    const allowedImageTypes = ['image/png', 'image/gif', 'image/jpeg', 'image/bmp']
    // Consts for handling to dropzone and change of style on dragging
    const dropZoneRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [style, setStyle] = useState("previewCanvas");
    const dragCounter = useRef(0);
    const [image, setImage] = useState("");

    // Set pattern image if called from editPattern
    useEffect(() => {
        if(isEditing === true) {
            const img = new Image();
            img.src = `/images/${img_url}`
            img.onload = () => {
                const canvasWidth = dropZoneRef.current.offsetWidth;
                const canvasHeight = dropZoneRef.current.offsetHeight;
                const resizedPatternImage = ImageResize(img, canvasWidth, canvasHeight, "previewCanvas");
                previewCanvasRef.current.style.backgroundImage = `url(${resizedPatternImage})`;
            }
        }
    }, []);
    function uploadImage(e) {
        // Check if file has been added with input button or dropped
        let files;

        if (e.dataTransfer) {
            files = e.dataTransfer.files; // drag and drop

            // set file input to value of dropped file
            const dataTransfer = new DataTransfer();
            for (let i = 0; i < files.length; i++) {
                dataTransfer.items.add(files[i]);
            }
            fileRef.current.files = dataTransfer.files;
        } else if (e.target) {
            files = e.target.files; // file input
        }

        if (files) {
            // Change value for FileChanged in parent component
            setFileChanged(true);
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
                            // Set fullsize image
                            setImage(img.src);
                            // Resize image when it finishes loading
                            img.onload = () => {
                                const canvasWidth = dropZoneRef.current.offsetWidth;
                                const canvasHeight = dropZoneRef.current.offsetHeight;
                                // Resize for the preview canvas
                                const resizedImage = ImageResize(img, canvasWidth, canvasHeight, "previewCanvas");
                                previewCanvasRef.current.style.backgroundImage = `url(${resizedImage})`;

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
    }

    // Functions for drag and drop
    function onDropHandler(e) {
        e.preventDefault();
        setStyle("previewCanvas");
        uploadImage(e);
    }

    function onDragEnterHandler(e) {
        e.preventDefault();
        dragCounter.current += 1;
        setStyle("previewCanvasDrag");
    }

    function onDragLeaveHandler(e) {
        e.preventDefault();
        dragCounter.current -= 1;
        if (dragCounter.current === 0) {
            setStyle("previewCanvas");
        }
    }
    function onDragOverHandler(e) {
        e.preventDefault();
    }

    function onMouseEnterHandler(e) {
        e.preventDefault();
        setStyle("previewCanvasDrag");
    }
    function onMouseLeaveHandler(e) {
        e.preventDefault();
        setStyle("previewCanvas");
    }


    return(
        <div
            id="drop-zone"
            ref={dropZoneRef}
            onDrop={onDropHandler}
            onDragOver={onDragOverHandler}
            onDragEnter={onDragEnterHandler}
            onDragLeave={onDragLeaveHandler}
            onMouseEnter={onMouseEnterHandler}
            onMouseLeave={onMouseLeaveHandler}
        >

            <div id="canvasContainer">
                <canvas
                    id="previewCanvas"
                    className={style}
                    ref={previewCanvasRef}
                >
                </canvas>
                <input type="file" ref={fileRef} id="uploadButton" name="uploadButton" onInput={uploadImage}/>
            </div>

        </div>
    )

}