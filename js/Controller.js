// js/Controller.js
import { Model } from './Model.js';
import { View } from './View.js';
import { SoundManager } from './SoundManager.js';
import { DEFAULT_VOLTAGE, DEFAULT_RESISTANCE } from './Constants.js';

export class Controller {
    constructor() {
        this.model = new Model();
        this.view = new View();
        this.soundManager = new SoundManager();

        // DOM Elementleri (Sliderlar ve Reset Butonu)
        this.voltageSlider = document.getElementById('voltageSlider');
        this.resistanceSlider = document.getElementById('resistanceSlider');
        this.resetButton = document.getElementById('resetButton');

        // Başlangıç değerlerini ayarla
        this.voltageSlider.value = DEFAULT_VOLTAGE;
        this.resistanceSlider.value = DEFAULT_RESISTANCE;
    }

    async init() {
        await this.view.loadAssets(); // SVG'leri yükle

        this.voltageSlider.addEventListener('input', (event) => {
            this.model.setVoltage(event.target.value);
            this.updateSimulation();
            this.soundManager.enableSound(); // İlk kullanıcı etkileşiminde sesi etkinleştir
        });

        this.resistanceSlider.addEventListener('input', (event) => {
            this.model.setResistance(event.target.value);
            this.updateSimulation();
            this.soundManager.enableSound(); // İlk kullanıcı etkileşiminde sesi etkinleştir
        });

        this.resetButton.addEventListener('click', () => {
            this.model.reset();
            // Slider'ları da resetle
            this.voltageSlider.value = this.model.getState().voltage;
            this.resistanceSlider.value = this.model.getState().resistance;
            this.updateSimulation();
            // Ses resetlenirken özel bir durum gerekirse burada eklenebilir.
        });

        // İlk yüklemede simülasyonu güncelle
        this.updateSimulation();
    }

    updateSimulation() {
        const state = this.model.getState();
        this.view.update(state);
        this.soundManager.updateSound(state.resistance, state.voltage);
    }
}
