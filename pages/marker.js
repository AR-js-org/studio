const { MarkerModule, Package } = ARjsStudioBackend;

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

    MarkerModule.getFullMarkerImage(base64String, 0.5, 512, "black")
        .then((fullMarkerImage) => {
            window.fullMarkerImage = fullMarkerImage;
            window.markerImage = fullMarkerImage;
        })
}


//Check method when user correctly upload a content
const checkUserUploadStatus = () =>
{
    debugger;
    if (window.markerImage && window.assetFile )
    {
        enableMarkerFooter();
    }
}

//All the required components are uploaded by the user => footer will be enable
const enableMarkerFooter = () => 
{
    var githubutton = document.querySelector('page-footer')
        .shadowRoot.querySelector('#github-publish-button');

    var zipbutton = document.querySelector('page-footer')
        .shadowRoot.querySelector('#zip-button');

    githubutton.classList.remove('publish-disabled');
    zipbutton.classList.remove('publish-disabled');
    zipbutton.setAttribute('disabled',false);

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
            assetParam: window.assetParam,
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
