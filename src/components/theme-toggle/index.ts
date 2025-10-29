import { LitElement, html, unsafeCSS, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import styleSheet from './index.css';

const THEME_KEY = 'theme-preference';

@customElement('theme-toggle')
export class ThemeToggle extends LitElement {
  static styles = unsafeCSS(styleSheet);

  @state()
  private isDark = false;

  connectedCallback() {
    super.connectedCallback();
    this.loadTheme();
    this.setupSystemThemeListener();
  }

  private renderSunIcon() {
    return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`;
  }

  private renderMoonIcon() {
    return svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>`;
  }

  render() {
    return html`
      <button
        class="theme-toggle"
        @click="${this.handleToggle}"
        aria-label="Toggle dark mode"
        aria-pressed="${this.isDark}"
      >
        <span class="icon sun-icon" aria-hidden="true">
          ${this.renderSunIcon()}
        </span>
        <span class="icon moon-icon" aria-hidden="true">
          ${this.renderMoonIcon()}
        </span>
      </button>
    `;
  }

  private handleToggle() {
    this.isDark = !this.isDark;
    this.applyTheme(this.isDark ? 'dark' : 'light');
    localStorage.setItem(THEME_KEY, this.isDark ? 'dark' : 'light');
  }

  private loadTheme() {
    const theme = this.getPreferredTheme();
    this.isDark = theme === 'dark';
    this.applyTheme(theme);
  }

  private getPreferredTheme(): 'dark' | 'light' {
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private applyTheme(theme: 'dark' | 'light') {
    if (theme === 'dark') {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  }

  private setupSystemThemeListener() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        this.isDark = e.matches;
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-toggle': ThemeToggle;
  }
}
