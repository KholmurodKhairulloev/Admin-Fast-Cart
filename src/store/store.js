import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import brandSlice from "../features/brands/brandSlice";
import categorySlice from "../features/categories/categorySlice";
import colorSlice from "../features/colors/colorSlice";
import productSlice from "../features/products/productSlice";


export const store = configureStore({
    reducer:{
        product:productSlice,
        category:categorySlice,
        auth:authSlice,
        brands:brandSlice,
        colors:colorSlice   
    }
})