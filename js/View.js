class View {
    constructor() {
        this.voltageSlider = document.getElementById('voltage-slider');
        this.voltageValueDisplay = document.getElementById('voltage-value');
        this.resistanceSlider = document.getElementById('resistance-slider');
        this.resistanceValueDisplay = document.getElementById('resistance-value');
        this.currentDisplay = document.getElementById('current-display');
        this.resetButton = document.getElementById('reset-button');
        
        this.batteryCells = [];
        for (let i = 1; i <= 6; i++) {
            const cell = document.getElementById(`batt-cell-${i}`);
            if (cell) {
                this.batteryCells.push(cell);
            }
        }
    }

    displayVoltage(voltage) {
        if (this.voltageValueDisplay) {
            this.voltageValueDisplay.textContent = `${voltage.toFixed(1)} V`;
        }
        if (this.voltageSlider && parseFloat(this.voltageSlider.value) !== voltage) {
             this.voltageSlider.value = voltage.toFixed(1);
        }
    }

    displayResistance(resistance) {
        if (this.resistanceValueDisplay) {
            this.resistanceValueDisplay.textContent = `${resistance} Ω`;
        }
         if (this.resistanceSlider && parseInt(this.resistanceSlider.value) !== resistance) {
            this.resistanceSlider.value = resistance;
        }
    }

    displayCurrent(currentAmps) {
        if (this.currentDisplay) {
            if (currentAmps === Infinity) {
                this.currentDisplay.textContent = "∞ mA";
            } else {
                const currentMilliAmps = currentAmps * 1000;
                this.currentDisplay.textContent = `${currentMilliAmps.toFixed(1)} mA`;
            }
        }
    }

    displayBatteries(numberOfActiveCells) {
        this.batteryCells.forEach((cell, index) => {
            if (index < numberOfActiveCells) {
                cell.src = 'assets/batteryvolt.svg'; // "1,5V" yazan pil
                cell.style.display = 'inline'; 
            } else {
                cell.style.display = 'none'; // Aktif olmayanları gizle
            }
        });
    }

    resetView(initialVoltage, initialResistance, initialCurrentAmps, initialActiveCells) {
        this.displayVoltage(initialVoltage);
        this.displayResistance(initialResistance);
        this.displayCurrent(initialCurrentAmps);
        this.displayBatteries(initialActiveCells);
    }

    bindVoltageChange(handler) {
        if (this.voltageSlider) {
            this.voltageSlider.addEventListener('input', (event) => {
                handler(parseFloat(event.target.value));
            });
        }
    }

    bindResistanceChange(handler) {
        if (this.resistanceSlider) {
            this.resistanceSlider.addEventListener('input', (event) => {
                handler(parseInt(event.target.value));
            });
        }
    }

    bindReset(handler) {
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => {
                handler();
            });
        }
    }
}