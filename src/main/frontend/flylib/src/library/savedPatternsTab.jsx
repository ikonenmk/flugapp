import PatternAccordion from "./patternAccordion.jsx";

export default function SavedPatternsTab({username}) {

    return (
        <>
            <div className="accordion-content-container">
                <PatternAccordion
                    username={username}
                    typeOfView="savedPatterns"
                />
            </div>
        </>
    );
}