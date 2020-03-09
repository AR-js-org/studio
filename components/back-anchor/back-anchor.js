fetch('./back-anchor.html')
  .then(stream => stream.text())
  .then(text => define(text));

function define(html) {
  class BackAnchor extends HTMLAnchorElement {
    constructor() {
      super();

      var shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = html;
    }
  }

  customElements.define('back-anchor', BackAnchor, { extends: 'a' });
}