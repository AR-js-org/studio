
const handleZip = (file, cb) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function () {
        const data = reader.result;
        JSZip.loadAsync(data).then((zip) => {
            for (let i in zip.files) console.log(i);
            for (let i in zip.files) {
                if (/.gltf$/.test(i)) {

                    zip.file(i).async('string').then(text => {
                        try {
                            let gltf = JSON.parse(text);
                            let buffers = gltf.buffers || [];
                            let images = gltf.images || [];
                            let uri;
                            let targets = [];

                            console.log(gltf.buffers);
                            console.log(gltf.images);
                            for (let i = 0; i < buffers.length; i++) {
                                uri = buffers[i].uri;
                                if (uri.indexOf('data:application/octet-stream;base64,') != 0) { // need a related file
                                    targets.push(buffers[i])
                                }
                            }
                            for (let i = 0; i < images.length; i++) {
                                uri = images[i].uri;
                                if (uri.indexOf('data:application/octet-stream;base64,') != 0) { // need a related file
                                    targets.push(images[i])
                                }
                            }
                            extractTargets(gltf, targets, zip, cb);
                        } catch (error) {
                            cb(error);
                        }
                    }).catch(error => { cb(error) });
                    return;
                }
            }
            cb('no gltf file in the zip');
        });
    };
};

const extractTargets = function (gltf, targets, zip, cb) {
    if (targets.length < 1) {
        return cb(false, 'data:application/octet-stream;base64,' + btoa(JSON.stringify(gltf)));
    }
    let one = targets.shift();
    console.log(one.uri);
    zip.file(one.uri).async('base64').then(base64 => {
        one.uri = 'data:application/octet-stream;base64,' + base64;
        extractTargets(gltf, targets, zip, cb);
    }).catch(err => {
        console.log(err);
    })
};
