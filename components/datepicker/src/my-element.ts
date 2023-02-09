import { LitElement, css, html } from "lit";
import { customElement, queryAsync, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";

import {
  format,
  setDate,
  getDate,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  getDay,
  isEqual,
  subWeeks,
  addWeeks,
  subDays,
  addDays,
  subMonths,
  addMonths,
  subYears,
  addYears,
} from "date-fns";

import { chunk } from "lodash";

@customElement("my-element")
export class MyElement extends LitElement {
  @state() showCalendar = false;
  @state()
  selectedDate = Date.now();

  // @queryAsync(".calendar")
  // calendar: Promise<HTMLElement>;

  render() {
    return html`
      <div class="input-group">
        ${this.renderInput()}
        ${this.renderButton()}
      </div>
      ${this.renderCalendar()}
    `;

  }

  renderInput() {
    return html`
      <input type="text" class="form-control" value="${format(this.selectedDate, 'yyyy-MM-dd')}" />
    `;
  }

  renderButton() {
    return html`
      <button @click="${() => this.toggleCalender()}">Toggle</button>
    `;
  }

  renderCalendar() {
    return this.showCalendar
      ? html`
      <div class="calendar" tabindex="0">
        ${this.renderData()}
      </div>
    `
    :'';
  }

  renderData() {
    return html`
      <div class="controls">
        <button @click="${() => this.setDatePreviousYear()}"></button>
        <button @click="${() => this.setDatePreviousMonth()}"></button>
        <span>${format(this.selectedDate, 'MMMM yyyy')}</span>
        <button @click="${() => this.setDateNextMonth()}"></button>
        <button @click="${() => this.setDateNextYear()}"></button>
      </div>
      <table tabindex="0" @keydown="${this.handleTableKeyDown}">
        <caption>${format(this.selectedDate, 'MMMM yyyy')}</caption>
        <thead>
          <tr>
            <th role="columnheader">
              <abbr aria-label="Sunday">Su</abbr>
            </th>
            <th role="columnheader">
              <abbr aria-label="Monday">Mo</abbr>
            </th>
            <th role="columnheader">
              <abbr aria-label="Tuesday">Tu</abbr>
            </th>
            <th role="columnheader">
              <abbr aria-label="Wednesday">We</abbr>
            </th>
            <th role="columnheader">
              <abbr aria-label="Thursday">Th</abbr>
            </th>
            <th role="columnheader">
              <abbr aria-label="Friday">Fr</abbr>
            </th>
            <th role="columnheader">
              <abbr aria-label="Saturday">Sa</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          ${map(
            this.renderMonth(),
            (week) => html`
              <tr role="row" class="week">
                ${map(week, (day: number) => this.renderDay(day))}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  renderMonth() {
    const daysInMonth = getDaysInMonth(this.selectedDate);
    const startDay = startOfMonth(this.selectedDate);
    const endDay = endOfMonth(this.selectedDate);

    const gridDays = chunk(
      [
        ...Array.from({ length: getDay(startDay) }).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => setDate(this.selectedDate, i + 1)),
        ...Array.from({ length: 6 - getDay(endDay) }).fill(null),
      ],
      7
    );

    return gridDays;
  }

  /**
   *
   * @param day
   * @returns String
   */
  renderDay(day: number) {
    return day
      ? html`
        <td
          @click="${() => this.handleDateSelection(day)}"
          role="gridcell"
          aria-selected=${isEqual(getDate(this.selectedDate), getDate(day))}>
            <span>${getDate(day)}</span>
        </td>`
      : html`<td></td>`;
  }

  async toggleCalender() {
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      // this.focusElement(await this.calendar); // ?
      /**
       *  Alt technique…
       *  In this block, query for calendar element – if available? –  and set focus. May change technique and simply hide the calendar rather than add and remove to ShadowDOM.
       *
       **/
    }
  }

  focusElement(element: HTMLElement) {
    element.focus();
  }

  /**
   * Handles click events on calendar days
   * @param date
   */
  handleDateSelection(date) {
    console.log(date);
    const dateString = format(date, "yyyy-MM-dd");
    this.handleSelectDate(date);
  }

  handleSelectDate(date) {
    console.log('wtf', date);
    this.setSelectedDate(date)

  }

  /**
   * Handles keyboard events on calendar table
   * @param event
   * @returns
   */
  handleTableKeyDown(event: KeyboardEvent) {
    const keyCode = event.code;

    switch (keyCode) {
      case "Enter":
      case "Space":
        // Choose selected date
        this.handleSelectDate(format(this.selectedDate, "yyyy-MM-dd"));
        return;
      case "Escape":
        // Close calendar
        this.toggleCalender();
        return;
      case "PageUp":
        // Previous month
        this.setDatePreviousMonth();
        return;
      case "PageDown":
        // Next month
        this.setDateNextMonth();
        return;
      case "Home":
        // Start of month
        this.setMonthStart();
        return;
      case "End":
        // End of month
        this.setMonthEnd();
        return;
      case "ArrowUp":
        // Previous week
        this.setPreviousWeek()
        return;
      case "ArrowDown":
        // Next week
        this.setNextWeek();
        return;
      case "ArrowLeft":
        // Previous day
        this.setPreviousDay();
        return;
      case "ArrowRight":
        // Next day
        this.setNextDay();
        return;
      default:
        return;
    }
  }

  setSelectedDate(date) {
    this.selectedDate = date;
  }

  setPreviousDay() {
    const prevDay = subDays(this.selectedDate, 1);
    this.setSelectedDate(prevDay);
  }

  setNextDay() {
    const nextDay = addDays(this.selectedDate, 1);
    this.setSelectedDate(nextDay);
  }

  setPreviousWeek() {
    const previousWeek = subWeeks(this.selectedDate, 1);
    this.setSelectedDate(previousWeek);
  }

  setNextWeek() {
    const nextWeek = addWeeks(this.selectedDate, 1);
    this.setSelectedDate(nextWeek);
  }

  setDatePreviousMonth() {
    this.setSelectedDate(subMonths(this.selectedDate, 1));
  }

  setDateNextMonth() {
    this.setSelectedDate(addMonths(this.selectedDate, 1));
  }

  setDatePreviousYear() {
    this.setSelectedDate(subYears(this.selectedDate, 1));
  }

  setDateNextYear() {
    this.setSelectedDate(addYears(this.selectedDate, 1));
  }

  setMonthStart() {
    this.setSelectedDate(startOfMonth(this.selectedDate));
  }

  setMonthEnd() {
    this.setSelectedDate(endOfMonth(this.selectedDate));
  }

  static styles = css`
    .calendar {
      display: inline-grid;
      margin: auto;
      border: 1px solid #ccc;
      padding: 0.5em;
      text-align: center;
    }

    .calendar:focus {
      outline: 2px solid red;
    }

    .input-group {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: stretch;
      width: 100%;
    }

    .form-control {
      padding: 0.375rem .75rem;
      font-size: 1rem;
      line-height: 1.6;
      background-clip: padding-box;
      border: 1px solid #868e96;
      appearance: none;
      border-radius: .1875rem;
    }

    .input-group > .form-control {
      position: relative;
      flex: 1 1 auto;
      width: 1%;
      min-width: 0;
    }

    .input-group > :not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .input-group > :not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: -1px;
    }

    .input-group button {
      position: relative;
      z-index: 2;
    }

    button {
      display: inline-block;
      text-transform: none;
      -webkit-appearance: none;
      background-color: white;
      border: 1px solid #017d87;
      border-radius: 3px;
      text-decoration: none;
      text-align: center;
      color: #017d87;
    }

    td {
      border: 1px solid #ccc;
      padding: 0.5rem;
    }

    td:empty {
      border: 0;
    }

    [aria-selected="true"] {
      background-color: #017d87;
      border: 1px solid #017d87;
      color: #fff;
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1em;
      margin-bottom: 0.5em;
      border-bottom: 1px solid #ccc
    }

    button {
      padding: 0.5em;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
