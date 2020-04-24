const { MarkerModule, Package } = ARjsStudioBackend;

const zip = () => {
    // check thePackage whether it is valid
    if (!window.markerImage) return alert('please select a marker image');
    if (!window.assetType) return alert('please select the corret content type');
    if (!window.assetFile || !window.assetName) return alert('please upload a content');

    MarkerModule.getMarkerPattern(window.markerImage)
        .then((markerPattern) => (new Package({
            arType: 'pattern',
            assetType: window.assetType, // image/audio/video/3d
            assetFile: window.assetFile,
            assetName: window.assetName,
            markerPatt: markerPattern
        })))
        .then((package) => package.serve({ packageType: "zip" }))
        .then((base64) => {
            window.location = `data:application/zip;base64,${base64}`;
        });
};

const element = document.querySelector("page-footer");
element.addEventListener("onClick", zip);
