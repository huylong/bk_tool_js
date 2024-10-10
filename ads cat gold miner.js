class AutoClicker {
    constructor(selector) {
        this.element = document.getElementById(selector);
        this.intervalId = null; // Biến để lưu trữ ID của setInterval
        this.simulateTabVisibilityAndFocus();
    }

    // Hàm để kích hoạt sự kiện chuột
    triggerMouseEvent(type, x, y) {
        const mouseEvent = new MouseEvent(type, {
            clientX: x,
            clientY: y,
            bubbles: true,
            cancelable: true,
            view: window
        });
        this.element.dispatchEvent(mouseEvent);
        console.log(`${type} chuột được kích hoạt tại (${x}, ${y}).`);
    }

    // Hàm để kích hoạt sự kiện cảm ứng
    triggerTouchEvent(type, x, y) {
        const touch = new Touch({
            identifier: Date.now(), // Mã định danh duy nhất
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
        console.log(`${type} cảm ứng được kích hoạt tại (${x}, ${y}).`);
    }

    // Hàm để bắt đầu tự động click
    async start(x, y) {
        if (!this.element) {
            console.log('Không tìm thấy phần tử!');
            return;
        }

        // // Kích hoạt các sự kiện một lần
        // this.triggerMouseEvent('click', x, y);
        // this.triggerTouchEvent('touchstart', x, y);
        // this.triggerTouchEvent('touchend', x, y);
        this.triggerMouseEvent('mousedown', x, y);
        this.triggerMouseEvent('mouseup', x, y);
    }

    // Hàm để dừng tự động click
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('Tự động click đã dừng lại.');
        }
    }

    // Hàm để chờ một khoảng thời gian ngẫu nhiên
    sleep(min, max) {
        const waitTime = this.getRandomInterval(min, max) * 1000; // Chuyển đổi thành mili giây
        return new Promise(resolve => setTimeout(resolve, waitTime));
    }

    // Hàm để lấy thời gian ngẫu nhiên giữa min và max
    getRandomInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    startAutoClicking() {
        const callMain = () => {
            main(); // Gọi hàm chính
            const waitTime = this.sleep(18, 20); // Thời gian ngẫu nhiên từ 4 đến 8 phút
            this.intervalId = setTimeout(callMain, waitTime); // Đặt lại setTimeout với thời gian mới
        };

        callMain(); // Gọi lần đầu tiên
    }

    simulateTabVisibilityAndFocus() {
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
}

// Sử dụng lớp AutoClicker
const clicker = new AutoClicker("GameCanvas");

// Iphone 14 Pro Max 100%

// Hàm chính để thực hiện các hành động
async function main() {
    await clicker.start(300, 213); // Click đầu tiên
    await clicker.sleep(16, 18); // Chờ từ 1 đến 3 giây
    await clicker.start(185, 448); // Click thứ hai
}
// Gọi hàm chính
clicker.startAutoClicking();

// Để dừng tự động click, bạn có thể gọi:
// clicker.stop();
