import { describe, it, expect, beforeEach } from 'vitest';
import { html, render } from 'lit';
import type { ThemeToggle } from './index';
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

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  describe('Component Rendering', () => {
    it('should render the component', async () => {
      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      expect(el).to.exist;
      expect(el.shadowRoot).to.exist;
    });

    it('should render toggle button', async () => {
      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button).to.exist;
    });

    it('should have aria-label', async () => {
      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      const button = el.shadowRoot!.querySelector('button');
      expect(button?.getAttribute('aria-label')).to.include('Toggle');
    });

    it('should render sun and moon icons', async () => {
      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      const sunIcon = el.shadowRoot!.querySelector('.sun-icon');
      const moonIcon = el.shadowRoot!.querySelector('.moon-icon');
      expect(sunIcon).to.exist;
      expect(moonIcon).to.exist;
    });

    it('should apply theme to body', async () => {
      await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      const hasTheme = document.body.classList.contains('light-theme') ||
                      document.body.classList.contains('dark-theme');
      expect(hasTheme).to.be.true;
    });
  });

  describe('User Interactions', () => {
    it('should toggle theme on click', async () => {
      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;

      const initialTheme = document.body.className;
      button.click();
      await el.updateComplete;

      const newTheme = document.body.className;
      expect(newTheme).to.not.equal(initialTheme);
    });

    it('should toggle between themes', async () => {
      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;

      button.click();
      await el.updateComplete;
      const firstClick = document.body.classList.contains('dark-theme') ||
                        document.body.classList.contains('light-theme');

      button.click();
      await el.updateComplete;
      const secondClick = document.body.classList.contains('dark-theme') ||
                        document.body.classList.contains('light-theme');  

      expect(firstClick).to.be.true;
      expect(secondClick).to.be.true;
    });

    it('should update aria-pressed', async () => {
      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;

      const initialPressed = button.getAttribute('aria-pressed');
      button.click();
      await el.updateComplete;

      const newPressed = button.getAttribute('aria-pressed');
      expect(newPressed).to.not.equal(initialPressed);
    });
  });

  describe('localStorage Integration', () => {
    it('should save theme to localStorage', async () => {
      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;

      button.click();
      await el.updateComplete;

      const savedTheme = localStorage.getItem('theme-preference');
      expect(savedTheme).to.be.oneOf(['light', 'dark']);
    });

    it('should load saved theme', async () => {
      localStorage.setItem('theme-preference', 'dark');

      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      await el.updateComplete;

      expect(document.body.classList.contains('dark-theme')).to.be.true;
    });

    it('should respect light theme', async () => {
      localStorage.setItem('theme-preference', 'light');

      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      await el.updateComplete;

      expect(document.body.classList.contains('light-theme')).to.be.true;
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid localStorage value', async () => {
      localStorage.setItem('theme-preference', 'invalid');

      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      await el.updateComplete;

      const hasValidTheme = document.body.classList.contains('light-theme') ||
                          document.body.classList.contains('dark-theme');
      expect(hasValidTheme).to.be.true;
    });

    it('should handle rapid clicking', async () => {
      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;

      button.click();
      button.click();
      button.click();
      await el.updateComplete;

      const hasValidTheme = document.body.classList.contains('light-theme') ||
                          document.body.classList.contains('dark-theme');
      expect(hasValidTheme).to.be.true;
    });

    it('should maintain only one theme class', async () => {
      const el = await fixture<ThemeToggle>(html`<theme-toggle></theme-toggle>`);
      const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;

      button.click();
      await el.updateComplete;

      const hasBothThemes = document.body.classList.contains('light-theme') &&
                          document.body.classList.contains('dark-theme');
      expect(hasBothThemes).to.be.false;
    });
  });
});
