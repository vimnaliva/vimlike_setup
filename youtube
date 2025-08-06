// Go to Home
settings.map('g h', function(vimlike) {
    window.open("https://www.youtube.com", "_self");
});

// settings.map('bracketleft', function(vimlike) {
//    vimlike.click('shift+n');
// });

//settings.map('bracketright', function(vimlike) {
//    vimlike.click('shift+p');
//});


// 显示速度浮动提示
function showSpeedOverlay(speed) {
    var overlay = document.createElement("div");
    overlay.innerText = "速度: " + speed + "x";
    overlay.style.position = "fixed";
    overlay.style.bottom = "20px";
    overlay.style.right = "20px";
    overlay.style.padding = "10px 15px";
    overlay.style.backgroundColor = "rgba(0,0,0,0.7)";
    overlay.style.color = "white";
    overlay.style.fontSize = "16px";
    overlay.style.borderRadius = "8px";
    overlay.style.zIndex = "9999";
    document.body.appendChild(overlay);
    setTimeout(function() {
        document.body.removeChild(overlay);
    }, 1500);
}

// 恢复正常速度 (1x)
settings.map('U', function(vimlike) {
    var videos = document.querySelectorAll("video");
    for (var video of videos) {
        video.playbackRate = 1;
    }
    console.log("Playback speed reset to 1x");
    showSpeedOverlay(1);
});

// P键: 从 2.25x 开始，每次 +0.25，到 4x 为止
settings.map('bracketright', function(vimlike) {
    var videos = document.querySelectorAll("video");
    for (var video of videos) {
        var current = video.playbackRate;
        var newSpeed = 0;
        if (current < 2.25) {
            newSpeed = 2.25;
        } else if (current < 4) {
            newSpeed = Math.round((current + 0.25) * 100) / 100;
            if (newSpeed > 4) newSpeed = 4;
        } else {
            newSpeed = 4;
        }
        video.playbackRate = newSpeed;
    }
    var speed = videos[0] ? videos[0].playbackRate : 'N/A';
    console.log("P key playback speed set to " + speed + "x");
    showSpeedOverlay(speed);
});

// O键: 每次 -0.25，最低到 0.5x
settings.map('bracketleft', function(vimlike) {
    var videos = document.querySelectorAll("video");
    for (var video of videos) {
        var current = video.playbackRate;
        var newSpeed = Math.max(0.5, Math.round((current - 0.25) * 100) / 100);
        video.playbackRate = newSpeed;
    }
    var speed = videos[0] ? videos[0].playbackRate : 'N/A';
    console.log("O key playback speed decreased to " + speed + "x");
    showSpeedOverlay(speed);
});
