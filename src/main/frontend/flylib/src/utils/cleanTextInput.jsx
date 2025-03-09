import DOMPurify from 'dompurify';
/*
*  Use DOMPurify to clean text input from user avoid Cross-Site Scripting
*/
export default function CleanTextInput(inputString) {
    const cleanedString = DOMPurify.sanitize(inputString);
    return cleanedString;

}