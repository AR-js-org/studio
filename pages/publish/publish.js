// TODO: Implement GitHub publish logic.
console.log(JSON.parse(sessionStorage.getItem("session")))

/**
 * Display error message.
 */
const displayError = () => {
    const feedbackContainer = document.getElementById("feedback-container");
    const errorTemplate = `<p class="error">* Please provide both a name and email for your project</p>`;
    feedbackContainer.innerHTML = errorTemplate;
}

/**
 * Display success message with the published URL.
 * 
 * @param {String} projectUrl 
 */
const displaySuccess = (projectUrl) => {
    const feedbackContainer = document.getElementById("feedback-container");
    const successTemplate = `
        <p class="paragraph margin-bottom-2rem">Hooray! You’ve succesfuly published your project! See it at:</p>
        <p class="link">${projectUrl}</p>`;
    feedbackContainer.innerHTML = successTemplate;
}

/**
 * Simply checks for empty input.
 * 
 * @param {String} name 
 * @param {String} email 
 * @returns {boolean}
 */
const isValidInput = (name, email) => {
    return name.length && email.length;
}

/**
 * Event handler for the publish button. id="publish-project"
 * 
 * @param {event} event 
 */
const handleClick = (event) => {
    const projectNameInput = document.getElementById("project-name");
    const personalEmailInput = document.getElementById("personal-email");

    if (isValidInput(projectNameInput.value, personalEmailInput.value)) {
        const projectUrl = "https://account.github.io/your-new-project-URL";
        displaySuccess(projectUrl);
    } else {
        displayError();
    }
    event.preventDefault();
}