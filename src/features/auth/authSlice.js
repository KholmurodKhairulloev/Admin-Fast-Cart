import { createSlice } from "@reduxjs/toolkit";
import { loginAdmin } from "../../apis/authApi";


export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: []
    }, reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.data = action.payload
            })
    }
})

// const { loginAdmin } = authSlice.actions


export default authSlice.reducer