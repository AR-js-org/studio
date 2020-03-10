const template = `
    <a href="javascript:history.back()">
        <img src="../assets/icons/arrow-back.svg" alt="go back" />
    </a>`;

class BackAnchor extends HTMLElement {
    constructor() {
        super();

        var shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = template;
    }
}

customElements.define('back-anchor', BackAnchor);
