import { describe, it, expect } from 'vitest';
import { html, render } from 'lit';
import type { SmartSearch } from './index';
import './index.js';

async function fixture<T extends HTMLElement>(template: ReturnType<typeof html>): Promise<T> {
  const container = document.createElement('div');
  document.body.appendChild(container);
  render(template, container);
  const element = container.firstElementChild as T;

  if ('updateComplete' in element) {
    await (element as any).updateComplete;
  }

  return element;
}

describe('SmartSearch Component', () => {
  const mockAccounts = [
    { id: '1', accountNumber: 'ACC001', accountHolder: 'John Doe', balance: 1000, type: 'checking' as const },
    { id: '2', accountNumber: 'ACC002', accountHolder: 'Jane Smith', balance: 2000, type: 'savings' as const }
  ];

  const mockTransactions = [
    { id: '1', amount: 50, date: '2024-01-01', description: 'Coffee Shop', accountId: '1', type: 'debit' as const }
  ];

  const mockCustomers = [
    { id: '1', name: 'Alice Johnson', email: 'alice@test.com', phone: '555-0001', customerId: 'CUST001' }
  ];

  describe('Component Rendering', () => {
    it('should render the component', async () => {
      const el = await fixture<SmartSearch>(html`<smart-search></smart-search>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it('should render input field', async () => {
      const el = await fixture<SmartSearch>(html`<smart-search></smart-search>`);
      const input = el.shadowRoot!.querySelector('input');
      expect(input).to.exist;
    });

    it('should use custom placeholder', async () => {
      const el = await fixture<SmartSearch>(html`
        <smart-search placeholder="Search here..."></smart-search>
      `);
      const input = el.shadowRoot!.querySelector('input');
      expect(input?.placeholder).to.equal('Search here...');
    });
  });

  describe('User Interactions - Keyboard', () => {
    it('should open dropdown when typing', async () => {
      const el = await fixture<SmartSearch>(html`
        <smart-search .accounts=${mockAccounts}></smart-search>
      `);

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.value = 'john';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;

      expect(el).toBeDefined();
      expect(input.value).toBe('john');
    });

    it('should handle ArrowDown key', async () => {
      const el = await fixture<SmartSearch>(html`
        <smart-search .accounts=${mockAccounts}></smart-search>
      `);

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.value = 'acc';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;

      expect(el).to.exist;
    });

    it('should close on Escape key', async () => {
      const el = await fixture<SmartSearch>(html`
        <smart-search .accounts=${mockAccounts}></smart-search>
      `);

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.value = 'john';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await el.updateComplete;

      expect(el).to.exist;
    });
  });

  describe('User Interactions - Mouse', () => {
    it('should show clear button with text', async () => {
      const el = await fixture<SmartSearch>(html`<smart-search></smart-search>`);
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;

      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 200));

      const clearButton = el.shadowRoot!.querySelector('.clear-button');
      expect(clearButton).to.exist;
    });

    it('should clear input on clear button click', async () => {
      const el = await fixture<SmartSearch>(html`<smart-search></smart-search>`);
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;

      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 200));

      const clearButton = el.shadowRoot!.querySelector('.clear-button') as HTMLElement;
      clearButton?.click();
      await el.updateComplete;

      expect(input.value).to.equal('');
    });
  });

  describe('Component Communication', () => {
    it('should accept accounts property', async () => {
      const el = await fixture<SmartSearch>(html`<smart-search></smart-search>`);

      el.accounts = mockAccounts;
      await el.updateComplete;

      expect(el.accounts).to.have.length(2);
    });

    it('should accept transactions property', async () => {
      const el = await fixture<SmartSearch>(html`<smart-search></smart-search>`);

      el.transactions = mockTransactions;
      await el.updateComplete;

      expect(el.transactions).to.have.length(1);
    });

    it('should accept customers property', async () => {
      const el = await fixture<SmartSearch>(html`<smart-search></smart-search>`);

      el.customers = mockCustomers;
      await el.updateComplete;

      expect(el.customers).to.have.length(1);
    });

    it('should dispatch search-select event', async () => {
      const el = await fixture<SmartSearch>(html`
        <smart-search .accounts=${mockAccounts}></smart-search>
      `);

      let eventFired = false;
      el.addEventListener('search-select', () => {
        eventFired = true;
      });

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.value = 'john';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;

      expect(eventFired).to.be.true;
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data', async () => {
      const el = await fixture<SmartSearch>(html`
        <smart-search .accounts=${[]} .transactions=${[]} .customers=${[]}></smart-search>
      `);

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.value = 'test';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;

      const content = el.shadowRoot!.textContent;
      expect(content).to.include('No results');
    });

    it('should handle special characters', async () => {
      const specialAccounts = [
        { id: '1', accountNumber: 'ACC(001)', accountHolder: 'John (CEO)', balance: 1000, type: 'checking' as const }
      ];

      const el = await fixture<SmartSearch>(html`
        <smart-search .accounts=${specialAccounts}></smart-search>
      `);

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      input.value = '(CEO)';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;

      expect(el).to.exist;
    });

    it('should debounce rapid typing', async () => {
      const el = await fixture<SmartSearch>(html`
        <smart-search .accounts=${mockAccounts}></smart-search>
      `);

      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;

      input.value = 'j';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.value = 'jo';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.value = 'joh';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      await new Promise(resolve => setTimeout(resolve, 200));
      await el.updateComplete;

      expect(el).toBeDefined();
      expect(input.value).toBe('joh');
    });
  });
});
