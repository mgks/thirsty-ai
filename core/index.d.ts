export declare const COSTS: Record<string, number>;
export declare const MILESTONES: Array<{ limit: number, unit: string, icon: string }>;
export declare const SHOCK_FACTS: Record<number, string[]>;

export interface StatResult {
    ml: number;
    liters: string;
    milestone: { limit: number, unit: string, icon: string };
    formattedString: string;
    fillPercentage: number;
}

export declare class ThirstyCalculator {
    totalMl: number;
    constructor();
    add(type: 'QUERY' | 'REASON' | 'IMAGE' | 'VIDEO' | string, multiplier?: number): number;
    getStats(): StatResult;
    getShockFact(force?: boolean): string | null;
    reset(): void;
}