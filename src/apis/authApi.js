import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/axiosRequest";
import { saveToken } from "../utils/token";


export const loginAdmin =createAsyncThunk( "auth/loginAdmin",
    async (user,nav)=>{

        try {
            const {data} = await axiosRequest.post(`/Account/login`,user)
            saveToken(data?.data)
            nav("/")
        } catch (error) {
            console.error(error);
        }
    }
)