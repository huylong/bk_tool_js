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

    const reloadInterval = 15 * 60 * 1000; // 15 phút (miligiây)

    console.log('Bums Autoclicker: Script đã được khởi chạy');

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getCurrentEnergy() {
        const energyElement = document.querySelector("#app > div.page-container > div > div > div.footer-view.power-value > span > div > div > div.tap_power_val.text_bold");
        const content = energyElement.textContent.split('/');
        return content ? parseInt(content[0].trim()) : 0;
    }

    function findClickerElement() {
        return document.querySelector("body > div.layout_layout__sx_l_ > div > div > div > div.Clicker_game__zqXSN > div.Clicker_gameContent__aycT2 > div > canvas");
    }

    function autoclicker() {
        const currentEnergy = getCurrentEnergy();
        if (currentEnergy < 1000) {
            const pauseDuration = getRandomInt(300, 600) * 1000;
            console.log(`Bums Autoclicker: Năng lượng thấp (${currentEnergy}), tạm dừng trong ${pauseDuration / 1000} giây`);
            setTimeout(autoclicker, pauseDuration);
        } else {
            const coordinates = getCenterCoordinates();
            const element = document.elementFromPoint(coordinates.x, coordinates.y); // Get the element at the center

            if (element) {
                triggerClickEvent('touchstart', element, coordinates);
                // triggerClickEvent('touchend', element, coordinates);
            }

            const randomDelay = getRandomInt(200, 300);
            setTimeout(autoclicker, randomDelay);
        }
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

    // Hàm tự động tải lại trang mỗi 15 phút
    function autoReload() {
        console.log('Đang tải lại trang...');
        location.reload();
    }

    function initializeScript() {
        console.log('Bums Autoclicker đã được khởi chạy');
        setTimeout(() => {
            autoclicker();
        }, 5000);

        setInterval(autoReload, reloadInterval);
    }

    initializeScript();
})();

