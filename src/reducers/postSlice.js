import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSlice } from "@reduxjs/toolkit";

//Define a service with endpoints
export const postApi = createApi({
    reducerPath: "postApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:8081/',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) =>  ({
    //Post endpoints
        getPosts: builder.query({  
            query: () => 'api/posts',
        }),
        getPostById: builder.query({
            query: (id) => 'api/posts/'+id,
        }),
        createPost: builder.mutation({
            query: (body) => ({
                url: 'api/posts',
                method: 'POST',
                body,
            }),
        }),
        updatePost: builder.mutation({
            query: (data) => {
                const {id, ...body} = data;
                return {
                    url: 'api/posts/'+id,
                method: 'PUT',
                body,
                }
            },
        }),
        deletePost: builder.mutation({
            query: (id) => ({
                url: 'api/posts/'+id,
                method: 'DELETE',
            }),
        }),
    }),
});

const dataSlice = createSlice({
    name: "data",
    initialState: {
        posts: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(postApi.endpoints.getPosts.matchFulfilled, (state, {payload})=>{
            return{
                ...state,
                posts: payload
            }
        })
        builder.addMatcher(postApi.endpoints.deletePost.matchFulfilled, (state, {payload}) => {
            return {
                ...state,
                posts: state.posts.filter(i=>i.id !== payload.id)
            }
        })
        builder.addMatcher(postApu.endpoints.createPost.matchFulfilled, (state, {payload})=> {
            state.posts.push(payload);
            return state;
        })
    }
})


export const {
    useGetPostsQuery,
    useGetPostbyIdQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postApi;

export default dataSlice.reducer;