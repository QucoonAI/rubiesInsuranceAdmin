import { createApiProxy, createBaseApi } from "@/service/api/BaseServiceApi";
import { RTKTagsConstant } from "@/utils/constant/RTKTagsConstant";
import { GetComplaintsResponse, GetComplaintResponse, ComplaintToggleRequest, BaseResponse, AdminListParams } from "@/types/api";

const complaintTag = Object.values(RTKTagsConstant.COMPLAINT_TAGS);

const api = createBaseApi("api/complaint-service", complaintTag).injectEndpoints({
    endpoints: (build) => ({
        getComplaints: build.query<GetComplaintsResponse, AdminListParams | void>({
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
                    url: `admin/complaints${qs ? `?${qs}` : ''}`,
                    method: "GET",
                };
            },
            providesTags: [RTKTagsConstant.COMPLAINT_TAGS.LIST],
        }),
        getComplaint: build.query<GetComplaintResponse, number>({
            query: (complaintId) => ({
                url: `admin/complaints/${complaintId}`,
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.COMPLAINT_TAGS.DETAIL],
        }),
        toggleComplaintStatus: build.mutation<BaseResponse, { complaintId: number } & ComplaintToggleRequest>({
            query: ({ complaintId, ...body }) => ({
                url: `admin/complaints/${complaintId}/toggle`,
                method: "POST",
                body,
            }),
            invalidatesTags: [RTKTagsConstant.COMPLAINT_TAGS.LIST, RTKTagsConstant.COMPLAINT_TAGS.DETAIL],
        }),
    }),
    overrideExisting: false,
});

export const complaintServiceApi = createApiProxy(api);
