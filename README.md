# 🚰 Thirsty AI

> **"AI isn't magic. It drinks."**

**Thirsty AI** is a minimalist, physics-based interactive visualization designed to expose the hidden environmental cost of modern Artificial Intelligence. 

Instead of boring charts, we use a 2D physics engine to simulate the "weight" of your digital footprint. Watch as your queries pile up, tumble, and fill the screen, visualizing the liters of fresh water evaporated to cool the data centers and generate the electricity for your curiosity.

![App Preview](https://via.placeholder.com/800x400?text=Thirsty+AI+Preview) 
*(Replace this link with a real screenshot of your physics pile-up later)*

---

## ✨ Features

- **2D Physics Engine:** Built with `Matter.js`. Objects have weight, friction, and restitution.
- **Sensory Experience:**
  - **Procedural Audio:** A built-in synthesizer generates unique "thuds" and "plops" based on object mass.
  - **Haptic Feedback:** Vibrates your device on impact.
  - **Gyroscope Gravity:** Tilt your phone to slide the trash pile around (Mobile only).
- **Zero Assets:** All visuals (Drops, Ice, Bottles, Barrels) are generated via code as SVGs. No heavy image downloads.
- **The "Real" Scale:** Objects are sized relative to their actual water footprint.
  - 💧 **Chat (15ml):** Small, bouncy droplet.
  - 🧊 **Reasoning (75ml):** Dense, heavy ice block.
  - 🥤 **Image Gen (500ml):** Large plastic bottle.
  - 🛢️ **Video Gen (2.5L):** Massive, screen-shaking barrel.

---

## 🔬 The Science (The Math)

The calculations are based on 2024/2025 environmental reports (UC Riverside / Microsoft) focusing on **Scope 1** and **Scope 2** water consumption.

**The Formula:** `Total Water = Direct Cooling + Energy Generation`

| Action | Cost | Why? |
| :--- | :--- | :--- |
| **Standard Query** | **15 ml** | Roughly 1 sip of water. Equivalent to a GPT-4 class query. |
| **Reasoning** | **75 ml** | (e.g., o1/Gemini Adv). Requires 5x compute time ("Thinking") = 5x heat. |
| **Image Gen** | **500 ml** | High GPU load. Equivalent to a standard water bottle evaporated. |
| **Video Gen** | **2.5 L** | Extreme load. Equivalent to dumping a bucket of water. |

**Where does the water go?**
It evaporates. Roughly **25%** is evaporated onsite to cool the H100 GPUs (preventing melting), and **75%** is evaporated at power plants (Hydro/Nuclear/Coal) to generate the electricity required.

---

## 🚀 Quick Start

This project uses **Vanilla JS (ES Modules)**. You cannot open the `index.html` directly from the file system; you must run a local server.

### 1. Clone & Run
```bash
# Clone the repo
git clone https://github.com/your-username/thirsty-ai.git
cd thirsty-ai

# Start a local server (Requires Node.js installed)
npx http-server .
```

### 2. Mobile Testing (Sensors)
To test the **Gyroscope** and **Haptics** on your phone, you need a secure connection (HTTPS) or a tunnel.

**Using Ngrok (Recommended):**
```bash
# Start server on 8080
npx http-server . -p 8080

# In a new terminal, tunnel it
ngrok http 8080
```
*Copy the `https://...` link provided by Ngrok and open it on your phone.*

---

## 📂 Project Structure

```text
thirsty-ai/
├── core/                  # Shared Logic (Future NPM package)
│   └── constants.js       # The "Truth" numbers
├── web/                   # The Frontend
│   ├── index.html         # The canvas & UI container
│   ├── css/
│   │   └── main.css       # Glassmorphism & Layouts
│   └── js/
│       └── app.js         # Matter.js setup, Audio Synth, Logic
└── package.json           # Dev dependencies
```

## 🛠️ Tech Stack

- **Physics:** [Matter.js](https://brm.io/matter-js/)
- **Animation:** CSS3 & Canvas API
- **Audio:** Web Audio API (Oscillators/GainNodes)
- **Framework:** Vanilla JavaScript (No React/Vue bloat)

## 📄 License

MIT

> **{ github.com/mgks }**
> 
> <a href="https://mgks.dev"><img src="https://img.shields.io/badge/Visit-mgks.dev-blue?style=flat&link=https%3A%2F%2Fmgks.dev"></a> <a href="https://github.com/sponsors/mgks"><img src="https://img.shields.io/badge/%20%20Become%20a%20Sponsor%20%20-red?style=flat&logo=github&link=https%3A%2F%2Fgithub.com%2Fsponsors%2Fmgks"></a>