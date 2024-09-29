// ==UserScript==
// @name         Auto click Bums
// @version      1.0
// @author       HuyPham
// @match        https://app.bums.bot/*
// @icon         https://cdn2.iconfinder.com/data/icons/avatars-60/5985/30-Scientist-48.png
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    console.log('Bums Autoclicker: Script đã được khởi chạy');

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getCurrentEnergy() {
        const energyElement = document.querySelector("#app > div.page-container > div > div > div.footer-view.power-value > span > div > div > div.tap_power_val.text_bold");
        
        if (!energyElement) {
            console.log("Không tìm thấy phần tử energyElement, tạm dừng trong 20 giây");
            return 0; // Trả về giá trị 0 nếu không tìm thấy phần tử
        }
        
        const content = energyElement.textContent.split('/');
        return content ? parseInt(content[0].trim()) : 0;
    }

    function findClickerElement() {
        return document.querySelector("#app > div.page-container > div > div > div.content > div.avatar");
    }

    function autoclicker() {
        const currentEnergy = getCurrentEnergy();
        if (currentEnergy < 1000) {
            const pauseDuration = getRandomInt(200, 300) * 1000;
            console.log(`Bums Autoclicker: Năng lượng thấp (${currentEnergy}), tạm dừng trong ${pauseDuration / 1000} giây`);
            setTimeout(autoclicker, pauseDuration);
            return;
        } else {
            const element = findClickerElement();
            
            if (element) {
                const coordinates = getRandomCoordinates(element);
                triggerClickEvent('touchstart', element, coordinates);
                triggerClickEvent('touchend', element, coordinates);
                const randomDelay = getRandomInt(100, 200);
                setTimeout(autoclicker, randomDelay);
            } else {
                console.log(`Không tìm thấy phần từ để click tạm dựng trong 20s`);
                const randomDelayNotElement = getRandomInt(20000, 30000) * 1000;
                setTimeout(autoclicker, randomDelayNotElement);
                return;
            }
        }
    }

    function getRandomCoordinates(element) {
        const rect = element.getBoundingClientRect();
        const x = getRandomInt(rect.left, rect.right);
        const y = getRandomInt(rect.top, rect.bottom);
        return { x, y };
    }

    function triggerClickEvent(type, element, coordinates) {
        // Check if the environment is touch-based or mouse-based
            // Create and dispatch a touch event for mobile devices
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

        // console.log('Auto-click triggered at', coordinates);
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
        console.log('Bums Autoclicker đã được khởi chạy');
        setTimeout(() => {
            autoclicker();
        }, 5000);
    }

    initializeScript();
})();

