import { authServiceApi } from "@/service/api/AuthServiceApi";
import { dashboardServiceApi } from "@/service/api/DashboardServiceApi";
import { claimServiceApi } from "@/service/api/ClaimServiceApi";
import { subscriptionServiceApi } from "@/service/api/SubscriptionServiceApi";
import { paymentServiceApi } from "@/service/api/PaymentServiceApi";
import { kycServiceApi } from "@/service/api/KycServiceApi";
import { policyServiceApi } from "@/service/api/PolicyServiceApi";
import { customerServiceApi } from "@/service/api/CustomerServiceApi";

export const reducerApi = {
    [authServiceApi.reducerPath]: authServiceApi.reducer,
    [dashboardServiceApi.reducerPath]: dashboardServiceApi.reducer,
    [claimServiceApi.reducerPath]: claimServiceApi.reducer,
    [subscriptionServiceApi.reducerPath]: subscriptionServiceApi.reducer,
    [paymentServiceApi.reducerPath]: paymentServiceApi.reducer,
    [kycServiceApi.reducerPath]: kycServiceApi.reducer,
    [policyServiceApi.reducerPath]: policyServiceApi.reducer,
    [customerServiceApi.reducerPath]: customerServiceApi.reducer,
};

export const middlewareApi = [
    authServiceApi.middleware,
    dashboardServiceApi.middleware,
    claimServiceApi.middleware,
    subscriptionServiceApi.middleware,
    paymentServiceApi.middleware,
    kycServiceApi.middleware,
    policyServiceApi.middleware,
    customerServiceApi.middleware,
];
