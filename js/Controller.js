class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.initializeView(); // Başlangıç görünümünü ayarla

        this.view.bindVoltageChange(this.handleVoltageChange.bind(this));
        this.view.bindResistanceChange(this.handleResistanceChange.bind(this));
        this.view.bindReset(this.handleReset.bind(this));
    }

    initializeView() {
        const voltage = this.model.getVoltage();
        const resistance = this.model.getResistance();
        const current = this.model.getCurrent();
        const activeCells = this.calculateActiveCells(voltage);

        this.view.resetView(voltage, resistance, current, activeCells);
    }

    calculateActiveCells(voltage) {
        let cells = 0;
        if (voltage > 0) {
            // Voltaj 0.75V'tan küçükse 0 pil, büyükse en az 1 pil (yuvarlama ile)
            // Bu, 0.1V gibi çok küçük değerlerde bile pil göstermesini engeller,
            // veya en az 0.75V'a ulaşıldığında ilk pili gösterir.
            // PhET'teki gibi hassas kısmi pil olmadığı için bu bir yaklaşımdır.
             if (voltage < 0.75 && voltage > 0) { // Çok küçük voltajlar için 0 pil
                cells = 0;
             } else {
                cells = Math.round(voltage / 1.5);
             }
        }
        return Math.min(6, Math.max(0, cells)); // 0-6 arasında sınırla
    }

    handleVoltageChange(newVoltage) {
        this.model.setVoltage(newVoltage);
        
        const currentVoltage = this.model.getVoltage(); // Modelden teyit et
        const activeCells = this.calculateActiveCells(currentVoltage);
        
        this.view.displayVoltage(currentVoltage);
        this.view.displayCurrent(this.model.getCurrent());
        this.view.displayBatteries(activeCells);
        // console.log(`Controller: Voltaj -> ${currentVoltage}V, Hücreler -> ${activeCells}`);
    }

    handleResistanceChange(newResistance) {
        this.model.setResistance(newResistance);
        this.view.displayResistance(this.model.getResistance());
        this.view.displayCurrent(this.model.getCurrent());
        // console.log(`Controller: Direnç -> ${this.model.getResistance()}Ω`);
    }

    handleReset() {
        this.model.reset();
        this.initializeView(); // Sıfırlama sonrası görünümü yeniden başlat
        // console.log("Controller: Simülasyon sıfırlandı.");
    }
}