// ==UserScript==
// @name         1win Autoclicker
// @version      1.1
// @namespace    Violentmonkey Scripts
// @author       mudachyo
// @match        https://cryptocklicker-frontend-rnd-prod.100hp.app/*
// @grant        none
// @icon         https://cryptocklicker-frontend-rnd-prod.100hp.app/images/common/Coin.webp
// @downloadURL  https://github.com/mudachyo/1win-Token/raw/main/1win-autoclicker.user.js
// @updateURL    https://github.com/mudachyo/1win-Token/raw/main/1win-autoclicker.user.js
// @homepage     https://github.com/mudachyo/1win-Token/
// ==/UserScript==

console.log('1win Autoclicker: Script đã được khởi chạy');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCurrentEnergy() {
    const energyElement = document.querySelector('#root > div._wrapper_1cplp_1 > div > footer > div._info_16i6o_10._footerInfo_16i6o_41 > div > div > div > div > span:nth-child(1)');
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
            const pauseDuration = getRandomInt(120, 180) * 1000;
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

            const randomDelay = getRandomInt(80, 120);
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

console.log('1win Autoclicker: Autoclicker đã được khởi chạy');
setTimeout(() => {
    autoclicker();
}, 5000);