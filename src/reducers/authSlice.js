import { createSlice } from "@reduxjs/toolkit";
import { postApi } from './api';


const CREDENTIALS = "credentials";


const authApi = postApi.injectEndpoints({
    endpoints: (builder) => ({
        me: builder.query({ 
            query: () => "auth/me",
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: 'auth/login',
                method: "POST",
                body: credentials,
            })
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: "auth/register",
                method: "POST",
                body: credentials,
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: "auth/logout",
                method: "POST",
            }),
        })
    })
})


function storeToken(state, { payload }) {
    state.credentials = { token: payload.token, user: { ...payload.user }};
    window.sessionStorage.setItem(
        CREDENTIALS,
        JSON.stringify({
            token: payload.token,
            user: { ...payload.user },
        })
    )
}

const initialState = {
    credentials: JSON.parse(window.sessionStorage.getItem(CREDENTIALS)) || {
        token: "",
        user: {userId: null},
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(authApi.endpoints.login.matchFulfilled, storeToken);
        builder.addMatcher(authApi.endpoints.register.matchFulfilled, storeToken);
        builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
            console.log("logout")
            state.credentials = {
                token: '',
                user: { userId: null },
            };
            window.sessionStorage.removeItem(CREDENTIALS)
        })
    }
})

export default authSlice.reducer;

export const {
    useMeQuery,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
 } = authApi;