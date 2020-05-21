const { MarkerModule, Package } = ARjsStudioBackend;

/**
 * Packages the data into a zip file and prompts download.
 * 
 * TODO: Add the generated markerImage into the zip package.
 * 
 * @param {event} event 
 */
const zip = (event) => {
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
            assetParam: window.assetParam,
            markerPatt: markerPattern
        })))
        .then((package) => package.serve({ packageType: "zip" }))
        .then((base64) => {
            // window.location = `data:application/zip;base64,${base64}`;
            // sometimes it doesn't work by use window.location directly, so change to this way
            const link = document.createElement('a');
            link.href = `data:application/zip;base64,${base64}`;
            link.download = "ar.zip";
            link.click();
        });
    event.preventDefault();
};

/**
 * Stores the session data and redirects to publish page.
 * 
 * @param {event} event 
 */
const publish = (event) => {
    // TODO: replace alerts with HTML error messages.
    if (!window.markerImage) return alert('please select a marker image');
    if (!window.assetType) return alert('please select the corret content type');
    if (!window.assetFile || !window.assetName) return alert('please upload a content');

    MarkerModule.getMarkerPattern(window.markerImage)
    .then((markerPattern) => {
        const session = {
            arType: 'pattern',
            assetType: window.assetType, // image/audio/video/3d
            assetFile: window.assetFile,
            assetName: window.assetName,
            assetParam: window.assetParam,
            markerPatt: markerPattern,
            markerImage: window.markerImage,
            fullMarkerImage: window.fullMarkerImage,
        }
        sessionStorage.clear();
        sessionStorage.setItem("session", JSON.stringify(session));
        window.location = "./publish";
    })
    event.preventDefault();
}

const element = document.querySelector("page-footer");
element.addEventListener("zip-button", zip);
element.addEventListener("publish-button", publish);
