// ==UserScript==
// @name         AutoClicker with AutoReload
// @version      1.0
// @description  Tự động click và tải lại trang sau khoảng 35 đến 45 phút
// @match        https://game.yumparty.com/*
// @icon         https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Candy-64.png
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    class AutoClicker {
        constructor(selector) {
            this.element = document.getElementById(selector);
            this.intervalId = null;
            this.simulateTabVisibilityAndFocus();
            this.schedulePageReload(); // Đặt lịch tự động tải lại trang
        }

        triggerMouseEvent(type, x, y) {
            const mouseEvent = new MouseEvent(type, {
                clientX: x,
                clientY: y,
                bubbles: true,
                cancelable: true,
                view: window
            });
            this.element.dispatchEvent(mouseEvent);
        }

        triggerTouchEvent(type, x, y) {
            const touch = new Touch({
                identifier: Date.now(),
                target: this.element,
                clientX: x,
                clientY: y,
                force: 1,
                radiusX: 1,
                radiusY: 1,
                rotationAngle: 0,
                altitudeAngle: 0,
                azimuthAngle: 0
            });

            const touchEvent = new TouchEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                touches: [touch],
                targetTouches: [touch],
                changedTouches: [touch]
            });

            this.element.dispatchEvent(touchEvent);
        }

        async start(x, y) {
            if (!this.element) {
                console.log('Không tìm thấy phần tử!');
                return;
            }

            this.triggerTouchEvent('touchstart', x, y);
            this.triggerTouchEvent('touchend', x, y);
        }

        stop() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
                console.log('Tự động click đã dừng lại.');
            }
        }

        sleep(min, max) {
            const waitTime = this.getRandomInterval(min, max) * 1000;
            return new Promise(resolve => setTimeout(resolve, waitTime));
        }

        sleep2(min, max) {
            const waitTime = this.getRandomInterval(min, max);
            return new Promise(resolve => setTimeout(resolve, waitTime));
        }

        getRandomInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        async main(callsCount) {
            for (let i = 0; i < callsCount; i++) {
                await this.sleep2(40, 60);
                await this.start(288, 266);
                await this.sleep2(40, 60);
                await this.start(206, 268);
                await this.sleep2(40, 60);
                await this.start(208, 226);
                await this.sleep2(40, 60);
                await this.start(182, 249);
                await this.sleep2(40, 60);
                await this.start(205, 220);
                await this.sleep2(40, 60);
                await this.start(196, 240);
                await this.sleep2(40, 60);
                await this.start(208, 226);
                await this.sleep2(40, 60);
                await this.start(288, 266);
                await this.sleep2(40, 60);

                console.log(`Lần thứ ${i + 1} đã thực hiện.`);
            }
        }

        startAutoClicking() {
            this.main(76);
        }

        schedulePageReload() {
            const reloadInterval = this.getRandomInterval(36, 40) * 60 * 1000;
            console.log(`Trang sẽ tự động tải lại sau ${reloadInterval / 60 / 1000} phút.`);
            setTimeout(() => {
                console.log('Đang tải lại trang...');
                location.reload();
            }, reloadInterval);
        }

        simulateTabVisibilityAndFocus() {
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

            window.addEventListener('blur', (event) => {
                window.focus();
                console.log('Tab đã bị blur, focus lại ngay.');
            }, true);

            window.addEventListener('focus', () => {
                console.log('Tab đã được focus.');
            });

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
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            const clicker = new AutoClicker("unity-canvas");
            clicker.startAutoClicking();
        }, 10000); // Chạy sau 10000ms, tức là 10 giây
    });

})();
