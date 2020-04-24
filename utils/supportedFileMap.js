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