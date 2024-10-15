// ==UserScript==
// @name         1win Autoclicker
// @version      1.3
// @namespace    Violentmonkey Scripts
// @author       mudachyo
// @match        https://cryptocklicker-frontend-rnd-prod.100hp.app/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    class OneWinAutoclicker {
        constructor() {
            this.config = {
                minEnergy: 25,
                minPauseDuration: 200,
                maxPauseDuration: 300,
                minClickDelay: 60,
                maxClickDelay: 80,
            };

            this.selectors = {
                energyElement: "#root > div._wrapper_1cplp_1 > div > footer > div._info_1qcl4_10._footerInfo_1qcl4_41 > div > div > div > div > span:nth-child(1)",
                clickerElement: 'img#coin._coin_24iid_65'
            };

            console.log('1win Autoclicker: Script đã được khởi chạy');
        }

        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        getCurrentEnergy() {
            const energyElement = document.querySelector(this.selectors.energyElement);
            if (energyElement) {
                let energyText = energyElement.textContent.replace(/\s/g, '').trim();
                energyText = energyText.replace(/[.,]/g, '');
                return parseInt(energyText, 10);
            }
            return 0;
        }

        findClickerElement() {
            return document.querySelector(this.selectors.clickerElement);
        }

        autoclicker() {
            const element = this.findClickerElement();
            if (element) {
                const currentEnergy = this.getCurrentEnergy();

                if (currentEnergy < this.config.minEnergy) {
                    const pauseDuration = this.getRandomInt(this.config.minPauseDuration, this.config.maxPauseDuration) * 1000;
                    console.log(`1win Autoclicker: Năng lượng thấp (${currentEnergy}), tạm dừng trong ${pauseDuration / 1000} giây`);
                    setTimeout(() => this.autoclicker(), pauseDuration);
                } else {
                    const coordinates = this.getRandomCoordinates(element);

                    this.triggerEvent(element, 'pointerdown', coordinates);
                    this.triggerEvent(element, 'mousedown', coordinates);
                    this.triggerEvent(element, 'pointermove', coordinates);
                    this.triggerEvent(element, 'mousemove', coordinates);
                    this.triggerEvent(element, 'pointerup', coordinates);
                    this.triggerEvent(element, 'mouseup', coordinates);
                    this.triggerEvent(element, 'click', coordinates);

                    const randomDelay = this.getRandomInt(this.config.minClickDelay, this.config.maxClickDelay);
                    setTimeout(() => this.autoclicker(), randomDelay);
                }
            } else {
                setTimeout(() => this.autoclicker(), 1000);
            }
        }

        triggerEvent(element, eventType, coordinates) {
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

        getRandomCoordinates(element) {
            const rect = element.getBoundingClientRect();
            const x = this.getRandomInt(rect.left, rect.right);
            const y = this.getRandomInt(rect.top, rect.bottom);
            return { x, y };
        }

        keepTabActive() {
            if (!window.Worker) {
                console.log("Web Workers không được hỗ trợ trong trình duyệt này.");
                return;
            }

            let worker = null;

            function createWorker() {
                try {
                    const blob = new Blob([
                        `setInterval(() => {
                            self.postMessage('keepAlive');
                        }, 20000);`
                    ], { type: 'application/javascript' });
                    return new Worker(URL.createObjectURL(blob));
                } catch (e) {
                    console.error("Không thể tạo Worker:", e);
                    return null;
                }
            }

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    if (!worker) {
                        worker = createWorker();
                        if (worker) {
                            worker.onmessage = () => {
                                window.dispatchEvent(new Event('mousemove'));
                                console.log("Tab vẫn đang hoạt động");
                            };
                        }
                    }
                } else {
                    if (worker) {
                        worker.terminate();
                        worker = null;
                    }
                }
            });
        }

        initialize() {
            this.keepTabActive();
            setTimeout(() => this.autoclicker(), 5000);
        }
    }

    const autoclicker = new OneWinAutoclicker();
    autoclicker.initialize();
})();
