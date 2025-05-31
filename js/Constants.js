// js/Constants.js
export const MAX_VOLTAGE = 9; // Volt
export const MIN_VOLTAGE = 0.1; // Volt
export const DEFAULT_VOLTAGE = 4.5; // Volt

export const MAX_RESISTANCE = 1000; // Ohm
export const MIN_RESISTANCE = 10; // Ohm
export const DEFAULT_RESISTANCE = 500; // Ohm

export const BATTERY_UNIT_VOLTAGE = 1.5; // Volt
export const MAX_BATTERIES = 6;

// Canvas Boyutları (index.html'deki canvas ile tutarlı olmalı)
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 350;

// Akım Eşikleri (Amper cinsinden)
// DEĞİŞTİ: Ampulün daha düşük akımlarda tepki vermesi için eşikler düşürüldü.
export const BULB_CURRENT_LOW_THRESHOLD = 0.004; // 4 mA (Bu eşiğin altı tamamen sönük ve Model.js'de 'off' durumuna denk geliyor)
export const BULB_CURRENT_MEDIUM_THRESHOLD = 0.015; // 15 mA (Bu eşik ve üzeri -> Orta Parlaklık)
export const BULB_CURRENT_HIGH_THRESHOLD = 0.060; // 60 mA (Bu eşik ve üzeri -> Tam Parlaklık)

// Renkler
export const COLOR_V_LETTER = '#007bff'; // Mavi
export const COLOR_R_LETTER = '#007bff'; // Mavi
export const COLOR_I_LETTER = '#ff8c00'; // Turuncu
export const WIRE_COLOR = '#333333';
export const PARTICLE_COLOR = 'rgba(255, 140, 0, 0.8)'; // Akım parçacıkları için turuncu

// SVG Dosya Yolları (assets klasörüne göre)
export const SVG_ASSETS = {
    BATTERY: 'assets/battery.svg',
    RESISTOR: 'assets/resistor.svg',
    BULB_OFF: 'assets/bulb-off.svg',
    BULB_MEDIUM: 'assets/bulb-medium.svg',
    BULB_ON: 'assets/bulb-on.svg',
};

// Ses Dosyası Yolu (sound klasörüne göre)
export const SOUND_FILE = 'sound/feedback.wav';

// Denklem font boyutu için temel ve ölçekleme faktörleri
export const EQUATION_BASE_FONT_SIZE = 28; 
export const EQUATION_FONT_SCALE_FACTOR = 8;

// Akım animasyonu parçacık sayısı
export const NUM_CURRENT_PARTICLES = 30;
export const CURRENT_PARTICLE_RADIUS = 3;

// Batarya çizim detayları
export const BATTERY_SVG_WIDTH = 30;
export const BATTERY_SVG_HEIGHT = 60;
export const BATTERY_SPACING = 10;
export const BATTERY_LABEL_FONT = 'bold 12px Arial';
export const BATTERY_LABEL_COLOR = '#000000';

// Direnç çizim detayları
export const RESISTOR_SVG_WIDTH = 240;
export const RESISTOR_SVG_HEIGHT = 96;
export const RESISTOR_MAX_DOTS = 50;
export const RESISTOR_DOT_COLOR = 'rgba(0,0,0,0.7)';
export const RESISTOR_DOT_RADIUS = 2;

// Ampul çizim detayları
export const BULB_SVG_WIDTH = 108;
export const BULB_SVG_HEIGHT = 162;
export const BULB_GLOW_MAX_RADIUS = 60;
export const BULB_GLOW_LINE_COUNT = 8;
export const BULB_GLOW_BASE_LINE_LENGTH = 30;
