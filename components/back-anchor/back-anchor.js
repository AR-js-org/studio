const template = `
    <a href="javascript:history.back()">
        <img class="img-back" src="studio/assets/icons/arrow-back.svg" alt="go back" />
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
        this.shadowRoot.querySelector('.img-back').src = `${this.getAttribute('assetsUrl')}/icons/arrow-back.svg`;
    }
}

customElements.define('back-anchor', BackAnchor);
