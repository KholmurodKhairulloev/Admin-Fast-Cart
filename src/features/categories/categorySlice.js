import { createSlice } from "@reduxjs/toolkit";
import { getCategories, getSubCategories } from "../../apis/categoryApi";


export const categorySlice=createSlice({
    name:"category",
    initialState:{
        data:[],
        subData:[]
    },reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getCategories.fulfilled,(state,action)=>{
            state.data=action.payload
        })
        .addCase(getSubCategories.fulfilled,(state,action)=>{
            state.subData=action.payload
        })
    }
})


export default categorySlice.reducer