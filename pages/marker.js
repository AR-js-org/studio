const handleImageUnload = () => {
    let preview = document.getElementById("image-preview");
    preview.innerHTML = "<file-holder></file-holder>";
};

const previewTemplate = (fileURL, fileName) =>  `
        <style>
            img {
                object-fit: contain;
                width: 23.75em;
                height: 23.75em;
                font-size: 1.25em;
            }
            .crossmark {
                font-size: 2.25em;
            }
            .filename {
                font-style: italic;
                font-weight: bold;
                font-size: 18px;
            }
        </style>
            
        <img src=${fileURL} alt="image-preview">
        <div>
            <span class="crossmark" onclick="handleImageUnload()">&times;</span>
            <span class="filename">${fileName}</span>
        </div>
        `;

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const fileName = file.name;
    const fileURL = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        //for backend api asset needs only base64 part
        window.assetImage = reader.result.split(',')[1];
    };
    let preview = document.getElementById("image-preview");
    preview.innerHTML = previewTemplate(fileURL, fileName);
};

const handleMarkerUpload = (event) => {
    const file = event.target.files[0];
    const fileName = file.name;
    let fileURL = null;
    if (window.detail === 'Image') {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            const base64Data = reader.result;
            new ARjsStudioBackend.MarkerModule.getFullMarkerImage(base64Data, 0.5, 512, 'black').then(fullMarkerImage => {
                window.markerImage = base64Data;
                var blob = dataURItoBlob(fullMarkerImage);
                fileURL = URL.createObjectURL(blob);
                let preview = document.getElementById("marker-preview");
                preview.innerHTML = previewTemplate(fileURL, fileName);
            });
        };
    }

    function dataURItoBlob(dataURI) {
        var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: mime});
    }
};