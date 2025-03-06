import { createSlice } from "@reduxjs/toolkit";
import { getProductById, getProducts } from "../../apis/producsApi";


export const productSlice = createSlice({
    name: "product",
    initialState: {
        data: [],
        getById: null,
        editProduct: {
            brandId:null
            
        }
    }, reducers: {
        setEditProduct: (state, action) => {
            console.log(action)
            // state.editProduct.brandId = action.payload.brandId
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.data = action.payload
        })
        builder.addCase(getProductById.fulfilled, (state, action) => {
            state.getById = action.payload
        })
    }
})

export const { setEditProduct } = productSlice.actions

export default productSlice.reducer