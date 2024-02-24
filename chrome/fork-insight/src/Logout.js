import React from "react";
import { useAuth } from "./AuthContext";



const Logout = () => {
    const {logout} = useAuth();
    function onClickLogout() {
        logout();
    }

    return (
        <>
            <a onClick={onClickLogout}>
                Logout 
            </a>
        </>
    );
};

export default Logout;
