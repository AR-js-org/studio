const { MarkerModule, Package } = ARjsStudioBackend;

var githubButton = document.querySelector('page-footer').shadowRoot.querySelector('#github-publish');
var zipButton = document.querySelector('page-footer').shadowRoot.querySelector('#zip-publish');

window.assetParam = {
    scale: 1.0,
    size: {
        width: 1.0,
        height: 1.0,
        depth: 1.0,
    },
};

/**
 * Initialize the default marker image on page load.
 */
const setDefaultMarker = () => {
    const c = document.createElement('canvas');
    const img = document.querySelector('.default-marker-hidden');
    c.height = img.naturalHeight;
    c.width = img.naturalWidth;
    const ctx = c.getContext('2d');

    ctx.drawImage(img, 0, 0, c.width, c.height);
    const base64String = c.toDataURL();
    window.markerImage = base64String;

    MarkerModule.getFullMarkerImage(base64String, 0.5, 512, "black")
        .then((fullMarkerImage) => {
            window.fullMarkerImage = fullMarkerImage;
            img.remove();
        });
}

const checkUserUploadStatus = () => {
    enablePageFooter(window.markerImage && window.assetFile);
}

// All the required components are uploaded by the user => footer will be enable
const enablePageFooter = (enable) => {
    if (enable) {
        githubButton.classList.remove('publish-disabled');
        zipButton.classList.remove('publish-disabled');
        githubButton.removeAttribute('disabled');
        zipButton.removeAttribute('disabled');
    } else {
        githubButton.classList.add('publish-disabled');
        zipButton.classList.add('publish-disabled');
        githubButton.setAttribute('disabled', '');
        zipButton.setAttribute('disabled', '');
    }
}

const zip = () => {
    // TODO: replace alerts with HTML error messages.
    if (!window.markerImage) return alert('please select a marker image');
    if (!window.assetType) return alert('please select the correct content type');
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
