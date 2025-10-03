// ==UserScript==
// @name         Google Search Button
// @description  選択した単語の近くに小ボタン表示、iPadの選択メニューと重ならないよう40pxオフセット
// @version      1.3
// @match        *://*/*
// @grant        none
// @inject-into  content
// ==/UserScript==

(function() {
    'use strict';

    let btn = null;
    let timer = null;
    const BUTTON_SIZE = 36;
    const OFFSET = 66; // 离选中文本的距离

    function removeButton() {
        if (btn) {
            btn.style.opacity = '0';
            setTimeout(() => {
                if (btn) btn.remove();
                btn = null;
            }, 200);
        }
    }

    function createButton(text, rect) {
        removeButton();

        btn = document.createElement('button');
        btn.textContent = '🔍';
        Object.assign(btn.style, {
            position: 'absolute',
            zIndex: 999999,
            width: `${BUTTON_SIZE}px`,
            height: `${BUTTON_SIZE}px`,
            borderRadius: `${BUTTON_SIZE/2}px`,
            border: 'none',
            background: 'rgba(255, 230, 180, 0.95)',
            color: '#000',
            fontSize: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            opacity: '0',
            transition: 'all 0.2s ease-in-out'
        });

        let scrollY = window.scrollY || window.pageYOffset;
        let spaceBelow = window.innerHeight - rect.bottom;
        let spaceAbove = rect.top;

        let top;
        if (spaceBelow > OFFSET) {
            top = rect.bottom + scrollY + OFFSET; // 下方显示，离选区约40px
        } else if (spaceAbove > OFFSET) {
            top = rect.top + scrollY - BUTTON_SIZE - OFFSET; // 上方显示，离选区约40px
        } else {
            // 空间不足时，显示在屏幕底部
            top = window.innerHeight - BUTTON_SIZE - 10 + scrollY;
        }

        // 左侧微调，避免超出屏幕
        let left = rect.left + scrollX;
        if (left + BUTTON_SIZE > window.innerWidth - 10) {
            left = window.innerWidth - BUTTON_SIZE - 10;
        }

        btn.style.top = `${top}px`;
        btn.style.left = `${left}px`;

        btn.addEventListener('click', () => {
            const url = `https://www.google.com/search?q=${encodeURIComponent(text)}+意味`;
            window.open(url, '_blank');
            removeButton();
        });

        document.body.appendChild(btn);
        setTimeout(() => { btn.style.opacity = '1'; }, 10);
    }

    document.addEventListener('selectionchange', () => {
        clearTimeout(timer);
        removeButton();

        const selText = window.getSelection().toString().trim();
        if (!selText) return;

        timer = setTimeout(() => {
            let rect;
            try {
                rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
            } catch (e) {
                rect = { bottom: window.innerHeight - 50, left: window.innerWidth - 60, top: window.innerHeight - 50 };
            }

            createButton(selText, rect);
        }, 1000);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') removeButton();
    });

    document.addEventListener('click', (e) => {
        if (btn && !btn.contains(e.target)) removeButton();
    });

})();
