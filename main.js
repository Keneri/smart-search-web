import { html, render } from 'lit';
import { mockAccounts, mockTransactions, mockCustomers } from './src/data/mock-data.ts';
import './src/components/smart-search/index.ts';
import './src/components/theme-toggle/index.ts';

const dropdown = document.getElementById('searchDropdown');
const selectionDisplay = document.getElementById('selectionDisplay');
const selectionContent = document.getElementById('selectionContent');

dropdown.accounts = mockAccounts;
dropdown.transactions = mockTransactions;
dropdown.customers = mockCustomers;

dropdown.addEventListener('search-select', (event) => {
  const { type, data } = event.detail;

  selectionDisplay.style.display = 'block';

  const template = html`
    <p><strong>Type:</strong> ${type}</p>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  `;
  render(template, selectionContent);

  console.log('Selected:', type, data);
});
