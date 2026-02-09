import { createApiProxy, createBaseApi } from "@/service/api/BaseServiceApi";
import { RTKTagsConstant } from "@/utils/constant/RTKTagsConstant";
import { TravelDetailsResponse } from "@/types/api";

const policyTag = Object.values(RTKTagsConstant.POLICY_TAGS);

const api = createBaseApi("api/policy-service", policyTag).injectEndpoints({
    endpoints: (build) => ({
        getTravelDetails: build.query<TravelDetailsResponse, { origin?: string; destination?: string }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.origin) queryParams.append('origin', params.origin);
                if (params.destination) queryParams.append('destination', params.destination);
                const qs = queryParams.toString();
                return {
                    url: `policy/travel/details${qs ? `?${qs}` : ''}`,
                    method: "GET",
                };
            },
            providesTags: [RTKTagsConstant.POLICY_TAGS.TRAVEL],
        }),
    }),
    overrideExisting: false,
});

export const policyServiceApi = createApiProxy(api);
