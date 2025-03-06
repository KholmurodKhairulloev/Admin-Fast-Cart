import { createSlice } from "@reduxjs/toolkit";
import { getColors } from "../../apis/producsApi";


export const colorSlice=createSlice({
    name:"colors",
    initialState:{
        data:[]
    },reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getColors.fulfilled,(state,action)=>{
            state.data=action.payload
        })
    }
})


export default colorSlice.reducer