# thirsty-ai

**"AI isn't magic. It drinks."**

<p>
  <img src="https://img.shields.io/npm/v/thirsty-ai.svg?style=flat-square&color=d25353" alt="npm version">
  <img src="https://img.shields.io/bundlephobia/minzip/thirsty-ai?style=flat-square&color=38bd24" alt="size">
  <img src="https://img.shields.io/npm/dt/thirsty-ai.svg?style=flat-square&color=success&color=38bd24" alt="npm downloads">
  <img src="https://img.shields.io/github/license/mgks/thirsty-ai.svg?style=flat-square&color=blue" alt="license">
</p>

**Thirsty AI** is a minimalist, open-source project designed to visualize the hidden environmental cost of modern Artificial Intelligence. It calculates the water consumption (Scope 1 Cooling + Scope 2 Energy Generation) of LLM queries and media generation.

## The Science

Calculations are based on 2024/2025 environmental reports (UC Riverside / Microsoft).

| Action | Cost (ml) | Context |
| :--- | :--- | :--- |
| **Chat** | 15 ml | Standard GPT-4o class query. |
| **Reason** | 150 ml | Chain-of-Thought (o1/Gemini). 10x compute heat. |
| **Image** | 500 ml | SDXL / DALL-E 3. One full water bottle. |
| **Video** | 3000 ml | High-compute video gen. A bucket of water. |

**Why "Waste"?**
The water used to cool Data Center GPUs evaporates into the atmosphere. It is removed from the local watershed and does not return to the ground immediately.

## Web App

The web interface features a fluid WebGL background that reacts to device orientation (Gyroscope) and visualizes the water level rising in real-time.

### Development
```bash
# Clone
git clone https://github.com/mgks/thirsty-ai.git

# Run Local Server
npx http-server .
```

## NPM Package (`thirsty-ai`)

The core logic is available as a zero-dependency package for developers.

### Installation
```bash
npm install thirsty-ai
```

### Usage
```javascript
import { ThirstyCalculator } from 'thirsty-ai';

const calc = new ThirstyCalculator();

// Add Interactions
calc.add('QUERY');      // +15ml
calc.add('IMAGE', 2);   // +1000ml (2 Images)

// Get Statistics
const stats = calc.getStats();
console.log(stats.formattedString); 
// Output: "Equivalent to 1.5 Bottles"

// Get a "Reality Check" Fact
// Returns a string based on the severity of usage
console.log(calc.getShockFact()); 
// Output: "One Liter. The amount required to keep a human alive for 8 hours..."
```

## License

MIT

> **{ github.com/mgks }**
> 
> <a href="https://mgks.dev"><img src="https://img.shields.io/badge/Visit-mgks.dev-blue?style=flat&link=https%3A%2F%2Fmgks.dev"></a> <a href="https://github.com/sponsors/mgks"><img src="https://img.shields.io/badge/%20%20Become%20a%20Sponsor%20%20-red?style=flat&logo=github&link=https%3A%2F%2Fgithub.com%2Fsponsors%2Fmgks"></a>
