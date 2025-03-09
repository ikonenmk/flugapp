
/*
* Checks length of input string (between 1-1000 chars)
* Checks that only allowed characters are included in string
* returns true if validated, otherwise an error message
* */
export default function ValidateCommentString(inputString) {
    console.log(inputString);
    if (inputString.length < 1 || inputString.length > 2000) {
        return "The comment has to be between 1 and 2000 characters";
    }

    const regex = /^[a-zA-Z0-9 \n\r.,?!'"()\/-]*$/;
    if(!regex.test(inputString)) {
        return "The comment contains special characters that are not allowed";
    }

    return true;
}