const template = `
    <a href="javascript:history.back()">
        <img src="studio/assets/icons/arrow-back.svg" alt="go back" />
    </a>`;

class BackAnchor extends HTMLElement {
    constructor() {
        super();

        var shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = template;
    }

    connectedCallback() {
        this.classList.add('primary-button');
        this.classList.add('back-anchor');
    }
}

customElements.define('back-anchor', BackAnchor);
