// ==UserScript==
// @name         W-Coin Autoclicker
// @version      1.0
// @match        *://alohomora-bucket-fra1-prod-frontend-static.fra1.cdn.digitaloceanspaces.com/*
// @icon         https://img.cryptorank.io/coins/w_coin1718038816897.png
// @run-at       document-start
// @grant        none
// ==/UserScript==

// Thiết lập độ trễ
const minDelay = 80;  // Độ trễ tối thiểu (miligiây)
const maxDelay = 140; // Độ trễ tối đa (miligiây)
const energyThreshold = 25; // Mức năng lượng tối thiểu trước khi tạm dừng
const pauseDuration = 60000; // Thời gian tạm dừng (60 giây)
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
    console.log(`Năng lượng dưới mức ${energyThreshold}, tạm dừng trong ${pauseDuration} ms...`);
    setTimeout(autoClicker, pauseDuration);
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

// Khởi động autoclicker sau 5 giây
setTimeout(autoClicker, 5000);

// Tự động tải lại trang mỗi 15 phút
setInterval(autoReload, reloadInterval);
