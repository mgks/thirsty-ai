export class FluidBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Physics Configuration
        this.conf = {
            tension: 0.015,
            dampening: 0.04,
            spread: 0.25,
            ambientWave: 10,
            waveSpeed: 0.1
        };

        // State
        this.fillPct = 0;       
        this.currentFill = 0;   
        this.tilt = 0;          
        this.currentTilt = 0;   
        this.time = 0;

        // Springs
        this.springs = [];
        this.numSprings = 50; 
        this.initSprings();

        // Setup
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.setupSensors();
        this.animate();
    }

    initSprings() {
        this.springs = [];
        for(let i=0; i<this.numSprings; i++) {
            this.springs.push({ p: 0, v: 0 });
        }
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.diag = Math.hypot(this.width, this.height);
    }

    setFill(percent) {
        if (percent <= 0) this.fillPct = 0;
        else this.fillPct = 0.05 + (percent / 100) * 0.95;
    }

    setupSensors() {
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', (e) => {
                const ag = e.accelerationIncludingGravity;
                if (!ag) return;

                // --- EXPERIMENTAL GRAVITY FIX ---
                const x = ag.x || 0;
                const y = ag.y || 0;
                
                // 1. Math.atan2(x, y) is the standard for orientation.
                // 2. We add Math.PI (180 degrees) to force the liquid to the opposite side 
                //    of whatever it was doing before (Top -> Bottom).
                let angle = Math.atan2(x, y) + Math.PI;

                // Splash Logic
                if (e.acceleration) {
                    const shake = Math.abs(e.acceleration.x) + Math.abs(e.acceleration.y);
                    if (shake > 10) this.splash(shake * 2);
                }

                this.tilt = angle;
            });
        }
    }

    splash(force) {
        const index = Math.floor(Math.random() * this.numSprings);
        const safeForce = Math.min(force, 60); 
        if (this.springs[index]) this.springs[index].v += safeForce;
    }

    update() {
        this.time += this.conf.waveSpeed;

        this.currentFill += (this.fillPct - this.currentFill) * 0.05;
        
        // Circular Lerp
        let diff = this.tilt - this.currentTilt;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this.currentTilt += diff * 0.05;

        // Springs
        for (let i = 0; i < this.numSprings; i++) {
            const spring = this.springs[i];
            // PC Waves
            const wave1 = Math.sin(this.time + i * 0.2) * this.conf.ambientWave;
            const wave2 = Math.cos(this.time * 0.7 + i * 0.1) * (this.conf.ambientWave * 0.6);
            
            const targetPos = wave1 + wave2;
            const extension = spring.p - targetPos;
            const acceleration = -this.conf.tension * extension - this.conf.dampening * spring.v;
            spring.v += acceleration;
            spring.p += spring.v;
        }

        // Spread
        const left = new Array(this.numSprings).fill(0);
        const right = new Array(this.numSprings).fill(0);

        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < this.numSprings; i++) {
                if (i > 0) {
                    left[i] = this.conf.spread * (this.springs[i].p - this.springs[i-1].p);
                    this.springs[i-1].v += left[i];
                }
                if (i < this.numSprings - 1) {
                    right[i] = this.conf.spread * (this.springs[i].p - this.springs[i+1].p);
                    this.springs[i+1].v += right[i];
                }
            }
            for (let i = 0; i < this.numSprings; i++) {
                if (i > 0) this.springs[i-1].p += left[i];
                if (i < this.numSprings - 1) this.springs[i+1].p += right[i];
            }
        }
    }

    animate() {
        this.update();
        const { ctx, width, height, diag } = this;
        
        ctx.clearRect(0, 0, width, height);
        ctx.save();

        ctx.translate(width / 2, height / 2);
        
        // --- ROTATION ---
        // We use the raw calculated tilt. 
        // If it was backwards before, the +Math.PI in setupSensors fixed it.
        ctx.rotate(this.currentTilt);

        // --- DRAWING LOGIC ---
        // 0% Fill = Top of the box (relative to rotation)
        // 100% Fill = Bottom of the box
        // We want to fill from the bottom UP.
        
        // The Box Height is 'diag' (huge).
        // Center is 0. Bottom is +diag/2. Top is -diag/2.
        
        // We draw the "Air" above the water instead of the water? 
        // No, let's draw the water.
        
        // Water Surface Y Position:
        // Start at Bottom (+diag/2) and move Up (subtract).
        const waterY = (diag / 2) - (this.currentFill * diag);

        ctx.beginPath();
        const startX = -diag / 2;
        const step = diag / this.numSprings;

        // Draw Surface Line
        ctx.moveTo(startX, waterY + this.springs[0].p);
        for (let i = 1; i < this.numSprings; i++) {
            const x = startX + (i * step);
            const y = waterY + this.springs[i].p;
            ctx.lineTo(x, y);
        }

        // Draw the rest of the box DOWN to the bottom
        ctx.lineTo(diag / 2, diag / 2);   // Bottom Right
        ctx.lineTo(-diag / 2, diag / 2);  // Bottom Left
        ctx.closePath();

        // Color
        let color = '#3b82f6'; 
        if (this.currentFill > 0.75) color = '#ef4444';
        else if (this.currentFill > 0.25) color = '#8b5cf6';
        
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        ctx.fill();

        ctx.restore();
        requestAnimationFrame(() => this.animate());
    }
}