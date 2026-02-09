
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  policyType: string;
  renewalDate: string;
  status: 'Active' | 'Inactive' | 'Pending';
  maturityDate?: string;
}

export interface Subscription {
  policyId: string;
  customerId: string;
  customerName: string;
  planName: string;
  premium: number;
  startDate: string;
  status: string;
  certificateUrl: string;
}

export interface Payment {
  id: string;
  policyId: string;
  amount: number;
  date: string;
  method: string;
  category: 'Life' | 'Health' | 'Savings' | 'Property';
  status: 'Success' | 'Pending' | 'Failed';
}

export interface Claim {
  id: string;
  policyId: string;
  customerName: string;
  amount: number;
  status: 'Reported' | 'Registered' | 'Rejected' | 'Outstanding' | 'Settled';
  dateReported: string;
  docs: string[];
  description: string;
}
