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
                width: 23.75em;
                height: 23.75em;
                font-size: 1.25em;
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
        <div>
            <span class="crossmark" onclick="handleUnload('${id}')">&times;</span>
            <span class="filename">${fileName}</span>
        </div>
        `;
const previewAudioTemplate = (fileURL, fileName, id) => `
        <style>
            .audioFrame {
                object-fit: contain;
                width: 23.75em;
                height: 23.75em;
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
                <div>
                    <span class="crossmark" onclick="handleUnload('${id}')">&times;</span>
                    <span class="filename">${fileName}</span>
                </div>
            </div>
        `;
const previewVideoTemplate = (fileURL, fileName, id) => `
        <style>
            .videoFrame {
                object-fit: contain;
                width: 23.75em;
                height: 23.75em;
                font-size: 1.25em;
                text-align: center;
                border: 1px solid var(--passive-color-dark);
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
            <div id="videoFrame" class="videoFrame" style="opacity:0">
                <video id="video" controls src=${fileURL} alt="${fileName}"></video>
                <div >
                    <span class="crossmark" onclick="handleUnload('${id}')">&times;</span>
                    <span class="filename">${fileName}</span>
                </div>
            </div>
        `;
const previewModelTemplate = (fileURL, fileName, id) => `
        <style>
            .modelFrame {
                object-fit: contain;
                width: 23.75em;
                height: 23.75em;
                font-size: 1.25em;
                text-align: center;
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
            <div>
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
const supportedFileMap = {
    '3d': {
        types: ['gltf', 'glb'],
        maxSize: 50 * 1024 * 1024,
        maxSizeText: '50MB',
    },
    image: {
        types: ['image/png', 'image/jpeg', 'image/gif'],
        maxSize: 15 * 1024 * 1024,
        maxSizeText: '15MB',
    },
    audio: {
        types: ['audio/wav', 'audio/mp3'],
        maxSize: 10 * 1024 * 1024,
        maxSizeText: '10MB',
    },
    video: {
        types: ['video/mp4'],
        maxSize: 25 * 1024 * 1024,
        maxSizeText: '25MB',
    }
};

// 2.1 check whether the file is a supported content type, and whether it is in the limited size;
const isSupportedFileAndSize = (type, file) => {
    let errorMessage = '';
    let supportedFile = supportedFileMap[type];
    if (supportedFile) {
        if (file.size > supportedFile.maxSize) errorMessage = 'exceed max size ' + supportedFile.maxSizeText;
        else if (type === '3d') { // cannot get the file.type
            let fileName = file.name.split('.');
            let ext = fileName[fileName.length - 1];
            if (supportedFile.types.indexOf(ext) < 0) errorMessage = 'error content type';
        } else {
            if (supportedFile.types.indexOf(file.type) < 0) errorMessage = 'error content type';
        }
    } else errorMessage = 'please select a supported file type';

    if (errorMessage) return alert(errorMessage);
    return true;
};

// 3:for step 1: marker upload
const handleMarkerUpload = (event) => {
    const file = event.target.files[0];
    const fileName = file.name;
    let fileURL = null;

    if (!isSupportedFileAndSize('image', file)) return;

    event.target.value = ''; // incase onchange will not be called when the same file is loaded.

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        const base64Data = reader.result;
        MarkerModule.getFullMarkerImage(base64Data, 0.5, 512, "black").then(
            (fullMarkerImage) => {
                window.markerImage = base64Data;
                var blob = dataURItoBlob(fullMarkerImage);
                fileURL = URL.createObjectURL(blob);
                let preview = document.getElementById("marker-preview");
                preview.innerHTML = previewImageTemplate(fileURL, fileName, "marker-preview");
            }
        );
    };

    function dataURItoBlob(dataURI) {
        var mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
        var binary = atob(dataURI.split(",")[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: mime });
    }
};

// for step 2: content upload
// object-fit: contain;
// step2.1: select file type
const fileSelect = document.querySelector("file-select");
fileSelect.addEventListener("onSelect", () => {
    thePackage.assetType = event.detail.selectedValue;
    let accept = '*';
    let supportedFile = supportedFileMap[thePackage.assetType];
    if (supportedFile) {
        accept = (thePackage.assetType === '3d') ? '*' : supportedFile.types.join(',');
    }
    document.querySelector('#contentFile').setAttribute('accept', accept); // so that we can select to correct one
});

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
    video.addEventListener('canplay', function () { // dynamic to caculate the size
        var width, height;
        if (video.videoWidth > video.videoHeight) { // it is landscape
            width = video.parentNode.clientWidth - 50;
            height = width * video.videoHeight / video.videoWidth;
        } else {
            height = video.parentNode.clientHeight - 100;
            width = height * video.videoWidth / video.videoHeight;
        }

        video.style.width = width + 'px';
        video.style.height = height + 'px';
        video.style['margin-top'] = ((video.parentNode.clientHeight - height) * 0.5) + 'px';
        video.style['border'] = '1px solid #aaa';
        document.querySelector('#videoFrame').style.opacity = 1;
    });
};

const handleModelUpload = (file) => {
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

};

const handleContentUpload = (event) => {
    const file = event.target.files[0];
    if (!isSupportedFileAndSize(thePackage.assetType, file)) return;

    event.target.value = ''; // incase onchange will not be called when the same file is loaded.
    switch (thePackage.assetType) {
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
    if (!thePackage.assetType) return alert('please select the corret content type');
    if (!thePackage.assetFile || !thePackage.assetName) return alert('please upload a content');


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
