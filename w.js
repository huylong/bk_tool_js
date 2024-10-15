// ==UserScript==
// @name         W-Coin Autoclicker
// @version      1.2
// @match        *://alohomora-bucket-fra1-prod-frontend-static.fra1.cdn.digitaloceanspaces.com/*
// @icon         https://img.cryptorank.io/coins/w_coin1718038816897.png
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  class WCoinAutoclicker {
      constructor() {
          this.config = {
              minDelay: 60,
              maxDelay: 80,
              energyThreshold: 25,
              pauseDuration: 120,
              reloadInterval: 15 * 60 * 1000
          };

          this.selectors = {
              energyElement: '.claim-charger-count-text',
              claimButton: 'button.claim-button'
          };
      }

      getRandomDelay(min, max) {
          return Math.random() * (max - min) + min;
      }

      getCurrentEnergy() {
          const energyElement = document.querySelector(this.selectors.energyElement);
          return energyElement ? parseInt(energyElement.textContent, 10) : null;
      }

      getRandomCoordinate(min, max) {
          return Math.random() * (max - min) + min;
      }

      async autoClicker() {
          const currentEnergy = this.getCurrentEnergy();

          if (currentEnergy !== null && currentEnergy < this.config.energyThreshold) {
              console.log(`Năng lượng dưới mức ${this.config.energyThreshold}, tạm dừng trong ${this.config.pauseDuration} giây...`);
              await new Promise(resolve => setTimeout(resolve, this.config.pauseDuration * 1000));
              this.autoClicker();
              return;
          }

          const button = document.querySelector(this.selectors.claimButton);

          if (!button) {
              setTimeout(() => this.autoClicker(), this.getRandomDelay(this.config.minDelay, this.config.maxDelay));
              return;
          }

          this.simulateTouch(button);
      }

      simulateTouch(button) {
          const rect = button.getBoundingClientRect();
          const x = this.getRandomCoordinate(rect.left, rect.right);
          const y = this.getRandomCoordinate(rect.top, rect.bottom);

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

                  button.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
                  button.dispatchEvent(touchStartEvent);

                  const delay = this.getRandomDelay(this.config.minDelay, this.config.maxDelay);
                  setTimeout(() => {
                      const touchEndEvent = new TouchEvent("touchend", {
                          cancelable: true,
                          bubbles: true,
                          touches: [],
                          targetTouches: [],
                          changedTouches: [touchObj],
                      });
                      button.dispatchEvent(touchEndEvent);

                      setTimeout(() => this.autoClicker(), this.getRandomDelay(this.config.minDelay, this.config.maxDelay));
                  }, delay);

              } catch (error) {
                  console.error('Lỗi khi tạo sự kiện Touch:', error);
                  setTimeout(() => this.autoClicker(), this.getRandomDelay(this.config.minDelay, this.config.maxDelay));
              }
          } else {
              console.error('TouchEvent không được hỗ trợ trong trình duyệt này.');
              setTimeout(() => this.autoClicker(), this.getRandomDelay(this.config.minDelay, this.config.maxDelay));
          }
      }

      autoReload() {
          console.log('Đang tải lại trang...');
          location.reload();
      }

      initialize() {
          setTimeout(() => this.autoClicker(), 5000);
          setInterval(() => this.autoReload(), this.config.reloadInterval);
      }
  }

  const autoclicker = new WCoinAutoclicker();
  autoclicker.initialize();
})();
