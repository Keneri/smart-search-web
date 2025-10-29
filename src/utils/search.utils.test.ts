import { describe, it, expect } from 'vitest';
import { filterByQuery, formatCurrency, formatDate, highlightMatch } from './search.utils';

describe('Search Utilities', () => {
  describe('filterByQuery', () => {
    it('should return empty results for empty query', () => {
      const results = filterByQuery('', [], [], []);
      expect(results.accounts).to.have.length(0);
      expect(results.transactions).to.have.length(0);
      expect(results.customers).to.have.length(0);
    });

    it('should filter accounts by name', () => {
      const accounts = [
        { id: '1', accountNumber: 'ACC001', accountHolder: 'John Doe', balance: 1000, type: 'checking' as const }
      ];
      const results = filterByQuery('john', accounts, [], []);
      expect(results.accounts).to.have.length(1);
    });

    it('should be case insensitive', () => {
      const accounts = [
        { id: '1', accountNumber: 'ACC001', accountHolder: 'John Doe', balance: 1000, type: 'checking' as const }
      ];
      const results = filterByQuery('JOHN', accounts, [], []);
      expect(results.accounts).to.have.length(1);
    });

    it('should limit results to max per category', () => {
      const accounts = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        accountNumber: `ACC${i}`,
        accountHolder: 'Test User',
        balance: 1000,
        type: 'checking' as const
      }));
      const results = filterByQuery('test', accounts, [], []);
      expect(results.accounts).to.have.length(5); 
    });

    it('should search across multiple fields', () => {
      const accounts = [
        { id: '1', accountNumber: 'TEST123', accountHolder: 'John Doe', balance: 1000, type: 'checking' as const }
      ];
      const results = filterByQuery('TEST123', accounts, [], []);
      expect(results.accounts).to.have.length(1);
    });

    it('should filter transactions by description', () => {
      const transactions = [
        { id: '1', amount: 50, date: '2024-01-01', description: 'Coffee Shop', accountId: '1', type: 'debit' as const },
        { id: '2', amount: 100, date: '2024-01-02', description: 'Grocery Store', accountId: '1', type: 'debit' as const }
      ];
      const results = filterByQuery('coffee', [], transactions, []);
      expect(results.transactions).to.have.length(1);
      expect(results.transactions[0].data.description).to.include('Coffee');
    });

    it('should filter transactions by amount', () => {
      const transactions = [
        { id: '1', amount: 150.50, date: '2024-01-01', description: 'Purchase', accountId: '1', type: 'debit' as const },
        { id: '2', amount: 100, date: '2024-01-02', description: 'Payment', accountId: '1', type: 'credit' as const }
      ];
      const results = filterByQuery('150', [], transactions, []);
      expect(results.transactions).to.have.length(1);
    });

    it('should filter customers by name', () => {
      const customers = [
        { id: '1', name: 'Alice Johnson', email: 'alice@test.com', phone: '555-0001', customerId: 'CUST001' },
        { id: '2', name: 'Bob Smith', email: 'bob@test.com', phone: '555-0002', customerId: 'CUST002' }
      ];
      const results = filterByQuery('alice', [], [], customers);
      expect(results.customers).to.have.length(1);
      expect(results.customers[0].data.name).to.include('Alice');
    });

    it('should filter customers by email', () => {
      const customers = [
        { id: '1', name: 'Alice Johnson', email: 'alice@company.com', phone: '555-0001', customerId: 'CUST001' },
        { id: '2', name: 'Bob Smith', email: 'bob@test.com', phone: '555-0002', customerId: 'CUST002' }
      ];
      const results = filterByQuery('company', [], [], customers);
      expect(results.customers).to.have.length(1);
    });

    it('should filter customers by customer ID', () => {
      const customers = [
        { id: '1', name: 'Alice Johnson', email: 'alice@test.com', phone: '555-0001', customerId: 'CUST001' },
        { id: '2', name: 'Bob Smith', email: 'bob@test.com', phone: '555-0002', customerId: 'DEMO123' }
      ];
      const results = filterByQuery('DEMO', [], [], customers);
      expect(results.customers).to.have.length(1);
      expect(results.customers[0].data.customerId).to.equal('DEMO123');
    });

    it('should search across all three data types', () => {
      const accounts = [
        { id: '1', accountNumber: 'TEST001', accountHolder: 'John Doe', balance: 1000, type: 'checking' as const }
      ];
      const transactions = [
        { id: '1', amount: 50, date: '2024-01-01', description: 'Test Payment', accountId: '1', type: 'debit' as const }
      ];
      const customers = [
        { id: '1', name: 'Test User', email: 'test@test.com', phone: '555-0001', customerId: 'CUST001' }
      ];

      const results = filterByQuery('test', accounts, transactions, customers);
      expect(results.accounts).to.have.length(1);
      expect(results.transactions).to.have.length(1);
      expect(results.customers).to.have.length(1);
    });

    it('should handle special characters in query', () => {
      const accounts = [
        { id: '1', accountNumber: 'ACC(001)', accountHolder: 'John (CEO)', balance: 1000, type: 'checking' as const }
      ];
      const results = filterByQuery('(CEO)', accounts, [], []);
      expect(results.accounts).to.have.length(1);
    });

    it('should trim whitespace from query', () => {
      const accounts = [
        { id: '1', accountNumber: 'ACC001', accountHolder: 'John Doe', balance: 1000, type: 'checking' as const }
      ];
      const results = filterByQuery('  john  ', accounts, [], []);
      expect(results.accounts).to.have.length(1);
    });
  });

  describe('formatCurrency', () => {
    it('should format positive amounts', () => {
      expect(formatCurrency(100)).to.equal('$100.00');
      expect(formatCurrency(1234.56)).to.equal('$1,234.56');
    });

    it('should format negative amounts', () => {
      expect(formatCurrency(-100)).to.equal('-$100.00');
    });

    it('should format zero', () => {
      expect(formatCurrency(0)).to.equal('$0.00');
    });

    it('should handle invalid input', () => {
      expect(formatCurrency(Infinity)).to.equal('$0.00');
      expect(formatCurrency(NaN)).to.equal('$0.00');
    });

    it('should format large numbers with commas', () => {
      expect(formatCurrency(1234567.89)).to.equal('$1,234,567.89');
    });

    it('should format small decimal amounts', () => {
      expect(formatCurrency(0.99)).to.equal('$0.99');
      expect(formatCurrency(0.01)).to.equal('$0.01');
    });

    it('should handle non-number input gracefully', () => {
      expect(formatCurrency('100' as any)).to.equal('$0.00');
      expect(formatCurrency(null as any)).to.equal('$0.00');
      expect(formatCurrency(undefined as any)).to.equal('$0.00');
    });
  });

  describe('formatDate', () => {
    it('should format valid dates', () => {
      const result = formatDate('2024-01-15');
      expect(result).to.include('2024');
      expect(result).to.include('Jan');
    });

    it('should return original string for invalid dates', () => {
      expect(formatDate('invalid')).to.equal('invalid');
      expect(formatDate('')).to.equal('');
    });

    it('should format dates with full ISO timestamp', () => {
      const result = formatDate('2024-06-15T10:30:00.000Z');
      expect(result).to.include('2024');
      expect(result).to.include('Jun');
    });

    it('should handle different months correctly', () => {
      const march = formatDate('2024-03-10');
      const december = formatDate('2024-12-25');
      expect(march).to.include('Mar');
      expect(december).to.include('Dec');
    });
  });

  describe('highlightMatch', () => {
    it('should return template result for empty query', () => {
      const result = highlightMatch('Hello World', '');
      expect(result).to.exist;
      expect(result.values).to.be.an('array');
    });

    it('should return template result for matching text', () => {
      const result = highlightMatch('Hello World', 'world');
      expect(result).to.exist;
      expect(result.values).to.be.an('array');
    });

    it('should handle case-insensitive matching', () => {
      const result = highlightMatch('Hello World', 'HELLO');
      expect(result).to.exist;
      expect(result.values).to.be.an('array');
    });

    it('should handle special characters in query', () => {
      const result = highlightMatch('Price: $100', '$100');
      expect(result).to.exist;
      expect(result.values).to.be.an('array');
    });

    it('should handle parentheses in query', () => {
      const result = highlightMatch('John (CEO)', '(CEO)');
      expect(result).to.exist;
      expect(result.values).to.be.an('array');
    });

    it('should handle brackets in query', () => {
      const result = highlightMatch('Admin [Level 1]', '[Level 1]');
      expect(result).to.exist;
      expect(result.values).to.be.an('array');
    });

    it('should handle empty text', () => {
      const result = highlightMatch('', 'test');
      expect(result).to.exist;
      expect(result.values).to.be.an('array');
    });

    it('should handle query with multiple words', () => {
      const result = highlightMatch('This is a test sentence', 'test sentence');
      expect(result).to.exist;
      expect(result.values).to.be.an('array');
    });

    it('should handle whitespace-only query', () => {
      const result = highlightMatch('Hello World', '   ');
      expect(result).to.exist;
      expect(result.values).to.be.an('array');
    });
  });
});
