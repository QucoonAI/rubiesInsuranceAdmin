import { createApiProxy, createBaseApi } from "@/service/api/BaseServiceApi";
import { RTKTagsConstant } from "@/utils/constant/RTKTagsConstant";
import { GetSubscriptionsResponse, GetSubscriptionResponse, AdminListParams } from "@/types/api";

const subscriptionTag = Object.values(RTKTagsConstant.SUBSCRIPTION_TAGS);

const api = createBaseApi("api/subscription-service", subscriptionTag).injectEndpoints({
    endpoints: (build) => ({
        getSubscriptions: build.query<GetSubscriptionsResponse, AdminListParams | void>({
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
                    url: `admin/subscriptions${qs ? `?${qs}` : ''}`,
                    method: "GET",
                };
            },
            providesTags: [RTKTagsConstant.SUBSCRIPTION_TAGS.LIST],
        }),
        getSubscription: build.query<GetSubscriptionResponse, number>({
            query: (subscriptionId) => ({
                url: `admin/subscriptions/${subscriptionId}`,
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.SUBSCRIPTION_TAGS.DETAIL],
        }),
        actOnSubscriptionCancellation: build.query<GetSubscriptionResponse, number>({
            query: (subscriptionId) => ({
                url: `admin/subscriptions/${subscriptionId}/cancellation`,
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.SUBSCRIPTION_TAGS.DETAIL],
        }),
    }),
    overrideExisting: false,
});

export const subscriptionServiceApi = createApiProxy(api);
