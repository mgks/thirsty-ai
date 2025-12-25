// --- 1. ASSET GENERATOR (Zero Dependency SVGs) ---
function createSVGTexture(type, color, w, h) {
    let svg = '';
    const half = w / 2;
    
    if (type === 'drop') {
        svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
            <path d="M${half} 0 Q${w} ${h*0.7} ${half} ${h} Q0 ${h*0.7} ${half} 0" fill="${color}" stroke="white" stroke-width="2"/>
        </svg>`;
    } else if (type === 'ice') {
        svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
            <rect x="2" y="2" width="${w-4}" height="${h-4}" fill="${color}" stroke="white" stroke-width="2" rx="4"/>
            <path d="M5 5 L15 15" stroke="white" stroke-opacity="0.5"/>
        </svg>`;
    } else if (type === 'bottle') {
        svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
            <rect x="${w*0.3}" y="0" width="${w*0.4}" height="${h*0.3}" fill="#ccc"/>
            <rect x="0" y="${h*0.3}" width="${w}" height="${h*0.7}" fill="${color}" rx="5" stroke="white" stroke-width="2"/>
        </svg>`;
    } else if (type === 'barrel') {
        svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
            <rect x="0" y="0" width="${w}" height="${h}" fill="${color}" stroke="white" stroke-width="4" rx="5"/>
            <line x1="0" y1="${h*0.3}" x2="${w}" y2="${h*0.3}" stroke="rgba(0,0,0,0.3)" stroke-width="3"/>
            <line x1="0" y1="${h*0.7}" x2="${w}" y2="${h*0.7}" stroke="rgba(0,0,0,0.3)" stroke-width="3"/>
            <path d="M${w*0.3} ${h*0.5} L${w*0.4} ${h*0.4} L${w*0.6} ${h*0.4} L${w*0.5} ${h*0.6} Z" fill="yellow"/>
        </svg>`;
    }

    const blob = new Blob([svg], {type: 'image/svg+xml'});
    return URL.createObjectURL(blob);
}

// Pre-generate textures
const textures = {
    drop: createSVGTexture('drop', '#00aaff', 30, 30),
    ice: createSVGTexture('ice', '#aaddff', 40, 40),
    bottle: createSVGTexture('bottle', '#0088cc', 30, 60),
    barrel: createSVGTexture('barrel', '#ff4444', 60, 80)
};

// --- 2. AUDIO SYNTH (Procedural Sound) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    
    if (type === 'drop') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'heavy') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    }
}

// --- 3. PHYSICS ENGINE ---
const { Engine, Render, Runner, Bodies, Composite, Events, Mouse, MouseConstraint, Body } = Matter;

const engine = Engine.create();
const world = engine.world;
const render = Render.create({
    element: document.getElementById('physics-container'),
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframes: false
    }
});

// Walls
const wallOpts = { isStatic: true, render: { visible: false } };
const ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight + 60, window.innerWidth, 120, wallOpts);
const leftW = Bodies.rectangle(-60, window.innerHeight/2, 120, window.innerHeight, wallOpts);
const rightW = Bodies.rectangle(window.innerWidth+60, window.innerHeight/2, 120, window.innerHeight, wallOpts);
Composite.add(world, [ground, leftW, rightW]);

// Mouse Control (Drag items)
const mouse = Mouse.create(render.canvas);
const mConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: { stiffness: 0.1, render: { visible: false } }
});
Composite.add(world, mConstraint);

// Collision Sound
Events.on(engine, 'collisionStart', (event) => {
    const pairs = event.pairs;
    pairs.forEach((pair) => {
        // Only play sound if impact velocity is high enough
        const speed = pair.collision.normal.x * (pair.bodyA.velocity.x - pair.bodyB.velocity.x) + 
                      pair.collision.normal.y * (pair.bodyA.velocity.y - pair.bodyB.velocity.y);
        
        if (Math.abs(speed) > 5) { // Threshold
             // Heavier objects make deeper sounds
             const mass = pair.bodyA.mass + pair.bodyB.mass;
             playSound(mass > 2 ? 'heavy' : 'drop');
        }
    });
});

Render.run(render);
Runner.run(Runner.create(), engine);

// --- 4. GAME LOGIC ---
let totalMl = 0;
let itemCount = 0;

function spawn(type) {
    let body;
    const x = Math.random() * (window.innerWidth - 100) + 50;
    const y = -50;
    const common = { restitution: 0.3, friction: 0.5 };

    if (type === 'drop') {
        body = Bodies.circle(x, y, 15, { ...common, render: { sprite: { texture: textures.drop, xScale:1, yScale:1 } } });
        totalMl += 15;
    } else if (type === 'ice') {
        body = Bodies.rectangle(x, y, 40, 40, { ...common, render: { sprite: { texture: textures.ice, xScale:1, yScale:1 } } });
        totalMl += 75;
    } else if (type === 'bottle') {
        body = Bodies.rectangle(x, y, 30, 60, { ...common, render: { sprite: { texture: textures.bottle, xScale:1, yScale:1 } } });
        totalMl += 500;
    } else if (type === 'barrel') {
        body = Bodies.rectangle(x, y, 60, 80, { ...common, density: 0.05, render: { sprite: { texture: textures.barrel, xScale:1, yScale:1 } } });
        totalMl += 2500;
    }

    Composite.add(world, body);
    itemCount++;
    
    // UI Update
    updateUI();
    
    // Haptics
    if(navigator.vibrate) navigator.vibrate(5);
}

function updateUI() {
    let val = totalMl;
    let unit = "ml";
    if (val >= 1000) { val = (val/1000).toFixed(2); unit = "L"; }
    
    document.getElementById('display-total').textContent = `${val} ${unit}`;
    document.getElementById('item-counter').textContent = `${itemCount} Items`;
    
    // Background Water Rise
    const maxMl = 20000; // Cap visual background at 20L
    const pct = Math.min((totalMl / maxMl) * 100, 100);
    document.getElementById('water-background').style.height = `${pct}%`;
}

// --- 5. MOBILE GYROSCOPE ---
const btnGyro = document.getElementById('btn-gyro');

function handleMotion(event) {
    const x = event.accelerationIncludingGravity.x;
    const y = event.accelerationIncludingGravity.y;
    // Map to Matter.js gravity
    engine.gravity.x = x / 5;
    engine.gravity.y = -y / 5;
}

btnGyro.addEventListener('click', () => {
    // iOS requires permission request
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    window.addEventListener('devicemotion', handleMotion);
                    btnGyro.style.color = '#00ff00';
                }
            })
            .catch(console.error);
    } else {
        // Android/Non-iOS
        window.addEventListener('devicemotion', handleMotion);
        btnGyro.style.color = '#00ff00';
    }
});

// Controls
document.getElementById('btn-query').addEventListener('click', () => spawn('drop'));
document.getElementById('btn-reason').addEventListener('click', () => spawn('ice'));
document.getElementById('btn-image').addEventListener('click', () => spawn('bottle'));
document.getElementById('btn-video').addEventListener('click', () => spawn('barrel'));

document.getElementById('clear-btn').addEventListener('click', () => {
    const bodies = Composite.allBodies(world).filter(b => !b.isStatic);
    Composite.remove(world, bodies);
    totalMl = 0; itemCount = 0;
    updateUI();
});

// Resize
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Body.setPosition(ground, { x: window.innerWidth/2, y: window.innerHeight + 60 });
    Body.setPosition(rightW, { x: window.innerWidth + 60, y: window.innerHeight/2 });
});