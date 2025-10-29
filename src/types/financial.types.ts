export type ISODateString = string & { readonly __brand: 'ISODate' };

export interface Account {
  id: string;
  accountNumber: string;
  accountHolder: string;
  balance: number;
  type: 'checking' | 'savings' | 'credit';
}

export interface Transaction {
  id: string;
  amount: number;
  date: ISODateString;
  description: string;
  accountId: string;
  type: 'debit' | 'credit';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerId: string;
}

export type SearchResult =
  | { type: 'account'; data: Account }
  | { type: 'transaction'; data: Transaction }
  | { type: 'customer'; data: Customer };
