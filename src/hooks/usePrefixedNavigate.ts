import {useRoutePrefix} from "./useRoutePrefix";
import {useNavigate} from "react-router-dom";

export const usePrefixedNavigate = () => {
    const {prefix} = useRoutePrefix()
    const navigate = useNavigate()
    
    return (to: string, options?: { replace?: boolean; state?: any }) => {
        let finalPath = to;

        if (prefix) {
            finalPath = `/${prefix}${to.startsWith('/') ? to : `/${to}`}`;
        }

        navigate(finalPath, options);
    };
}