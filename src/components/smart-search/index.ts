import { LitElement, html, unsafeCSS, svg, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Account, Transaction, Customer, SearchResult } from '../../types/financial.types';
import { filterByQuery, highlightMatch, formatCurrency, formatDate } from '../../utils/search.utils';
import styleSheet from './index.css';

@customElement('smart-search')
export class SmartSearch extends LitElement {
  static styles = unsafeCSS(styleSheet);

  private readonly DEBOUNCE_DELAY = 150;
  private readonly BLUR_DELAY = 200;

  @property({
    type: Array,
    hasChanged(newVal: unknown, oldVal: unknown) {
      return Array.isArray(newVal) && newVal !== oldVal;
    }
  })
  accounts: Account[] = [];

  @property({
    type: Array,
    hasChanged(newVal: unknown, oldVal: unknown) {
      return Array.isArray(newVal) && newVal !== oldVal;
    }
  })
  transactions: Transaction[] = [];

  @property({
    type: Array,
    hasChanged(newVal: unknown, oldVal: unknown) {
      return Array.isArray(newVal) && newVal !== oldVal;
    }
  })
  customers: Customer[] = [];

  @property({ type: String })
  placeholder = 'Search accounts, transactions, or customers...';

  @state()
  private query = '';

  @state()
  private isOpen = false;

  @state()
  private selectedIndex = -1;

  @state()
  private filteredResults: {
    accounts: SearchResult[];
    transactions: SearchResult[];
    customers: SearchResult[];
  } = { accounts: [], transactions: [], customers: [] };

  private inputTimeout?: number;
  private resultIndexMap = new WeakMap<SearchResult, number>();

  private renderSearchIcon() {
    return svg`<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>`;
  }

  private renderCloseIcon() {
    return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`;
  }

  private renderAccountIcon() {
    return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
      <line x1="2" y1="10" x2="22" y2="10"></line>
    </svg>`;
  }

  private renderTransactionIcon() {
    return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <polyline points="17 5 12 1 7 5"></polyline>
      <polyline points="7 19 12 23 17 19"></polyline>
    </svg>`;
  }

  private renderCustomerIcon() {
    return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>`;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.inputTimeout) {
      clearTimeout(this.inputTimeout);
    }
  }

  render() {
    const totalResults =
      this.filteredResults.accounts.length +
      this.filteredResults.transactions.length +
      this.filteredResults.customers.length;

    return html`
      <div class="search-container">
        <!-- Screen reader announcements -->
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          class="sr-only"
        >
          ${totalResults > 0
            ? `${totalResults} result${totalResults === 1 ? '' : 's'} found`
            : this.query ? 'No results found' : nothing}
        </div>

        <div class="search-input-wrapper">
          ${this.renderSearchIcon()}
          <input
            type="text"
            class="search-input"
            placeholder="${this.placeholder}"
            .value="${this.query}"
            @input="${this.handleInput}"
            @focus="${this.handleFocus}"
            @blur="${this.handleBlur}"
            @keydown="${this.handleKeydown}"
            role="combobox"
            aria-expanded="${this.isOpen}"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant="${this.selectedIndex >= 0 ? `result-${this.selectedIndex}` : ''}"
            aria-label="Search for accounts, transactions, or customers"
          />
          ${this.query
            ? html`
                <button
                  class="clear-button"
                  @click="${this.handleClear}"
                  aria-label="Clear search"
                >
                  ${this.renderCloseIcon()}
                </button>
              `
            : nothing}
        </div>

        ${this.isOpen && this.query
          ? html`
              <div class="dropdown-panel" id="search-results" role="listbox">
                ${totalResults === 0
                  ? html`
                      <div class="no-results">
                        <p>No results found for "${this.query}"</p>
                      </div>
                    `
                  : html`
                      ${this.renderResultGroup(
                        'Accounts',
                        this.filteredResults.accounts
                      )}
                      ${this.renderResultGroup(
                        'Transactions',
                        this.filteredResults.transactions
                      )}
                      ${this.renderResultGroup(
                        'Customers',
                        this.filteredResults.customers
                      )}
                    `}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private renderResultGroup(
    title: string,
    results: SearchResult[]
  ) {
    if (results.length === 0) return nothing;

    return html`
      <div class="result-group">
        <div class="group-header">${title}</div>
        ${results.map((result) => this.renderResultItem(result))}
      </div>
    `;
  }

  private renderResultItem(result: SearchResult) {
    const globalIndex = this.getGlobalIndex(result);
    const isSelected = globalIndex === this.selectedIndex;

    return html`
      <div
        id="result-${globalIndex}"
        class="result-item ${isSelected ? 'selected' : ''}"
        role="option"
        tabindex="-1"
        aria-selected="${isSelected}"
        @click="${() => this.handleSelect(result)}"
        @mouseenter="${() => this.handleMouseEnter(globalIndex)}"
      >
        ${this.renderResultContent(result)}
      </div>
    `;
  }

  private renderResultContent(result: SearchResult) {
    switch (result.type) {
      case 'account':
        return html`
          <div class="result-icon account-icon">
            ${this.renderAccountIcon()}
          </div>
          <div class="result-content">
            <div class="result-title">
              ${highlightMatch(result.data.accountHolder, this.query)}
            </div>
            <div class="result-subtitle">
              ${highlightMatch(result.data.accountNumber, this.query)} •
              ${result.data.type} • ${formatCurrency(result.data.balance)}
            </div>
          </div>
        `;
      case 'transaction':
        return html`
          <div class="result-icon transaction-icon">
            ${this.renderTransactionIcon()}
          </div>
          <div class="result-content">
            <div class="result-title">
              ${highlightMatch(result.data.description, this.query)}
            </div>
            <div class="result-subtitle">
              ${formatCurrency(result.data.amount)} • ${formatDate(result.data.date)} •
              ${result.data.type}
            </div>
          </div>
        `;
      case 'customer':
        return html`
          <div class="result-icon customer-icon">
            ${this.renderCustomerIcon()}
          </div>
          <div class="result-content">
            <div class="result-title">
              ${highlightMatch(result.data.name, this.query)}
            </div>
            <div class="result-subtitle">
              ${highlightMatch(result.data.email, this.query)} •
              ${highlightMatch(result.data.customerId, this.query)}
            </div>
          </div>
        `;
    }
  }

  private handleInput(e: Event) {
    if (!(e.target instanceof HTMLInputElement)) return;

    const input = e.target;
    this.query = input.value;

    clearTimeout(this.inputTimeout);
    this.inputTimeout = window.setTimeout(() => {
      this.performSearch();
    }, this.DEBOUNCE_DELAY);
  }

  private handleFocus() {
    if (this.query) {
      this.isOpen = true;
    }
  }

  private handleBlur() {
    setTimeout(() => {
      this.isOpen = false;
      this.selectedIndex = -1;
    }, this.BLUR_DELAY);
  }

  private handleClear() {
    this.query = '';
    this.filteredResults = { accounts: [], transactions: [], customers: [] };
    this.isOpen = false;
    this.selectedIndex = -1;
  }

  private handleKeydown(e: KeyboardEvent) {
    if (!this.isOpen && e.key === 'ArrowDown') {
      e.preventDefault();
      this.isOpen = true;
      this.selectedIndex = 0;
      this.scrollSelectedIntoView();
      return;
    }

    if (!this.isOpen) return;

    const totalResults =
      this.filteredResults.accounts.length +
      this.filteredResults.transactions.length +
      this.filteredResults.customers.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, totalResults - 1);
        this.scrollSelectedIntoView();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.scrollSelectedIntoView();
        break;
      case 'Enter':
        e.preventDefault();
        if (this.selectedIndex >= 0) {
          const result = this.getResultByIndex(this.selectedIndex);
          if (result) {
            this.handleSelect(result);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.isOpen = false;
        this.selectedIndex = -1;
        break;
    }
  }

  private scrollSelectedIntoView() {
    this.updateComplete.then(() => {
      const selectedEl = this.shadowRoot?.querySelector('.result-item.selected');
      if (selectedEl instanceof HTMLElement) {
        selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  private handleMouseEnter(index: number) {
    this.selectedIndex = index;
  }

  private handleSelect(result: SearchResult) {
    this.dispatchEvent(
      new CustomEvent('search-select', {
        detail: result,
        bubbles: true,
        composed: true
      })
    );

    this.isOpen = false;
    this.selectedIndex = -1;
  }

  private performSearch() {
    this.filteredResults = filterByQuery(
      this.query,
      this.accounts,
      this.transactions,
      this.customers
    );

    this.isOpen = this.query.length > 0;
    this.selectedIndex = -1;
    this.updateResultIndices();
  }

  private updateResultIndices() {
    this.resultIndexMap = new WeakMap();
    let index = 0;

    for (const result of [
      ...this.filteredResults.accounts,
      ...this.filteredResults.transactions,
      ...this.filteredResults.customers
    ]) {
      this.resultIndexMap.set(result, index++);
    }
  }

  private getGlobalIndex(result: SearchResult): number {
    return this.resultIndexMap.get(result) ?? -1;
  }

  private getResultByIndex(index: number): SearchResult | null {
    const allResults = [
      ...this.filteredResults.accounts,
      ...this.filteredResults.transactions,
      ...this.filteredResults.customers
    ];

    return allResults[index] || null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'smart-search': SmartSearch;
  }
}
