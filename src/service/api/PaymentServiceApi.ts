import { createApiProxy, createBaseApi } from "@/service/api/BaseServiceApi";
import { RTKTagsConstant } from "@/utils/constant/RTKTagsConstant";
import {
    PaymentAccountResponse,
    AddPaymentAccountRequest,
    BankListResponse,
    AccountNameEnquiryRequest,
    AccountNameEnquiryResponse,
    VirtualAccountGenerationRequest,
    VirtualAccountGenerationResponse,
    BaseResponse,
} from "@/types/api";

const paymentTag = Object.values(RTKTagsConstant.PAYMENT_TAGS);

const api = createBaseApi("api/payment-service", paymentTag).injectEndpoints({
    endpoints: (build) => ({
        getPaymentAccounts: build.query<PaymentAccountResponse, void>({
            query: () => ({
                url: "payment/accounts",
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.PAYMENT_TAGS.ACCOUNTS],
        }),
        addPaymentAccount: build.mutation<BaseResponse, AddPaymentAccountRequest>({
            query: (arg) => ({
                url: "payment/accounts",
                method: "POST",
                body: arg,
            }),
            invalidatesTags: [RTKTagsConstant.PAYMENT_TAGS.ACCOUNTS],
        }),
        getBanks: build.query<BankListResponse, void>({
            query: () => ({
                url: "payment/banks",
                method: "GET",
            }),
            providesTags: [RTKTagsConstant.PAYMENT_TAGS.BANKS],
        }),
        nameEnquiry: build.query<AccountNameEnquiryResponse, AccountNameEnquiryRequest>({
            query: (params) => ({
                url: "payment/account/enquiry",
                method: "GET",
                body: params,
            }),
        }),
        confirmPayment: build.mutation<BaseResponse, { reference: string }>({
            query: (params) => ({
                url: `payment/confirm/${params.reference}`,
                method: "POST",
            }),
        }),
        generateVirtualAccount: build.mutation<VirtualAccountGenerationResponse, { policyName: string; body: VirtualAccountGenerationRequest }>({
            query: (params) => ({
                url: `payment/generate?policyName=${params.policyName}`,
                method: "POST",
                body: params.body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const paymentServiceApi = createApiProxy(api);
