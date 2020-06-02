const unloadFileStyle = `
    .crossmark {
        vertical-align: middle;
        font-size: 2.25em;
    }
    .download-marker {
        display: flex;
    }
    .download-marker span {
        display: flex;
        padding: 0.25em 0em;
    }
    .filename {
        vertical-align: middle;
        font-style: italic;
        font-weight: bold;
        font-size: 18px;
    }`;
const previewImageStyle = `
    .imageFrame {
        display: flex;
        position:relative;
        width: 23.75em;
        height: 23.75em;
        object-fit: contain;
        font-size: 1.25em;
        text-align: center;
    }
    #marker-preview .imageFrame {
        border: 1px solid black;
    }
    img {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
    }
    .filename-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
    }`;

const previewAudioStyle = `
    .audioFrame {
        width: 23.75em;
        height: 23.75em;
        object-fit: contain;
        font-size: 1.25em;
        text-align: center;
        border: 1px solid var(--passive-color-dark);
    }
    audio {
        width: 18em;
        height: 3em;
        margin-left: 3em;
        margin-top: 8em;
    }
    .filename-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
    }`;

const previewVideoStyle = `
    .videoFrame {
        width: 23.75em;
        height: 23.75em;
        display: flex;
        flex-direction: column;
        justify-content: center;
        object-fit: contain;
        font-size: 1.25em;
        text-align: center;
        border: 1px solid var(--passive-color-dark);
    }
    .filename-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
    }
    .remove-marker {
        display: flex;
        align-items: center;
    }
    video {
        object-fit: cover;
    }`;

const previewModelStyle = `
    .modelFrame {
        width: 23.75em;
        height: 23.75em;
        object-fit: contain;
        font-size: 1.25em;
        text-align: center;
    }
    .filename-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
    }`;

const unloadFileTemplate = (fileName, fileURL) => `
    <div class="filename-container">
        <div class="remove-marker">
            <span class="crossmark" onclick="handleUnload(this)">&times;</span>
            <span class="filename">Remove</span>
        </div>
    </div>`;

const unloadMarkerTemplate = (fileName, fileURL) => `
    <div class="filename-container">
        <div class="remove-marker">
            <span class="crossmark" onclick="handleUnload(this, true)">&times;</span>
            <span class="filename">Remove</span>
        </div>
        <div class="download-marker">
            <span>
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                    <path d="M16.5 8L15.09 6.59L9.5 12.17V0H7.5V12.17L1.92 6.58L0.5 8L8.5 16L16.5 8Z" fill="black"/>
                </svg>
            </span>
            <a class="filename" style="text-decoration: none; color: black;" href="${fileURL}" download>Download marker</button>
        </div>
    </div>`;

/**
 *
 * @param {string} fileURL
 * @param {string} fileName
 * @param {boolean} isMarker
 */
const previewImageTemplate = (fileURL, fileName, isMarker) => `
    <style>
        ${previewImageStyle}
        ${unloadFileStyle}
    </style>

    <div class="imageFrame">
        <img id="img" src=${fileURL} alt="${fileName}">
    </div>
    ${isMarker ? unloadMarkerTemplate(fileName, fileURL) : unloadFileTemplate(fileName, fileURL)}`;


const previewAudioTemplate = (fileURL, fileName) => `
    <style>
        ${previewAudioStyle}
        ${unloadFileStyle}
    </style>
    <div class="audioFrame">
        <audio controls src=${fileURL} alt="${fileName}"></audio>
    </div>
    ${unloadFileTemplate(fileName, fileURL)}`;

const previewVideoTemplate = (fileURL, fileName) => `
    <style>
        ${previewVideoStyle}
        ${unloadFileStyle}
    </style>
    <div id="videoFrame" class="videoFrame" style="opacity:0">
        <video id="video" controls src=${fileURL} alt="${fileName}"></video>
    </div>
    ${unloadFileTemplate(fileName, fileURL)}`;

const previewModelTemplate = (fileURL, fileName) => `
    <style>
        ${previewModelStyle}
        ${unloadFileStyle}
    </style>
    <div class="modelFrame" id="modelFrame">
        <a-scene
            renderer="logarithmicDepthBuffer: true;"
            embedded
            loading-screen="enabled: false;"
            vr-mode-ui="enabled: false">
            <a-assets>
                <a-asset-item id="model" src="${fileURL}"></a-asset-item>
            </a-assets>

            <a-entity position="0 0.9 -2">
                <a-entity animation-mixer="loop: repeat" model-controller="target:#modelFrame" gltf-model="#model"></a-entity>
            </a-entity>

            <a-sky color="#ECECEC"></a-sky>
            <a-entity camera position="0 1 0">
            </a-entity>
        </a-scene>
    </div>
    ${unloadFileTemplate(fileName, fileURL)}`;
