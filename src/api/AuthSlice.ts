import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { SERVER_URI } from "../config/constant";
import { LoginUserInfo, LoginResponse } from "../interfaces/interface";

const baseQuery = fetchBaseQuery({
    baseUrl: `${SERVER_URI}/v1/auth`,
    credentials: 'include',
});

export const authSlice = createApi({
    reducerPath: "authAPI",
    tagTypes: ['Auth'],
    baseQuery,

    endpoints: (build) => ({

        login: build.mutation<LoginResponse, LoginUserInfo>({
            query: (credentials) => ({
                url: `/login`,
                method: 'POST',
                body: credentials,
            })
        }),

        logout: build.mutation<void, void>({
            query: () => ({
                url: `/logout`,
                method: 'DELETE',
            }),
        }),

    })
})

export const { useLoginMutation, useLogoutMutation } = authSlice;