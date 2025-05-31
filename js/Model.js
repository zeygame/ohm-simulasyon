// js/Model.js
import {
    DEFAULT_VOLTAGE,
    DEFAULT_RESISTANCE,
    BATTERY_UNIT_VOLTAGE,
    MAX_BATTERIES,
    MAX_RESISTANCE,
    BULB_CURRENT_LOW_THRESHOLD,
    BULB_CURRENT_MEDIUM_THRESHOLD,
    BULB_CURRENT_HIGH_THRESHOLD,
    RESISTOR_MAX_DOTS // Dirençteki maksimum nokta sayısı için sabiti buraya ekledik
} from './Constants.js';

export class Model {
    constructor() {
        this.voltage = DEFAULT_VOLTAGE;
        this.resistance = DEFAULT_RESISTANCE;
        this.current = 0;
        this.calculateCurrent();
    }

    setVoltage(v) {
        this.voltage = parseFloat(v);
        this.calculateCurrent();
    }

    setResistance(r) {
        this.resistance = parseFloat(r);
        this.calculateCurrent();
    }

    calculateCurrent() {
        if (this.resistance > 0) {
            this.current = this.voltage / this.resistance; // Amper
        } else {
            this.current = 0;
        }
    }

    getState() {
        return {
            voltage: this.voltage,
            resistance: this.resistance,
            current: this.current, // Amper
            currentMA: this.current * 1000, // Miliamper
            numBatteries: this.getNumberOfBatteries(),
            resistorDotCount: this.getResistorDotCount(),
            bulbState: this.getBulbState(),
        };
    }

    getNumberOfBatteries() {
        return Math.min(MAX_BATTERIES, Math.ceil(this.voltage / BATTERY_UNIT_VOLTAGE));
    }

    getResistorDotCount() {
        // Constants.js'deki sabit adının RESISTOR_MAX_DOTS olduğunu varsayarak kullanıyoruz.
        return Math.floor((this.resistance / MAX_RESISTANCE) * RESISTOR_MAX_DOTS);
    }

    getBulbState() {
        if (this.current >= BULB_CURRENT_HIGH_THRESHOLD) {
            return 'on'; // assets/bulb-on.svg
        } else if (this.current >= BULB_CURRENT_MEDIUM_THRESHOLD) {
            return 'medium'; // assets/bulb-medium.svg
        } else if (this.current >= BULB_CURRENT_LOW_THRESHOLD) {
            // Bu durumda ampul sönük ama devrede. İsterseniz 'dim' (loş) gibi yeni bir durum
            // ve buna uygun bir SVG de tanımlayabilirsiniz. Şimdilik 'off' kullanıyoruz.
            return 'off';
        }
        return 'off'; // assets/bulb-off.svg (tamamen sönük veya çok çok düşük akım)
    }

    reset() {
        this.voltage = DEFAULT_VOLTAGE;
        this.resistance = DEFAULT_RESISTANCE;
        this.calculateCurrent();
    }
}
