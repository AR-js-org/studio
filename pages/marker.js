const { MarkerModule, Package } = ARjsStudioBackend;
// 0. public object for the final use
let thePackage = {
    arType: 'pattern',
    assetType: '', // image/audio/video/3d
    markerPatt: '',
    assetFile: null,
    assetName: '',
};

// 1. all tempplates
const previewImageTemplate = (fileURL, fileName, id) => `
    <style>
        img {
            object-fit: contain;
            font-size: 1.25em;
        }
        .filename-container {
            display: flex;
            align-items: center;
            padding: 1em;
            cursor: pointer;
        }
        .crossmark {
            vertical-align: middle;
            font-size: 2.25em;
        }
        .filename {
            vertical-align: middle;
            font-style: italic;
            font-weight: bold;
            font-size: 18px;
        }
    </style>

    <img src=${fileURL} alt="${fileName}">
    <div class="filename-container">
        <span class="crossmark" onclick="handleUnload('${id}')">&times;</span>
        <span class="filename">${fileName}</span>
    </div>
    `;
const previewAudioTemplate = (fileURL, fileName, id) => `
    <style>
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
        }
        .crossmark {
            vertical-align: middle;
            font-size: 2.25em;
        }
        .filename {
            vertical-align: middle;
            font-style: italic;
            font-weight: bold;
            font-size: 18px;
        }
    </style>
        <div class="audioFrame">
            <audio controls src=${fileURL} alt="${fileName}"></audio>
        </div>
        <div classe="filename-container">
            <span class="crossmark" onclick="handleUnload('${id}')">&times;</span>
            <span class="filename">${fileName}</span>
        </div>
    `;
const previewVideoTemplate = (fileURL, fileName, id) => `
    <style>
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
        .crossmark {
            vertical-align: middle;
            font-size: 2.25em;
        }
        .filename {
            vertical-align: middle;
            font-style: italic;
            font-weight: bold;
            font-size: 18px;
        }
        video {
            object-fit: cover;
        }
    </style>
        <div id="videoFrame" class="videoFrame" style="opacity:0">
            <video id="video" controls src=${fileURL} alt="${fileName}"></video>
        </div>
        <div class="filename-container">
            <span class="crossmark" onclick="handleUnload('${id}')">&times;</span>
            <span class="filename">${fileName}</span>
        </div>
    `;
const previewModelTemplate = (fileURL, fileName, id) => `
    <style>
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
        }
        .crossmark {
            vertical-align: middle;
            font-size: 2.25em;
        }
        .filename {
            vertical-align: middle;
            font-style: italic;
            font-weight: bold;
            font-size: 18px;
        }
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
        <div class="filename-container">
            <span class="crossmark" onclick="handleUnload('${id}')">&times;</span>
            <span class="filename">${fileName}</span>
        </div>   
    `;

const handleUnload = (id) => {
    let preview = document.getElementById(id);
    preview.innerHTML = "<file-holder></file-holder>";

    if (id === 'content-preview') {
        thePackage.assetFile = null;
        thePackage.assetName = '';
    } else if (id === 'marker-preview') {
        window.markerImage = null;
    }
};

// 2. all supported file information




// 3:for step 1: marker upload
const handleMarkerUpload = (event) => {
    const file = event.target.files[0];
    const fileName = file.name;
    let fileURL = null;

    if (!isValidFile('image', file, "marker-error")) return;

    event.target.value = ''; // in case 'onchange' will not be called when the same file is loaded.

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        const base64Data = reader.result;
        MarkerModule.getFullMarkerImage(base64Data, 0.5, 512, "black")
            .then((fullMarkerImage) => {
                window.markerImage = base64Data;
                let blob = dataURItoBlob(fullMarkerImage);
                fileURL = URL.createObjectURL(blob);
                let preview = document.getElementById("marker-preview");
                preview.innerHTML = previewImageTemplate(fileURL, fileName, "marker-preview");
            }
            );
    };

    function dataURItoBlob(dataURI) {
        let mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
        let binary = atob(dataURI.split(",")[1]);
        let array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: mime });
    }
};

const handleImageUpload = (file) => {
    const fileName = file.name;
    const fileURL = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        thePackage.assetFile = reader.result.split(",")[1];
        thePackage.assetName = file.type.replace('image/', 'asset.');
    };
    let preview = document.getElementById("content-preview");
    preview.innerHTML = previewImageTemplate(fileURL, fileName, "content-preview");
};
const handleAudioUpload = (file) => {
    const fileName = file.name;
    const fileURL = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function () {
        //for backend api asset needs only base64 part
        thePackage.assetFile = reader.result;
        thePackage.assetName = file.type.replace('audio/', 'asset.');
    };
    let preview = document.getElementById("content-preview");
    preview.innerHTML = previewAudioTemplate(fileURL, fileName, "content-preview");
};
const handleVideoUpload = (file) => {
    const fileName = file.name;
    const fileURL = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function () {
        //for backend api asset needs only base64 part
        thePackage.assetFile = reader.result;
        thePackage.assetName = file.type.replace('video/', 'asset.');
    };
    let preview = document.getElementById("content-preview");
    preview.innerHTML = previewVideoTemplate(fileURL, fileName, "content-preview");

    var video = document.querySelector('#video');
    video.addEventListener('canplay', () => {
        if (video.videoWidth > video.videoHeight) {
            video.style.width = '100%';
        } else {
            video.style.height = '100%';
        }

        video.parentElement.style.backgroundColor = 'black';
        document.querySelector('#videoFrame').style.opacity = 1;
    });
};

const handleModelUpload = (file) => {
    let fileType = file.name.split('.').slice(-1)[0];
    if (fileType === 'glb') {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            //for backend api asset needs only base64 part
            thePackage.assetFile = reader.result.split(",")[1];
            let fileName = file.name.split('.');
            thePackage.assetName = 'asset.' + fileName[fileName.length - 1];

            let preview = document.getElementById("content-preview");
            preview.innerHTML = previewModelTemplate(reader.result, file.name, "content-preview");
        };
    } else if (fileType === 'gltf') {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = function () {
            try {
                let gltf = JSON.parse(reader.result);
                let buffers = gltf.buffers || [];
                let images = gltf.images || [];
                let uri;
                const previewError = document.getElementById("content-error");

                console.log(gltf.buffers);
                console.log(gltf.images);
                for (let i = 0; i < buffers.length; i++) {
                    uri = buffers[i].uri;
                    if (uri.indexOf('data:application/octet-stream;base64,') != 0) { // need a related file
                        previewError.innerHTML = '*Please pack all related files to zip file and try again.'

                        return;
                    }
                }
                for (let i = 0; i < images.length; i++) {
                    uri = images[i].uri;
                    if (uri.indexOf('data:application/octet-stream;base64,') != 0) { // need a related file
                        previewError.innerHTML = '*Please pack all related files to zip file and try again.'
                        return;
                    }
                }

            } catch (error) {

            }
            // console.log(reader.result);
        };
    } else if (fileType == 'zip') {
        handleZip(file, (err, result) => {
            thePackage.assetFile = result.split(",")[1];
            let fileName = file.name.split('.');
            thePackage.assetName = 'asset.gltf';

            let preview = document.getElementById("content-preview");
            preview.innerHTML = previewModelTemplate(result, file.name, "content-preview");
        })

    }
};

const handleContentUpload = (event) => {
    const file = event.target.files[0];

    if (!isValidFile(window.assetType, file, "content-error")) return;

    event.target.value = ''; // incase onchange will not be called when the same file is loaded.
    switch (window.assetType) {
        case 'image': {
            handleImageUpload(file);
            break;
        }
        case 'audio': {
            handleAudioUpload(file);
            break;
        }
        case 'video': {
            handleVideoUpload(file);
            break;
        }
        case '3d': {
            handleModelUpload(file);
            break;
        }
    }

};

// for step 3: upload
const zip = () => {
    // check thePackage whether it is valid
    if (!window.markerImage) return alert('please select a marker image');
    if (!window.assetType) return alert('please select the corret content type');
    if (!thePackage.assetFile || !thePackage.assetName) return alert('please upload a content');

    thePackage.assetType = window.assetType

    MarkerModule.getMarkerPattern(window.markerImage)
        .then((markerPattern) => {
            thePackage.markerPatt = markerPattern;
            return new Package(thePackage)
        })
        .then((package) => package.serve({ packageType: "zip" }))
        .then((base64) => {
            window.location = `data:application/zip;base64,${base64}`;
        });
};

const element = document.querySelector("page-footer");
element.addEventListener("onClick", zip);
