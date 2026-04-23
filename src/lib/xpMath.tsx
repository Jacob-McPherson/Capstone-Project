// src/lib/xpMath.ts

export interface UserRank { 
    level: number; 
    title: string; 
    currentXP: number;
    nextLevelXP: number;
    progressPercentage: number;
} 

// Your teammate's exact college-themed XP thresholds
const LEVEL_THRESHOLDS = [ 
    { minXp: 5000, level: 5, title: "Dean" },               // 100 quests
    { minXp: 2500, level: 4, title: "PhD" },                // 50 quests
    { minXp: 1000, level: 3, title: "Graduate Assistant" }, // 20 quests
    { minXp: 500,  level: 2, title: "Grad" },               // 10 quests
    { minXp: 0,    level: 1, title: "Undergrad" },          // 0 quests (Start)
]; 

export function calculateLevel(totalXp: number): UserRank { 
    const safeXp = Math.max(0, totalXp); 

    // Find current rank
    const currentRankIndex = LEVEL_THRESHOLDS.findIndex(threshold => safeXp >= threshold.minXp); 
    const currentRank = LEVEL_THRESHOLDS[currentRankIndex] || { level: 1, title: "Undergrad", minXp: 0 }; 

    // Calculate progress to the NEXT level for the UI Progress Bar
    let nextLevelXP = currentRank.minXp; 
    let progressPercentage = 100; 

    // If they aren't the highest level (Dean), calculate the exact percentage
    if (currentRankIndex > 0) {
        const nextRank = LEVEL_THRESHOLDS[currentRankIndex - 1];
        nextLevelXP = nextRank.minXp;

        // Math: (XP earned in current level) / (Total XP needed to pass current level)
        const xpIntoCurrentLevel = safeXp - currentRank.minXp;
        const xpNeededForNextLevel = nextRank.minXp - currentRank.minXp;
        progressPercentage = (xpIntoCurrentLevel / xpNeededForNextLevel) * 100;
    }

    return { 
        level: currentRank.level, 
        title: currentRank.title,
        currentXP: safeXp,
        nextLevelXP: nextLevelXP,
        progressPercentage: progressPercentage
    }; 
}