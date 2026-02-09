import { createApiProxy, createBaseApi } from "@/service/api/BaseServiceApi";
import { RTKTagsConstant } from "@/utils/constant/RTKTagsConstant";
import {
    NinValidationRequest,
    NOKValidationRequest,
    UserValidationRequest,
    LoginResponse,
} from "@/types/api";

const kycTag = Object.values(RTKTagsConstant.KYC_TAGS);

const api = createBaseApi("api/kyc-service", kycTag).injectEndpoints({
    endpoints: (build) => ({
        validateNin: build.mutation<LoginResponse, NinValidationRequest>({
            query: (arg) => ({
                url: "kyc/nin/validate",
                method: "POST",
                body: arg,
            }),
        }),
        validateNok: build.mutation<LoginResponse, NOKValidationRequest>({
            query: (arg) => ({
                url: "kyc/nok/validate",
                method: "POST",
                body: arg,
            }),
        }),
        validateUserDetails: build.mutation<LoginResponse, UserValidationRequest>({
            query: (arg) => ({
                url: "kyc/user/validate",
                method: "POST",
                body: arg,
            }),
        }),
    }),
    overrideExisting: false,
});

export const kycServiceApi = createApiProxy(api);
