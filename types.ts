
export interface UserProfile {
  fullName: string;
  phone: string;
  age: number;
  job: string;
  monthlyIncome: number;
  location: string;
  maritalStatus: string;
  bankName?: string;
  bankAccountNumber?: string;
  idFront?: string; // Base64 image
  idBack?: string;  // Base64 image
  portrait?: string; // Base64 image
}

export interface LoanRequest {
  amount: number;
  termDays: number;
  interestRate: number; // monthly or daily
  serviceFee: number;
}

export interface CreditScoreResult {
  credit_score: number;
  risk_level: 'low' | 'medium' | 'high';
  decision: 'approved' | 'rejected' | 'pending';
  reason: string;
}

export interface LoanRecord {
  id: string;
  amount: number;
  status: 'processing' | 'approved' | 'rejected' | 'disbursed' | 'completed';
  date: string;
  score?: number;
}
