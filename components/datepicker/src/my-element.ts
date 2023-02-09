import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
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
  setDefaultOptions,
} from "date-fns";

import { enGB } from "date-fns/locale";

import { chunk } from "lodash";

@customElement("my-element")
export class MyElement extends LitElement {
  @state()
  showCalendar = false;

  @state()
  selectedDate = Date.now();

  @query('#date')
  dateInput!: HTMLInputElement;

  @query('.calendar')
  calendar!: HTMLDivElement;

  constructor() {
    super();
    setDefaultOptions({ locale: enGB });
  }

  render() {
    return html`
      <label for="date">Choose a date</label>
      <div class="input-group">
        ${this.renderInput()} ${this.renderButton()}
      </div>
      ${this.renderCalendar()}
    `;
  }

  renderInput() {
    return html`
      <input
        type="text"
        class="form-control"
        id="date"
        value="${format(this.selectedDate, "P")}"
      />
    `;
  }

  renderButton() {
    return html`
      <button
        @click="${() => this.toggleCalender()}"
        type="button"
        aria-label="Toggle calendar"
        aria-haspopup="true"
        aria-expanded="${this.showCalendar}"
        aria-controls="calendar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path
            d="M112 0C120.8 0 128 7.164 128 16V64H320V16C320 7.164 327.2 0 336 0C344.8 0 352 7.164 352 16V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H96V16C96 7.164 103.2 0 112 0zM416 192H32V448C32 465.7 46.33 480 64 480H384C401.7 480 416 465.7 416 448V192zM384 96H64C46.33 96 32 110.3 32 128V160H416V128C416 110.3 401.7 96 384 96z"
          />
        </svg>
      </button>
    `;
  }

  renderCalendar() {
    return html` <div class="calendar" tabindex="0" ?hidden=${!this.showCalendar}>${this.renderData()}</div> `
  }

  renderData() {
    return html`
      <div class="controls btn-group">
        <button @click="${() => this.setDatePreviousYear()}" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M235.8 453.1L53.8 256l181.1-197.1c2.844-3.078 4.25-6.969 4.25-10.86c0-4.312-1.719-8.609-5.156-11.75c-6.5-6-16.59-5.594-22.59 .8906l-192 208c-5.688 6.156-5.688 15.56 0 21.72l192 208c6 6.484 16.09 6.891 22.59 .8906C241.4 469.8 241.8 459.6 235.8 453.1zM212.2 245.1c-5.688 6.156-5.688 15.56 0 21.72l192 208c6 6.484 16.09 6.891 22.59 .8906c6.531-5.969 6.906-16.11 .9062-22.61l-181.1-197.1l181.1-197.1c2.844-3.078 4.25-6.969 4.25-10.86c0-4.312-1.719-8.609-5.156-11.75c-6.5-6-16.59-5.594-22.59 .8906L212.2 245.1z"
            />
          </svg>
        </button>
        <button @click="${() => this.setDatePreviousMonth()}" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M234.8 36.25c3.438 3.141 5.156 7.438 5.156 11.75c0 3.891-1.406 7.781-4.25 10.86L53.77 256l181.1 197.1c6 6.5 5.625 16.64-.9062 22.61c-6.5 6-16.59 5.594-22.59-.8906l-192-208c-5.688-6.156-5.688-15.56 0-21.72l192-208C218.2 30.66 228.3 30.25 234.8 36.25z"
            />
          </svg>
        </button>
        <span>${format(this.selectedDate, "MMMM yyyy")}</span>
        <button @click="${() => this.setDateNextMonth()}" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M85.14 475.8c-3.438-3.141-5.156-7.438-5.156-11.75c0-3.891 1.406-7.781 4.25-10.86l181.1-197.1L84.23 58.86c-6-6.5-5.625-16.64 .9062-22.61c6.5-6 16.59-5.594 22.59 .8906l192 208c5.688 6.156 5.688 15.56 0 21.72l-192 208C101.7 481.3 91.64 481.8 85.14 475.8z"
            />
          </svg>
        </button>
        <button @click="${() => this.setDateNextYear()}" type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M212.2 58.86l181.1 197.1L212.2 453.1c-2.844 3.078-4.25 6.969-4.25 10.86c0 4.312 1.719 8.609 5.156 11.75c6.5 6 16.59 5.594 22.59-.8906l192-208c5.688-6.156 5.688-15.56 0-21.72l-192-208c-6-6.484-16.09-6.891-22.59-.8906C206.6 42.22 206.2 52.36 212.2 58.86zM235.8 266.9c5.688-6.156 5.688-15.56 0-21.72l-192-208c-6-6.484-16.09-6.891-22.59-.8906c-6.531 5.969-6.906 16.11-.9062 22.61l181.1 197.1L20.26 453.1c-2.844 3.078-4.25 6.969-4.25 10.86c0 4.312 1.719 8.609 5.156 11.75c6.5 6 16.59 5.594 22.59-.8906L235.8 266.9z"
            />
          </svg>
        </button>
      </div>

      <table tabindex="0" @keydown="${this.handleTableKeyDown}">
        <caption>
          ${format(this.selectedDate, "MMMM yyyy")}
        </caption>
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
            this.renderMonth(), // Array of weeks
            (week) => html`
              <tr role="row" class="week">
                ${map(week, (day) => this.renderDay(day))}
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
        ...Array.from({ length: daysInMonth }, (_, i) =>
          setDate(this.selectedDate, i + 1)
        ),
        ...Array.from({ length: 6 - getDay(endDay) }).fill(null),
      ],
      7
    );

    return gridDays;
  }

  /**
   *
   * @param day
   * @returns String HTML representation of a day in the calendar grid.
   */
  renderDay(day: Date) {
    return day
      ? html` <td
          @click="${() => this.handleDateSelection(day)}"
          role="gridcell"
          aria-selected=${isEqual(getDate(this.selectedDate), getDate(day))}
        >
          <span>${getDate(day)}</span>
        </td>`
      : html`<td></td>`;
  }

  toggleCalender() {
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.focusElement(this.calendar); // ?
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
    const dateString = format(date, "yyyy-MM-dd");
    this.handleSelectDate(date);
  }

  handleSelectDate(date) {
    this.setSelectedDate(date);
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
        this.handleSelectDate(this.selectedDate);
        this.toggleCalender();
        this.focusElement(this.dateInput);
        return;
      case "Escape":
        // Close calendar
        this.toggleCalender();
        this.focusElement(this.dateInput);
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
        this.setPreviousWeek();
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
    [hidden] {
      display: none !important;
    }

    .calendar {
      display: inline-grid;
      margin: auto;
      border: 1px solid #868e96;
      padding: 0.5em;
      text-align: center;
    }

    .calendar:focus-within {
      outline: 2px solid #017d87;
    }

    .input-group {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: stretch;
      width: 100%;
    }

    .form-control {
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.6;
      background-clip: padding-box;
      border: 1px solid #868e96;
      appearance: none;
      border-radius: 0.1875rem;
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

    button:hover,
    button:focus {
      background-color: #e9ecef;
      border-color: #005d64;
      color: #005d64;
    }

    button[aria-expanded="true"] {
      background-color: #017d87;
      color: white;
    }

    svg {
      display: inline-block;
      font-size: inherit;
      height: 1em;
      overflow: visible;
      vertical-align: -0.125em;
      text-align: center;
      width: 1.25em;
    }

    button > svg {
      fill: currentColor;
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
      border-bottom: 1px solid #ccc;
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
