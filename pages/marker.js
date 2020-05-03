const { MarkerModule, Package } = ARjsStudioBackend;

const zip = () => {
    // TODO: replace alerts with HTML error messages.
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
            // window.location = `data:application/zip;base64,${base64}`;
            // sometimes it doesn't work by use window.location directly, so change to this way
            var link = document.createElement('a');
            link.href = `data:application/zip;base64,${base64}`;
            link.download = "ar.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);


        });
};

const element = document.querySelector("page-footer");
element.addEventListener("onClick", zip);
