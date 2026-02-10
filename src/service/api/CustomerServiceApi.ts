import { createApiProxy, createBaseApi } from "@/service/api/BaseServiceApi";
import { RTKTagsConstant } from "@/utils/constant/RTKTagsConstant";
import { GetUsersResponse, GetUserResponse, AdminListParams, NotifyRequest, BaseResponse } from "@/types/api";

const customerTag = Object.values(RTKTagsConstant.CUSTOMER_TAGS);

const api = createBaseApi("api/customer-service", customerTag).injectEndpoints({
    endpoints: (build) => ({
        getCustomers: build.query<GetUsersResponse, AdminListParams | void>({
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
                    url: `admin/customers${qs ? `?${qs}` : ''}`,
                    method: "GET",
                };
            },
            providesTags: [RTKTagsConstant.CUSTOMER_TAGS.LIST],
        }),
        getCustomer: build.query<GetUserResponse, number>({
            query: (customerId) => ({
                url: `admin/customers/${customerId}`,
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.CUSTOMER_TAGS.DETAIL],
        }),
        sendNotification: build.mutation<BaseResponse, NotifyRequest>({
            query: (body) => ({
                url: "admin/notify",
                method: "POST",
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const customerServiceApi = createApiProxy(api);
