// ==UserScript==
// @name        Auto View Ads
// @namespace   Violentmonkey Scripts
// @match       https://game.catgoldminer.ai/*
// @grant       none
// @version     1.0
// @description Script tự động click quảng cáo cho trò chơi, cập nhật lần cuối: 23:05:41 11/10/2024
// ==/UserScript==

(function() {
    'use strict';

    class AutoClicker {
        constructor(selector) {
            this.element = document.querySelector(selector);
            this.isRunning = false;
            this.simulateTabVisibilityAndFocus();
        }

        // Hàm để kích hoạt sự kiện chuột
        triggerMouseEvent(type, x, y) {
            const mouseEvent = new MouseEvent(type, {
                clientX: x,
                clientY: y,
                bubbles: true,
                cancelable: true,
                view: window,
            });
            this.element.dispatchEvent(mouseEvent);
            console.info(`[${type}] Chuột được kích hoạt tại (${x}, ${y}).`);
        }

        // Hàm để bắt đầu tự động click
        async start(x, y) {
            if (!this.element) {
                console.error('Không tìm thấy phần tử!');
                return;
            }

            this.triggerMouseEvent('mousedown', x, y);
            this.triggerMouseEvent('mouseup', x, y);
        }

        // Hàm để dừng tự động click
        stop() {
            this.isRunning = false;
            console.info('Tự động click đã dừng lại.');
        }

        // Hàm để chờ một khoảng thời gian ngẫu nhiên
        sleep(min, max) {
            const waitTime = this.getRandomInterval(min, max) * 1000;
            return new Promise(resolve => setTimeout(resolve, waitTime));
        }

        // Hàm để lấy thời gian ngẫu nhiên giữa min và max
        getRandomInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Hàm để bắt đầu auto click theo khoảng thời gian ngẫu nhiên
        async startAutoClicking() {
            this.isRunning = true;
            while (this.isRunning) {
                await main();
                const waitTime = this.getRandomInterval(2100, 2700); // 35 đến 45 phút
                console.info(`Chờ ${waitTime / 60} phút trước khi thực hiện lần tiếp theo.`);
                await this.sleep(waitTime, waitTime);
            }
        }

        simulateTabVisibilityAndFocus() {
            // Giả lập document luôn ở trạng thái visible
            Object.defineProperty(document, 'visibilityState', {
                configurable: true,
                enumerable: true,
                get: () => 'visible',
            });

            Object.defineProperty(document, 'hidden', {
                configurable: true,
                enumerable: true,
                get: () => false,
            });

            // Chặn sự kiện visibilitychange
            document.addEventListener('visibilitychange', (event) => {
                event.stopImmediatePropagation();
            }, true);

            // Giả lập window luôn được focus
            window.addEventListener('blur', () => {
                window.focus();
                console.info('Tab đã bị blur, focus lại ngay.');
            }, true);

            window.addEventListener('focus', () => {
                console.info('Tab đã được focus.');
            });

            // Giả lập document.hasFocus luôn trả về true
            Object.defineProperty(document, 'hasFocus', {
                configurable: true,
                enumerable: true,
                value: () => true,
            });

            // Giả lập window.requestAnimationFrame liên tục chạy
            const fakeAnimation = () => {
                window.requestAnimationFrame(fakeAnimation);
            };
            window.requestAnimationFrame(fakeAnimation);
        }
    }

    // Hàm chính để thực hiện các hành động
    async function main() {
        await clicker.start(300, 213); // Click đầu tiên
        await clicker.sleep(19, 21); // Chờ từ 19 đến 21 giây
        await clicker.start(185, 448); // Click thứ hai
    }

    // Tạo và thêm các button vào cuối body
    const createButton = (text, style, onClick) => {
        const button = document.createElement('button');
        button.innerText = text;
        Object.assign(button.style, style);
        button.addEventListener('click', onClick);
        document.body.appendChild(button);
    };

    const startButtonStyle = {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: '9999',
        padding: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const clearButtonStyle = {
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        zIndex: '9999',
        padding: '10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    createButton('Start Ads', startButtonStyle, () => {
        console.info('Button được nhấn, bắt đầu AutoClicker...');
        clicker.startAutoClicking();
    });

    createButton('Clear', clearButtonStyle, () => {
        console.info('Button được nhấn, dừng AutoClicker...');
        if (clicker) {
            clicker.stop();
        }
    });

    // Khởi tạo AutoClicker với phần tử cụ thể
    const clicker = new AutoClicker("#GameCanvas");
})();
