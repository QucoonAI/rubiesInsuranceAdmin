import { combineReducers } from "redux";
import { auth } from "@/store/module/auth";
import { reducerApi } from "@/service/api";

export const rootReducer = combineReducers({
    auth: auth.reducer,
    ...reducerApi,
});
