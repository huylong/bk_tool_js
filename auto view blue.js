// ==UserScript==
// @name        Auto view ADS Blue
// @namespace   Violentmonkey Scripts
// @match       https://bluefarming.xyz/*
// @grant       none
// @version     1.2
// @author      -
// @description 01:04:07 29/9/2024
// ==/UserScript==

(function() {
    'use strict';

    class AutoClicker {
        constructor(selector) {
            this.selector = selector;
            this.element = document.querySelector(selector);
            this.isRunning = false;
            this.numberClick = 1;
        }

        // Hàm sleep để tạm dừng trong khoảng thời gian ngẫu nhiên
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        checkClaimAds() {
            return document.querySelector("#root > div._container_1krht_1._container_dc403_1.white-box > button");
        }

        claimAds() {
            return document.querySelector("#root > div._outlet_qvl9w_21 > div > div._container_12n6k_1 > div:nth-child(1) > div > div > button");
        }

        // Hàm để kích hoạt sự kiện chuột với khoảng nghỉ ngẫu nhiên
        async triggerMouseEvent(type, element) {
            const rect = element.getBoundingClientRect();
            const coordinates = {
                x: rect.left + (rect.width / 2),
                y: rect.top + (rect.height / 2)
            };

            const mouseEvent = new MouseEvent(type, {
                clientX: coordinates.x,
                clientY: coordinates.y,
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(mouseEvent);
        }

        // Hàm để bắt đầu tự động click
        async start() {
            this.isRunning = true;
            while (this.isRunning) {
                this.element = document.querySelector(this.selector);
                if (!this.element) {
                    console.error('Không tìm thấy phần tử!');
                    return;
                }

                console.log(`Click ads lần thứ ${this.numberClick}`);

                await this.triggerMouseEvent('click', this.element);
                await this.sleep(this.getRandomInterval(16000, 18000));

                const checkAds = this.checkClaimAds();

                if (checkAds) {
                    await this.triggerMouseEvent('click', checkAds);
                }

                await this.sleep(this.getRandomInterval(1000, 2000));

                const claimAdsNow = this.claimAds();
                
                if (claimAdsNow) {
                    console.log(`Claim ads lần thứ ${this.numberClick}`);
                    await this.triggerMouseEvent('click', claimAdsNow);
                }

                if (this.numberClick > 50) {
                    console.log('30 lần click rồi phải nghỉ 5 phút');
                    await this.sleep(5 * 60 * 1000); // Nghỉ 5 phút
                    this.numberClick = 0;
                }

                this.numberClick++;

                await this.sleep(this.getRandomInterval(2000, 3000));

            }
        }

        // Hàm để dừng tự động click
        stop() {
            this.isRunning = false;
            console.info('Tự động click đã dừng lại.');
        }

        // Hàm để lấy thời gian ngẫu nhiên giữa min và max mili giây
        getRandomInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

    // Hàm giả lập document luôn ở trạng thái "visible" và window luôn được focus
    function simulateTabVisibilityAndFocus() {
        Object.defineProperty(document, 'visibilityState', {
            configurable: true,
            get: () => 'visible',
        });

        Object.defineProperty(document, 'hidden', {
            configurable: true,
            get: () => false,
        });

        document.addEventListener('visibilitychange', (event) => {
            event.stopImmediatePropagation();
        }, true);

        window.addEventListener('blur', () => {
            window.focus();
            console.log('Tab đã bị blur, focus lại ngay.');
        }, true);

        Object.defineProperty(document, 'hasFocus', {
            configurable: true,
            get: () => () => true,
        });
    }

    // Thêm button vào cuối body
    const startButton = document.createElement('button');
    startButton.innerText = "Start Ads";
    Object.assign(startButton.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: '9999',
        padding: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    });

    startButton.addEventListener('click', () => {
        console.info('Button được nhấn, bắt đầu AutoClicker...');
        simulateTabVisibilityAndFocus();
        const clicker = new AutoClicker("#root > div._outlet_qvl9w_21 > div > div._container_12n6k_1 > div:nth-child(1) > div > div > button");
        clicker.start();
    });

    const clearButton = document.createElement('button');
    clearButton.innerText = "Clear";
    Object.assign(clearButton.style, {
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        zIndex: '9999',
        padding: '10px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    });

    clearButton.addEventListener('click', () => {
        console.info('Button được nhấn, dừng AutoClicker...');
        if (clicker) {
            clicker.stop();
        }
    });

    document.body.appendChild(startButton);
    document.body.appendChild(clearButton);
})();
