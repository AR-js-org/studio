const fileSelectTemplate = `
  <style>
    .dropdown {
      display: block;
      border: 1px solid var(--passive-color-dark);
      box-sizing: border-box;
      border-radius: 5px;
      height: 3.5em;
      font-size: 0.875em;
      padding: 1em 1.25em;
      -webkit-appearance: none;
      -moz-appearance: none;
      background: transparent;
      background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
      background-repeat: no-repeat;
      background-position: top 0.8em right 0.25em;
    }
  </style>

  <select class="dropdown" name="content-type" >
    <option value="">Please select an option</option>
    <option value="3d">3D Object (.gltf, .glb .zip; max size 50MB)</option>
    <option value="image">Image (.jpg, .png, .gif; max size 15MB)</option>
    <option value="audio">Audio (.mp3; max size 10MB)</option>
    <option value="video">Video (.mp4; max size 25MB)</option>
  </select>`;

class FileSelect extends HTMLElement {
  shadow = null;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = fileSelectTemplate;
  }

  connectedCallback() {
    const select = this.shadow.querySelector("select");
    select.onchange = () => {
      const supportedFile = supportedFileMap[select.value];
      const accept = (!select.value || select.value === '3d') ? '*' : supportedFile.types.join(',');
      document.querySelector('#content-file').setAttribute('accept', accept);
      window.assetType = select.value;
    }
  }
}

customElements.define('file-select', FileSelect);
