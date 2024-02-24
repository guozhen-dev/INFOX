import RealApp from "./RealApp";
import { AuthProvider } from "./AuthContext";
import { React } from "react";

function App() {
    return (
        <AuthProvider>
            <RealApp />
        </AuthProvider>
    );
}   

export default App;