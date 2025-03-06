import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/axiosRequest";

export const getProducts=createAsyncThunk('product/getProducts?PageSize=10000',
async ()=>{
    try {
        let {data}=await axiosRequest.get(`/Product/get-products?PageSize=10000 `)
        return data?.data?.products
    } catch (error) {
        console.error(error);
    }
}
)

export const getProductById=createAsyncThunk('product/getProductsById',
async (id)=>{
    try {
        let {data}=await axiosRequest.get(`/Product/get-product-by-id?id=${id}`)
        return data.data
    } catch (error) {
        console.error(error);
    }
}
)

export const deleteProduct = createAsyncThunk('product/deleteProduct',
async (id,{dispatch})=>{
    try {
        await axiosRequest.delete(`/Product/delete-product?id=${id}`)
        dispatch(getProducts())
    } catch (error) {
        console.error(error);
    }
}
)

export const addProduct =createAsyncThunk('product/addProduct',
async (newProduct,{dispatch})=>{
    try {
        await axiosRequest.post("/Product/add-product", newProduct)
        dispatch(getProducts())
    } catch (error) {
        console.error(error);
    }
}
)


export const updateProduct =createAsyncThunk('product/updateProduct',
async (formData,{dispatch})=>{
    try {
        await axiosRequest.put("/Product/update-product",formData)
        dispatch(getProducts())
    } catch (error) {
        console.error(error);
    }
}
)

export const getBrands =createAsyncThunk('brands/getBrands',
async ()=>{
    try {
        const {data}=await axiosRequest.get(`/Brand/get-brands`)
        return data.data
    } catch (error) {
        console.error(error);
    }
}
)

export const getColors =createAsyncThunk('colors/getColors',
async ()=>{
    try {
        const {data}=await axiosRequest.get(`/Color/get-colors`)
        return data.data
    } catch (error) {
        console.error(error);
    }
}
)

export const addColor = createAsyncThunk('colors/addColor',
async (color,{dispatch})=>{
    try {
        await axiosRequest.post(`/Color/add-color?ColorName=${color}`)
        dispatch(getColors())
    } catch (error) {
        console.error(error);
    }
}
)


export const addProductImg=createAsyncThunk('product/addProductImg',
async (newImg,{dispatch})=>{
    try {
        await axiosRequest.post("/Product/add-image-to-product",newImg)
        dispatch(getProducts())
    } catch (error) {
        console.error(error);
    }
}
)

export const  deleteProductImg = createAsyncThunk('product/deleteProductImg',
async (id,{dispatch})=>{
    try {
        await axiosRequest.delete(`/Product/delete-image-from-product?imageId=${id}`)
    } catch (error) {
        console.error(error);
    }
}
)
