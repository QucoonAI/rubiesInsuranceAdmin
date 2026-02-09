import { createApiProxy, createBaseApi } from "@/service/api/BaseServiceApi";
import { RTKTagsConstant } from "@/utils/constant/RTKTagsConstant";
import {
    LoginRequest,
    LoginResponse,
    ChangePasswordRequest,
    InitiateEnrollmentRequest,
    CompleteEnrollmentRequest,
    InitiatePasswordResetRequest,
    CompletePasswordResetRequest,
    BaseResponse,
} from "@/types/api";

const authTag = Object.values(RTKTagsConstant.AUTHENTICATION_TAGS);

const api = createBaseApi("api/auth-service", authTag).injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<LoginResponse, LoginRequest>({
            query: (arg: LoginRequest) => ({
                url: "authentication/login",
                method: "POST",
                body: arg,
            }),
        }),
        getUserDetails: build.query<LoginResponse, void>({
            query: () => ({
                url: "authentication/me",
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.AUTHENTICATION_TAGS.DETAIL],
        }),
        initiateEnrollment: build.mutation<BaseResponse, InitiateEnrollmentRequest>({
            query: (arg) => ({
                url: "authentication/initiate-enrollment",
                method: "POST",
                body: arg,
            }),
        }),
        completeEnrollment: build.mutation<LoginResponse, CompleteEnrollmentRequest>({
            query: (arg) => ({
                url: "authentication/complete-enrollment",
                method: "POST",
                body: arg,
            }),
        }),
        changePassword: build.mutation<BaseResponse, ChangePasswordRequest>({
            query: (arg) => ({
                url: "authentication/change-password",
                method: "POST",
                body: arg,
            }),
        }),
        initiatePasswordReset: build.mutation<BaseResponse, InitiatePasswordResetRequest>({
            query: (arg) => ({
                url: "authentication/initiate-password-reset",
                method: "POST",
                body: arg,
            }),
        }),
        completePasswordReset: build.mutation<BaseResponse, CompletePasswordResetRequest>({
            query: (arg) => ({
                url: "authentication/complete-password-reset",
                method: "POST",
                body: arg,
            }),
        }),
        resendOtp: build.mutation<BaseResponse, InitiatePasswordResetRequest>({
            query: (arg) => ({
                url: "authentication/resend-otp",
                method: "POST",
                body: arg,
            }),
        }),
    }),
    overrideExisting: false,
});

export const authServiceApi = createApiProxy(api);
