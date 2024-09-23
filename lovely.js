// ==UserScript==
// @name         Auto click Lovely
// @version      1.0
// @author       HuyPham
// @match        https://play.lovely.finance/*
// @icon         https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-48.png
// @downloadURL  https://github.com/mudachyo/xKuCoin/raw/main/xkucoin-autoclicker.user.js
// @updateURL    https://github.com/mudachyo/xKuCoin/raw/main/xkucoin-autoclicker.user.js
// @homepage     https://github.com/mudachyo/xKuCoin
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    console.log('Lovely Autoclicker: Script đã được khởi chạy');

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getCurrentEnergy() {
        const energyElement = document.querySelector("body > div.layout_layout__sx_l_ > div > div > div > div.Clicker_bottom__2XKip > div.Energy_energy__2wX36 > span");
        const content = energyElement.textContent.split('/');
        return content ? parseInt(content[0].trim()) : 0;
    }

    function findClickerElement() {
        return document.querySelector("body > div.layout_layout__sx_l_ > div > div > div > div.Clicker_game__zqXSN > div.Clicker_gameContent__aycT2 > div > canvas");
    }

    function autoclicker() {
        const currentEnergy = getCurrentEnergy();
        if (currentEnergy < 20) {
            const pauseDuration = getRandomInt(600, 900) * 1000;
            console.log(`Lovely Autoclicker: Năng lượng thấp (${currentEnergy}), tạm dừng trong ${pauseDuration / 1000} giây`);
            setTimeout(autoclicker, pauseDuration);
        } else {
            const coordinates = getCenterCoordinates();
            const element = document.elementFromPoint(coordinates.x, coordinates.y); // Get the element at the center

            if (element) {
                triggerClickEvent(element, coordinates);
            }

            const randomDelay = getRandomInt(300, 500);
            setTimeout(autoclicker, randomDelay);
        }
    }

    function triggerClickEvent(element, coordinates) {
        // Check if the environment is touch-based or mouse-based
        if ('ontouchstart' in window) {
            // Create and dispatch a touch event for mobile devices
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

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getCenterCoordinates() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;

        const offsetRangeX = 40;
        const offsetRangeY = 60;

        const x = getRandomInt(centerX - offsetRangeX, centerX + offsetRangeX);
        const y = getRandomInt(centerY - offsetRangeY, centerY + offsetRangeY);

        return { x, y };
    }

    function initializeScript() {
        console.log('Lovely Autoclicker đã được khởi chạy');
        setTimeout(() => {
            autoclicker();
        }, 5000);
    }

    initializeScript();
})();

