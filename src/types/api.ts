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

export interface AdminLoginRequest {
  email: string;
  password: string;
  otp?: string;
  latitude?: string;
  longitude?: string;
}

export interface AdminInviteRequest {
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminPhoneNumber: string;
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

export type CoverageData = DashboardDataCoverage;

export interface AdminDashboardResponseData {
  activePlanCount: number;
  claimCount: number;
  activePolicies: number;
  coverage: CoverageData;
}

export interface AdminDashboardResponse extends BaseResponse {
  data: AdminDashboardResponseData;
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

export interface GetClaimsResponse extends BaseResponse {
  data: ApiClaim[];
  totalSize: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  settledCount: number;
}

export interface ClaimToggleRequest {
  action: 'APPROVED' | 'REJECTED' | 'SETTLED';
  recipientAccountName?: string;
  recipientAccountNumber?: string;
  recipientBankCode?: string;
  recipientBankName?: string;
}

export interface ClaimDocument {
  id: number;
  claimId: number;
  userId: number;
  documentS3Key: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetClaimDocumentsResponse extends BaseResponse {
  data: ClaimDocument[];
}

export interface GetClaimDocumentResponse extends BaseResponse {
  data: string;
}

export interface GetClaimResponse extends BaseResponse {
  data: ApiClaim;
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
  subscriptionPremiums?: string;
  subscriptionToBeRenewed: boolean;
  nextPaymentDate?: string;
  daysBetweenPayments?: number;
  totalCoverage?: number;
}

export interface SubscriptionReadListResponse extends BaseResponse {
  data: ApiSubscription[];
}

export interface GetSubscriptionsResponse extends BaseResponse {
  data: ApiSubscription[];
  totalSize: number;
}

export interface GetSubscriptionResponse extends BaseResponse {
  data: ApiSubscription;
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

// ============================================================
// Admin Notifications
// ============================================================
export interface NotifyRequest {
  subject: string;
  message: string;
  userId?: string;
}

// ============================================================
// Admin Shared
// ============================================================
export interface AdminListParams {
  page?: string;
  size?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// ============================================================
// Customers (Admin)
// ============================================================
export interface ApiUser {
  userId: number;
  userCode?: string;
  userEmail?: string;
  userFirstName?: string;
  userLastName?: string;
  userNumber?: string;
  userGender?: string;
  userAddress?: string;
  userDateOfBirth?: string;
  userOccupation?: string;
  userStatus?: string;
  userType?: string;
  userRoleId?: number;
  userNin?: string;
  userCreatedAt?: string;
  userUpdatedAt?: string;
  userDetailsProvided: boolean;
  ninVerified: boolean;
  nextOfKinVerified: boolean;
  userNextOfKinName?: string;
  userNextOfKinNumber?: string;
  userNextOfKinEmail?: string;
  userNextOfKinAddress?: string;
}

export interface GetUsersResponse extends BaseResponse {
  data: ApiUser[];
  totalSize: number;
}

export interface GetUserResponse extends BaseResponse {
  data: ApiUser;
}
