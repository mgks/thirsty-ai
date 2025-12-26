import { COSTS, MILESTONES, SHOCK_FACTS } from './constants.js';

export class ThirstyCalculator {
    constructor() {
        this.totalMl = 0;
        this.history = [];
        this.lastFactLimit = -1;
    }

    /**
     * Add water usage based on action type
     * @param {string} type - 'QUERY', 'REASON', 'IMAGE', 'VIDEO'
     * @param {number} multiplier - (Optional) x1, x5, etc.
     */
    add(type, multiplier = 1) {
        const key = type.toUpperCase();
        const cost = COSTS[key] || 0;
        this.totalMl += (cost * multiplier);
        return this.totalMl;
    }

    /**
     * Get comprehensive stats
     */
    getStats() {
        // Find Milestone
        let currentMilestone = MILESTONES[0];
        for (let i = MILESTONES.length - 1; i >= 0; i--) {
            if (this.totalMl >= MILESTONES[i].limit) {
                currentMilestone = MILESTONES[i];
                break;
            }
        }

        // Calculate equivalents
        const equivalentCount = (this.totalMl / currentMilestone.limit).toFixed(1);
        const unitName = currentMilestone.unit + (equivalentCount !== "1.0" ? "s" : "");

        return {
            ml: this.totalMl,
            liters: (this.totalMl / 1000).toFixed(2),
            milestone: currentMilestone,
            formattedString: `Equivalent to ${equivalentCount} ${unitName}`,
            fillPercentage: Math.min((this.totalMl / 20000) * 100, 100)
        };
    }

    /**
     * Get a random shock fact based on current usage
     * Returns null if usage hasn't crossed a new threshold since last call
     */
    getShockFact(force = false) {
        let factLimit = 0;
        // Find highest crossed threshold
        Object.keys(SHOCK_FACTS).forEach(limit => {
            if (this.totalMl >= parseInt(limit)) factLimit = limit;
        });

        // Only return if we hit a new tier (or forced)
        if (factLimit != this.lastFactLimit || force) {
            this.lastFactLimit = factLimit;
            const facts = SHOCK_FACTS[factLimit];
            return facts[Math.floor(Math.random() * facts.length)];
        }
        return null;
    }

    reset() {
        this.totalMl = 0;
        this.lastFactLimit = -1;
    }
}

export { COSTS, MILESTONES, SHOCK_FACTS };