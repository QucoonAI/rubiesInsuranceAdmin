import { createApiProxy, createBaseApi } from "@/service/api/BaseServiceApi";
import { RTKTagsConstant } from "@/utils/constant/RTKTagsConstant";
import { ClaimReadListResponse, BaseResponse } from "@/types/api";

const claimTag = Object.values(RTKTagsConstant.CLAIM_TAGS);

const api = createBaseApi("api/claim-service", claimTag).injectEndpoints({
    endpoints: (build) => ({
        getClaims: build.query<ClaimReadListResponse, void>({
            query: () => ({
                url: "claims",
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.CLAIM_TAGS.LIST],
        }),
        createClaim: build.mutation<BaseResponse, { subscriptionId: number }>({
            query: (params) => ({
                url: `claims?subscriptionId=${params.subscriptionId}`,
                method: "POST",
            }),
            invalidatesTags: [RTKTagsConstant.CLAIM_TAGS.LIST],
        }),
    }),
    overrideExisting: false,
});

export const claimServiceApi = createApiProxy(api);
