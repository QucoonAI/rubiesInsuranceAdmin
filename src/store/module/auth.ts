import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { LoginResponse } from "@/types/api";
import { authServiceApi } from "@/service/api/AuthServiceApi";

export type AuthState = {
    loading: boolean;
    token: string;
    loginDetails: LoginResponse;
    payload: any;
};

const initialState: AuthState = {
    loading: false,
    loginDetails: {} as LoginResponse,
    token: "",
    payload: {},
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset() {
            return initialState;
        },
        setPayload(state, action) {
            state.payload = action.payload;
        },
    },
    extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
        builder
            .addMatcher(
                authServiceApi.endpoints.login.matchFulfilled,
                (state, action) => {
                    state.loginDetails = action.payload;
                    state.token = action.payload.token || "";
                }
            )
            .addMatcher(
                authServiceApi.endpoints.adminLogin.matchFulfilled,
                (state, action) => {
                    state.loginDetails = action.payload;
                    state.token = action.payload.token || "";
                }
            );
    },
});

export const auth = {
    reducer: slice.reducer,
    mutation: slice.actions,
};
