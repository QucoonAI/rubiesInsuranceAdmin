import { createApiProxy, createBaseApi } from "@/service/api/BaseServiceApi";
import { RTKTagsConstant } from "@/utils/constant/RTKTagsConstant";
import { GetClaimsResponse, GetClaimResponse, GetClaimDocumentsResponse, GetClaimDocumentResponse, ClaimToggleRequest, BaseResponse, AdminListParams } from "@/types/api";

const claimTag = Object.values(RTKTagsConstant.CLAIM_TAGS);

const api = createBaseApi("api/claim-service", claimTag).injectEndpoints({
    endpoints: (build) => ({
        getClaims: build.query<GetClaimsResponse, AdminListParams | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    if (params.page) queryParams.append('page', params.page);
                    if (params.size) queryParams.append('size', params.size);
                    if (params.search) queryParams.append('search', params.search);
                    if (params.startDate) queryParams.append('startDate', params.startDate);
                    if (params.endDate) queryParams.append('endDate', params.endDate);
                }
                const qs = queryParams.toString();
                return {
                    url: `admin/claims${qs ? `?${qs}` : ''}`,
                    method: "GET",
                };
            },
            providesTags: [RTKTagsConstant.CLAIM_TAGS.LIST],
        }),
        getClaim: build.query<GetClaimResponse, number>({
            query: (claimId) => ({
                url: `admin/claims/${claimId}`,
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.CLAIM_TAGS.DETAIL],
        }),
        createClaim: build.mutation<BaseResponse, { subscriptionId: number }>({
            query: (params) => ({
                url: `claims?subscriptionId=${params.subscriptionId}`,
                method: "POST",
            }),
            invalidatesTags: [RTKTagsConstant.CLAIM_TAGS.LIST],
        }),
        getClaimDocuments: build.query<GetClaimDocumentsResponse, number>({
            query: (claimId) => ({
                url: `admin/claims/${claimId}/documents`,
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.CLAIM_TAGS.DETAIL],
        }),
        getClaimDocumentUrl: build.query<GetClaimDocumentResponse, { claimId: number; documentId: number }>({
            query: ({ claimId, documentId }) => ({
                url: `admin/claims/${claimId}/documents/${documentId}`,
                method: "GET",
            }),
        }),
        toggleClaimStatus: build.mutation<BaseResponse, { claimId: number } & ClaimToggleRequest>({
            query: ({ claimId, ...body }) => ({
                url: `admin/claims/${claimId}/toggle`,
                method: "POST",
                body,
            }),
            invalidatesTags: [RTKTagsConstant.CLAIM_TAGS.LIST, RTKTagsConstant.CLAIM_TAGS.DETAIL],
        }),
    }),
    overrideExisting: false,
});

export const claimServiceApi = createApiProxy(api);
