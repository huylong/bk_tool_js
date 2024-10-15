// ==UserScript==
// @name         Auto click Bums
// @version      1.1
// @author       HuyPham
// @match        https://app.bums.bot/*
// @icon         https://cdn2.iconfinder.com/data/icons/avatars-60/5985/30-Scientist-48.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    class BumsAutoclicker {
        constructor() {
            this.reloadInterval = 15 * 60 * 1000; // 15 phút (miligiây)
            this.minEnergy = 1000;
            this.clickerSelector = "#app > div.page-container > div > div.tap-container > div.content > div.avatar";
            this.energySelector = "#app > div.page-container > div > div.tap-container > div.footer-view.power-value > span > div > div > div.tap_power_val.text_bold";
            this.claimTokenSelector = "body > div.van-popup.van-popup--bottom.mine-offline-popup.van-safe-area-bottom > div > button";
        }

        static getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        getCurrentEnergy() {
            const energyElement = document.querySelector(this.energySelector);
            const content = energyElement?.textContent.split('/');
            return content ? parseInt(content[0].trim()) : 0;
        }

        findClickerElement() {
            return document.querySelector(this.clickerSelector);
        }

        checkClaimToken() {
            return document.querySelector(this.claimTokenSelector);
        }

        getRandomCoordinates(element) {
            const rect = element.getBoundingClientRect();
            const x = BumsAutoclicker.getRandomInt(rect.left, rect.right);
            const y = BumsAutoclicker.getRandomInt(rect.top, rect.bottom);
            return { x, y };
        }

        triggerClickEvent(type, element, coordinates) {
            const touchObj = new Touch({
                identifier: Date.now(),
                target: element,
                clientX: coordinates.x,
                clientY: coordinates.y,
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
                touches: [touchObj],
                targetTouches: [touchObj],
                changedTouches: [touchObj]
            });

            element.dispatchEvent(touchEvent);
        }

        async autoclicker() {
            const currentEnergy = this.getCurrentEnergy();
            if (currentEnergy < this.minEnergy) {
                const pauseDuration = BumsAutoclicker.getRandomInt(300, 600) * 1000;
                console.log(`Bums Autoclicker: Năng lượng thấp (${currentEnergy}), tạm dừng trong ${pauseDuration / 1000} giây`);
                await new Promise(resolve => setTimeout(resolve, pauseDuration));
            } else {
                const element = this.findClickerElement();
                const getClaimToken = this.checkClaimToken();

                if (getClaimToken) {
                    const coordinates = this.getRandomCoordinates(getClaimToken);
                    this.triggerClickEvent('touchstart', getClaimToken, coordinates);
                    this.triggerClickEvent('touchend', getClaimToken, coordinates);
                }

                if (element) {
                    const coordinates = this.getRandomCoordinates(element);
                    this.triggerClickEvent('touchstart', element, coordinates);
                }

                await new Promise(resolve => setTimeout(resolve, BumsAutoclicker.getRandomInt(200, 300)));
            }

            this.autoclicker();
        }

        autoReload() {
            console.log('Đang tải lại trang...');
            location.reload();
        }

        initialize() {
            console.log('Bums Autoclicker đã được khởi chạy');
            setTimeout(() => this.autoclicker(), 5000);
            setInterval(() => this.autoReload(), this.reloadInterval);
        }
    }

    const bumsAutoclicker = new BumsAutoclicker();
    bumsAutoclicker.initialize();
})();
