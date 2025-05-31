class Model {
    constructor() {
        this._voltage = 4.5; // Volt - başlangıç değeri
        this._resistance = 500; // Ohm - başlangıç değeri
        this._current = 0; // Amper
        this.calculateCurrent(); // Başlangıç akımını hesapla
    }

    setVoltage(value) {
        this._voltage = parseFloat(value);
        this.calculateCurrent();
    }

    getVoltage() {
        return this._voltage;
    }

    setResistance(value) {
        this._resistance = parseInt(value);
        this.calculateCurrent();
    }

    getResistance() {
        return this._resistance;
    }

    calculateCurrent() {
        if (this._resistance === 0) {
            this._current = Infinity;
        } else {
            this._current = this._voltage / this._resistance; // I = V / R
        }
    }

    getCurrent() {
        return this._current; // Amper cinsinden
    }

    reset() {
        this._voltage = 4.5; // Varsayılan voltaj
        this._resistance = 500; // Varsayılan direnç
        this.calculateCurrent();
    }
}