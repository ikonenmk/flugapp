import React, {useEffect, useRef, useState} from "react";
import './resizeableTextArea.css'
import Button from "@mui/material/Button";
import ValidateCommentString from "../../utils/validateCommentString.jsx";
import CleanTextInput from "../../utils/cleanTextInput.jsx";
import axios from "axios";
export default function ResizableTextArea({username, patternId, token, setUpdatePostedComments, updatePostedComments}) {
    // ref for textarea
    const textAreaRef = useRef(null);
    // state for text value
    // state for comment text
    const [commentText, setCommentText] = useState("Write a new comment...");
    function resizeTextArea() {
        if(!textAreaRef.current) {
            return;
        }
        textAreaRef.current.style.height = "auto";
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }

    // hook for resizing textarea
    useEffect(() => {
        resizeTextArea()
        window.addEventListener("resize", resizeTextArea)
    }, []);

    // Function for handling comment post
    async function handleCommentButtonClick () {
        // Check input
        const validationResult = ValidateCommentString(commentText);
        if (validationResult !== true) {
        } else {
            const cleanedCommentText = CleanTextInput(commentText);
            const encodedComment = encodeURIComponent(cleanedCommentText);
            // make api call to upload comment text and details
            try {
                const response = await axios
                    .post(`/api/pattern/comment?username=${username}&pattern_id=${patternId}&comment_text=${encodedComment}`,
                        null, {headers: {Authorization: `Bearer ${token}`}})
                if(response.data.success === true) {
                    // refresh comments
                    setUpdatePostedComments(!updatePostedComments);
                    setCommentText("Write a new comment...");
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.log("An error occured: " +error.message);
            }
        }
    }

    return (
        <>
            <textarea
                rows="1"
                className="textarea"
                value={commentText}
                ref={textAreaRef}
                onChange={(e) => {
                    setCommentText(e.target.value);
                    resizeTextArea();
                }}
                onFocus={() => {
                    // Only clear placeholder if it’s the default text
                    if (commentText === "Write a new comment...") {
                        setCommentText("");
                    }
                    resizeTextArea();
                }}
                onBlur={() => {
                    // Only reset to placeholder if no text is entered
                    if (commentText.trim() === "") {
                        setCommentText("Write a new comment...");
                    }
                    resizeTextArea();
                }}
            />
            <div className="comment-button-container">
                <Button
                    onClick={handleCommentButtonClick}
                    size="small"
                    variant="contained"
                    sx={{
                        color: 'white',
                        backgroundColor: 'lightgrey'
                    }}
                >Post</Button>
            </div>
        </>
    )
}