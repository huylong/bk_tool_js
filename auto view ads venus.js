// ==UserScript==
// @name        Auto view ADS vertus
// @namespace   Violentmonkey Scripts
// @match       https://thevertus.app/*
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
            this.reloadAfterTask = 3000; // Thời gian sau khi nhiệm vụ kết thúc (3s)
        }

        // Hàm sleep để tạm dừng trong khoảng thời gian ngẫu nhiên
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Hàm để kích hoạt sự kiện chuột với khoảng nghỉ ngẫu nhiên
        async triggerMouseEvent(type, element) {
            const randomDelay = this.getRandomInterval(1, 3) * 1000; // Nghỉ ngẫu nhiên từ 1-3 giây
            console.log(`Đang đợi ${randomDelay / 1000} giây trước khi click...`);

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
            console.log(`${type} chuột được kích hoạt cho phần tử: ${element}`);
        }

        // Hàm để bắt đầu tự động click
        async start() {
            console.log("Tự động click bắt đầu...");

            this.element = document.querySelector(this.selector);
            if (!this.element) {
                console.log('Không tìm thấy phần tử!');
                return;
            }

            await this.triggerMouseEvent('click', this.element);

            const randomDelay = this.getRandomInterval(20, 25) * 1000; // Nghỉ ngẫu nhiên 20-25 giây
            this.reloadAfterTask = this.getRandomInterval(6, 8) * 1000 * 60; // Nghỉ ngẫu nhiên 6-8 phut
            await this.sleep(randomDelay);

            setTimeout(() => {
                this.reloadPageAndRestart();
            }, this.reloadAfterTask); // Reload sau 3s
        }

        // Hàm để dừng tự động click
        stop() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
                console.log('Tự động click đã dừng lại.');
            }
        }

        // Hàm để lấy thời gian ngẫu nhiên giữa min và max giây
        getRandomInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Hàm để reload trang và bắt đầu lại
        async reloadPageAndRestart() {
            const randomDelay = this.getRandomInterval(5, 10) * 1000; // Nghỉ ngẫu nhiên 5-10 giây
            console.log(`Reload sau ${randomDelay / 1000} giây...`);
            await this.sleep(randomDelay);

            this.stop(); // Dừng trước khi reload

            // Lưu trạng thái vào `localStorage`
            localStorage.setItem('autoClickerActive', 'true');

            // Reload lại trang
            window.location.reload();
        }

        // Hàm để thực hiện các hành động sau khi reload trang
        async performPostReloadActions() {
            // Đợi trang tải hoàn toàn
            await this.sleep(5000); // Đợi 5 giây sau khi reload

            console.log("Bắt đầu các hành động sau khi reload...");

            // Thực hiện click vào nút ngay sau khi bắt đầu
            const button = document.querySelector("body > div:nth-child(12) > div.react-modal-sheet-container > div.react-modal-sheet-content > div > div._wrapper_16x1w_1");

            if (button) {
                await this.triggerMouseEvent('click', button);
            } else {
                console.log("Không tìm thấy button để click.");
            }

            await this.sleep(this.getRandomInterval(2, 3) * 1000);

            const button1 = document.querySelector("#root > div._wrapper_gesw3_1 > div._wrapper_7gwnn_1 > div._activeTab_7gwnn_22");

            if (button1) {
                await this.triggerMouseEvent('click', button1);
            } else {
                console.log("Không tìm thấy button 1 để click.");
            }

            console.log("Đã hoàn thành các hành động sau khi reload.");
            this.start(); // Tiếp tục vòng lặp click
        }
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

    // Gắn sự kiện click cho button để bắt đầu AutoClicker
    startButton.addEventListener('click', () => {
        console.log("Button được nhấn, bắt đầu AutoClicker...");
        simulateTabVisibilityAndFocus(); // Gọi hàm giả lập trạng thái tab visible và focus
        clicker = new AutoClicker("#root > div._wrapper_gesw3_1 > div._scroll_15ap5_1 > div:nth-child(4) > div:nth-child(1) > div:nth-child(1)");

        // Nếu không có trạng thái nào, bắt đầu quá trình click mới
        clicker.start();
    });

    function simulateTabVisibilityAndFocus() {
        // Giả lập document luôn ở trạng thái visible
        Object.defineProperty(document, 'visibilityState', {
            configurable: true,
            enumerable: true,
            get: function() {
                return 'visible'; // Trả về 'visible' để tab luôn ở trạng thái visible
            }
        });

        Object.defineProperty(document, 'hidden', {
            configurable: true,
            enumerable: true,
            get: function() {
                return false; // Trả về false để báo hiệu rằng tab không bị ẩn
            }
        });

        // Chặn sự kiện visibilitychange để nó không kích hoạt khi tab bị ẩn
        document.addEventListener('visibilitychange', function(event) {
            event.stopImmediatePropagation(); // Ngăn sự kiện 'visibilitychange'
        }, true);

        // Giả lập window luôn được focus
        window.addEventListener('blur', (event) => {
            // Khi tab bị blur, ngay lập tức làm nó focus lại
            window.focus();
            console.log('Tab đã bị blur, focus lại ngay.');
        }, true);

        window.addEventListener('focus', () => {
            console.log('Tab đã được focus.');
        });

        // Giả lập document.hasFocus luôn trả về true
        Object.defineProperty(document, 'hasFocus', {
            configurable: true,
            enumerable: true,
            value: function() {
                return true; // Luôn trả về true để báo hiệu rằng window luôn focus
            }
        });

        // Giả lập window.requestAnimationFrame liên tục chạy
        const fakeAnimation = () => {
            window.requestAnimationFrame(fakeAnimation); // Liên tục yêu cầu frame mới để trình duyệt nghĩ rằng tab vẫn đang active
        };
        window.requestAnimationFrame(fakeAnimation);
    }

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
        localStorage.removeItem('autoClickerActive');
        console.log("Trạng thái autoClickerActive đã được xóa.");
        alert("Trạng thái autoClickerActive đã được xóa.");
    });

    // Thêm button vào body
    document.body.appendChild(startButton);
    document.body.appendChild(clearButton);

    // Kiểm tra trạng thái từ `localStorage` để biết có cần khởi động lại không
    if (localStorage.getItem('autoClickerActive') === 'true') {
        window.addEventListener('load', () => {
            console.log("Trang đã được reload, khởi động lại hành động...");
            simulateTabVisibilityAndFocus(); // Gọi hàm giả lập trạng thái tab visible và focus
            localStorage.removeItem('autoClickerActive'); // Xóa trạng thái
            clicker = new AutoClicker("#root > div._wrapper_gesw3_1 > div._scroll_15ap5_1 > div:nth-child(4) > div:nth-child(1) > div:nth-child(1)");
            clicker.performPostReloadActions(); // Thực hiện các hành động sau khi tải lại
        });
    }
})();
