// ==UserScript==
// @name         Auto click CELL Wallet
// @version      1.0
// @author       HuyPham
// @match        https://cell-frontend.s3.us-east-1.amazonaws.com/*
// @icon         https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678087-heart-48.png
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    console.log('CELL Wallet Autoclicker: Script đã được khởi chạy');

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getCurrentEnergy() {
        const energyElement = document.querySelector("#root > main > div > div.relative.w-full.h-full.p-4.rounded-\\[40px\\].shadow-card.bg-card.touch-none > div.absolute.top-4.right-4.inline-flex.items-center.gap-2.z-\\[1\\].pointer-events-none.rounded-\\[40px\\].text-sm.px-4.py-2.shadow-card.bg-white\\/50.font-mono.backdrop-blur > span");
        const content = energyElement.textContent.split('/');
        return content ? parseInt(content[0].trim()) : 0;
    }

    function findClickerElement() {
        const divElement = Array.from(document.querySelectorAll('div')).find(div => {
            return div.style.backgroundImage.includes('/telegram-mini-app/cells/pink.png');
        });

        return divElement;
    }

    function autoclicker() {
        const currentEnergy = getCurrentEnergy();
        if (currentEnergy < 50) {
            const pauseDuration = getRandomInt(600, 900) * 1000;
            console.log(`CELL Wallet Autoclicker: Năng lượng thấp (${currentEnergy}), tạm dừng trong ${pauseDuration / 1000} giây`);
            setTimeout(autoclicker, pauseDuration);
        } else {
            const element = findClickerElement();
            if (element) {
                const coordinates = getRandomCoordinates(element);
                triggerEvent(element, 'pointerdown', coordinates);
                triggerEvent(element, 'mousedown', coordinates);
                triggerEvent(element, 'pointermove', coordinates);
                triggerEvent(element, 'mousemove', coordinates);
                triggerEvent(element, 'pointerup', coordinates);
                triggerEvent(element, 'mouseup', coordinates);
                triggerEvent(element, 'click', coordinates);
                const randomDelay = getRandomInt(200, 300);
                setTimeout(autoclicker, randomDelay);
            }
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
        const y = getRandomInt(centerY + 100, centerY + offsetRangeY + 100);

        return { x, y };
    }

    function getRandomCoordinates(element) {
        const rect = element.getBoundingClientRect();
        const x = getRandomInt(rect.left, rect.right);
        const y = getRandomInt(rect.top, rect.bottom);
        return { x, y };
    }

    function initializeScript() {
        console.log('CELL Wallet Autoclicker đã được khởi chạy');
        setTimeout(() => {
            autoclicker();
        }, 5000);
    }

    initializeScript();
})();

