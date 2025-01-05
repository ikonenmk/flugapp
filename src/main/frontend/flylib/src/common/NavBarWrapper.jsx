import NavBarTop from "../common/navBarTop.jsx";
import {Outlet} from "react-router-dom";
import CookiesBanner from "./cookiesBanner.jsx";

export default function NavBarWrapper() {


    return (
        <>
            <NavBarTop />
            <Outlet />
            <CookiesBanner />
        </>

    )
}