// script.js
import { Controller } from './js/Controller.js';

document.addEventListener('DOMContentLoaded', () => {
    const controller = new Controller();
    controller.init().catch(error => {
        console.error("Initialization failed:", error);
        // Kullanıcıya bir hata mesajı gösterilebilir.
        const body = document.querySelector("body");
        if (body) {
            body.innerHTML = `<div style="color: red; text-align: center; padding-top: 50px;">
                                <h1>Simülasyon Yüklenemedi</h1>
                                <p>Lütfen konsolu kontrol edin veya sayfayı yenileyin.</p>
                              </div>`;
        }
    });
});
