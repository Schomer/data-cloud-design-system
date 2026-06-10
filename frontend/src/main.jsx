import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { AuthProvider } from './context/AuthContext';
import { EditorProvider } from './context/EditorContext';
import { ChartColorProvider } from './context/ChartColorContext';

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <EditorProvider>
                <ChartColorProvider>
                    <App />
                </ChartColorProvider>
            </EditorProvider>
        </AuthProvider>
    </React.StrictMode>,
)
