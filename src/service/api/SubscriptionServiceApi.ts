import { createApiProxy, createBaseApi } from "@/service/api/BaseServiceApi";
import { RTKTagsConstant } from "@/utils/constant/RTKTagsConstant";
import { SubscriptionReadListResponse, VirtualAccountGenerationResponse } from "@/types/api";

const subscriptionTag = Object.values(RTKTagsConstant.SUBSCRIPTION_TAGS);

const api = createBaseApi("api/subscription-service", subscriptionTag).injectEndpoints({
    endpoints: (build) => ({
        getSubscriptions: build.query<SubscriptionReadListResponse, { policyName?: string } | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params && params.policyName) {
                    queryParams.append('policyName', params.policyName);
                }
                const qs = queryParams.toString();
                return {
                    url: `subscriptions${qs ? `?${qs}` : ''}`,
                    method: "GET",
                };
            },
            providesTags: [RTKTagsConstant.SUBSCRIPTION_TAGS.LIST],
        }),
        renewSubscription: build.query<VirtualAccountGenerationResponse, { subscriptionId: number }>({
            query: (params) => ({
                url: `subscriptions/${params.subscriptionId}/renew`,
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.SUBSCRIPTION_TAGS.DETAIL],
        }),
    }),
    overrideExisting: false,
});

export const subscriptionServiceApi = createApiProxy(api);
