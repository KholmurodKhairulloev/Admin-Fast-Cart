import { createSlice } from "@reduxjs/toolkit";
import { getBrands } from "../../apis/producsApi";


export const brandSlice=createSlice({
    name:"brands",
    initialState:{
        data:[]
    },reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getBrands.fulfilled,(state,action)=>{
            state.data=action.payload
        })
    }
})


export default brandSlice.reducer