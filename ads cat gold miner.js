class AutoClicker {
    constructor(selector) {
        this.element = document.getElementById(selector);
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
            view: window
        });
        this.element.dispatchEvent(mouseEvent);
        console.log(`${type} chuột được kích hoạt tại (${x}, ${y}).`);
    }

    // Hàm để bắt đầu tự động click
    async start(x, y) {
        if (!this.element) {
            console.log('Không tìm thấy phần tử!');
            return;
        }

        // Kích hoạt các sự kiện
        this.triggerMouseEvent('mousedown', x, y);
        this.triggerMouseEvent('mouseup', x, y);
    }

    // Hàm để dừng tự động click
    stop() {
        this.isRunning = false;
        console.log('Tự động click đã dừng lại.');
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

    // Hàm để bắt đầu auto click theo khoảng thời gian ngẫu nhiên
    async startAutoClicking() {
        this.isRunning = true;
        while (this.isRunning) {
            await main(); // Gọi hàm chính và đợi nó hoàn thành
            const waitTime = this.getRandomInterval(1, 2); // Thời gian ngẫu nhiên từ 35 đến 45 phút
            console.log(`Chờ ${waitTime} giây trước khi thực hiện lần tiếp theo.`);
            await this.sleep(waitTime, waitTime); // Đợi trước khi gọi lại main
        }
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

// Hàm chính để thực hiện các hành động
async function main() {
    await clicker.start(300, 213); // Click đầu tiên
    await clicker.sleep(19, 21); // Chờ từ 19 đến 21 giây
    await clicker.start(185, 448); // Click thứ hai
}

// Gọi hàm auto click
clicker.startAutoClicking();

// Để dừng tự động click, bạn có thể gọi:
// clicker.stop();
