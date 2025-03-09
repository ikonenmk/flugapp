import {createContext, useContext, useReducer} from "react";

const AuthContext = createContext(null);
const AuthDispatchContext = createContext(null);

export function AuthProvider({children}) {
    // Initial user status
    const initialUserStatus = "unauthorized";
    const [userStatus, dispatch] = useReducer(
        userStatusReducer,
        initialUserStatus
    );

    return (
        <AuthContext.Provider value={userStatus}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthContext.Provider>
    )
}
// Hooks
export function useAuth() {
    return useContext(AuthContext);
}
export function useAuthDispatch() {
    return useContext(AuthDispatchContext);
}

// Reducer function for updating context on login or logout
function userStatusReducer(userStatus, action) {
    switch (action.type) {
        case 'login': {
            return 'authorized';
        }
        case 'logout': {
            return 'unauthorized';
        }
        default: {
            throw Error('Unknown action: ' +action.type);
        }
    }

}
