const FooterContent = `
  <style>
    #footer{
      padding: 2em 6em;
    }
    
    .lead {
      font-family: Chakra Petch;
      font-style: normal;
      font-weight: bold;
      font-size: 1.75em;
      line-height: 140%;
    }
    
    .primary-button,
    .passive-button {
      display: inline-block;
      font-family: Chakra Petch;
      font-style: normal;
      font-weight: 600;
      font-size: 1em;
      line-height: 1.25em;
      height: 3.5em;
      border: none;
      border: 1.5px solid black;
      box-sizing: border-box;
      box-shadow: 10px 10px 0px black;
      border-radius: 10px;
      padding: 1em 1.25em;
      margin: 1.875em 0;
      text-decoration: none;
      color: black;
    }

    .primary-button:active,
    .passive-button:active {
      box-shadow: 5px 5px 0px #000000;
      transform: translateY(4px);
    }

    .primary-button {
      background: var(--primary-color);
    }

    .primary-button:hover {
      background: var(--primary-color-dark);
    }

    .passive-button {
      background: var(--passive-color);
    }

    .passive-button:hover {
      background: var(--passive-color-dark);
    }
  </style>

  <div>
    <div id="footer">
    <p class="lead">
      3. Export the project
    </p>

    <p class="paragraph">
      Export your project to GitHub or download the package containing all files and generated code to save it locally.
    </p>

    <div class="buttons">
      <button class="primary-button">
        Export to Github
      </button>
    
      <button class="passive-button">
        Download package
      </button>
    </div>
    </div>
  </div>`;

class PageFooter extends HTMLElement {
  constructor() {
    super();
    
    let shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = FooterContent    
  }
}

customElements.define('page-footer', PageFooter);

