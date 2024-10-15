// ==UserScript==
// @name        Auto view ADS Blue
// @namespace   Violentmonkey Scripts
// @match       https://bluefarming.xyz/*
// @grant       none
// @version     1.3
// @author      -
// @description Auto view ads on Blue Farming
// ==/UserScript==

(function() {
    'use strict';

    class AutoClicker {
        constructor(selector) {
            this.selector = selector;
            this.isRunning = false;
            this.clickCount = 0;
        }

        static sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        static getRandomInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        static async triggerMouseEvent(type, element) {
            if (!element) return;
            const rect = element.getBoundingClientRect();
            const mouseEvent = new MouseEvent(type, {
                clientX: rect.left + (rect.width / 2),
                clientY: rect.top + (rect.height / 2),
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(mouseEvent);
        }

        getElement(selector) {
            return document.querySelector(selector);
        }

        async clickElement(selector) {
            const element = this.getElement(selector);
            if (element) {
                await AutoClicker.triggerMouseEvent('click', element);
                await AutoClicker.sleep(AutoClicker.getRandomInterval(500, 1000));
            }
        }

        async start() {
            this.isRunning = true;
            while (this.isRunning) {
                console.log(`Click ads lần thứ ${this.clickCount + 1}`);

                await this.clickElement(this.selector);
                await AutoClicker.sleep(AutoClicker.getRandomInterval(16000, 18000));

                await this.clickElement("body > div.popup.popup-peer.popup-confirmation.active > div > div.popup-buttons > button > span");
                await this.clickElement("#root > div._container_1krht_1._container_dc403_1.white-box > button");

                const claimAdsButton = this.getElement("#root > div._outlet_qvl9w_21 > div > div._container_12n6k_1 > div:nth-child(1) > div > div > button");
                if (claimAdsButton) {
                    console.log(`Claim ads lần thứ ${this.clickCount + 1}`);
                    await AutoClicker.triggerMouseEvent('click', claimAdsButton);
                }

                this.clickCount++;

                if (this.clickCount >= 50) {
                    console.log('50 lần click rồi, nghỉ 5 phút');
                    await AutoClicker.sleep(5 * 60 * 1000);
                    this.clickCount = 0;
                }

                await AutoClicker.sleep(AutoClicker.getRandomInterval(2000, 3000));
            }
        }

        stop() {
            this.isRunning = false;
            console.info('Tự động click đã dừng lại.');
        }
    }

    class TabKeeper {
        constructor() {
            this.worker = null;
        }

        start() {
            if (!window.Worker) {
                console.log("Web Workers không được hỗ trợ trong trình duyệt này.");
                return;
            }

            document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        }

        handleVisibilityChange() {
            if (document.hidden) {
                if (!this.worker) {
                    this.worker = this.createWorker();
                    if (this.worker) {
                        this.worker.onmessage = () => {
                            window.dispatchEvent(new Event('mousemove'));
                            console.log("Tab vẫn đang hoạt động");
                        };
                    }
                }
            } else if (this.worker) {
                this.worker.terminate();
                this.worker = null;
            }
        }

        createWorker() {
            try {
                const blob = new Blob([
                    `setInterval(() => { self.postMessage('keepAlive'); }, 20000);`
                ], { type: 'application/javascript' });
                return new Worker(URL.createObjectURL(blob));
            } catch (e) {
                console.error("Không thể tạo Worker:", e);
                return null;
            }
        }
    }

    class UIManager {
        constructor() {
            this.clicker = null;
            this.tabKeeper = new TabKeeper();
        }

        init() {
            this.createButton("Start Ads", this.startClicking.bind(this), { right: '10px', backgroundColor: '#28a745' });
            this.createButton("Stop Ads", this.stopClicking.bind(this), { left: '10px', backgroundColor: '#dc3545' });
        }

        createButton(text, onClick, styles) {
            const button = document.createElement('button');
            button.innerText = text;
            Object.assign(button.style, {
                position: 'fixed',
                bottom: '10px',
                zIndex: '9999',
                padding: '10px',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                ...styles
            });
            button.addEventListener('click', onClick);
            document.body.appendChild(button);
        }

        startClicking() {
            console.info('Bắt đầu AutoClicker...');
            this.tabKeeper.start();
            this.clicker = new AutoClicker("#root > div._outlet_qvl9w_21 > div > div._container_12n6k_1 > div:nth-child(1) > div > div > button");
            this.clicker.start();
        }

        stopClicking() {
            console.info('Dừng AutoClicker...');
            if (this.clicker) {
                this.clicker.stop();
            }
        }
    }

    const ui = new UIManager();
    ui.init();
})();
