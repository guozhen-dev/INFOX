import React from "react";
import { useAuth } from "./AuthContext";



const Logout = () => {
    const {user, logout} = useAuth();
    function onClickLogout() {
        console.log(user);
        logout();
    }

    return (
        <>
            <a onClick={onClickLogout}>
                Logout {user.username} 
            </a>
        </>
    );
};

export default Logout;
