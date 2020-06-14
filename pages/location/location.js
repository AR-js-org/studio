const { Package } = ARjsStudioBackend;

function checkTpl(tpl) {
    tpl.showDistance = !!tpl.showDistance;
    tpl.showName = !!tpl.showName;
    tpl.heightFromGround = parseFloat(tpl.heightFromGround) || 0;
    if (tpl.places && tpl.places.length > 0) {
        for (let places = tpl.places, i = places.length - 1; i >= 0; i--) {
            let one = places[i];
            // one.id ??
            one.name = (one.name || '').trim();

            one.latitude = parseFloat(one.latitude);
            if (isNaN(one.latitude) || one.latitude < -90 || one.latitude > 90) return `The ${i + 1} latitude shoulde be in range of -90 ~ 90`;

            one.longitude = parseFloat(one.longitude);
            if (isNaN(one.longitude) || one.longitude < -180 || one.longitude > 180) return `The ${i + 1} longitude shoulde be in range of -90 ~ 90`;
        }
    }
    if (!tpl.places || tpl.places.length < 1) return 'No valid places';
};

function getTplFile(self) {
    const tplError = document.getElementById("tpl-error");
    tplError.innerHTML = '';

    const file = self.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = function () {
        try {
            eval('var tpl=' + reader.result);
            let error = checkTpl(tpl);
            if (error) {
                tplError.innerHTML = '* Your uploaded JSON file is error: <br/>' + error;
            } else {
                // TODO use this tpl
                console.log(tpl);
            }

        } catch (error) {
            tplError.innerHTML = '* Your uploaded JSON file is error: <br/>' + error.toString();
        }
    };


    self.value = ''; // Reset required for re-upload
};

function uploadLocations() {
    var uploadTpl = document.getElementById('uploadTpl');
    uploadTpl.click();
};

function downloadJsonTpl() {
    // var tpl = 'aaaa';
    var base64 = btoa(multiLocationsTemplate);
    var link = document.createElement('a');
    link.href = `data:application/json;base64,${base64}`;
    link.download = "template.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
var githubButton = document.querySelector('page-footer').shadowRoot.querySelector('#github-publish');
var zipButton = document.querySelector('page-footer').shadowRoot.querySelector('#zip-publish');

window.locations = true;
window.assetParam = {
    scale: 1.0,
    size: {
        width: 1.0,
        height: 1.0,
        depth: 1.0,
    },
    locations: [
        // {
        //     latitude: 12.345678, // required for location based AR
        //     longitude: 12.345678 // required for location based AR
        // }
    ]
};

const checkUserUploadStatus = () => {
    enablePageFooter(window.assetParam.locations.length && window.assetFile);
};

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
    if (!window.assetParam.locations.length) return alert('please select a location');
    if (!window.assetType) return alert('please select the correct content type');
    if (!window.assetFile || !window.assetName) return alert('please upload a content');


    // create the package
    const package = new Package({
        arType: 'location',
        assetType: window.assetType, // image/audio/video/3d
        assetFile: window.assetFile,
        assetName: window.assetName,
        assetParam: window.assetParam
    });

    package.serve({ packageType: 'zip' }).then((base64) => {
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

    if (!window.assetParam.locations.length) return alert('please select a location');
    if (!window.assetType) return alert('Please, select the correct content type.');
    if (!window.assetFile || !window.assetName) return alert('Please, upload a content.');

    window.name = JSON.stringify({
        arType: 'location',
        assetType: window.assetType, // image/audio/video/3d
        assetFile: window.assetFile,
        assetName: window.assetName,
        assetParam: window.assetParam,
    });

    window.location = '../publish';

}

zipButton.addEventListener('click', zip);
githubButton.addEventListener('click', publish);
