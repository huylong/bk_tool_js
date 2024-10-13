// ==UserScript==
// @name         W-Coin Autoclicker
// @version      1.0
// @match        *://alohomora-bucket-fra1-prod-frontend-static.fra1.cdn.digitaloceanspaces.com/*
// @icon         https://img.cryptorank.io/coins/w_coin1718038816897.png
// @run-at       document-start
// @grant        none
// ==/UserScript==

// Thiết lập độ trễ
const minDelay = 60;  // Độ trễ tối thiểu (miligiây)
const maxDelay = 80; // Độ trễ tối đa (miligiây)
const energyThreshold = 25; // Mức năng lượng tối thiểu trước khi tạm dừng
const pauseDuration = 120; // Thời gian tạm dừng (120 giây)
const reloadInterval = 15 * 60 * 1000; // 15 phút (miligiây)

// Hàm tạo độ trễ ngẫu nhiên
function getRandomDelay(min, max) {
  return Math.random() * (max - min) + min;
}

// Hàm lấy mức năng lượng hiện tại
function getCurrentEnergy() {
  const energyElement = document.querySelector('.claim-charger-count-text');
  if (energyElement) {
    const currentEnergy = parseInt(energyElement.textContent, 10);
    return currentEnergy;
  }
  return null;
}

// Hàm chính của autoclicker
function autoClicker() {
  const currentEnergy = getCurrentEnergy();

  if (currentEnergy !== null && currentEnergy < energyThreshold) {
    console.log(`Năng lượng dưới mức ${energyThreshold}, tạm dừng trong ${pauseDuration} giay...`);
    setTimeout(autoClicker, pauseDuration * 1000);
    return;
  }

  const button = document.querySelector('button.claim-button');

  if (!button) {
    setTimeout(autoClicker, getRandomDelay(minDelay, maxDelay));
    return;
  }

  const rect = button.getBoundingClientRect();

  function getRandomCoordinate(min, max) {
    return Math.random() * (max - min) + min;
  }

  const x = getRandomCoordinate(rect.left, rect.right);
  const y = getRandomCoordinate(rect.top, rect.bottom);

  if (typeof TouchEvent === 'function') {
    try {
      const touchObj = new Touch({
        identifier: Date.now(),
        target: button,
        clientX: x,
        clientY: y,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5,
      });

      const touchStartEvent = new TouchEvent("touchstart", {
        cancelable: true,
        bubbles: true,
        touches: [touchObj],
        targetTouches: [touchObj],
        changedTouches: [touchObj],
      });

      // Đảm bảo rằng event listener không phải là passive
      button.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
      button.dispatchEvent(touchStartEvent);

      const delay = getRandomDelay(minDelay, maxDelay);
      setTimeout(() => {
        const touchEndEvent = new TouchEvent("touchend", {
          cancelable: true,
          bubbles: true,
          touches: [],
          targetTouches: [],
          changedTouches: [touchObj],
        });
        button.dispatchEvent(touchEndEvent);

        setTimeout(autoClicker, getRandomDelay(minDelay, maxDelay));

      }, delay);

    } catch (error) {
      console.error('Lỗi khi tạo sự kiện Touch:', error);
      setTimeout(autoClicker, getRandomDelay(minDelay, maxDelay));
    }
  } else {
    console.error('TouchEvent không được hỗ trợ trong trình duyệt này.');
    setTimeout(autoClicker, getRandomDelay(minDelay, maxDelay));
  }
}

// Hàm tự động tải lại trang mỗi 15 phút
function autoReload() {
  console.log('Đang tải lại trang...');
  location.reload();
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

// Khởi động autoclicker sau 5 giây
// Khởi động simulateTabVisibilityAndFocus sau 5 giây
setTimeout(simulateTabVisibilityAndFocus, 5000);
setTimeout(autoClicker, 5000);

// Tự động tải lại trang mỗi 15 phút
setInterval(autoReload, reloadInterval);
