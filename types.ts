export interface Certificate {
  id: string;
  code: string;
  amount: number;
  recipientName: string;
  managerName: string;
  createdAt: string;
  expiryDate: string;
  status: 'active' | 'redeemed';
}

export type PresetAmount = 500 | 1000 | 2000 | 5000;