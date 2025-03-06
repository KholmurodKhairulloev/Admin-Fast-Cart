

import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/axiosRequest";


export const getCategories = createAsyncThunk('category/getCategories?PageSize=10000',
    async () => {
        try {
            let { data } = await axiosRequest.get("/Category/get-categories")
            return data.data
        } catch (error) {
            console.error(error);
        }
    }
)

export const addCategory = createAsyncThunk('category/addCategory',
    async (formData, { dispatch }) => {
        try {
            await axiosRequest.post(`/Category/add-category`, formData)
            dispatch(getCategories())
        } catch (error) {
            console.error(error);
        }
    }
)

export const deleteCategory = createAsyncThunk('category/deleteCategory',
    async (id, { dispatch }) => {
        try {
            await axiosRequest.delete(`/Category/delete-category?id=${id}`)
            dispatch(getCategories())
        } catch (error) {
            console.error(error);
        }
    }
)

export const editCategory = createAsyncThunk('category/editCategory',
    async (formData, { dispatch }) => {
        try {
            await axiosRequest.put(`/Category/update-category`, formData)
            dispatch(getCategories())
        } catch (error) {
            console.error(error);
        }
    }
)

export const getSubCategories = createAsyncThunk('category/getSubCategories',
    async () => {
        try {
            let { data } = await axiosRequest.get("/SubCategory/get-sub-category")
            return data.data
        } catch (error) {
            console.error(error);
        }
    }
)


