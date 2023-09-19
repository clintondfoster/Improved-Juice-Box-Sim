import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const storeApi = createApi({
    tagTypes:['tag'],
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8081/'}),
    endpoints: (builder) => ({


    }),
})