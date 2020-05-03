const unloadFileStyle = `
    .crossmark {
        vertical-align: middle;
        font-size: 2.25em;
    }
    .filename {
        vertical-align: middle;
        font-style: italic;
        font-weight: bold;
        font-size: 18px;
    }`;

const previewImageStyle = `
    img {
        object-fit: contain;
        font-size: 1.25em;
    }
    .filename-container {
        display: flex;
        align-items: center;
        padding: 1em;
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
        padding: 1em;
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
        padding: 1em;
        cursor: pointer;
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
        padding: 1em;
        cursor: pointer;
    }`;

const unloadFileTemplate = (fileName) => `
    <div class="filename-container">
        <span class="crossmark" onclick="handleUnload(this)">&times;</span>
        <span class="filename">${fileName}</span>
    </div>`;

const previewImageTemplate = (fileURL, fileName) => `
    <style>
        ${previewImageStyle}
        ${unloadFileStyle}
    </style>

    <img src=${fileURL} alt="${fileName}">
    ${unloadFileTemplate(fileName)}`;

const previewAudioTemplate = (fileURL, fileName) => `
    <style>
        ${previewAudioStyle}
        ${unloadFileStyle}
    </style>
    <div class="audioFrame">
        <audio controls src=${fileURL} alt="${fileName}"></audio>
    </div>
    ${unloadFileTemplate(fileName)}`;

const previewVideoTemplate = (fileURL, fileName) => `
    <style>
        ${previewVideoStyle}
        ${unloadFileStyle}
    </style>
    <div id="videoFrame" class="videoFrame" style="opacity:0">
        <video id="video" controls src=${fileURL} alt="${fileName}"></video>
    </div>
    ${unloadFileTemplate(fileName)}`;

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
    ${unloadFileTemplate(fileName)}`;