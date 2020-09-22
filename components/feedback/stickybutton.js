const StickyButton = `
    <style>
      .sticky-button {
        font-family: Chakra Petch;
        font-style: normal;
        font-weight: 600;
        font-size: 1em;
        border: 1.5px solid black;
        border-radius: 10px;
        padding: .8em .8em;
        text-decoration: none;
        color: black;
        cursor: pointer;
        background-color: var(--primary-color);
        position: fixed;
        top: 50%;
        right: 0px;
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
        -webkit-transform: rotate(-90deg);
        transform: rotate(-90deg);
      }
      .sticky-button:active {
        box-shadow: -5px 5px 0px #000000;
        webkit-transform-origin: 105% 100%;
        transform-origin: 105% 100%;
        -webkit-transform: rotate(-90deg);
        transform: rotate(-90deg);
    }
    .sticky-button:hover {
        background-color: var(--primary-color-dark);
    }
      .icono-mail {
        box-sizing: border-box;
        display: inline-block;
        vertical-align: middle;
        position: relative;
        direction: ltr;
        width: 28px;
        height: 18px;
        overflow: hidden;
        margin: 4px 1.5px;
        border: 2px solid;
      }
      .icono-mail:before {
        content: '';
        pointer-events: none;
        position: absolute;
        width: 25px;
        height: 25px;
        -webkit-transform: rotate(50deg) skew(-10deg,-20deg);
        transform: rotate(50deg) skew(-10deg,-20deg);
        top: -20px;
        left: -3px;
        border: 2px solid;
      }
      @media (max-width: 600px) {
        .sticky-button {
          display: none;
        }
      }
    </style>

    <a id="stickyBtn" class="sticky-button" target="_blank" href="https://forms.gle/s9EPDNyCzZ2g5j3C9" >
      <span class="icono-mail"></span> Send feedback
    </a>
`;

class FeedbackButton extends HTMLElement {
  shadow = null;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = StickyButton;
  }
}

customElements.define('feedback-button', FeedbackButton);
