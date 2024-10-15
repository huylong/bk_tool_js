// ==UserScript==
// @name         Auto click Lovely
// @version      1.1
// @author       HuyPham
// @match        https://play.lovely.finance/*
// @icon         https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-48.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    class LovelyAutoclicker {
        constructor() {
            this.config = {
                minEnergy: 20,
                minPauseDuration: 600,
                maxPauseDuration: 900,
                minClickDelay: 200,
                maxClickDelay: 300,
                offsetRangeX: 40,
                offsetRangeY: 60
            };

            this.selectors = {
                energyElement: "body > div.layout_layout__sx_l_ > div > div > div > div.Clicker_bottom__2XKip > div.Energy_energy__2wX36 > span",
                clickerElement: "body > div.layout_layout__sx_l_ > div > div > div > div.Clicker_game__zqXSN > div.Clicker_gameContent__aycT2 > div > canvas"
            };

            console.log('Lovely Autoclicker: Script đã được khởi chạy');
        }

        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        getCurrentEnergy() {
            const energyElement = document.querySelector(this.selectors.energyElement);
            if (!energyElement) {
                console.log("Không tìm thấy phần tử energyElement");
                return 0;
            }
            const content = energyElement.textContent.split('/');
            return content ? parseInt(content[0].trim()) : 0;
        }

        findClickerElement() {
            return document.querySelector(this.selectors.clickerElement);
        }

        autoclicker() {
            const currentEnergy = this.getCurrentEnergy();
            if (currentEnergy < this.config.minEnergy) {
                const pauseDuration = this.getRandomInt(this.config.minPauseDuration, this.config.maxPauseDuration) * 1000;
                console.log(`Lovely Autoclicker: Năng lượng thấp (${currentEnergy}), tạm dừng trong ${pauseDuration / 1000} giây`);
                setTimeout(() => this.autoclicker(), pauseDuration);
            } else {
                const clickerElement = this.findClickerElement();
                if (clickerElement) {
                    const coordinates = this.getRandomCoordinates(clickerElement);
                    this.triggerClickEvent(clickerElement, coordinates);
                }

                const randomDelay = this.getRandomInt(this.config.minClickDelay, this.config.maxClickDelay);
                setTimeout(() => this.autoclicker(), randomDelay);
            }
        }

        triggerClickEvent(element, coordinates) {
            if ('ontouchstart' in window) {
                const touchObj = new Touch({
                    identifier: Date.now(),
                    target: element,
                    clientX: coordinates.x,
                    clientY: coordinates.y,
                    radiusX: 2.5,
                    radiusY: 2.5,
                    rotationAngle: 10,
                    force: 1.0
                });

                const touchEvent = new TouchEvent('touchstart', {
                    cancelable: true,
                    bubbles: true,
                    touches: [touchObj],
                    targetTouches: [touchObj],
                    changedTouches: [touchObj],
                    shiftKey: true
                });

                element.dispatchEvent(touchEvent);
            }

            console.log('Auto-click triggered at', coordinates);
        }

        getRandomCoordinates(element) {
            const rect = element.getBoundingClientRect();
            const x = this.getRandomInt(rect.left, rect.right);
            const y = this.getRandomInt(rect.top, rect.bottom);
            return { x, y };
        }

        initialize() {
            console.log('Lovely Autoclicker đã được khởi chạy');
            setTimeout(() => this.autoclicker(), 5000);
        }
    }

    const autoclicker = new LovelyAutoclicker();
    autoclicker.initialize();
})();
