const { MarkerModule, Package } = ARjsStudioBackend;

const previewTemplate = (fileURL, fileName, id) => `
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
        
const handleUnload = (id) => {
    let preview = document.getElementById(id);
    preview.innerHTML = "<file-holder></file-holder>";
};

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const fileName = file.name;
    const fileURL = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        //for backend api asset needs only base64 part
        window.assetImage = reader.result.split(",")[1];
    };
    let preview = document.getElementById("image-preview");
    preview.innerHTML = previewTemplate(fileURL, fileName, "image-preview");
};

const handleMarkerUpload = (event) => {
    const file = event.target.files[0];
    const fileName = file.name;
    let fileURL = null;
    if (window.detail === "Image") {
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
                    preview.innerHTML = previewTemplate(fileURL, fileName, "marker-preview");
                }
            );
        };
    }

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

const zip = () => {
    MarkerModule.getMarkerPattern(window.markerImage)
        .then(
            (markerPattern) =>
                new Package({
                    arType: "pattern",
                    assetType: "image",
                    markerPatt: markerPattern,
                    assetFile: window.assetImage,
                    assetName: "asset.jpg",
                })
        )
        .then((package) => package.serve({ packageType: "zip" }))
        .then((base64) => {
            window.location = `data:application/zip;base64,${base64}`;
        });
};

const fileSelect = document.querySelector("file-select");
fileSelect.addEventListener("onSelect", () => {
    window.detail = event.detail.selectedValue;
});

const element = document.querySelector("page-footer");
element.addEventListener("onClick", zip);
