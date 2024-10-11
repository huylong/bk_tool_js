// ==UserScript==
// @name        Auto view ADS goatsbot
// @namespace   Violentmonkey Scripts
// @match       https://dev.goatsbot.xyz/*
// @grant       none
// @version     1.3
// @author      -
// @description 01:04:07 29/9/2024
// ==/UserScript==

(function() {
    'use strict';

    class AutoClicker {
        constructor(selector) {
            this.selector = selector;
            this.numberClick = 1;
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async triggerMouseEvent(type, element) {
            const randomDelay = this.getRandomInterval(1, 3) * 1000;
            console.log(`Đang đợi ${randomDelay / 1000} giây trước khi click...`);
            await this.sleep(randomDelay);

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

        async start() {
            console.log("Tự động click bắt đầu...");
            while (true) {
                const element = document.querySelector(this.selector);
                if (!element) {
                    console.log('Không tìm thấy phần tử, dừng lại!');
                    break;
                }

                console.log(`Click ads lần thứ ${this.numberClick}`);
                await this.triggerMouseEvent('click', element);

                let repeatDelay = this.getRandomInterval(90, 100) * 1000;

                if (this.numberClick > 50) {
                    repeatDelay = this.getRandomInterval(5, 7) * 60 * 1000;
                    console.log(`Nghỉ 5-7 phút sau 10 lần click`);
                    this.numberClick = 0;
                }

                await this.sleep(repeatDelay);
                this.numberClick++;
            }
        }

        getRandomInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

    function simulateTabVisibilityAndFocus() {
        Object.defineProperty(document, 'visibilityState', {
            configurable: true,
            enumerable: true,
            get: function() {
                return 'visible';
            }
        });

        Object.defineProperty(document, 'hidden', {
            configurable: true,
            enumerable: true,
            get: function() {
                return false;
            }
        });

        document.addEventListener('visibilitychange', function(event) {
            event.stopImmediatePropagation();
        }, true);

        window.addEventListener('blur', () => {
            window.focus();
            console.log('Tab đã bị blur, focus lại ngay.');
        }, true);

        Object.defineProperty(document, 'hasFocus', {
            configurable: true,
            enumerable: true,
            value: function() {
                return true;
            }
        });

        const fakeAnimation = () => {
            window.requestAnimationFrame(fakeAnimation);
        };
        window.requestAnimationFrame(fakeAnimation);
    }

    const startButton = document.createElement('button');
    startButton.innerText = "Start Ads";
    startButton.style.position = 'fixed';
    startButton.style.bottom = '10px';
    startButton.style.right = '10px';
    startButton.style.zIndex = '9999';
    startButton.style.padding = '10px';
    startButton.style.backgroundColor = '#28a745';
    startButton.style.color = '#fff';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';

    const clearButton = document.createElement('button');
    clearButton.innerText = "Clear";
    clearButton.style.position = 'fixed';
    clearButton.style.bottom = '10px';
    clearButton.style.left = '10px';
    clearButton.style.zIndex = '9999';
    clearButton.style.padding = '10px';
    clearButton.style.backgroundColor = '#dc3545';
    clearButton.style.color = '#fff';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '5px';
    clearButton.style.cursor = 'pointer';

    startButton.addEventListener('click', () => {
        console.log("Button được nhấn, bắt đầu AutoClicker...");
        simulateTabVisibilityAndFocus();
        const clicker = new AutoClicker("#tabs-\\:r2\\:--tabpanel-0 > div:nth-child(1) > div.css-kcqt6s > div > div > div.css-1vvnutk > button");
        clicker.start();
    });

    clearButton.addEventListener('click', () => {
        console.log("Button được nhấn, dừng AutoClicker...");
        location.reload(); // Tải lại trang để dừng AutoClicker
    });

    document.body.appendChild(startButton);
    document.body.appendChild(clearButton);
})();
