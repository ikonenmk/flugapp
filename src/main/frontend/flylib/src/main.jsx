import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import PageRoutes from "./common/pageRoutes.jsx";
import {AuthProvider} from "./contexts/authContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <PageRoutes />
        </AuthProvider>
    </React.StrictMode>
);

