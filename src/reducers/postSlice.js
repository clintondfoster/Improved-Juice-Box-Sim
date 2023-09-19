import { createSlice, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postSlice = createApi({
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
            query: (id) => `api/posts/${id}`,
        }),
        createPost: builder.mutation({
            query: (body) => ({
                url: 'api/posts',
                method: 'POST',
                body,
            }),
        }),
        updatePost: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `api/posts/${id}`,
                method: 'PUT',
                body,
            }),
        }),
        deletePost: builder.mutation({
            query: (id) => ({
                url: `api/posts/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});
export const {
    useGetPostsQuery,
    useGetPostbyIdQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postSlice;