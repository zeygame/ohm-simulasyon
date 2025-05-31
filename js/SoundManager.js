import { soundFilePath } from './Constants.js';

let audioContext;
let audioBuffer; // Ses dosyasını tutacak buffer
let sourceNode; // Ses kaynağı düğümü
let gainNode;
let isAudioInitialized = false;

/**
 * Web Audio API'yi başlatır ve ses kaynağını ayarlar.
 * loop.wav dosyasını yükler ve oynatır.
 */
export async function initAudio() {
    if (isAudioInitialized) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0; // Başlangıçta sesi kapat

        // loop.wav dosyasını yükle
        const response = await fetch(soundFilePath);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Ses kaynağını oluştur ve döngüye al
        sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.loop = true; // Sesi döngüye al
        sourceNode.connect(gainNode);
        sourceNode.start(0); // Sesi hemen başlat

        isAudioInitialized = true;
        console.log('Audio initialized and loop.wav loaded.');
    } catch (e) {
        console.warn('Web Audio API not supported or failed to initialize/load audio:', e);
    }
}

/**
 * Sesin şiddetini ayarlar.
 * Direnç arttıkça ses şiddeti artar, Gerilim arttıkça ses şiddeti azalır.
 * @param {number} voltage - Mevcut gerilim.
 * @param {number} resistance - Mevcut direnç.
 * @param {number} maxVoltage - Gerilim sürgüsünün maksimum değeri.
 * @param {number} maxResistance - Direnç sürgüsünün maksimum değeri.
 */
export function updateAudioVolume(voltage, resistance, maxVoltage, maxResistance) {
    if (!isAudioInitialized) return;

    // Direnç arttıkça gain artmalı (0-1 arasında)
    let resistanceFactor = resistance / maxResistance;

    // Gerilim arttıkça gain azalmalı (1-0 arasında)
    let voltageFactor = 1 - (voltage / maxVoltage);

    // İki faktörü birleştirerek gain'i hesapla
    let gain = resistanceFactor * voltageFactor;

    // Çok düşük değerlerde sesi tamamen kapatmak için eşik
    if (gain < 0.01) {
        gain = 0;
    }

    gainNode.gain.setValueAtTime(gain, audioContext.currentTime);
}