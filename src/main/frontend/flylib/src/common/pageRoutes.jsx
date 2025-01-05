import {createBrowserRouter, redirect, RouterProvider, useNavigate} from "react-router-dom";
import '../index.css'
import Home from "../home/home.jsx";
import Error from "../common/error.jsx";
import Login from "../login/login.jsx"
import PersonalLibrary from "../library/personalLibrary.jsx";
import Register from "../register/register.jsx";
import CreatePattern from "../create/createPattern.jsx";
import NavBarWrapper from "../common/NavBarWrapper.jsx";
import Cookies from "js-cookie";
import {CheckJwt} from "../utils/checkJwt.jsx";
import {useAuth, useAuthDispatch} from "../contexts/authContext.jsx";
import Pattern from "../pattern/pattern.jsx";
import User from "../user/user.jsx";
import About from "../about/about.jsx";
import ForgotPassword from "./forgotPassword/forgotPassword.jsx";
import Restore from "./forgotPassword/restore.jsx";
export default function PageRoutes() {
    // Read from auth context
    const userStatus = useAuth();
    const dispatch = useAuthDispatch();
    // Routes
    const router = createBrowserRouter([
        {
            path: "/",
            element: <NavBarWrapper />,
            errorElement: <Error />,
            children: [
                {
                    path: "/",
                    element: <Home />,
                    errorElement: <Error />,

                },
                {
                    path:"/forgotpassword",
                    element: <ForgotPassword />,
                    errorElement: <Error />,
                },{
                    path:"/restore/:restoretoken",
                    element: <Restore />,
                    errorElement: <Error />,
                },
                {
                    path:"/about",
                    element: <About />,
                    errorElement: <Error />,
                },
                {
                    path:"/login",
                    element: <Login />,
                    errorElement: <Error />,
                },
                {
                    path: "/library",
                    loader: () => checkToken(dispatch),
                    element: <PersonalLibrary />,
                    errorElement: <Error />,
                },
                {
                    path: "/register",
                    element: <Register />,
                    errorElement: <Error />,
                },
                {
                    path: "/create",
                    loader: () => checkToken(dispatch),
                    element: <CreatePattern />,
                    errorElement: <Error />,
                },
                {
                    path: "/user/:username",
                    loader: () => checkToken(dispatch),
                    element: <User />,
                    errorElement: <Error />,
                },
                {
                    path: "/pattern/:patternId",
                    element: <Pattern />,
                    errorElement: <Error />,
                }

            ]
        }

    ]);

    // Loader function that checks if JWT is valid before accessing route
    async function checkToken (dispatch) {
        const token = Cookies.get("token");
        if (token) {
            try {
                const tokenIsValid = await CheckJwt(token, dispatch, userStatus);
                if (!tokenIsValid) {
                    return redirect("/login");
                }
                return null;

            } catch (error) {
                console.error("An error occured: ", error);
                throw error;
            }
        } else {
            return redirect("/login");
        }

    }


    return (
                <RouterProvider router={router}>
                </RouterProvider>
    );


}