const fileInputTemplate = `
  <div class="pages-content-container">
    <div class="pages-content-element">
      <p class="lead">2. Choose the content type </p>
      <p class="paragraph">
        Select supported content type from the list below and upload the file from your computer.
      </p>
      <select class="dropdown" name="content-type">
        <option value="">--Please select an option--</option>
        <option value="3D">3D Object (.gltf, .glb; max size 50MB)</option>
        <option value="Image">Image (.jpg, .png, .gif; max size 15MB)</option>
        <option value="Audio">Audio (.mp3; max size 10MB)</option>
        <option value="Video">Video (.mp4; max size 25MB)</option>
      </select>
      <a class="passive-button">Upload file</a>
    </div>
    <div class="pages-content-element">
      <div class="image-placeholder">
        Click to upload
      </div>
    </div>
  </div>`;

class FileInput extends HTMLElement {
  constructor() {
    super();

    var shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = fileInputTemplate;
  }

  connectedCallback() {
    this.classList.add('pages-content-container');
  }

}

customElements.define('file-input', FileInput);