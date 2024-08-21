import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IAuthUser } from "../components/pages/Login/Login";

const useAuthData = () => {
    const getToken = useAuthHeader();
    const authUser = useAuthUser<IAuthUser>();

    return { getToken, authUser };
};

export default useAuthData;