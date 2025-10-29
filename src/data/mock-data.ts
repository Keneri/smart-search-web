import { Account, Transaction, Customer, ISODateString } from '../types/financial.types';

//data is ai generated
export const mockAccounts: Account[] = [
  {
    id: 'acc-001',
    accountNumber: '1234567890',
    accountHolder: 'John Smith',
    balance: 5420.50,
    type: 'checking'
  },
  {
    id: 'acc-002',
    accountNumber: '2345678901',
    accountHolder: 'Sarah Johnson',
    balance: 12350.75,
    type: 'savings'
  },
  {
    id: 'acc-003',
    accountNumber: '3456789012',
    accountHolder: 'Michael Brown',
    balance: -850.25,
    type: 'credit'
  },
  {
    id: 'acc-004',
    accountNumber: '4567890123',
    accountHolder: 'Emily Davis',
    balance: 8900.00,
    type: 'checking'
  },
  {
    id: 'acc-005',
    accountNumber: '5678901234',
    accountHolder: 'David Wilson',
    balance: 25600.40,
    type: 'savings'
  },
  {
    id: 'acc-006',
    accountNumber: '6789012345',
    accountHolder: 'Jennifer Martinez',
    balance: -1200.00,
    type: 'credit'
  },
  {
    id: 'acc-007',
    accountNumber: '7890123456',
    accountHolder: 'Robert Taylor',
    balance: 3250.80,
    type: 'checking'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    amount: 125.50,
    date: '2024-01-15' as ISODateString,
    description: 'Grocery Store Purchase',
    accountId: 'acc-001',
    type: 'debit'
  },
  {
    id: 'txn-002',
    amount: 2500.00,
    date: '2024-01-14' as ISODateString,
    description: 'Salary Deposit',
    accountId: 'acc-001',
    type: 'credit'
  },
  {
    id: 'txn-003',
    amount: 45.99,
    date: '2024-01-13' as ISODateString,
    description: 'Netflix Subscription',
    accountId: 'acc-004',
    type: 'debit'
  },
  {
    id: 'txn-004',
    amount: 1200.00,
    date: '2024-01-12' as ISODateString,
    description: 'Rent Payment',
    accountId: 'acc-002',
    type: 'debit'
  },
  {
    id: 'txn-005',
    amount: 350.25,
    date: '2024-01-11' as ISODateString,
    description: 'Amazon Purchase',
    accountId: 'acc-003',
    type: 'debit'
  },
  {
    id: 'txn-006',
    amount: 75.00,
    date: '2024-01-10' as ISODateString,
    description: 'Gas Station',
    accountId: 'acc-001',
    type: 'debit'
  },
  {
    id: 'txn-007',
    amount: 5000.00,
    date: '2024-01-09' as ISODateString,
    description: 'Investment Transfer',
    accountId: 'acc-005',
    type: 'credit'
  },
  {
    id: 'txn-008',
    amount: 220.00,
    date: '2024-01-08' as ISODateString,
    description: 'Electric Bill Payment',
    accountId: 'acc-004',
    type: 'debit'
  },
  {
    id: 'txn-009',
    amount: 89.99,
    date: '2024-01-07' as ISODateString,
    description: 'Restaurant Dinner',
    accountId: 'acc-001',
    type: 'debit'
  },
  {
    id: 'txn-010',
    amount: 1500.00,
    date: '2024-01-06' as ISODateString,
    description: 'Freelance Payment',
    accountId: 'acc-002',
    type: 'credit'
  },
  {
    id: 'txn-011',
    amount: 450.00,
    date: '2024-01-05' as ISODateString,
    description: 'Car Insurance',
    accountId: 'acc-007',
    type: 'debit'
  },
  {
    id: 'txn-012',
    amount: 32.50,
    date: '2024-01-04' as ISODateString,
    description: 'Coffee Shop',
    accountId: 'acc-004',
    type: 'debit'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    customerId: 'CUST-10001'
  },
  {
    id: 'cust-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 234-5678',
    customerId: 'CUST-10002'
  },
  {
    id: 'cust-003',
    name: 'Michael Brown',
    email: 'mbrown@email.com',
    phone: '(555) 345-6789',
    customerId: 'CUST-10003'
  },
  {
    id: 'cust-004',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '(555) 456-7890',
    customerId: 'CUST-10004'
  },
  {
    id: 'cust-005',
    name: 'David Wilson',
    email: 'dwilson@email.com',
    phone: '(555) 567-8901',
    customerId: 'CUST-10005'
  },
  {
    id: 'cust-006',
    name: 'Jennifer Martinez',
    email: 'jmartinez@email.com',
    phone: '(555) 678-9012',
    customerId: 'CUST-10006'
  },
  {
    id: 'cust-007',
    name: 'Robert Taylor',
    email: 'robert.t@email.com',
    phone: '(555) 789-0123',
    customerId: 'CUST-10007'
  }
];
