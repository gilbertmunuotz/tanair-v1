import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../library/store";
import { UserInfo } from "../interfaces/interface";


const initialState = {
    isAuthenticated: false,
    user: null,
    role: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.role = action.payload.role;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.role = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

// Selector functions to access user information
export const isAuthenticated = (state: RootState) => state.auth.isAuthenticated; // Check Auth State Selector
export const users = (state: RootState): UserInfo | null => state.auth.user;  // Get User Info Selector
export const selectUserRole = (state: RootState) => state.auth.role; // Get User Role

export default authSlice.reducer;