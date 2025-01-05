import PatternAccordion from "./patternAccordion.jsx";

export default function SavedPatternsTab({username}) {

    return (
        <>
            <div>
                <PatternAccordion
                    username={username}
                    typeOfView="savedPatterns"
                />
            </div>
        </>
    );
}