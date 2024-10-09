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
            this.intervalId = null;
            this.numberClick = 1;
        }

        // Hàm sleep để tạm dừng trong khoảng thời gian ngẫu nhiên
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        checkClaimAds() {
            const energyElement = document.querySelector("#root > div._container_1krht_1._container_dc403_1.white-box > button");
            if (energyElement) {
                return energyElement;
            }
            return false;
        }

        // Hàm để kích hoạt sự kiện chuột với khoảng nghỉ ngẫu nhiên
        async triggerMouseEvent(type, element) {
            const randomDelay = this.getRandomInterval(1, 2) * 100; // Nghỉ ngẫu nhiên từ 1-2 giây
            console.log(`Đang đợi ${randomDelay / 10000} giây trước khi click...`);

            await this.sleep(randomDelay); // Đợi ngẫu nhiên trước khi click

            const rect = element.getBoundingClientRect();
            const coordinates = {
                x: rect.left + (rect.width / 2), // Tọa độ X giữa phần tử
                y: rect.top + (rect.height / 2)  // Tọa độ Y giữa phần tử
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
            console.log("Tự động click bắt đầu...");

            this.element = document.querySelector(this.selector);
            if (!this.element) {
                console.log('Không tìm thấy phần tử!');
                return;
            }

            console.log('Click ads lần thứ ' + this.numberClick);

            const checkAds = this.checkClaimAds();

            if (checkAds) {
                await this.triggerMouseEvent('click', checkAds);
            }

            var repeatDelay  = this.getRandomInterval(21, 24) * 1000; // Nghỉ ngẫu nhiên 35 toi 40
            await this.triggerMouseEvent('click', this.element);
            await this.sleepRandomTime(16, 20) * 1000; // Nghỉ ngẫu nhiên 16 toi 25s truoc khi nhan claim
            await this.triggerMouseEvent('click', this.element);

            if (this.numberClick > 30) {
                repeatDelay  = this.getRandomInterval(3, 5) * 1000 * 60;
                this.numberClick = 0;
            }

            // Gọi lại hàm start để thực hiện auto click lặp lại
            this.intervalId = setTimeout(() => {
                this.start(); // Lặp lại quá trình auto click
            }, repeatDelay);

            this.numberClick++;
        }

        

        // Hàm để dừng tự động click
        stop() {
            if (this.intervalId) {
                clearTimeout(this.intervalId); // Dừng thời gian chạy của setTimeout
                this.intervalId = null;
                console.log('Tự động click đã dừng lại.');
            }
        }

        // Hàm để lấy thời gian ngẫu nhiên giữa min và max giây
        getRandomInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        sleepRandomTime(minSeconds = 2, maxSeconds = 4) {
            const randomTime = Math.random() * (maxSeconds - minSeconds) + minSeconds;
            return new Promise(resolve => setTimeout(resolve, randomTime * 1000));
          }
    }

    // Hàm giả lập document luôn ở trạng thái "visible" và window luôn được focus
    function simulateTabVisibilityAndFocus() {
        // Giả lập document luôn ở trạng thái visible
        Object.defineProperty(document, 'visibilityState', {
            configurable: true,
            get: function() {
                return 'visible'; // Trả về 'visible' để tab luôn ở trạng thái visible
            }
        });

        Object.defineProperty(document, 'hidden', {
            configurable: true,
            get: function() {
                return false; // Trả về false để báo hiệu rằng tab không bị ẩn
            }
        });

        // Chặn sự kiện visibilitychange để nó không kích hoạt khi tab bị ẩn
        document.addEventListener('visibilitychange', function(event) {
            event.stopImmediatePropagation(); // Ngăn sự kiện 'visibilitychange'
        }, true);

        // Giả lập sự kiện focus để tab luôn giữ focus
        window.addEventListener('blur', function(event) {
            // Khi tab bị blur, ngay lập tức làm nó focus lại
            window.focus();
            console.log('Tab đã bị blur, focus lại ngay.');
        }, true);

        // Giả lập window luôn được focus
        Object.defineProperty(document, 'hasFocus', {
            configurable: true,
            get: function() {
                return function() {
                    return true; // Luôn trả về true để báo hiệu tab luôn focus
                };
            }
        });
    }

    // Khởi tạo đối tượng AutoClicker
    let clicker = null;

    // Thêm button vào cuối body
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

    // Gắn sự kiện click cho button để bắt đầu AutoClicker và giả lập visibility + focus
    startButton.addEventListener('click', () => {
        console.log("Button được nhấn, bắt đầu AutoClicker...");
        simulateTabVisibilityAndFocus(); // Gọi hàm giả lập trạng thái tab visible và focus
        clicker = new AutoClicker("#root > div._outlet_qvl9w_21 > div > div._container_12n6k_1 > div:nth-child(1) > div > div > button");
        clicker.start(); // Bắt đầu AutoClicker mới
    });

    // Thêm button xóa trạng thái AutoClicker
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

    // Gắn sự kiện click cho button xóa trạng thái
    clearButton.addEventListener('click', () => {
        console.log("Button được nhấn, dừng AutoClicker...");
        if (clicker) {
            clicker.stop(); // Gọi hàm dừng lại AutoClicker
        }
    });

    // Thêm button vào body
    document.body.appendChild(startButton);
    document.body.appendChild(clearButton);

})();
