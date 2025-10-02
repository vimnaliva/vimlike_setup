settings.map('v', function(vimlike) {
    vimlike.click('//a[text()=">"]');
});

settings.map('b', function(vimlike) {
    vimlike.click('//a[text()="<"]');
});

settings.map('2', function(vimlike) {
    vimlike.click('//a[text()="有修正"]');
});

settings.map('3', function(vimlike) {
    vimlike.click('//a[text()="無修正"]');
});

settings.map('4', function(vimlike) {
    vimlike.click('//a[text()="モザイク破壊"]');
});


// 通用搜索（优先使用选中文字）
settings.map('g e', function(vimlike) {
    var selected = window.getSelection().toString().trim();
//    var selected = window.getSelection().toString().trim().slice(0, 7); // 取前7个字符，fc2ppvdb
    if (selected) {
        window.open("https://supjav.com/ja/?s=" + encodeURIComponent(selected), "_blank");
    } else {
        var query = prompt("search supjav:");
        if (query) {
            window.open("https://supjav.com/ja/?s=" + encodeURIComponent(query), "_blank");
        }
    }
});

settings.map('g d', function(vimlike) {
    var selected = window.getSelection().toString().trim();
    if (selected) {
        window.open("https://www.dmm.co.jp/search/=/searchstr=" + encodeURIComponent(selected), "_blank");
    } else {
        var query = prompt("search dmm:");
        if (query) {
            window.open("https://www.dmm.co.jp/search/=/searchstr=" + encodeURIComponent(query), "_blank");
        }
    }
});

settings.map('g v', function(vimlike) {
    var selected = window.getSelection().toString().trim();
    if (selected) {
        window.open("https://fc2ppvdb.com/articles/" + encodeURIComponent(selected), "_blank");
    } else {
        var query = prompt("search fc2ppvdb:");
        if (query) {
            window.open("https://fc2ppvdb.com/articles/" + encodeURIComponent(query), "_blank");
        }
    }
});


settings.map('m', function(vimlike) {
    var video = document.querySelector('video');
    if (!video) return;

    if (video.muted) {
        // 当前静音，尝试取消静音并播放
        // iOS Safari 要求用户手势 + 视频播放才能取消静音
        video.play().then(() => {
            video.muted = false;
        }).catch(() => {
            // 播放被阻止，保持静音状态
            console.log("播放被阻止，需要用户交互");
        });
    } else {
        // 当前已取消静音，切换回静音
        video.muted = true;
    }
});
