import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { SERVER_URI } from "../config/constant";
import { User, UserResponse } from "../interfaces/interface";
import { RootState } from "../library/store";

const baseQuery = fetchBaseQuery({
    baseUrl: `${SERVER_URI}/v1/users`,
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;

        // Add Authorization header with JWT
        const token = state.auth.jwtToken;

        // Add the Authorization header if the token exists
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    },
    credentials: 'include',
});

export const userSlice = createApi({
    reducerPath: "usersAPI",
    tagTypes: ['Users'],
    baseQuery,

    endpoints: (build) => ({

        createUserr: build.mutation<void, User>({
            query: (credentials) => ({
                url: `/new`,
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Users']
        }),

        getAllUsers: build.query<UserResponse, void>({
            query: () => ({
                url: `/all`,
                method: 'GET'
            }),
            providesTags: ['Users']
        }),

        // getSingleUser: build.query<>({
        //     query: () => ({
        //         url: `/user`,
        //         method: 'GET'
        //     }),
        //     providesTags: ['Users']
        // }),

        // updateUser: build.mutation<>({
        //     query: () => ({
        //         url: `/update`,
        //         method: 'PUT'
        //     }),
        //     invalidatesTags: ['Users']
        // }),

        deleteUser: build.mutation<void, string>({
            query: (_id) => ({
                url: `/delete/${_id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Users']
        })

    })
})

export const { useCreateUserrMutation, useGetAllUsersQuery,
    //  useGetSingleUserQuery,
    //   useUpdateUserMutation, 
    useDeleteUserMutation
} = userSlice;