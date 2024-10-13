// ==UserScript==
// @name         1win Autoclicker
// @version      1.1
// @namespace    Violentmonkey Scripts
// @author       mudachyo
// @match        https://cryptocklicker-frontend-rnd-prod.100hp.app/*
// @grant        none
// ==/UserScript==

console.log('1win Autoclicker: Script đã được khởi chạy');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCurrentEnergy() {
    const energyElement = document.querySelector("#root > div._wrapper_1cplp_1 > div > footer > div._info_1qcl4_10._footerInfo_1qcl4_41 > div > div > div > div > span:nth-child(1)");
    if (energyElement) {
        let energyText = energyElement.textContent.replace(/\s/g, '').trim();
        // Thay thế dấu chấm hoặc dấu phẩy bằng chuỗi rỗng
        energyText = energyText.replace(/[.,]/g, '');
        return parseInt(energyText, 10);
    }
    return 0;
}

function findClickerElement() {
    return document.querySelector('img#coin._coin_24iid_65');
}

function autoclicker() {
    const element = findClickerElement();
    if (element) {
        const currentEnergy = getCurrentEnergy();

        if (currentEnergy < 25) {
            const pauseDuration = getRandomInt(200, 300) * 1000;
            console.log(`1win Autoclicker: Năng lượng thấp (${currentEnergy}), tạm dừng trong ${pauseDuration / 1000} giây`);
            setTimeout(autoclicker, pauseDuration);
        } else {
            const coordinates = getRandomCoordinates(element);

            triggerEvent(element, 'pointerdown', coordinates);
            triggerEvent(element, 'mousedown', coordinates);
            triggerEvent(element, 'pointermove', coordinates);
            triggerEvent(element, 'mousemove', coordinates);
            triggerEvent(element, 'pointerup', coordinates);
            triggerEvent(element, 'mouseup', coordinates);
            triggerEvent(element, 'click', coordinates);

            const randomDelay = getRandomInt(60, 80);
            setTimeout(autoclicker, randomDelay);
        }
    } else {
        setTimeout(autoclicker, 1000);
    }
}

function triggerEvent(element, eventType, coordinates) {
    const event = new MouseEvent(eventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: coordinates.x,
        clientY: coordinates.y,
        screenX: coordinates.x + window.screenX,
        screenY: coordinates.y + window.screenY,
    });

    element.dispatchEvent(event);
}

function getRandomCoordinates(element) {
    const rect = element.getBoundingClientRect();
    const x = getRandomInt(rect.left, rect.right);
    const y = getRandomInt(rect.top, rect.bottom);
    return { x, y };
}

// Focus tab
function simulateTabVisibilityAndFocus() {
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

console.log('1win Autoclicker: Autoclicker đã được khởi chạy');
setTimeout(() => {
    autoclicker();
    simulateTabVisibilityAndFocus();
}, 5000);