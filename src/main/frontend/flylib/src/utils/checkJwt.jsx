import axios from "axios";
//Function receiving a token, check validity of token, returns true or false

export async function CheckJwt (token, dispatch, userStatus) {
    try {
        const tokenIsValid = await axios
            .get(`/api/auth/validate?token=${token}`);
        if (!tokenIsValid.data) {
            return false;
        } else {
            // Change userStatus in AuthContext if unauthorized
            if (userStatus === 'unauthorized') {
                dispatch({type: 'login'});

            }
            return true;
        }
        } catch (error) {
        console.error("An error occured: ", error);
        throw error;
     }
}