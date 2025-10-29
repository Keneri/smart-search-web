import { html, TemplateResult } from 'lit';
import { Account, Transaction, Customer, SearchResult } from '../types/financial.types';

function hasHighPriorityMatch(fields: string[], query: string): boolean {
  const lowerQuery = query.toLowerCase();

  for (const field of fields) {
    const lowerField = field.toLowerCase();
    if (lowerField.startsWith(lowerQuery)) return true;

    const words = lowerField.split(/\s+/);
    for (const word of words) {
      if (word.startsWith(lowerQuery)) return true;
    }
  }

  return false;
}

function matchesQuery(fields: string[], query: string): boolean {
  const lowerQuery = query.toLowerCase();
  const searchable = fields.join(' ').toLowerCase();
  return searchable.includes(lowerQuery);
}

export function filterByQuery(
  query: string,
  accounts: Account[],
  transactions: Transaction[],
  customers: Customer[],
  maxPerCategory: number = 5
): { accounts: SearchResult[]; transactions: SearchResult[]; customers: SearchResult[] } {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return { accounts: [], transactions: [], customers: [] };
  }

  const highPriorityAccounts: SearchResult[] = [];
  const normalAccounts: SearchResult[] = [];

  for (const account of accounts) {
    const fields = [account.accountNumber, account.accountHolder, account.type];
    if (matchesQuery(fields, lowerQuery)) {
      const result = { type: 'account' as const, data: account };
      if (hasHighPriorityMatch(fields, lowerQuery)) {
        highPriorityAccounts.push(result);
      } else {
        normalAccounts.push(result);
      }
    }
  }

  const highPriorityTransactions: SearchResult[] = [];
  const normalTransactions: SearchResult[] = [];

  for (const txn of transactions) {
    const fields = [txn.description, txn.amount.toString(), txn.date, txn.type];
    if (matchesQuery(fields, lowerQuery)) {
      const result = { type: 'transaction' as const, data: txn };
      if (hasHighPriorityMatch(fields, lowerQuery)) {
        highPriorityTransactions.push(result);
      } else {
        normalTransactions.push(result);
      }
    }
  }

  const highPriorityCustomers: SearchResult[] = [];
  const normalCustomers: SearchResult[] = [];

  for (const customer of customers) {
    const fields = [customer.name, customer.email, customer.customerId, customer.phone];
    if (matchesQuery(fields, lowerQuery)) {
      const result = { type: 'customer' as const, data: customer };
      if (hasHighPriorityMatch(fields, lowerQuery)) {
        highPriorityCustomers.push(result);
      } else {
        normalCustomers.push(result);
      }
    }
  }

  return {
    accounts: [...highPriorityAccounts, ...normalAccounts].slice(0, maxPerCategory),
    transactions: [...highPriorityTransactions, ...normalTransactions].slice(0, maxPerCategory),
    customers: [...highPriorityCustomers, ...normalCustomers].slice(0, maxPerCategory)
  };
}

export function highlightMatch(text: string, query: string): TemplateResult {
  if (!query.trim()) return html`${text}`;

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts = text.split(regex);

  return html`${parts.map((part, i) =>
    i % 2 === 0 ? part : html`<mark>${part}</mark>`
  )}`;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function formatCurrency(amount: number): string {
  try {
    if (typeof amount !== 'number' || !isFinite(amount)) {
      console.warn('Invalid amount for currency formatting:', amount);
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `$${amount.toFixed(2)}`;
  }
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return dateString;
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
}
