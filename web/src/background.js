export class FluidBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Physics Configuration (Tuned for Water)
        this.conf = {
            tension: 0.025,     // Higher = Snappier (Water tension)
            dampening: 0.015,   // Lower = More sloshing (Less friction)
            spread: 0.3,        // Higher = Faster ripples
            ambientWave: 10,    // PC: Base wave height
            waveSpeed: 0.15     // PC: Faster animation
        };

        // State
        this.fillPct = 0;       
        this.currentFill = 0;   
        this.tilt = 0;          
        this.currentTilt = 0;   
        this.time = 0;

        // Springs
        this.springs = [];
        this.numSprings = 60; // Increased resolution for smoother waves
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

                // --- GRAVITY FIX ---
                const x = ag.x || 0;
                const y = ag.y || 0;
                
                // Keep the working "Flip" logic
                let angle = Math.atan2(x, y) + Math.PI;

                // Splash Logic
                if (e.acceleration) {
                    const shake = Math.abs(e.acceleration.x) + Math.abs(e.acceleration.y);
                    // More sensitive splash for water feel
                    if (shake > 8) this.splash(shake * 2.5);
                }

                this.tilt = angle;
            });
        }
    }

    splash(force) {
        const index = Math.floor(Math.random() * this.numSprings);
        // Allow higher force limit for water splashes
        const safeForce = Math.min(force, 100); 
        if (this.springs[index]) this.springs[index].v += safeForce;
    }

    update() {
        this.time += this.conf.waveSpeed;

        // 1. Smooth Fill
        this.currentFill += (this.fillPct - this.currentFill) * 0.05;
        
        // 2. Smooth Rotation
        let diff = this.tilt - this.currentTilt;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this.currentTilt += diff * 0.1; // Snappier rotation for water

        // 3. Springs
        for (let i = 0; i < this.numSprings; i++) {
            const spring = this.springs[i];
            
            // Faster ambient waves
            const wave1 = Math.sin(this.time + i * 0.2) * this.conf.ambientWave;
            const wave2 = Math.cos(this.time * 0.7 + i * 0.1) * (this.conf.ambientWave * 0.6);
            
            const targetPos = wave1 + wave2;
            const extension = spring.p - targetPos;
            const acceleration = -this.conf.tension * extension - this.conf.dampening * spring.v;
            spring.v += acceleration;
            spring.p += spring.v;
        }

        // 4. Spread (Run 4 passes for very fast wave propagation)
        const left = new Array(this.numSprings).fill(0);
        const right = new Array(this.numSprings).fill(0);

        for (let j = 0; j < 4; j++) {
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
        
        // Rotation
        ctx.rotate(this.currentTilt);

        // Water Level
        const waterY = (diag / 2) - (this.currentFill * diag);

        ctx.beginPath();
        const startX = -diag / 2;
        const step = diag / this.numSprings;

        ctx.moveTo(startX, waterY + this.springs[0].p);

        for (let i = 1; i < this.numSprings; i++) {
            const x = startX + (i * step);
            const y = waterY + this.springs[i].p;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(diag / 2, diag / 2);   // Bottom Right
        ctx.lineTo(-diag / 2, diag / 2);  // Bottom Left
        ctx.closePath();

        // Colors
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