const fileSelectTemplate = `
  <style>
    .dropdown {
      display: block;
      border: 1.5px solid black;
      box-sizing: border-box;
      border-radius: 5px;
      height: 3.5em;
      padding: 1em 1.25em;
      -webkit-appearance: none;
      -moz-appearance: none;
      background: transparent;
      background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
      background-repeat: no-repeat;
      background-position: top 0.8em right 0.25em;
    }
  </style>

  <select class="dropdown" name="content-type">
    <option value="">Please select an option</option>
    <option value="3D">3D Object (.gltf, .glb; max size 50MB)</option>
    <option value="Image">Image (.jpg, .png, .gif; max size 15MB)</option>
    <option value="Audio">Audio (.mp3; max size 10MB)</option>
    <option value="Video">Video (.mp4; max size 25MB)</option>
  </select>`;

class FileSelect extends HTMLElement {
    constructor() {
        super();

        var shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = fileSelectTemplate;
    }
}

customElements.define('file-select', FileSelect);
