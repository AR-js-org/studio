class PageHeader extends HTMLElement {
    constructor() {
        super();

        // handling github pages
        let logoUrl = `${window.location.href} + /../../assets/img/logo.png`;
        if (logoUrl.indexOf('/studio') > -1) {
            logoUrl = `${window.location.href} + /../../studio/assets/img/logo.png`;
        }

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
                    width: 2.25em;
                    height: 2.25em;
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
            </style>

            <a href="/">
                <img src="${window.location.href} + /../../assets/img/logo.png" alt="logo" />
                <p>AR.js Studio</p>
            </a>
        `;

        let shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = template
    }

    connectedCallback() {
        this.classList.add('page-header');
    }
}

customElements.define('page-header', PageHeader);
