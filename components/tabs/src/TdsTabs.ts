import { html, css, LitElement } from 'lit';

const KEYCODE = {
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  HOME: 36,
  END: 35,
};

export class TdsDatepicker extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
    }

    ::slotted(tds-panel) {
      flex-basis: 100%;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  private onSlotChange() {
    this.linkPanels();
  }

  private linkPanels() {
    const tabs = this.allTabs();

    tabs.forEach(tab => {
      const panel = tab.nextElementSibling;

      if (panel?.tagName.toLowerCase() !== 'tds-panel') {
        return;
      }

      tab.setAttribute('aria-controls', panel.id);
      panel?.setAttribute('aria-labelledby', tab.id);
    });

    const selectedTab = tabs.find(tab => tab.selected) || tabs[0];

    this.selectTab(selectedTab);
  }

  private allTabs() {
    return Array.from(this.querySelectorAll('tds-tab'));
  }

  private allPanels() {
    return Array.from(this.querySelectorAll('tds-panel'));
  }

  private selectTab(newTab) {
    const selectedTab = newTab;

    this.reset();

    const newPanel = this.panelForTab(selectedTab);

    if (!newPanel) {
      throw new Error(`No panel with id ${selectedTab.id}`);
    }

    selectedTab.selected = true;
    newPanel.hidden = false;
    selectedTab.focus();
    this.setAttribute('aria-labelledby', selectedTab.id);
  }

  private panelForTab(tab) {
    const panelId = tab.getAttribute('aria-controls');

    return this.querySelector(`#${panelId}`);
  }

  private previousTab() {}

  private nextTab() {
    const tabs = this.allTabs();
    const newIndex = tabs.findIndex(tab => tab.selected) + 1;

    return tabs[newIndex % tabs.length];
  }

  private firstTab() {
    const tabs = this.allTabs();
    return tabs[0];
  }

  private lastTab() {
    const tabs = this.allTabs();
    return tabs[tabs - length - 1];
  }

  private reset() {
    const tabs = this.allTabs();
    const panels = this.allPanels();

    tabs.forEach(tab => {
      const currentTab = tab;
      currentTab.selected = false;

      return currentTab;
    });

    panels.forEach(panel => {
      const currentPanel = panel;

      currentPanel.hidden = true;

      return currentPanel;
    });
  }

  onKeyDown(event: Event) {
    let newTab;

    if (event.target.getAttribute('role') !== 'tab') {
      return;
    }

    if (event.altKey) {
      return;
    }

    if (this.vertical) {
      switch (event.keyCode) {
        case KEYCODE.LEFT:
        case KEYCODE.UP:
          newTab = this.previousTab();
          break;
        case KEYCODE.RIGHT:
        case KEYCODE.DOWN:
          newTab = this.nextTab();
          break;
        case KEYCODE.HOME:
          newTab = this.firstTab();
          break;
        case KEYCODE.END:
          newTab = this.lastTab();
          break;
        default:
          return;
          break;
      }
    } else {
      switch (event.keyCode) {
        case KEYCODE.LEFT:
          newTab = this.previousTab();
          break;
        case KEYCODE.RIGHT:
          newTab = this.nextTab();
          break;
        case KEYCODE.HOME:
          newTab = this.firstTab();
          break;
        case KEYCODE.END:
          newTab = this.lastTab();
          break;
        default:
          break;
      }
    }
  }

  render() {
    return html`
      <slot name="tab"></slot>
      <slot name="panel"></slot>
    `;
  }
}
