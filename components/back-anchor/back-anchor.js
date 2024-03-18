class BackAnchor extends HTMLElement {
    connectedCallback() {
        this.classList.add('primary-button');
        this.classList.add('back-anchor');
        var shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<a href="${this.getAttribute('href')}">
            <img class="img-back" src="${this.getAttribute('assetsUrl')}/icons/arrow-back.svg" alt="go back" />
        </a>`;
    }
}

customElements.define('back-anchor', BackAnchor);
