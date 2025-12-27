import { ThirstyCalculator } from '../../core/index.js';
import { FluidBackground } from './background.js';
import { ICONS } from './icons.js';

// Init Logic & Background
const calc = new ThirstyCalculator();
const bg = new FluidBackground('fluid-canvas');

// --- STATE ---
let lastMilestoneUnit = '';
let lastIconCount = 0;

// Track counts per type
let counts = {
    query: 0,
    reason: 0,
    image: 0,
    video: 0
};

// Combo System State
let combo = {
    count: 0,
    lastTap: 0,
    timer: null,
    multiplier: 1
};

// UI Elements
const ui = {
    amt: document.getElementById('amount-display'),
    iconArea: document.getElementById('icon-area'),
    text: document.getElementById('comparison-text'),
    logView: document.getElementById('log-view'),
    chart: document.getElementById('chart-container'),
    gyroHint: document.getElementById('gyro-hint'),
    speedBadge: document.getElementById('speed-badge'),
    
    // Badges Map
    badges: {
        query: document.getElementById('badge-query'),
        reason: document.getElementById('badge-reason'),
        image: document.getElementById('badge-image'),
        video: document.getElementById('badge-video')
    }
};

// --- LOGIC HELPER ---

function updateBadge(type, amountAdded) {
    counts[type] += amountAdded;
    
    const badge = ui.badges[type];
    if (badge) {
        badge.textContent = `${counts[type]}`;
        badge.classList.add('visible');
    }
}

function clearBadges() {
    // Reset counts
    counts = { query: 0, reason: 0, image: 0, video: 0 };
    
    // Hide UI
    Object.values(ui.badges).forEach(b => {
        b.classList.remove('visible');
        // Optional: Reset text after fade out
        setTimeout(() => b.textContent = '0', 300);
    });
}

// --- CORE FUNCTIONS ---

/**
 * Handles the tap speed and returns the multiplier (x1, x2, x5)
 */
function handleCombo() {
    const now = Date.now();
    
    // Check if tap is "continuous" (within 500ms)
    if (now - combo.lastTap < 500) {
        combo.count++;
    } else {
        combo.count = 1; // Reset
    }
    
    combo.lastTap = now;
    clearTimeout(combo.timer);

    // Determine Multiplier
    if (combo.count > 15) combo.multiplier = 5;
    else if (combo.count > 5) combo.multiplier = 2;
    else combo.multiplier = 1;

    // Update Badge UI
    if (combo.multiplier > 1 && ui.speedBadge) {
        ui.speedBadge.textContent = `x${combo.multiplier}`;
        ui.speedBadge.classList.add('visible'); // CSS class to show it
    } else if (ui.speedBadge) {
        ui.speedBadge.classList.remove('visible');
    }

    // Reset Timer: If no tap for 1 second, reset combo
    combo.timer = setTimeout(() => {
        combo.count = 0;
        combo.multiplier = 1;
        if(ui.speedBadge) ui.speedBadge.classList.remove('visible');
    }, 1000);

    return combo.multiplier;
}

/**
 * Main Update Loop
 */
function updateUI() {
    const stats = calc.getStats();

    // 1. Amount Display
    if (stats.ml >= 1000) {
        ui.amt.innerHTML = `${stats.liters}<span class="unit">L</span>`;
        // Re-append badge because innerHTML wipes it
        if(ui.speedBadge) ui.amt.appendChild(ui.speedBadge);
    } else {
        ui.amt.innerHTML = `${stats.ml}<span class="unit">ml</span>`;
        if(ui.speedBadge) ui.amt.appendChild(ui.speedBadge);
    }

    // 2. Shock Text
    // Logic is now inside the Core Package
    const newFact = calc.getShockFact(); 
    if (newFact) {
        // Fade effect
        ui.text.style.opacity = 0;
        setTimeout(() => {
            ui.text.innerHTML = newFact;
            ui.text.style.opacity = 1;
        }, 200);
    }

    // 3. Multi-Icon Logic
    const newUnit = stats.milestone.unit;
    let newCount = Math.floor(stats.ml / stats.milestone.limit);
    
    // Visual Caps
    if (newCount < 1) newCount = 1; 
    if (newCount > 6) newCount = 6; 

    // If unit changed (e.g. Glass -> Bottle), clear everything
    if (newUnit !== lastMilestoneUnit) {
        ui.iconArea.innerHTML = '';
        lastIconCount = 0;
        lastMilestoneUnit = newUnit;
    }

    // Only append icons if count INCREASED
    if (newCount > lastIconCount) {
        const diff = newCount - lastIconCount;
        for (let i = 0; i < diff; i++) {
            const span = document.createElement('span');
            span.className = 'milestone-svg pop-in'; // Add animation class
            span.innerHTML = ICONS[stats.milestone.icon];
            ui.iconArea.appendChild(span);
        }
        lastIconCount = newCount;
    }

    // 4. Fluid Background Fill
    bg.setFill(stats.fillPercentage);
}

// --- EVENT LISTENERS ---

// Control Buttons
document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const mult = handleCombo();
        calc.add(type, mult);
        updateBadge(type, mult);        
        updateUI();
        if(navigator.vibrate) navigator.vibrate(10);
    });
});

// Reset
document.getElementById('btn-reset').addEventListener('click', () => {
    calc.reset();
    lastIconCount = 0;
    lastMilestoneUnit = '';
    ui.iconArea.innerHTML = '';
    clearBadges();
    updateUI();
});

// Gyro Permission (iOS)
ui.amt.addEventListener('click', () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    if(ui.gyroHint) ui.gyroHint.style.opacity = '0';
                    bg.setupGyro();
                }
            })
            .catch(console.error);
    } else {
        bg.setupGyro();
    }
});

// Log View Handling
document.getElementById('btn-log').addEventListener('click', () => {
    ui.logView.classList.remove('hidden');
    // Tiny delay to allow display:block to apply before adding active class for transition
    setTimeout(() => ui.logView.classList.add('active'), 10);
    renderChart();
});

document.getElementById('close-log').addEventListener('click', () => {
    ui.logView.classList.remove('active');
    setTimeout(() => ui.logView.classList.add('hidden'), 400); // Wait for transition
});

/**
 * Renders the simple CSS bar chart
 */
function renderChart() {
    // Mock History (In a real app, load this from localStorage)
    // We append current session stats at the end
    const history = [150, 400, 2500, 1000, 50, 7500, calc.getStats().ml];
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'Today'];
    
    // Calculate Max for scaling
    const max = Math.max(...history, 500); 

    ui.chart.innerHTML = ''; // Clear previous
    
    history.forEach((val, i) => {
        const h = (val / max) * 100;
        // Ensure even 0 values have a tiny line so graph looks complete
        const finalH = h < 2 ? 2 : h; 
        
        const bar = document.createElement('div');
        bar.className = 'chart-bar' + (i === 6 ? ' today' : '');
        
        // Use requestAnimationFrame to trigger the height animation
        requestAnimationFrame(() => {
            bar.style.height = `${finalH}%`;
        });

        bar.innerHTML = `<span class="bar-date">${days[i]}</span>`;
        ui.chart.appendChild(bar);
    });
}

// Start
updateUI();