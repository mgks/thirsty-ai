export const AI_COSTS = {
    QUERY_STANDARD: 15,
    QUERY_REASONING: 75,
    MEDIA_GENERATION: 500
};

// "Holes" are cut out of a 100x100 box.
// The box definition: M0,0 H100 V100 H0 Z
const BOX = "M0,0 H100 V100 H0 Z";

export const CONTAINERS = [
    {
        id: 'glass',
        name: 'Water Glass',
        capacity: 250,
        // Visual: A tapered glass centered in the screen
        // Hole: Start at 30,10 -> 70,10 -> 65,90 -> 35,90
        hole: "M30,20 L70,20 L65,85 H35 L30,20 Z",
        outline: "M30,20 L70,20 L65,85 H35 L30,20 Z"
    },
    {
        id: 'bottle',
        name: 'Plastic Bottle',
        capacity: 1000,
        // Visual: Narrow neck, wider body
        hole: "M42,10 H58 V25 H70 V90 H30 V25 H42 Z",
        outline: "M42,10 H58 V25 H70 V90 H30 V25 H42 Z"
    },
    {
        id: 'bucket',
        name: 'Wash Bucket',
        capacity: 10000,
        // Visual: Wide bucket
        hole: "M20,20 L80,20 L75,90 H25 L20,20 Z",
        outline: "M20,20 L80,20 L75,90 H25 L20,20 Z"
    }
];

// Helper to generate the "Inverted" path string for the overlay
export function getInvertedPath(containerIndex) {
    return `${BOX} ${CONTAINERS[containerIndex].hole}`;
}

// IMPACT_LEVELS
export const IMPACT_LEVELS = [
    { threshold: 200, title: "Micro-Thirst", desc: "Enough to grow a few coffee beans." },
    { threshold: 1000, title: "Dehydration Unit", desc: "Daily clean water ration for a child in a conflict zone." },
    { threshold: 4000, title: "Agricultural Cost", desc: "Water required to grow ONE almond." },
    { threshold: 15000, title: "Survival Threshold", desc: "WHO minimum for human survival for one week." }
];