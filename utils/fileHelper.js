const supportedFileMap = {
    '3d': {
        types: ['gltf', 'glb', 'zip'],
        maxSize: 50 * 1024 * 1024,
        maxSizeText: '50MB',
    },
    image: {
        types: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
        maxSize: 15 * 1024 * 1024,
        maxSizeText: '15MB',
    },
    audio: {
        types: ['audio/wav', 'audio/mp3'],
        maxSize: 10 * 1024 * 1024,
        maxSizeText: '10MB',
    },
    video: {
        types: ['video/mp4'],
        maxSize: 25 * 1024 * 1024,
        maxSizeText: '25MB',
    }
};

function getFileType(file) {
    let type = file.name.split('.').pop().toLocaleLowerCase();

    if (supportedFileMap['3d'].types.indexOf(type) > -1) return '3d';
    if (supportedFileMap['image'].types.indexOf('image/' + type) > -1) return 'image';
    if (supportedFileMap['audio'].types.indexOf('audio/' + type) > -1) return 'audio';
    if (supportedFileMap['video'].types.indexOf('video/' + type) > -1) return 'video';
};

function isValidFile(type, file, errorId) {
    const supportedFile = supportedFileMap[type];
    const previewError = document.getElementById(errorId)

    if (!type || !isValidFileType(type, file)) {
        previewError.innerHTML = '*Please select a supported file listed above.';
        return false;
    }
    if (!isValidFileSize(type, file)) {
        previewError.innerHTML = `*The file is too large. Max size is ${supportedFile.maxSizeText}.`;
        return false;
    }
    if (!isValidFileExt(type, file)) {
        previewError.innerHTML = `*The file is not supported. Supported file types are ${supportedFile.types.join(', ')}.`;
        return false;
    }

    previewError.innerHTML = ""
    return true
};

/** Checks whether file is uploaded and its type exists in the supportedFileMap. */
function isValidFileType(type, file) {
    const supportedFile = supportedFileMap[type];
    return supportedFile && file;
}

/** Checks whether file size is correct based on its type. */
function isValidFileSize(type, file) {
    const supportedFile = supportedFileMap[type];
    return file.size < supportedFile.maxSize;
}

/** Checks whether file extention is correct based on its type. */
function isValidFileExt(type, file) {
    const supportedFile = supportedFileMap[type];
    const fileType = type === '3d' ? file.name.split('.').slice(-1)[0] : file.type
    return supportedFile.types.includes(fileType)
}

function dataURItoBlob(dataURI) {
    const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const binary = atob(dataURI.split(",")[1]);
    let array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
}
