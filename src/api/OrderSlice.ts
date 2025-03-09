import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { SERVER_URI } from "../config/constant";
import { Order, OrderResponse } from "../interfaces/interface";
import { RootState } from "../library/store";

const baseQuery = fetchBaseQuery({
    baseUrl: `${SERVER_URI}/v1/orders`,
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

export const orderSlice = createApi({
    reducerPath: "orderAPI",
    tagTypes: ['Order'],
    baseQuery,

    endpoints: (build) => ({

        createOrder: build.mutation<void, Order>({
            query: (credentials) => ({
                url: `/new`,
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Order']
        }),

        getAllOrders: build.query<OrderResponse, string>({
            query: (_id) => ({
                url: `/all/${_id}`,
                method: 'GET'
            }),
            providesTags: ['Order']
        }),

        getAdminOrders: build.query<OrderResponse, void>({
            query: () => ({
                url: `/all`,
                method: 'GET'
            }),
            providesTags: ['Order']
        }),

        getSingleOrder: build.mutation<Order, string>({
            query: (_id) => ({
                url: `/order/${_id}`,
                method: 'GET',
            }),
            invalidatesTags: ['Order']
        }),

        updateOrder: build.mutation<void, { id: string, orderData: Order }>({
            query: ({ id, orderData }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: orderData,
            }),
            invalidatesTags: ['Order'],
        }),

        deleteOrders: build.mutation<void, string>({
            query: (_id) => ({
                url: `/delete/${_id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Order']
        })
    })
})

export const { useCreateOrderMutation, useGetAllOrdersQuery,
    useGetAdminOrdersQuery, useDeleteOrdersMutation,
    useGetSingleOrderMutation, useUpdateOrderMutation
} = orderSlice;
