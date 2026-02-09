import { createApiProxy, createBaseApi } from "@/service/api/BaseServiceApi";
import { RTKTagsConstant } from "@/utils/constant/RTKTagsConstant";
import { AdminDashboardResponse } from "@/types/api";

const dashboardTag = Object.values(RTKTagsConstant.DASHBOARD_TAGS);

const api = createBaseApi("api/dashboard-service", dashboardTag).injectEndpoints({
    endpoints: (build) => ({
        getDashboard: build.query<AdminDashboardResponse, void>({
            query: () => ({
                url: "admin/dashboard",
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.DASHBOARD_TAGS.OVERVIEW],
        }),
    }),
    overrideExisting: false,
});

export const dashboardServiceApi = createApiProxy(api);
