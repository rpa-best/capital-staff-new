import createStore from 'react-auth-kit/createStore';
import {refresh} from "./RefreshToken";

export const authStore = createStore({
    authName:'_auth',
    authType:'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: false,
    refresh: refresh
});