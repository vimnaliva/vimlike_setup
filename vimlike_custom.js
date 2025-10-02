// Scroll
settings.map('j', VLCommand.SCROLL_DOWN, {excludes: ['https://www.youtube.com/watch', 'https://www.netflix.com/watch/']});
settings.map('k', VLCommand.SCROLL_UP, {excludes: ['https://www.youtube.com/watch', 'https://www.netflix.com/watch/']});
settings.map('h', VLCommand.SCROLL_LEFT, {excludes: ['https://www.youtube.com/watch', 'https://www.netflix.com/watch/']});
settings.map('l', VLCommand.SCROLL_RIGHT, {excludes: ['https://www.youtube.com/watch', 'https://www.netflix.com/watch/']});
// settings.map('d', VLCommand.HALF_PAGE_DOWN);
// settings.map('e', VLCommand.HALF_PAGE_UP);
settings.map('space', VLCommand.HALF_PAGE_DOWN, {excludes: ['https://www.youtube.com/watch', 'https://www.netflix.com/watch/']});
settings.map('shift+space', VLCommand.HALF_PAGE_UP);
settings.map('shift+d', VLCommand.PAGE_DOWN);
settings.map('shift+e', VLCommand.PAGE_UP);
settings.map('g g', VLCommand.SCROLL_TO_TOP);
settings.map('shift+g', VLCommand.SCROLL_TO_BOTTOM);
settings.map('e', VLCommand.SCROLL_TO_BOTTOM);

// Normal mode
settings.map('f', VLCommand.ACTIVATE_LINK, {excludes: ['https://www.youtube.com/watch', 'https://www.netflix.com/watch/']});
settings.map('shift+f', VLCommand.ACTIVATE_LINK);
settings.map('d', VLCommand.ACTIVATE_LINK_WITH_NEW_TAB);
settings.map('n', VLCommand.NEXT_LINK, {excludes: ['https://www.youtube.com/watch', 'https://www.netflix.com/watch/']});
settings.map('shift+n', VLCommand.PREV_LINK, {excludes: ['https://www.youtube.com/watch', 'https://www.netflix.com/watch/']});
settings.map('tab', VLCommand.NEXT_LINK);
settings.map('shift+tab', VLCommand.PREV_LINK);
settings.map('a', VLCommand.GO_BACK);
settings.map('s', VLCommand.GO_FORWARD);
settings.map('q', VLCommand.PREV_TAB);
settings.map('w', VLCommand.NEXT_TAB);
settings.map('v t', VLCommand.NEW_TAB);
settings.map('t', VLCommand.NEW_TAB, {excludes: ['https://www.youtube.com/watch', 'https://www.netflix.com/watch/']});
settings.map('i', VLCommand.FOCUS_INPUT, {excludes: ['https://chatgpt.com/']});
settings.map('slash', VLCommand.SHOW_CONSOLE);
settings.map('ctrl+i', VLCommand.INSERT_MODE);
settings.map('g i', VLCommand.INSERT_MODE);
settings.map('g 1', VLCommand.OPEN_TAB1);
settings.map('g 2', VLCommand.OPEN_TAB2);
settings.map('g 3', VLCommand.OPEN_TAB3);
settings.map('g 4', VLCommand.OPEN_TAB4);
settings.map('g 5', VLCommand.OPEN_TAB5);
settings.map('g 6', VLCommand.OPEN_TAB6);
settings.map('g 7', VLCommand.OPEN_TAB7);
settings.map('g 8', VLCommand.OPEN_TAB8);
settings.map('g 9', VLCommand.OPEN_TAB9);
settings.map('g 0', VLCommand.OPEN_LAST_TAB);
settings.map('x', VLCommand.CLOSE_TAB);
settings.map('ctrl+u', VLCommand.VIDEO_FULLSCREEN);
settings.map('ctrl+p', VLCommand.VIDEO_PIP);
settings.map('ctrl+d', VLCommand.DARK_MODE);
settings.map('r', VLCommand.RELOAD);
settings.map('?', VLCommand.TOGGLE_HELP);
settings.map('shift+slash', VLCommand.TOGGLE_HELP);
settings.map('/', VLCommand.SHOW_CONSOLE);
settings.map('c c', VLCommand.COPY_CURRENT_URL);
settings.map('y y', VLCommand.COPY_CURRENT_URL);
settings.map('y t', VLCommand.DUPLICATE_TAB);
settings.map('g shift+u', VLCommand.GO_TO_URL_ROOT);
settings.map('g u', VLCommand.GO_TO_URL_UP);
settings.map('ctrl+m', VLCommand.ZOOM_IN);
settings.map('shift+r', VLCommand.TOGGLE_READER_MODE);
settings.map('o', VLCommand.OPEN_SELECTED_LINK_IN_NEW_TAB);
settings.map('O', VLCommand.OPEN_SELECTED_LINK);


// 通用搜索（优先使用选中文字）
settings.map('g s', function(vimlike) {
    var selected = window.getSelection().toString().trim();
    if (selected) {
        window.open("https://www.google.com/search?q=" + encodeURIComponent(selected), "_blank");
    } else {
        var query = prompt("Google search:");
        if (query) {
            window.open("https://www.google.com/search?q=" + encodeURIComponent(query), "_blank");
        }
    }
});

// 搜索「意味」版
settings.map('g a', function(vimlike) {
    var selected = window.getSelection().toString().trim();
    if (selected) {
        window.open("https://www.google.com/search?q=" + encodeURIComponent(selected + " 意味"), "_blank");
    } else {
        var query = prompt("Google search (意味):");
        if (query) {
            window.open("https://www.google.com/search?q=" + encodeURIComponent(query + " 意味"), "_blank");
        }
    }
});


// ----------------------
// 自制居中悬浮 Search Bar（偏灰黄 + 高度 + 动画 + 光标全选）
// ----------------------
function createSearchBar() {
    if (document.getElementById('vimlike-searchbar')) return;

    let input = document.createElement('input');
    input.id = 'vimlike-searchbar';
    input.type = 'text';
    input.placeholder = 'Search... (yt: YouTube, j: 意味, URL)';

    // 自动填入选中的文本
    let selectedText = window.getSelection().toString().trim();
    if (selectedText) input.value = selectedText;

    Object.assign(input.style, {
        position: 'fixed',
        top: '40%', // 调整到屏幕稍上方
        left: '50%',
        transform: 'translate(-50%, -50%) scale(0.9)',
        width: '50%', // 宽度略小
        padding: '1em 1em', // 高度增加
        fontSize: '1.1em',
        zIndex: 99999,
        borderRadius: '12px',
        border: 'none',
        outline: 'none',
        background: 'rgba(192, 192, 192, 0.7)', // 半透明灰黄色
        color: '#000',
        boxShadow: '0 0 23px rgba(255, 222, 173, 0.4)', // 柔和光晕
        opacity: '0',
        transition: 'all 0.2s ease-in-out',
    });

    document.body.appendChild(input);

    // 弹出动画 + 自动全选
    setTimeout(() => {
        input.style.opacity = '1';
        input.style.transform = 'translate(-50%, -50%) scale(1)';
        if (selectedText) input.select();
    }, 10);

    input.focus();

    function removeInput() {
        if (!input || !input.parentNode) return;
        input.style.opacity = '0';
        input.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            if (input.parentNode) input.parentNode.removeChild(input);
        }, 200);
        document.removeEventListener('keydown', keyHandler);
    }

    function keyHandler(e) {
        if (!input) return;

        if (e.key === 'Enter') {
            let val = input.value.trim();
            if (!val) return;

            let lower = val.toLowerCase();
            let mainText = val;
            let prefix = '';

            // 支持 j 或 yt 前/后缀
            if (lower.startsWith('j ')) {
                prefix = 'j';
                mainText = val.slice(2).trim();
            } else if (lower.endsWith(' j')) {
                prefix = 'j';
                mainText = val.slice(0, -2).trim();
            } else if (lower.startsWith('yt ')) {
                prefix = 'yt';
                mainText = val.slice(3).trim();
            } else if (lower.endsWith(' yt')) {
                prefix = 'yt';
                mainText = val.slice(0, -3).trim();
            }

            // 根据前缀搜索
            if (prefix === 'j') {
                window.open('https://www.google.com/search?q=' + encodeURIComponent(mainText + ' 意味'), '_blank');
            } else if (prefix === 'yt') {
                window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(mainText), '_blank');
            } else if (val.startsWith('http://') || val.startsWith('https://')) {
                window.open(val, '_blank');
            } else if (/^[\w.-]+\.[a-z]{2,}$/i.test(val)) {
                window.open('https://' + val, '_blank');
            } else {
                window.open('https://www.google.com/search?q=' + encodeURIComponent(val), '_blank');
            }

            removeInput();
        } else if (e.key === 'Escape') {
            removeInput();
        }
    }

    document.addEventListener('keydown', keyHandler);
}

// ----------------------
// 快捷键绑定
// ----------------------
settings.map('o', function(vimlike) {
    createSearchBar();
});
