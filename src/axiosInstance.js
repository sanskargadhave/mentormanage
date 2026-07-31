import axios from "axios";
import { showToast } from "./utils/showToast";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        
        const token = localStorage.getItem("token");
        if(token) config.headers.Authorization = `Bearer ${token}`;
        
        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) =>{
        
        if (response.data.success === false) {

            showToast.error(response.data.message);

            return Promise.reject({
                response
            });
        }

        return response;
    },
    (error) => {
        

        const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";


        showToast.error(message);

        return Promise.reject(error);
    }
);
export default axiosInstance;