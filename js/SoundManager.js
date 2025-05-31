// js/SoundManager.js
import { MAX_RESISTANCE, MAX_VOLTAGE, SOUND_FILE } from './Constants.js';

export class SoundManager {
    constructor() {
        this.player = null;
        this.isSoundEnabled = false;
        this.soundStarted = false;
        this.soundFileLoaded = false;

        if (typeof Tone !== 'undefined') {
            try {
                this.player = new Tone.Player({
                    url: SOUND_FILE, // Constants.js'den gelen güncel yol
                    loop: true,
                    autostart: false,
                    onload: () => {
                        this.soundFileLoaded = true;
                        console.log("Sound file loaded successfully:", SOUND_FILE);
                    },
                    onerror: (error) => {
                        console.error("Error loading sound file with Tone.Player:", error);
                        this.soundFileLoaded = false;
                    }
                }).toDestination();
                this.player.volume.value = -Infinity; 
                console.log("Tone.Player initialized.");
            } catch (e) {
                console.warn("Tone.Player could not be created:", e);
                this.player = null;
            }
        } else {
            console.warn("Tone.js library not found. Sound features will be disabled.");
        }
    }

    enableSound() {
        if (this.player && Tone.context.state !== 'running') {
            Tone.start().then(() => {
                console.log("AudioContext started by user interaction.");
                this.isSoundEnabled = true;
                if (this.soundFileLoaded && !this.soundStarted) {
                    try {
                        this.player.start();
                        this.soundStarted = true;
                        console.log("Sound playback started.");
                    } catch (e) {
                        console.error("Error starting Tone.Player:", e);
                    }
                }
            }).catch(e => {
                console.error("Error starting AudioContext:", e);
            });
        } else if (this.player && Tone.context.state === 'running') {
            this.isSoundEnabled = true;
            if (this.soundFileLoaded && !this.soundStarted) {
                 try {
                    this.player.start();
                    this.soundStarted = true;
                    console.log("Sound playback started (AudioContext already running).");
                } catch (e) {
                    console.error("Error starting Tone.Player (AudioContext already running):", e);
                }
            }
        }
    }

    updateSound(resistance, voltage) {
        if (!this.isSoundEnabled || !this.player || !this.soundFileLoaded || !this.soundStarted) {
            return; 
        }

        const resistanceNormalized = resistance / MAX_RESISTANCE; // 0 ile 1 arası
        const voltageNormalized = voltage / MAX_VOLTAGE;     // 0 ile 1 arası

        // Ses şiddeti mantığı GÜNCELLENDİ:
        // Direnç artarken ses AZALACAK.
        // Gerilim artarken ses ARTACAK.
        
        let baseVolumeDB = -25; // Orta bir başlangıç seviyesi (ayarlanabilir)
        let volumeDB = baseVolumeDB;
        
        // Direnç etkisi: Yüksek direnç -> daha düşük volüm (daha negatif dB)
        // Maksimum etki: resistanceNormalized = 1 ise -20dB ekle (yani toplamda -45dB'e kadar düşebilir)
        volumeDB -= resistanceNormalized * 20; 
        
        // Gerilim etkisi: Yüksek gerilim -> daha yüksek volüm (daha az negatif dB)
        // Maksimum etki: voltageNormalized = 1 ise +20dB ekle (yani toplamda -5dB'e kadar çıkabilir)
        volumeDB += voltageNormalized * 20;
        
        // Volümü makul sınırlar içinde tut (-60dB çok sessiz, 0dB maksimum)
        volumeDB = Math.max(-60, Math.min(0, volumeDB)); 
        
        this.player.volume.value = volumeDB;
    }

    stopSound() {
        if (this.player && this.soundStarted) {
            try {
                this.player.stop();
                this.soundStarted = false;
                console.log("Sound playback stopped.");
            } catch(e) {
                console.error("Error stopping Tone.Player:", e);
            }
        }
    }

    toggleSound(forceState) {
        if (forceState !== undefined) {
            if (forceState) {
                this.enableSound();
            } else {
                this.stopSound();
            }
        } else {
            if (this.isSoundEnabled && this.soundStarted) {
                this.stopSound();
                this.isSoundEnabled = false; 
            } else {
                this.enableSound();
            }
        }
    }
}
