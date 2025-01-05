import {useEffect, useState} from "react";
import SavedPatternsTab from "./savedPatternsTab.jsx";
import CreatedPatternsTab from "./createdPatternsTab.jsx";
import OrdersTabs from "./ordersTab.jsx";
import Cookies from "js-cookie";
import axios from "axios";
import "./personalLibrary.css"
import { useLocation } from "react-router-dom";

export default function PersonalLibrary( ) {
    const location = useLocation();
    // Data for auth
    const token = Cookies.get("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const [username, setUsername] = useState("");
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || "savedPatternTab");

    // Get username from server
    useEffect(() => {
        axios
            .get('/api/auth/username', config)
            .then((response) => {
                setUsername(response.data);
            })
            .catch((error) => {
                console.log('Axios request error: ', error);
            });
    }, []);

    const handleTabClick = (e) => {
        setActiveTab(e.target.dataset.key);
    }

    // Rendering of tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case "savedPatternTab":
                return <SavedPatternsTab username={username}/>;
            case "createdPatternTab":
                return <CreatedPatternsTab username={username}/>;
            case "ordersTab":
                return <OrdersTabs />;
        }
    }

    return(
        <>
            <div className="rubric">
                <h1>Personal Library</h1>
            </div>
            <div className="tab-container">
                <div className="tabs">
                    <button data-key="savedPatternTab" className={`tablinks ${activeTab === "savedPatternTab" ? "active" : ""}`} onClick={handleTabClick}>
                        Saved patterns
                    </button>
                    <button data-key="createdPatternTab" className={`tablinks ${activeTab === "createdPatternTab" ? "active" : ""}`} onClick={handleTabClick}>
                        Created patterns
                    </button>
                </div>
                <div id="tabContent">
                    {renderTabContent()}
                </div>
            </div>

        </>
    );
}