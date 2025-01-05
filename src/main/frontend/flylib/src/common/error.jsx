import {useRouteError} from "react-router-dom";

export default function Error() {
    //Router error message
    const error = useRouteError();
    return(
        <div>
            <h2>Error: {error.status}</h2>
            <p>
                <i>Message: {error.statusText || error.message}</i>
            </p>
        </div>
    );
}