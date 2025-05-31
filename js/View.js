// js/View.js
import {
    CANVAS_WIDTH, CANVAS_HEIGHT, COLOR_V_LETTER, COLOR_I_LETTER, COLOR_R_LETTER,
    EQUATION_BASE_FONT_SIZE, EQUATION_FONT_SCALE_FACTOR, MAX_VOLTAGE, MAX_RESISTANCE, MIN_RESISTANCE,
    SVG_ASSETS, WIRE_COLOR, PARTICLE_COLOR, NUM_CURRENT_PARTICLES, CURRENT_PARTICLE_RADIUS,
    BATTERY_SVG_WIDTH, BATTERY_SVG_HEIGHT, BATTERY_SPACING, BATTERY_LABEL_FONT, BATTERY_LABEL_COLOR, BATTERY_UNIT_VOLTAGE,
    RESISTOR_SVG_WIDTH, RESISTOR_SVG_HEIGHT, RESISTOR_DOT_COLOR, RESISTOR_DOT_RADIUS, RESISTOR_MAX_DOTS,
    BULB_SVG_WIDTH, BULB_SVG_HEIGHT, BULB_GLOW_MAX_RADIUS, BULB_GLOW_LINE_COUNT, BULB_GLOW_BASE_LINE_LENGTH
} from './Constants.js';

export class View {
    constructor() {
        this.canvas = document.getElementById('ohmCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;

        this.voltageValueDisplay = document.getElementById('voltageValue');
        this.resistanceValueDisplay = document.getElementById('resistanceValue');
        this.currentValueDisplay = document.getElementById('currentValue');
        this.equationV = document.querySelector('#equation-display .v-letter');
        this.equationI = document.querySelector('#equation-display .i-letter');
        this.equationR = document.querySelector('#equation-display .r-letter');

        this.svgImages = {};
        this.assetsLoaded = false;
        this.particles = [];

        this.circuitPath = [
            { x: 70, y: 50 }, 
            { x: CANVAS_WIDTH - 70, y: 50 }, 
            { x: CANVAS_WIDTH - 70, y: CANVAS_HEIGHT - 70 }, 
            { x: 70, y: CANVAS_HEIGHT - 70 }, 
        ];
        this.totalPathLength = this._calculateTotalPathLength();
        this.initParticles();

        this.animationFrameId = null;
        this.lastState = null;
    }

    async loadAssets() {
        console.log("Loading SVG assets...");
        const assetPromises = [];

        for (const key in SVG_ASSETS) {
            const path = SVG_ASSETS[key];
            const promise = fetch(path)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`SVG dosyası yüklenemedi: ${path} - ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(svgString => this._loadSVGStringAsImage(svgString))
                .then(img => {
                    this.svgImages[key.toLowerCase()] = img; 
                    console.log(`${key} SVG loaded as '${key.toLowerCase()}'.`);
                })
                .catch(error => {
                    console.error(`Error loading SVG asset ${key} from ${path}:`, error);
                    throw error; 
                });
            assetPromises.push(promise);
        }

        try {
            await Promise.all(assetPromises);
            this.assetsLoaded = true;
            console.log("All SVG assets loaded successfully.");
        } catch (error) {
            console.error("One or more SVG assets failed to load. View may not render correctly.", error);
            this.assetsLoaded = false;
        }
    }

    _loadSVGStringAsImage(svgString) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (err) => {
                console.error('SVG string to Image error:', err);
                reject(new Error('Failed to load SVG string as image.'));
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        });
    }

    _calculateTotalPathLength() {
        let length = 0;
        for (let i = 0; i < this.circuitPath.length; i++) {
            const p1 = this.circuitPath[i];
            const p2 = this.circuitPath[(i + 1) % this.circuitPath.length];
            length += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }
        return length;
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < NUM_CURRENT_PARTICLES; i++) {
            this.particles.push({
                dist: (i / NUM_CURRENT_PARTICLES) * this.totalPathLength,
                offset: (Math.random() - 0.5) * 6
            });
        }
    }

    _getPositionOnPath(distance) {
        let currentDist = 0;
        for (let i = 0; i < this.circuitPath.length; i++) {
            const p1 = this.circuitPath[i];
            const p2 = this.circuitPath[(i + 1) % this.circuitPath.length];
            const segmentLength = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

            if (segmentLength === 0 && distance <= currentDist ) {
                 return { x: p1.x, y: p1.y, angle: 0};
            }
            if (segmentLength > 0 && distance <= currentDist + segmentLength + 0.001) {
                const distIntoSegment = distance - currentDist;
                const ratio = distIntoSegment / segmentLength;
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                return {
                    x: p1.x + ratio * dx,
                    y: p1.y + ratio * dy,
                    angle: Math.atan2(dy, dx)
                };
            }
            currentDist += segmentLength;
        }
        return this._getPositionOnPath(distance % this.totalPathLength);
    }

    update(state) {
        this.lastState = state;
        
        this.voltageValueDisplay.textContent = state.voltage.toFixed(1);
        this.resistanceValueDisplay.textContent = state.resistance.toFixed(0);
        this.currentValueDisplay.textContent = state.currentMA.toFixed(2);

        this.equationV.style.fontSize = `${EQUATION_BASE_FONT_SIZE + (state.voltage / MAX_VOLTAGE) * EQUATION_FONT_SCALE_FACTOR}px`;
        this.equationR.style.fontSize = `${EQUATION_BASE_FONT_SIZE + (state.resistance / MAX_RESISTANCE) * EQUATION_FONT_SCALE_FACTOR}px`;
        
        const maxCurrentApprox = MAX_VOLTAGE / MIN_RESISTANCE; 
        this.equationI.style.fontSize = `${EQUATION_BASE_FONT_SIZE + (state.current / maxCurrentApprox) * EQUATION_FONT_SCALE_FACTOR * 2}px`;

        if (!this.animationFrameId) {
            this._animate();
        }
    }
    
    _animate() {
        if (!this.lastState || !this.assetsLoaded) {
            this.animationFrameId = requestAnimationFrame(() => this._animate());
            return;
        }
        this._drawFrame(this.lastState);
        this.animationFrameId = requestAnimationFrame(() => this._animate());
    }

    _drawFrame(state) {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (!this.assetsLoaded) {
            this.ctx.fillStyle = "red";
            this.ctx.font = "16px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText("Varlıklar yüklenemedi. Lütfen konsolu kontrol edin.", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
            return;
        }

        // 1. Kabloları Çiz
        this.ctx.strokeStyle = WIRE_COLOR;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(this.circuitPath[0].x, this.circuitPath[0].y);
        this.ctx.lineTo(this.circuitPath[1].x, this.circuitPath[1].y);
        this.ctx.lineTo(this.circuitPath[2].x, this.circuitPath[2].y);
        this.ctx.lineTo(this.circuitPath[3].x, this.circuitPath[3].y);
        this.ctx.closePath();
        this.ctx.stroke();

        // 2. Bataryaları Çiz (Üst yatay kablo üzerinde, yatay olarak sıralı)
        if (this.svgImages.battery && state.numBatteries > 0) {
            const topWireY = this.circuitPath[0].y; 
            const topWireStartX = this.circuitPath[0].x;
            const topWireEndX = this.circuitPath[1].x;
            const topWireLength = topWireEndX - topWireStartX;

            const totalBatteryStackWidth = state.numBatteries * BATTERY_SVG_WIDTH +
                                         (state.numBatteries > 0 ? (state.numBatteries - 1) * BATTERY_SPACING : 0);
            
            const batteryPackStartX = topWireStartX + (topWireLength - totalBatteryStackWidth) / 2;
            const batteryPackY = topWireY - BATTERY_SVG_HEIGHT / 2;

            for (let i = 0; i < state.numBatteries; i++) {
                this.ctx.drawImage(this.svgImages.battery,
                                   batteryPackStartX + i * (BATTERY_SVG_WIDTH + BATTERY_SPACING),
                                   batteryPackY,
                                   BATTERY_SVG_WIDTH,
                                   BATTERY_SVG_HEIGHT);
            }
            
            this.ctx.fillStyle = BATTERY_LABEL_COLOR;
            this.ctx.font = BATTERY_LABEL_FONT;
            this.ctx.textAlign = 'center';
            const totalBatteryVoltageText = (state.numBatteries * BATTERY_UNIT_VOLTAGE).toFixed(1) + "V";
            const labelXPos = batteryPackStartX + totalBatteryStackWidth / 2;
            const labelYPos = batteryPackY + BATTERY_SVG_HEIGHT + 12; 
            this.ctx.fillText(totalBatteryVoltageText, labelXPos, labelYPos);
        }

        // 3. Direnci Çiz (Alt yatay kablo üzerinde)
        if (this.svgImages.resistor) {
            const bottomWireY = this.circuitPath[3].y; 
            const bottomWireStartX = this.circuitPath[3].x; 
            const bottomWireEndX = this.circuitPath[2].x; 
            const bottomWireLength = bottomWireEndX - bottomWireStartX;

            const resistorX = bottomWireStartX + (bottomWireLength - RESISTOR_SVG_WIDTH) / 2;
            const resistorY = bottomWireY - RESISTOR_SVG_HEIGHT / 2; 
            
            this.ctx.drawImage(this.svgImages.resistor, resistorX, resistorY, RESISTOR_SVG_WIDTH, RESISTOR_SVG_HEIGHT);
            
            this.ctx.fillStyle = RESISTOR_DOT_COLOR;

            // --- DİRENÇ NOKTACIK ALANI HESAPLAMASI GÜNCELLENDİ ---
            const capRadiusEstimate = RESISTOR_SVG_HEIGHT / 2; 
            const verticalPadding = 5; 

            let dotAreaX = resistorX + capRadiusEstimate;
            let dotAreaWidth = RESISTOR_SVG_WIDTH - (2 * capRadiusEstimate);

            let dotAreaY = resistorY + verticalPadding;
            let dotAreaHeight = RESISTOR_SVG_HEIGHT - (2 * verticalPadding);

            if (dotAreaWidth < 0) dotAreaWidth = 0;
            if (dotAreaHeight < 0) dotAreaHeight = 0;
            // --- DİRENÇ NOKTACIK ALANI HESAPLAMASI SONU ---

            for (let i = 0; i < state.resistorDotCount; i++) {
                const dotX = dotAreaX + Math.random() * dotAreaWidth;
                const dotY = dotAreaY + Math.random() * dotAreaHeight;
                
                this.ctx.beginPath();
                this.ctx.arc(dotX, dotY, RESISTOR_DOT_RADIUS, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        // 4. Ampulü Çiz (Sağ dikey kablo üzerinde)
        let bulbImageToDraw;
        switch (state.bulbState) {
            case 'on': bulbImageToDraw = this.svgImages.bulb_on; break;
            case 'medium': bulbImageToDraw = this.svgImages.bulb_medium; break;
            default: bulbImageToDraw = this.svgImages.bulb_off; break;
        }
        
        if (bulbImageToDraw) {
            const bulbX = this.circuitPath[1].x - BULB_SVG_WIDTH / 2; 
            const rightWireTopY = this.circuitPath[1].y;
            const rightWireBottomY = this.circuitPath[2].y;
            const rightWireHeight = rightWireBottomY - rightWireTopY;
            const bulbY = rightWireTopY + (rightWireHeight - BULB_SVG_HEIGHT) / 2;
            
            if (state.bulbState !== 'off' && (state.bulbState === 'on' || state.bulbState === 'medium')) {
                this.ctx.save();
                const glowRadius = Math.min(BULB_GLOW_MAX_RADIUS, state.current * 200);
                this.ctx.shadowBlur = glowRadius;
                this.ctx.shadowColor = (state.bulbState === 'on') ? "rgba(255, 255, 0, 0.7)" : "rgba(255, 255, 150, 0.5)";

                const bulbCenterX = bulbX + BULB_SVG_WIDTH / 2;
                const bulbCenterY = bulbY + BULB_SVG_HEIGHT * (35/90);

                for (let i = 0; i < BULB_GLOW_LINE_COUNT; i++) {
                    const angle = (i / BULB_GLOW_LINE_COUNT) * Math.PI * 2;
                    const lineLength = BULB_GLOW_BASE_LINE_LENGTH + Math.min(30, state.current * 80);
                    
                    const startX = bulbCenterX + Math.cos(angle) * (BULB_SVG_WIDTH * 0.3);
                    const startY = bulbCenterY + Math.sin(angle) * (BULB_SVG_WIDTH * 0.3);
                    const endX = bulbCenterX + Math.cos(angle) * (BULB_SVG_WIDTH * 0.3 + lineLength);
                    const endY = bulbCenterY + Math.sin(angle) * (BULB_SVG_WIDTH * 0.3 + lineLength);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(startX, startY);
                    this.ctx.lineTo(endX, endY);
                    this.ctx.strokeStyle = `rgba(255, 223, 100, ${0.2 + Math.min(0.5, state.current*2)})`;
                    this.ctx.lineWidth = 1.5 + Math.min(2.5, state.current*10);
                    this.ctx.stroke();
                }
                this.ctx.drawImage(bulbImageToDraw, bulbX, bulbY, BULB_SVG_WIDTH, BULB_SVG_HEIGHT);
                this.ctx.restore();
            } else {
                this.ctx.drawImage(bulbImageToDraw, bulbX, bulbY, BULB_SVG_WIDTH, BULB_SVG_HEIGHT);
            }
        } else {
            console.warn(`Ampul çizilemedi: state.bulbState='${state.bulbState}', karşılık gelen SVG bulunamadı.`);
        }

        // 5. Akım Parçacıklarını Çiz ve Güncelle
        const particleSpeed = state.current * 250; 
        this.ctx.fillStyle = PARTICLE_COLOR;
        this.particles.forEach(p => {
            p.dist = (p.dist + particleSpeed * 0.016) % this.totalPathLength; 
            const pos = this._getPositionOnPath(p.dist);
            
            if (pos) {
                let particleDrawX = pos.x;
                let particleDrawY = pos.y;

                const perpendicularAngle = pos.angle + Math.PI / 2;
                particleDrawX += p.offset * Math.cos(perpendicularAngle);
                particleDrawY += p.offset * Math.sin(perpendicularAngle);

                this.ctx.beginPath();
                this.ctx.arc(particleDrawX, particleDrawY, CURRENT_PARTICLE_RADIUS, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}
