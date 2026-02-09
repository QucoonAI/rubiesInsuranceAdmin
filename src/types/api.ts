// ============================================================
// Base
// ============================================================
export interface BaseResponse {
  responseCode: string;
  responseMessage: string;
  details?: {
    validation_errors: ValidationError[];
  };
}

export interface ValidationError {
  message: string;
  field?: string;
  code?: string;
}

// ============================================================
// Authentication
// ============================================================
export interface LoginRequest {
  userEmail?: string;
  userPassword?: string;
  deviceId?: string;
  latitude?: string;
  longitude?: string;
}

export interface LoginResponse {
  responseCode?: string;
  responseMessage?: string;
  token?: string;
  userId?: number;
  userEmail?: string;
  userFirstName?: string;
  userLastName?: string;
  userNumber?: string;
  userGender?: string;
  userAddress?: string;
  userStatus?: string;
  userType?: string;
  userRoleId?: number;
  userCreatedAt?: string;
  userUpdatedAt?: string;
  userDetailsProvided?: boolean;
  ninVerified?: boolean;
  nextOfKinVerified?: boolean;
  privileges: string[];
}

export interface ChangePasswordRequest {
  username?: string;
  oldPassword?: string;
  userPassword: string;
}

export interface InitiateEnrollmentRequest {
  userEmail?: string;
  userFirstName?: string;
  userLastName?: string;
  userNumber?: string;
}

export interface CompleteEnrollmentRequest {
  userEmail?: string;
  userPassword?: string;
  otp?: string;
}

export interface InitiatePasswordResetRequest {
  userEmail?: string;
}

export interface CompletePasswordResetRequest {
  userEmail?: string;
  userPassword?: string;
  otp?: string;
}

// ============================================================
// Dashboard
// ============================================================
export interface DashboardDataCoverage {
  totalCoverage: number;
  shieldCoverage: number;
  travelCoverage: number;
  vehicleCoverage: number;
  creditLifeCoverage: number;
  eduCareCoverage: number;
  tenantCoverage: number;
}

export interface DashboardResponseData {
  activePlanCount: number;
  claimCount: number;
  activePolicies: string[];
  coverage: DashboardDataCoverage;
}

export interface DashboardResponse extends BaseResponse {
  data: DashboardResponseData;
}

// ============================================================
// Claims
// ============================================================
export interface ApiClaim {
  claimId?: number;
  claimSubscriptionId?: number;
  claimSubscriptionName?: string;
  claimUserId?: number;
  claimAmount?: number;
  claimStatus?: string;
  claimCreatedAt?: string;
  claimUpdatedAt?: string;
}

export interface ClaimReadListResponse extends BaseResponse {
  data: ApiClaim[];
}

// ============================================================
// Subscriptions
// ============================================================
export interface ApiSubscription {
  subscriptionId?: number;
  subscriptionPolicyId?: number;
  subscriptionPolicyName?: string;
  subscriptionUserId?: number;
  subscriptionStatus?: string;
  subscriptionPaymentAmount?: number;
  subscriptionAssuredSum?: number;
  subscriptionContributionFrequency?: string;
  subscriptionInsuranceDuration?: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  subscriptionCreatedAt?: string;
  subscriptionUpdatedAt?: string;
  subscriptionExtraData?: string;
  subscriptionToBeRenewed: boolean;
  nextPaymentDate?: string;
  daysBetweenPayments?: number;
  totalCoverage?: number;
}

export interface SubscriptionReadListResponse extends BaseResponse {
  data: ApiSubscription[];
}

// ============================================================
// Payments
// ============================================================
export interface PaymentAccount {
  id?: number;
  userId: number;
  accountName?: string;
  accountNumber: string;
  bankCode?: string;
  isPrimary: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentAccountResponse extends BaseResponse {
  data: PaymentAccount[];
}

export interface AddPaymentAccountRequest {
  accountName: string;
  accountNumber: string;
  bankCode: string;
}

export interface AccountNameEnquiryRequest {
  accountNumber: string;
  bankCode: string;
}

export interface AccountNameEnquiryResponse {
  accountName?: string;
  accountNumber?: string;
  bankCode?: string;
  bankName?: string;
  bvn?: string;
  kyc?: string;
  responseCode?: string;
  responseMessage?: string;
  sessionId?: string;
}

export interface BankListResponseData {
  bankCode?: string;
  bankName?: string;
  bankShortName?: string;
  bankLogoUrl?: string;
  code?: string;
  name?: string;
}

export interface BankListResponse extends BaseResponse {
  data: BankListResponseData[];
}

export interface VirtualAccountGenerationRequest {
  accountName?: string;
  accountNumber?: string;
  bankCode?: string;
  paymentAmount?: string;
  assuredSum?: string;
  contributionFrequency?: string;
  insuranceDuration?: string;
  daysBeforeNextPayment?: number;
  daysBeforeSubscriptionEnds?: number;
  s3Url?: string;
  data?: object;
}

export interface VirtualAccountGenerationResponse {
  accountName: string;
  accountNumber: string;
  reference: string;
  responseCode: string;
  responseMessage: string;
}

// ============================================================
// KYC
// ============================================================
export interface NinValidationRequest {
  nin: string;
}

export interface NOKValidationRequest {
  firstName: string;
  lastName: string;
  emailAddress?: string;
  phoneNumber?: string;
}

export interface UserValidationRequest {
  gender: string;
  dateOfBirth: string;
  homeAddress?: string;
}

// ============================================================
// Policy
// ============================================================
export interface TravelDetails {
  distance: number;
  price: number;
}

export interface TravelDetailsResponse extends BaseResponse {
  data: TravelDetails;
}
