class PageHeader extends HTMLElement {
    constructor() {
        super();

        const template = `
            <style>
                a {
                    display: grid;
                    grid-template-columns: auto auto;
                    justify-content: left;
                    align-content: center;
                    text-decoration: none;
                    height: 5em;
                    width: 12.5em;
                    padding-left: 1.875em;
                }

                img {
                    height: 2em;
                    padding: 0;
                    margin: 0;
                }

                p {
                    font-family: Chakra Petch;
                    font-style: normal;
                    font-weight: bold;
                    line-height: 1.625em;
                    padding-left: 0.625em;
                    margin: 0.3125em;
                    font-size: 1.25em;
                    color: black;
                }

                .minor-text {
                    font-size: 1em;
                }
            </style>

            <a href="/studio">
                <img class="logo-img" alt="logo" />
            </a>
        `;

        let shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = template
    }

    connectedCallback() {
        this.classList.add('page-header');
        this.shadowRoot.querySelector('.logo-img').src = `${this.getAttribute('assetsUrl')}/img/logo.png`;
    }
}

customElements.define('page-header', PageHeader);
