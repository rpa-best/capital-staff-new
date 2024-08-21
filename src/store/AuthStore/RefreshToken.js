import createRefresh from 'react-auth-kit/createRefresh';
import axios from "axios";

export const refresh = createRefresh({
    interval: 10,
    refreshApiCallback: async (param) => {
        try {
            const data = { refresh: param.refresh };
            console.log(param.refresh)

            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/oauth/refresh-token/`, data);

            return {
                isSuccess: true,
                newAuthToken: response.data.access,
                newRefreshToken: response.data.refresh,
                newAuthTokenExpireIn: 10,
                newRefreshTokenExpiresIn: 60,
            };
        } catch (error) {
            return {
                isSuccess: false
            };
        }
    }
});