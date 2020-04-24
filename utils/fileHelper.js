const supportedFileMap = {
    '3d': {
        types: ['gltf', 'glb', 'zip'],
        maxSize: 50 * 1024 * 1024,
        maxSizeText: '50MB',
    },
    image: {
        types: ['image/png', 'image/jpeg', 'image/gif'],
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

function isValidFile (type, file, errorId) {
    const supportedFile = supportedFileMap[type];
    const previewError = document.getElementById(errorId)

    if (!isValidFileType(type, file)) {
        previewError.innerHTML = '*Please select an option before uploading a file.';
        return false;
    }
    if (isValidFileSize(type, file)) {
        previewError.innerHTML = `*The file is too large. Max size is ${supportedFile.maxSizeText}.`;
        return false;
    }
    if (isValidFileType(type, file)) {
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

/** Checks whether file extention is correct based on its type. */
function isValidFileExt(type, file) {
    const supportedFile = supportedFileMap[type];
    const fileType = type === '3d' ? file.name.split('.').slice(-1)[0] : file.type
    return supportedFile.types.includes(fileType)
}

/** Checks whether file size is correct based on its type. */
function isValidFileSize(type, file) {
    const supportedFile = supportedFileMap[type];
    return file.size > supportedFile.maxSize;
}