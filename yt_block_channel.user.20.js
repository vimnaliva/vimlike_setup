// ==UserScript==
// @name         YouTube 频道屏蔽器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 YouTube 上屏蔽特定频道
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 存储被屏蔽的频道列表
    let blockedChannels = [];

    // 初始化：从 cookie 读取被屏蔽的频道
    function initBlockedChannels() {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('blockedChannels='));
        if (cookie) {
            try {
                blockedChannels = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
            } catch (e) {
                blockedChannels = [];
            }
        }
    }

    // 保存被屏蔽的频道到 cookie
    function saveBlockedChannels() {
        const date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = `blockedChannels=${encodeURIComponent(JSON.stringify(blockedChannels))}; expires=${date.toUTCString()}; path=/`;
    }

    // 屏蔽频道
    function blockChannel(channelName, channelUrl) {
        if (!blockedChannels.some(ch => ch.url === channelUrl)) {
            blockedChannels.push({ name: channelName, url: channelUrl });
            saveBlockedChannels();
            hideBlockedChannels();
            alert(`✅ 已屏蔽频道: ${channelName}\n当前共屏蔽 ${blockedChannels.length} 个频道`);
        }
    }

    // 取消屏蔽频道
    function unblockChannel(channelUrl) {
        blockedChannels = blockedChannels.filter(ch => ch.url !== channelUrl);
        saveBlockedChannels();
        hideBlockedChannels();
    }

    // 隐藏被屏蔽的频道视频
    function hideBlockedChannels() {
        const videoElements = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-playlist-video-renderer');
        
        videoElements.forEach(video => {
            let channelLink = video.querySelector('#channel-name a, #text a[href*="/@"], #text a[href*="/channel/"], ytd-channel-name a, yt-formatted-string.ytd-channel-name a');
            
            if (!channelLink) {
                const allLinks = video.querySelectorAll('a[href*="/@"], a[href*="/channel/"]');
                for (let link of allLinks) {
                    if (link.href.includes('/@') || link.href.includes('/channel/')) {
                        channelLink = link;
                        break;
                    }
                }
            }
            
            if (channelLink) {
                const channelUrl = channelLink.href;
                const isBlocked = blockedChannels.some(ch => ch.url === channelUrl);
                
                if (isBlocked) {
                    video.style.display = 'none';
                } else {
                    video.style.display = '';
                }
            }
        });
    }

    // 创建屏蔽按钮
    function createBlockButton(channelName, channelUrl) {
        const button = document.createElement('button');
        button.textContent = '🚫 屏蔽此频道';
        button.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(255, 0, 0, 0.8);
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            z-index: 1000;
            display: none;
        `;
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            blockChannel(channelName, channelUrl);
        });
        
        return button;
    }

    // 为频道名添加屏蔽按钮
    function addBlockButtons() {
        const videoElements = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-playlist-video-renderer');
        
        videoElements.forEach(video => {
            if (video.dataset.blockButtonAdded) return;
            
            let channelLink = video.querySelector('#channel-name a, #text a[href*="/@"], #text a[href*="/channel/"], ytd-channel-name a, yt-formatted-string.ytd-channel-name a');
            
            if (!channelLink) {
                const allLinks = video.querySelectorAll('a[href*="/@"], a[href*="/channel/"]');
                for (let link of allLinks) {
                    if (link.href.includes('/@') || link.href.includes('/channel/')) {
                        channelLink = link;
                        break;
                    }
                }
            }
            
            if (channelLink) {
                video.dataset.blockButtonAdded = 'true';
                
                const channelName = channelLink.textContent.trim();
                const channelUrl = channelLink.href;
                
                if (!channelName) return;
                
                video.style.position = 'relative';
                
                const blockButton = createBlockButton(channelName, channelUrl);
                video.appendChild(blockButton);
                
                video.addEventListener('mouseenter', () => {
                    blockButton.style.display = 'block';
                });
                
                video.addEventListener('mouseleave', () => {
                    blockButton.style.display = 'none';
                });
                
                let touchTimer;
                video.addEventListener('touchstart', (e) => {
                    blockButton.style.display = 'block';
                    clearTimeout(touchTimer);
                    touchTimer = setTimeout(() => {
                        blockButton.style.display = 'none';
                    }, 3000);
                }, { passive: true });
            }
        });
    }

    // 创建管理面板
    function createManagementPanel() {
        const panel = document.createElement('div');
        panel.id = 'channel-blocker-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            width: 90%;
            max-width: 500px;
            max-height: 70vh;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: none;
            color: black;
        `;
        
        const title = document.createElement('h3');
        title.textContent = '已屏蔽的频道';
        title.style.cssText = 'margin-top: 0; color: black;';
        panel.appendChild(title);
        
        const debugInfo = document.createElement('div');
        debugInfo.id = 'debug-info';
        debugInfo.style.cssText = `
            background: #ffe4e1;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 6px;
            font-size: 13px;
            color: #333;
            border: 2px solid #ff6b6b;
        `;
        panel.appendChild(debugInfo);
        
        const list = document.createElement('div');
        list.id = 'blocked-channel-list';
        list.style.cssText = 'min-height: 50px; color: black;';
        panel.appendChild(list);
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = `
            margin-top: 10px;
            padding: 8px 16px;
            background: #065fd4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        closeButton.addEventListener('click', () => {
            panel.style.display = 'none';
        });
        panel.appendChild(closeButton);
        
        document.body.appendChild(panel);
        return panel;
    }

    // 导出屏蔽列表
    function exportBlockedChannels() {
        const dataStr = JSON.stringify(blockedChannels, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'youtube_blocked_channels_' + new Date().toISOString().split('T')[0] + '.json';
        link.click();
        URL.revokeObjectURL(url);
        alert('✅ 导出成功！共 ' + blockedChannels.length + ' 个频道');
    }

    // 导入屏蔽列表
    function importBlockedChannels() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const importedData = JSON.parse(event.target.result);
                    
                    if (!Array.isArray(importedData)) {
                        alert('❌ 文件格式错误：不是有效的数组');
                        return;
                    }
                    
                    // 验证数据格式
                    let validCount = 0;
                    for (let i = 0; i < importedData.length; i++) {
                        const item = importedData[i];
                        if (item.name && item.url) {
                            validCount++;
                        }
                    }
                    
                    if (validCount === 0) {
                        alert('❌ 文件中没有有效的频道数据');
                        return;
                    }
                    
                    // 询问是否覆盖
                    const currentCount = blockedChannels.length;
                    let confirmed = true;
                    
                    if (currentCount > 0) {
                        confirmed = confirm(
                            '当前已有 ' + currentCount + ' 个屏蔽频道\n' +
                            '导入的文件包含 ' + validCount + ' 个频道\n\n' +
                            '选择"确定"将合并列表（去重）\n' +
                            '选择"取消"将取消导入'
                        );
                    }
                    
                    if (!confirmed) return;
                    
                    // 合并数据（去重）
                    const existingUrls = new Set(blockedChannels.map(ch => ch.url));
                    let addedCount = 0;
                    
                    for (let i = 0; i < importedData.length; i++) {
                        const item = importedData[i];
                        if (item.name && item.url && !existingUrls.has(item.url)) {
                            blockedChannels.push(item);
                            existingUrls.add(item.url);
                            addedCount++;
                        }
                    }
                    
                    saveBlockedChannels();
                    hideBlockedChannels();
                    updateManagementPanel();
                    
                    alert('✅ 导入成功！\n新增 ' + addedCount + ' 个频道\n当前共 ' + blockedChannels.length + ' 个频道');
                    
                } catch (error) {
                    alert('❌ 导入失败：' + error.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // 更新管理面板列表
    function updateManagementPanel() {
        try {
            const list = document.getElementById('blocked-channel-list');
            const debugInfo = document.getElementById('debug-info');
            
            // 清空（使用 textContent 而不是 innerHTML）
            debugInfo.textContent = '';
            list.textContent = '';
            
            // 获取数据
            const cookieData = document.cookie.split('; ').find(row => row.startsWith('blockedChannels='));
            let cookieChannels = [];
            
            if (cookieData) {
                const cookieValue = cookieData.split('=')[1];
                const decodedValue = decodeURIComponent(cookieValue);
                cookieChannels = JSON.parse(decodedValue);
            }
            
            const channelsToDisplay = cookieChannels.length > 0 ? cookieChannels : blockedChannels;
            
            // 添加调试信息（不使用 innerHTML）
            const debugText = document.createElement('p');
            debugText.textContent = '✅ 数据正常！变量: ' + blockedChannels.length + ', Cookie: ' + cookieChannels.length;
            debugText.style.cssText = 'color: green; font-weight: bold; margin: 0;';
            debugInfo.appendChild(debugText);
            
            // 添加标题
            const header = document.createElement('h4');
            header.textContent = '共 ' + channelsToDisplay.length + ' 个被屏蔽的频道';
            header.style.cssText = 'color: green; margin: 0 0 10px 0;';
            list.appendChild(header);
            
            // 添加导出/导入按钮区域
            const buttonRow = document.createElement('div');
            buttonRow.style.cssText = 'display: flex; gap: 10px; margin-bottom: 15px;';
            
            const exportBtn = document.createElement('button');
            exportBtn.textContent = '📥 导出列表';
            exportBtn.style.cssText = 'flex: 1; padding: 8px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;';
            exportBtn.onclick = function() {
                exportBlockedChannels();
            };
            
            const importBtn = document.createElement('button');
            importBtn.textContent = '📤 导入列表';
            importBtn.style.cssText = 'flex: 1; padding: 8px; background: #388e3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;';
            importBtn.onclick = function() {
                importBlockedChannels();
            };
            
            const clearBtn = document.createElement('button');
            clearBtn.textContent = '🗑️ 清空全部';
            clearBtn.style.cssText = 'flex: 1; padding: 8px; background: #d32f2f; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;';
            clearBtn.onclick = function() {
                if (confirm('确定要清空所有 ' + blockedChannels.length + ' 个屏蔽频道吗？\n\n建议先导出备份！')) {
                    blockedChannels = [];
                    saveBlockedChannels();
                    hideBlockedChannels();
                    updateManagementPanel();
                    alert('✅ 已清空所有屏蔽频道');
                }
            };
            
            buttonRow.appendChild(exportBtn);
            buttonRow.appendChild(importBtn);
            buttonRow.appendChild(clearBtn);
            list.appendChild(buttonRow);
            
            // 逐个添加频道
            for (let i = 0; i < channelsToDisplay.length; i++) {
                const channel = channelsToDisplay[i];
                
                const item = document.createElement('div');
                item.style.cssText = 'padding: 10px; background: white; border: 1px solid #ddd; margin-bottom: 5px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;';
                
                const text = document.createElement('span');
                text.textContent = (i + 1) + '. ' + channel.name;
                text.style.cssText = 'color: black; font-size: 14px; flex: 1;';
                
                const btn = document.createElement('button');
                btn.textContent = '解除屏蔽';
                btn.style.cssText = 'padding: 5px 10px; background: green; color: white; border: none; border-radius: 3px; cursor: pointer;';
                btn.onclick = function() {
                    if (confirm('确定要解除屏蔽 "' + channel.name + '" 吗？')) {
                        unblockChannel(channel.url);
                        initBlockedChannels();
                        updateManagementPanel();
                    }
                };
                
                item.appendChild(text);
                item.appendChild(btn);
                list.appendChild(item);
            }
            
        } catch (e) {
            alert('错误: ' + e.message);
        }
    }

    // 创建管理按钮
    function createManagementButton() {
        const button = document.createElement('button');
        button.textContent = '🛡️ 频道管理 v20';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #065fd4;
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 20px;
            cursor: pointer;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        
        button.addEventListener('click', () => {
            // 每次打开前重新从 Cookie 读取
            initBlockedChannels();
            const panel = document.getElementById('channel-blocker-panel');
            if (panel) {
                panel.style.display = 'block';
                updateManagementPanel();
            }
        });
        
        document.body.appendChild(button);
    }

    // 初始化
    function init() {
        initBlockedChannels();
        createManagementPanel();
        createManagementButton();
        
        hideBlockedChannels();
        addBlockButtons();
        
        const observer = new MutationObserver(() => {
            hideBlockedChannels();
            addBlockButtons();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
