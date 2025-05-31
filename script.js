document.addEventListener('DOMContentLoaded', () => {
    console.log("Ohm Yasası Simülasyonu Başlatılıyor...");
    
    const model = new Model();
    const view = new View();
    const appController = new Controller(model, view);
    
    console.log("Simülasyon Hazır.");
});