window.onload = function() {
    loadVideos();
    registerTouch();
};

var loadVideos = function() {
    var dir = './videos/';
    var playlist = [
        dir + '0.mp4',
        dir + '1.mp4',
        dir + '2.mp4'
    ];

    var videoElement = document.querySelector('video');
    var index = 0;
    videoElement.src = playlist[index];

    videoElement.addEventListener('loadedmetadata', function () {
        videoElement.play();
    });

    videoElement.addEventListener('ended', function() {
        index++;
        var i = index === playlist.length ? 0 : index;

        if (i === 0) index = i;

        videoElement.src = playlist[i];
        videoElement.play();
    });
};

var registerTouch = function() {
    var button = document.querySelector('button[data-action="show"]');
    if (!button) {
        return;
    }

    if (window.innerWidth < 850) {
        document.querySelector('video').controls = false;
    }

    var menu = document.querySelector('.menu');
    var iphone = document.querySelector('.px');

    button.addEventListener('click', function() {
        if (window.visibleVideo) {
            menu.style.opacity = 1;
            iphone.style.opacity = 0.15;
            window.visibleVideo = false;
            return;
        }

        window.visibleVideo = true;
        iphone.style.opacity = 1;
        menu.style.opacity = 0;
    });
};
