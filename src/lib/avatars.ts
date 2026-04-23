// src/lib/avatars.ts

const BASE_URL = "https://nzdgynyertlpwtsgbwpj.supabase.co/storage/v1/object/public/Avatars";

export const AVATAR_DATA = {
  plant: {
    name: "Nature Lineage",
    stages: [
      { minXp: 0, title: "The Seed", description: "Every great journey begins in the dark. Potential, coiled tight, waiting for its moment.", url: `${BASE_URL}/plant_1_novice.webp` },
      { minXp: 500, title: "First Sprout", description: "It broke through the soil. Small, fragile, but undeniably alive. The hard part is just starting.", url: `${BASE_URL}/plant_2_apprentice.webp` },
      { minXp: 1500, title: "Young Oak", description: "Roots are forming. Branches reaching. Something worth sheltering under is starting to take shape.", url: `${BASE_URL}/plant_3_adept.webp` },
      { minXp: 4000, title: "Ancient Oak", description: "Centuries of storms, survived. Fireflies nest in its branches. The forest grew around it.", url: `${BASE_URL}/plant_4_master.webp` }
    ]
  },
  dragon: {
    name: "Dragon Lineage",
    stages: [
      { minXp: 0, title: "The Egg", description: "Something stirs within. A faint heat. A faint glow. Whatever is inside — it is patient.", url: `${BASE_URL}/dragon_1_novice.webp` },
      { minXp: 500, title: "Hatchling", description: "Clumsy, curious, and already breathing embers. The world has no idea what it just let loose.", url: `${BASE_URL}/dragon_2_apprentice.webp` },
      { minXp: 1500, title: "Wyvern", description: "It learned to fly before it learned to land. Every scar is a lesson. Every flame is earned.", url: `${BASE_URL}/dragon_3_adept.webp` },
      { minXp: 4000, title: "Elder Dragon", description: "Mountains move out of its way. Its name is spoken carefully, and only when necessary.", url: `${BASE_URL}/dragon_4_master.webp` }
    ]
  },
  star: {
    name: "Cosmic Lineage",
    stages: [
      { minXp: 0, title: "Dust Cloud", description: "Before the light, there was only drifting. But even dust, given time, can become something blinding.", url: `${BASE_URL}/star_1_novice.webp` },
      { minXp: 500, title: "Dim Star", description: "A faint glow at the edge of the sky. Easy to miss. Impossible to extinguish.", url: `${BASE_URL}/star_2_apprentice.webp` },
      { minXp: 1500, title: "Bright Star", description: "Navigators use it now. It does not know this. It simply burns, as it always has.", url: `${BASE_URL}/star_3_adept.webp` },
      { minXp: 4000, title: "Supernova", description: "It gave everything. In doing so, it seeded the universe with the material for new worlds.", url: `${BASE_URL}/star_4_master.webp` }
    ]
  },
  knight: {
    name: "Warrior Lineage",
    stages: [
      { minXp: 0, title: "Squire", description: "Wooden sword. Oversized boots. An unshakeable belief that they are destined for something greater.", url: `${BASE_URL}/knight_1_novice.webp` },
      { minXp: 500, title: "Scout", description: "Faster than expected. Quieter than you would think. Starting to understand that skill beats bravado.", url: `${BASE_URL}/knight_2_apprentice.webp` },
      { minXp: 1500, title: "Knight", description: "The armor was earned, not given. The plume catches the wind. They have learned when not to draw the sword.", url: `${BASE_URL}/knight_3_adept.webp` },
      { minXp: 4000, title: "Legendary Knight", description: "The blade glows because it has been used in service of something worth glowing for.", url: `${BASE_URL}/knight_4_master.webp` }
    ]
  }
};

export function getActiveAvatar(lineage: string | null, totalXP: number) {
  const safeLineage = lineage && AVATAR_DATA[lineage as keyof typeof AVATAR_DATA] ? lineage : 'knight';
  const stages = AVATAR_DATA[safeLineage as keyof typeof AVATAR_DATA].stages;
  
  const sortedStages = [...stages].sort((a, b) => b.minXp - a.minXp);
  const currentStage = sortedStages.find(stage => totalXP >= stage.minXp) || stages[0];

  return currentStage;
}