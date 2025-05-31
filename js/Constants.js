// Akım eşikleri (Amper cinsinden)
export const currentThresholds = {
    off: 0.05, // 50 mA altı
    medium: 0.15 // 50 mA - 150 mA arası
};

// Devre elemanlarının konumları ve boyutları için yapılandırma
export const circuitConfig = {
    padding: 50, // Devrenin kenarlardan içe doğru boşluğu
    batteryWidth: 40,
    batteryHeight: 60,
    resistorWidth: 80,
    resistorHeight: 40,
    bulbSize: 60,
    wireThickness: 4,
    dotRadius: 1.5, // Direnç içindeki noktaların yarıçapı
    electronSize: 4, // Elektron/ok boyutu
    electronColor: '#f97316' // Turuncu
};

// SVG varlıklarının yolları
export const assetPaths = {
    battery: 'assets/battery.svg',
    bulbOff: 'assets/bulb-off.svg',
    bulbMedium: 'assets/bulb-medium.svg',
    bulbOn: 'assets/bulb-on.svg',
    resistor: 'assets/resistor.svg'
};

// Ses dosyasının yolu
export const soundFilePath = 'assets/sound/loop.wav';