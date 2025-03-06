import axios from 'axios'

export  const axiosRequest = axios.create({
    baseURL:import.meta.env.VITE_API_BASIC,
})

axiosRequest.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("access_token")
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

axiosRequest.interceptors.response.use(
    (response)=>{
        return response
    },
    (error)=>{
        if(error.response && error.response.status==401){
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    }
)