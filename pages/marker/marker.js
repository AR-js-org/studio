const { MarkerModule, Package } = ARjsStudioBackend;

var githubButton = document.querySelector('page-footer').shadowRoot.querySelector('#github-publish');
var zipButton = document.querySelector('page-footer').shadowRoot.querySelector('#zip-publish');

/**
 * Initialize the default marker image on page load.
 */
const setDefaultMarker = () => {
    const c = document.createElement('canvas');
    const img = document.querySelector('#marker-preview .marker img');
    c.height = img.naturalHeight;
    c.width = img.naturalWidth;
    const ctx = c.getContext('2d');

    ctx.drawImage(img, 0, 0, c.width, c.height);
    const base64String = c.toDataURL();
    window.markerImage = base64String;
}

const checkUserUploadStatus = () => {
    if (window.markerImage && window.assetFile) {
        enablePageFooter();
    }
}

// All the required components are uploaded by the user => footer will be enable
const enablePageFooter = () => {
    githubButton.classList.remove('publish-disabled');
    zipButton.classList.remove('publish-disabled');
    zipButton.removeAttribute('disabled');
}

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
            assetParam: window.assetParam && (window.assetParam.isValid ? window.assetParam : null),
            markerPatt: markerPattern
        })))
        .then((package) => package.serve({ packageType: 'zip' }))
        .then((base64) => {
            // window.location = `data:application/zip;base64,${base64}`;
            // sometimes it doesn't work by use window.location directly, so change to this way
            const link = document.createElement('a');
            link.href = `data:application/zip;base64,${base64}`;
            link.download = 'ar.zip';
            link.click();
        });
};

/**
 * Stores the session data and redirects to publish page.
 *
 * @param {event} event
 */
const publish = () => {
    // TODO: replace alerts with HTML error messages.

    if (!window.markerImage) return alert('Please, select a marker image.');
    if (!window.assetType) return alert('Please, select the correct content type.');
    if (!window.assetFile || !window.assetName) return alert('Please, upload a content.');

    MarkerModule.getMarkerPattern(window.markerImage)
        .then((markerPattern) => {
            window.name = JSON.stringify({
                arType: 'pattern',
                assetType: window.assetType, // image/audio/video/3d
                assetFile: window.assetFile,
                assetName: window.assetName,
                assetParam: window.assetParam,
                markerPatt: markerPattern,
                markerImage: window.markerImage,
                fullMarkerImage: window.fullMarkerImage,
            });

            window.location = '../publish';
        }
        )
}

zipButton.addEventListener('click', zip);
githubButton.addEventListener('click', publish);
