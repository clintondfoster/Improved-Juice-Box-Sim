import { configureStore } from "@reduxjs/toolkit";
import { postApi } from "./reducers/postSlice";

const store = configureStore({
    reducer: {
        [postApi.reducerPath]: postApi.reducer,
        auth: authReducer,
        data: dataReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(postApi.middleware),
});

export default store;
