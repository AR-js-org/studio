const template = `
    <div>
        //TODO
    </div>`;

class Map extends HTMLElement {
    constructor() {
        super();
        var shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = template;
    }

    // connectedCallback() {
    //     this.classList.add('primary-button');
    //     this.classList.add('back-anchor');
    // }
}

customElements.define('map', Map);
