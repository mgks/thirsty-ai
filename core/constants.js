export const COSTS = {
    QUERY: 15,
    REASON: 150,
    IMAGE: 500,
    VIDEO: 3000
};

export const MILESTONES = [
    { limit: 300, unit: 'Glass', icon: 'glass' },
    { limit: 1000, unit: 'Bottle', icon: 'bottle' },
    { limit: 10000, unit: 'Bucket', icon: 'bucket' },
    { limit: 150000, unit: 'Bathtub', icon: 'bath' },
    { limit: 2500000, unit: 'Olympic Pool', icon: 'pool' }
];

// Key: Limit in ml. Value: Array of possible facts to pick randomly.
export const SHOCK_FACTS = {
    0: [
        "Every query evaporates clean water. It doesn't come back.",
        "Data centers run on fresh, potable water. We drink what's left."
    ],
    300: [
        "In 2025, over 2 billion people lack access to this much safe drinking water.",
        "You evaporated a glass of water while a child in a conflict zone waits for a community tap.",
        "Clean water is a luxury. AI treats it like a waste product."
    ],
    1000: [
        "This aquifer water is gone forever. Corporate hydration > Human hydration.",
        "One Liter. Enough to keep a human alive for 6 hours in extreme heat. Wasted on digital noise.",
        "Big Tech burns millions of liters daily. You just contributed."
    ],
    5000: [
        "Agricultural scarcity is real. AI water consumption is outpacing local regeneration.",
        "Farmers are losing water rights to Data Centers. Think about that.",
        "This much water could have grown food. Instead, it generated pixels."
    ],
    15000: [
        "15 Liters. The absolute minimum weekly hygiene ration for a refugee.",
        "Entire villages subsist on less water than you just burned.",
        "This isn't 'virtual' waste. It's physical steam leaving a drought-stricken town."
    ],
    50000: [
        "You are now competing with a small town's water supply.",
        "Groundwater depletion is permanent. There is no Ctrl+Z for this.",
        "Imagine pulling the plug on a reservoir. That is what this usage looks like."
    ]
};