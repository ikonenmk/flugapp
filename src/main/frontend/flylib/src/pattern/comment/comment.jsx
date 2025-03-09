import Button from "@mui/material/Button";
import {NavLink} from "react-router-dom";
import React, {useEffect, useState} from "react";
import './comment.css';
import axios from "axios";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function PostedComment({comment, token, userStatus, updatedPostedComments, setUpdatedPostedComments}) {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const [username, setUsername] = useState("");
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

    // Delete comment on delete button click
    async function deleteComment() {
        try {
            const response = await axios
                .delete(`/api/pattern/comment?comment_id=${comment.id}`, null,
                    {headers: {Authorization: `Bearer ${token}`}})
            if(response.data.success === true) {
                // refresh comments
                setUpdatedPostedComments(!updatedPostedComments);

            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log("An error occured: " +error.message);
        }
    }

    return (
        comment && comment.commentText && comment.timeOfPosting && comment.username ? (
                <div className="comment-container">
                    <div className="comment-header">
                        <NavLink to={`/user/${comment.username}`}>
                            @{comment.username}
                        </NavLink>
                        {' '}
                        at {comment.timeOfPosting.replace("T", " ")}
                        {userStatus === "authorized" ? (
                            username === comment.username ? (
                                <Button
                                    size="large"
                                    sx={{
                                        color: 'gray'
                                    }}
                                    startIcon={<DeleteForeverIcon />}
                                    className="delete-comment-button"
                                    onClick={deleteComment} />

                            ):( ""

                            )
                        ):("")}

                    </div>
                    <div className="comment-body">
                        {comment.commentText}
                    </div>
                    <div className="comment-footer">

                    </div>
                </div>
            ):(
                ""
            )
    );
}