import { createApiProxy, createBaseApi } from "@/service/api/BaseServiceApi";
import { RTKTagsConstant } from "@/utils/constant/RTKTagsConstant";
import { GetPolicyDocumentsResponse, GetPolicyDocumentUrlResponse } from "@/types/api";

const policyDocumentTag = Object.values(RTKTagsConstant.POLICY_DOCUMENT_TAGS);

const api = createBaseApi("api/policy-document-service", policyDocumentTag).injectEndpoints({
    endpoints: (build) => ({
        getPolicyDocuments: build.query<GetPolicyDocumentsResponse, void>({
            query: () => ({
                url: "admin/policy-documents",
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.POLICY_DOCUMENT_TAGS.LIST],
        }),
        getPolicyDocumentUrl: build.query<GetPolicyDocumentUrlResponse, number>({
            query: (policyDocumentId) => ({
                url: `admin/policy-documents/${policyDocumentId}`,
                method: "GET",
            }),
        }),
    }),
    overrideExisting: false,
});

export const policyDocumentServiceApi = createApiProxy(api);
