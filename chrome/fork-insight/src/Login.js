import {React} from "react";
import { useAuth } from "./AuthContext"; 

const Login = () => {
    const {login} = useAuth();
    function onClickLogin() {
        const client_id = '8a79ee6701d1e06c6c58';
        let authURL = `https://github.com/login/oauth/authorize?scope=user:email&scope=repo&client_id=${client_id}`;
        chrome.identity.launchWebAuthFlow({
            url: authURL,
            interactive: true
        }, function(redirectURL) {
            // return url should be in the form of https://<chrome-extension-id>.chromiumapp.org/<base64-encoded-userinfo-json>
            let url = new URL(redirectURL);
            let userInfo = JSON.parse(atob(url.pathname.slice(1)));
            if (userInfo) {
                login(userInfo);
            }
        });
    }

    return (
        <>
            <a onClick={onClickLogin}>
                Login 
            </a>
        </>
    );
};

export default Login;
