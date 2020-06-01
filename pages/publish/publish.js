const GITHUB_CLIENT_ID = '284c2ed8c719c8520bd1';

// TODO: Replace darr with an icon.
const previewImageTemplate = (fileURL) =>
    `<div id="image-container">
        <img src=${fileURL} alt="marker.png"/>
        <p class="paragraph bold cursor-pointer" onclick="handleDownload(event)">
            &darr; Download marker.png
        </p>
    </div>`;

/**
 * Display marker image from a template.
 */
const displayImage = () => {
    const imageData = window.session.fullMarkerImage ? window.session.fullMarkerImage : window.session.markerImage;
    const imageBlob = dataURItoBlob(imageData);
    const fileURL = URL.createObjectURL(imageBlob);

    const previewContainer = document.getElementById("preview-container");
    previewContainer.innerHTML = previewImageTemplate(fileURL);
}

/**
 * Display map with markers.
 * TODO: Implement display function for map data.
 */
const displayMap = () =>{

}

/**
 * Display image/map preview on load.
 */
const displayPreview = () => {
    const arType = window.session.arType;

    if (arType === "pattern") {
        displayImage();
    } else if (arType === "location") {
        displayMap();
    } else {
        console.error("Invalid arType:", arType);
    }
}

/**
 * Initialize page with the session data and display preview on load.
 */
const initPage = () => {
    // no other things to do here
    window.session = JSON.parse(window.name);
    displayPreview();

    const publishAnchor = document.getElementById("publish-project");

    const randomString = Math.random().toString(36).substring(7);
    publishAnchor.setAttribute('href', `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=public_repo&state=${randomString}&redirect_uri=${window.origin}/studio/pages/publish-confirm/index.html`);
    window.session.randomString = randomString;

    setSession(window.session);

    const input = document.querySelector('#project-name');
    input.addEventListener('blur', () => {
        window.session.projectName = input.value;
        setSession(window.session);
    });
}

const setSession = (session) => {
    window.name = JSON.stringify(session);
};

/**
 * Display success message with the published URL.
 *
 * @param {String} projectUrl
 */
const displaySuccess = (projectUrl) => {
    const feedbackContainer = document.getElementById("feedback-container");
    const successTemplate = `
        <p class="paragraph margin-bottom-2rem">Hooray! You’ve succesfuly published your project! See it at:</p>
        <p class="link margin-bottom-2rem">${projectUrl}</p>
        <p class="small disclaimer-color">You still own your content! So if you want anything taken down, let us know at <b>arjsstudiohelp@gmail.com</b> and we will delete it. We’re there for any other questions too. :)</p>`;
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
    if (!email) {
        return name.length;
    }
    return name.length && email.length;
}

/**
 * Event handler for the marker image download.
 * @param {event} event
 */
const handleDownload = (event) => {
    const fullMarkerImage = window.session.fullMarkerImage || window.session.markerImage;
    const imageblob = dataURItoBlob(fullMarkerImage);
    const fileURL = URL.createObjectURL(imageblob);

    const link = document.createElement('a');
    link.href = fileURL;
    link.download = "marker.png";
    link.click();

    event.preventDefault();
}
