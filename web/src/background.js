export class FluidBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // State
        this.fillHeight = 0; // 0 to 1
        this.wavePhase = 0;
        this.tilt = 0; // Gyro
        this.color = '#3b82f6';
        
        window.addEventListener('resize', () => this.resize());
        this.setupGyro();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    setFill(percent) {
        // Smooth target interpolation could go here, but app updates mostly handle it
        this.fillHeight = percent / 100;
        
        // Color Shift Logic
        if (percent > 75) this.color = '#ef4444'; // Red
        else if (percent > 25) this.color = '#8b5cf6'; // Purple
        else this.color = '#3b82f6'; // Blue
    }

    setupGyro() {
        // Listen for device orientation
        window.addEventListener('deviceorientation', (e) => {
            // Gamma is left/right tilt (-90 to 90)
            const gamma = e.gamma || 0;
            // Clamp and smooth
            this.tilt = gamma * 0.5; // Degrees rotation
        });
    }

    animate() {
        const { ctx, width, height } = this;
        
        ctx.clearRect(0, 0, width, height);
        this.wavePhase += 0.05;

        // Visual Water Level
        // We invert it so 0 is bottom
        const waterY = height - (height * this.fillHeight);

        ctx.save();
        
        // Apply Tilt
        ctx.translate(width/2, height/2);
        ctx.rotate(this.tilt * Math.PI / 180);
        ctx.translate(-width/2, -height/2);

        ctx.beginPath();
        ctx.moveTo(0, height); // Bottom Left
        ctx.lineTo(0, waterY); // Top Left (start)

        // Draw Sine Wave
        for (let x = 0; x <= width; x += 10) {
            const y = Math.sin((x / width) * 4 + this.wavePhase) * 10;
            ctx.lineTo(x, waterY + y);
        }

        ctx.lineTo(width, height); // Bottom Right
        ctx.closePath();
        
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6; // Transparency
        ctx.fill();
        
        // Second Wave (Layered for depth)
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 10) {
            const y = Math.sin((x / width) * 5 + this.wavePhase + 1) * 15;
            ctx.lineTo(x, waterY + y + 5);
        }
        ctx.lineTo(width, height);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.3;
        ctx.fill();

        ctx.restore();

        requestAnimationFrame(() => this.animate());
    }
}