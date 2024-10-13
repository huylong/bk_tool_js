// ==UserScript==
// @name         AutoClicker with AutoReload
// @version      1.2
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
            this.isRunning = false; // Cờ để theo dõi trạng thái chạy
            this.simulateTabVisibilityAndFocus();
            this.schedulePageReload();
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
                rotationAngle: 0
            });

            const touchEvent = new TouchEvent(type, {
                bubbles: true,
                cancelable: true,
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

            if (!this.isRunning) {
                return; // Nếu AutoClicker đã dừng, không click nữa
            }

            this.triggerTouchEvent('touchstart', x, y);
            this.triggerTouchEvent('touchend', x, y);
        }

        stop() {
            this.isRunning = false;
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
            this.isRunning = true;

            await this.sleep2(500, 1000);
            await this.start(186, 585);
            await this.sleep2(100, 200);
            await this.start(186, 585);

            for (let i = 0; i < callsCount; i++) {
                if (!this.isRunning) {
                    console.log('Đã dừng tự động click.');
                    break;
                }

                await this.start(226, 258);
                await this.sleep2(20, 40);
                await this.start(216, 248);
                await this.sleep2(20, 40);
                await this.start(208, 226);
                await this.start(205, 210);
                await this.sleep2(20, 40);
                await this.start(288, 266);
                await this.sleep2(20, 40);
                await this.start(206, 268);
                await this.sleep2(20, 40);
                await this.start(208, 226);
                await this.sleep2(20, 40);
                await this.start(182, 249);
                await this.sleep2(20, 40);
                await this.start(205, 220);
                await this.sleep2(20, 40);
                await this.start(196, 240);
                await this.sleep2(20, 40);
                await this.start(208, 226);
                await this.sleep2(20, 40);
                await this.start(196, 240);
                await this.sleep2(20, 40);
                await this.start(205, 225);
                await this.sleep2(20, 40);
                await this.start(196, 256);
                await this.sleep2(20, 40);
                await this.start(205, 220);
                await this.sleep2(20, 40);
                await this.start(188, 493);

                console.log(`Lần thứ ${i + 1} đã thực hiện.`);
            }
        }

        async reFill() {
            await this.sleep2(20, 40);
            this.isRunning = true; // Đảm bảo cờ isRunning được bật
            await this.start(190, 460);
        }

        startAutoClicking() {
            this.main(70);
        }

        schedulePageReload() {
            const reloadInterval = this.getRandomInterval(35, 40) * 60 * 1000;
            console.log(`Trang sẽ tự động tải lại sau ${reloadInterval / 60 / 1000} phút.`);
            setTimeout(() => {
                console.log('Đang tải lại trang...');
                location.reload();
            }, reloadInterval);
        }

        simulateTabVisibilityAndFocus() {
            // Giả lập thuộc tính visibilityState luôn là 'visible'
            Object.defineProperty(document, 'visibilityState', {
                configurable: true,
                enumerable: true,
                get: function() {
                    return 'visible';
                }
            });

            // Giả lập thuộc tính hidden luôn là false
            Object.defineProperty(document, 'hidden', {
                configurable: true,
                enumerable: true,
                get: function() {
                    return false;
                }
            });

            // Giả lập thuộc tính hasFocus() luôn trả về true
            Object.defineProperty(document, 'hasFocus', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function() {
                    return true;
                }
            });

            // Chặn sự kiện visibilitychange để ngăn các script khác thay đổi trạng thái visibility
            document.addEventListener('visibilitychange', function(event) {
                event.stopImmediatePropagation();
            }, true);

            // Xử lý sự kiện blur và focus lại tab ngay lập tức nếu nó bị mất focus
            window.addEventListener('blur', (event) => {
                setTimeout(() => {
                    window.focus();
                    console.log('Tab đã bị blur, focus lại ngay.');
                }, 10);
            }, true);

            // Log khi tab được focus
            window.addEventListener('focus', () => {
                console.log('Tab đã được focus.');
            });

            // Giữ cho tab luôn hoạt động bằng cách sử dụng requestAnimationFrame
            const fakeAnimation = () => {
                window.requestAnimationFrame(fakeAnimation);
            };
            window.requestAnimationFrame(fakeAnimation);

            // Tạo một sự kiện giả để thông báo rằng tab vẫn đang được focus
            setInterval(() => {
                const focusEvent = new Event('focus');
                window.dispatchEvent(focusEvent);
            }, 10000); // Gửi sự kiện focus mỗi 10 giây

            // Đoạn mã giữ kết nối, cập nhật Service Worker mỗi 30 giây
            setInterval(() => {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    for (let registration of registrations) {
                        registration.update();
                    }
                });
            }, 30000); // Cập nhật Service Worker mỗi 30 giây
        }
    }

    window.addEventListener('load', () => {
        const clicker = new AutoClicker("unity-canvas");

        // Tạo nút Start
        const startButton = document.createElement('button');
        startButton.innerText = "Start";
        startButton.style.position = 'fixed';
        startButton.style.top = '22%';
        startButton.style.right = '17%';
        startButton.style.zIndex = '9999';
        startButton.style.padding = '6px';
        startButton.style.backgroundColor = '#28a745';
        startButton.style.color = '#fff';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';
        document.body.appendChild(startButton);

        // Tạo nút Stop
        const stopButton = document.createElement('button');
        stopButton.innerText = "Stop";
        stopButton.style.position = 'fixed';
        stopButton.style.top = '22%';
        stopButton.style.right = '30%';
        stopButton.style.zIndex = '9999';
        stopButton.style.padding = '6px';
        stopButton.style.backgroundColor = '#dc3545';
        stopButton.style.color = '#fff';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '5px';
        stopButton.style.cursor = 'pointer';
        document.body.appendChild(stopButton);

        // Tạo nút Refill
        const reFillButton = document.createElement('button');
        reFillButton.innerText = "Ref";
        reFillButton.style.position = 'fixed';
        reFillButton.style.top = '22%';
        reFillButton.style.right = '6%';
        reFillButton.style.zIndex = '9999';
        reFillButton.style.padding = '6px';
        reFillButton.style.backgroundColor = '#FF7F50';
        reFillButton.style.color = '#fff';
        reFillButton.style.border = 'none';
        reFillButton.style.borderRadius = '5px';
        reFillButton.style.cursor = 'pointer';
        document.body.appendChild(reFillButton);

        // Sự kiện click cho nút Start
        startButton.addEventListener('click', () => {
            console.log("Tự động click bắt đầu...");
            clicker.startAutoClicking();
        });

        // Sự kiện click cho nút Refill
        stopButton.addEventListener('click', () => {
            console.log("Tự động click đã dừng lại.");
            clicker.stop();
        });

        // Sự kiện click cho nút Stop
        reFillButton.addEventListener('click', () => {
            console.log("Click reFill.");
            clicker.reFill();
        });

        setTimeout(() => {
            clicker.startAutoClicking();
            console.log("Chương trình tự động click sẽ chạy sau 15 giây...");
        }, 15000);
    });

})();
