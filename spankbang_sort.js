settings.map('v', function(vimlike) {
    vimlike.click('//li[contains(@class,"next")]/a');
});

settings.map('p', function(vimlike) {
    var btn = document.querySelector('button.vjs-play-control');
    if (btn) {
        btn.click();
    }
});

settings.map('9', function(vimlike) {
    // 获取所有包含评价值的元素
    const videoItems = document.querySelectorAll('[data-testid="video-item"]');

    videoItems.forEach(item => {
        const rateElement = item.querySelector('[data-testid="rates"] .md\\:text-body-md');
        if (rateElement) {
            const text = rateElement.textContent.trim().replace('%', '');
            const rate = parseFloat(text);
            if (rate < 90) {
                // 评价值小于 90%，变灰处理
                item.style.opacity = '0.3';
            } else {
                // 满足条件的高亮显示
                item.style.opacity = '1';
            }
        } else {
            // 没有评价信息的也变灰
            item.style.opacity = '0.3';
        }
    });
});


settings.map('0', function(vimlike) {
    const videoItems = document.querySelectorAll('[data-testid="video-item"]');

    videoItems.forEach(item => {
        const rateElement = item.querySelector('[data-testid="rates"] .md\\:text-body-md');
        if (rateElement) {
            const text = rateElement.textContent.trim().replace('%', '');
            const rate = parseFloat(text);
            if (rate < 90) {
                // 隐藏评价值小于 90% 的视频
                item.style.display = 'none';
            } else {
                item.style.display = '';
            }
        } else {
            // 没有评价信息的也隐藏
            item.style.display = 'none';
        }
    });
});

settings.map('8', function(vimlike) {
    const container = document.querySelector('#video_theater') || document.body; // 容器节点
    const items = Array.from(document.querySelectorAll('[data-testid="video-item"]'));

    const withRate = items.map(item => {
        const rateEl = item.querySelector('[data-testid="rates"] .md\\:text-body-md');
        const rate = rateEl ? parseFloat(rateEl.textContent.trim().replace('%', '')) : -1;
        return { item, rate };
    });

    withRate.sort((a, b) => b.rate - a.rate); // 从高到低排序

    // 清空父容器中的旧排序内容（只移除原有项目）
    withRate.forEach(({ item }) => item.remove());

    // 插入新排序后的项目
    withRate.forEach(({ item }) => container.appendChild(item));
});
