import { LitElement, css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

@customElement('my-element')
export class MyElement extends LitElement {
  static formAssociated = true;
  @query('.c-resource__file-upload')
  form!: HTMLElement;

  @query('#file')
  fileInput!: HTMLInputElement;

  @property()
  progress: Number = 0;

  @property()
  files!: FileList;

  render() {
    return html`
      <div
        >
        <div class="c-resource__file-upload"
          @drop="${this.onDrop}"
          @dragover="${this.onDragOver}"
          @dragenter="${this.onDragEnter}"
          @dragleave="${this.onDragLeave}"
          @dragend="${this.onDragEnd}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="svg-inline--fa fa-w-20 fa-2x text-primary"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M308.7 164.7C314.9 158.4 325.1 158.4 331.3 164.7L411.3 244.7C417.6 250.9 417.6 261.1 411.3 267.3C405.1 273.6 394.9 273.6 388.7 267.3L336 214.6V368C336 376.8 328.8 384 320 384C311.2 384 304 376.8 304 368V214.6L251.3 267.3C245.1 273.6 234.9 273.6 228.7 267.3C222.4 261.1 222.4 250.9 228.7 244.7L308.7 164.7zM272 32C331.5 32 384.1 61.55 416 106.8C430.5 99.87 446.8 96 464 96C525.9 96 576 146.1 576 208C576 218.7 574.5 228.1 571.7 238.8C612.3 260.2 640 302.9 640 352C640 422.7 582.7 480 512 480H144C64.47 480 0 415.5 0 336C0 273.2 40.15 219.9 96.17 200.1C100.3 106.6 177.4 32 272 32zM272 64C194.6 64 131.5 125 128.1 201.5C127.6 214.6 119.1 225.1 106.8 230.3C63.18 245.7 32 287.2 32 336C32 397.9 82.14 448 144 448H512C565 448 608 405 608 352C608 315.2 587.3 283.2 556.8 267.1C543.4 259.1 536.8 244.5 540.9 229.1C542.9 223 544 215.7 544 208C544 163.8 508.2 128 464 128C451.7 128 440.1 130.8 429.7 135.7C415.7 142.4 398.8 137.9 389.8 125.2C363.7 88.12 320.7 64 272 64V64z" fill="currentColor"/></svg>

        <label for="file" class="form-label">Choose a file or drag and drop</label>

            <input id="file" type="file" accept=".jpg,.png" @change=${this.onChange}>

            ${this.files
            ? html`<span class="field-hint">${this.files[0].name}</span>`
            : ''
            }

          ${this.progress
          ? html`
              <div class="progress">
                <div class="progress-bar bg-primary" role="progressbar" style="width: ${this.progress}%" aria-valuenow="${this.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="Upload progress"></div>
              </div>
              <span>${this.progress}%</span>`
          : ''}
        </div>
    </div>
    `
  }

  handleFiles(files: FileList) {
    // ([...files]).forEach(this.uploadFile);
    // this.uploadFile(files[0]);
    this.files = files;
    this._dispatchFile();
  }

  uploadFile(file: File) {
    // this.files[0] = file;
    this._dispatchFile();
  }

  private _dispatchFile() {
    const options = {
      bubbles: true,
      composed: true
    };

    this.dispatchEvent(new Event('onchange', options));
  }

  onChange(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const files = this.fileInput.files;

    if (files) {
      this.handleFiles(files);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.form.classList.remove('is-dragover');

    const dt = event.dataTransfer;
    const files = dt?.files;

    console.log(files);

    if (files) {
      this.handleFiles(files);
    }
    // this._dispatchFile('yo');

    // this.onFileDrop();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.form.classList.add('is-dragover');
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.form.classList.add('is-dragover');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.form.classList.remove('is-dragover');
  }

  onDragEnd(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.form.classList.remove('is-dragover');
  }

  static styles = css`
    :host {
      text-align: center;
    }

    .svg-inline--fa {
      display: inline-block;
      height: 1em;
      vertical-align: -0.125rem;
      width: 1.25rem;
      color: #017d87;
    }

    .svg-inline--fa.fa-w-20 {
      width: 1.25em;
    }

    .fa-2x {
      font-size: 2em;
    }

    .box {
      padding: 10rem;
      background-color: white;
      outline: 2px dashed black;
      outline-offset: -10px;
    }

    label {
      display: block;
      font-size: 1.015625rem;
      font-weight: 300;
    }

    .c-resource__file-upload {
      border: 1px dashed #ced4da;
      cursor: default;
      transition: background-color,border .4s ease;
      padding: 1.40652rem;
    }

    .box__uploading,
    .box__success,
    .box__error {
      display: none;
    }

    .box.is-uploading .box__input {
      display:none;
    }

    .box.is-uploading .box__uploading {
      display: block;
    }

    .is-dragover {
      background-color: var(--talis-drop-bg);
      border-color: #017d87;
    }

    [type="file"] {
      display: none;
    }

    .field-hint {
      font-style: italic;
    }

    .progress {
      --talis-progress-height: 0.5rem;
    --talis-progress-font-size: 0.609375rem;
    --talis-progress-bg: transparent;
    --talis-progress-border-radius: 0.5rem;
    --talis-progress-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075);
    --talis-progress-bar-color: #fff;
    --talis-progress-bar-bg: #017d87;
    --talis-progress-bar-transition: width 0.6s ease;
    display: flex;
    height: var(--talis-progress-height);
    overflow: hidden;
    font-size: var(--talis-progress-font-size);
    background-color: var(--talis-progress-bg);
    border-radius: var(--talis-progress-border-radius);
    border: 1px solid #017d87;
    }

    .progress-bar {
    background-color: var(--talis-progress-bar-bg);
    color: var(--talis-progress-bar-color);
    flex-direction: column;
    justify-content: center;
    text-align: center;
    transition: var(--talis-progress-bar-transition);
    white-space: nowrap;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
