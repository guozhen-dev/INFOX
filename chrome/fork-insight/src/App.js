import RealApp from "./RealApp";
import { AuthProvider } from "./AuthContext";
import { PageProvider } from "./PageContext";
import { React } from "react";

function App() {
    return (
        <AuthProvider>
            <PageProvider>
                <RealApp />
            </PageProvider>
        </AuthProvider>
    );
}   

export default App;