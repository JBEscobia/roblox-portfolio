// "Assets made": models, animation and environments, grouped into sets.
// Each set is self-contained, so another game's assets (ANTS! is next) is one more entry here.
export interface AssetSet {
  id: string;
  kind: string;
  title: string;
  summary: string;
  source: string;
  media: string[];
}

export const assetSets: AssetSet[] = [
  {
    id: 'creatures',
    kind: 'Models · Rigging · Animation',
    title: 'Creature movesets',
    summary: 'An orc, a tauren chieftain, a troll and a goblin, each generated procedurally, rigged to R15 and given a full enemy moveset: idle, walk, run, three or four attacks and a stagger. Each has its own weapon, and every attack is keyed to read from a distance.',
    source: 'Recorded in Roblox Studio on a plain stage. Clips play back in the order listed under each video.',
    media: ['AS-01', 'AS-02', 'AS-03', 'AS-04'],
  },
  {
    id: 'houses',
    kind: 'Models',
    title: 'Villager houses',
    summary: 'Fifteen cosy houses for a village game: twelve cottage variants plus a toadstool house, a home in the roots of a giant tree and a spiral-shell cottage. Each one sits on the same 24 × 24 plot with a working door and colliders.',
    source: 'Captured in Roblox Studio.',
    media: ['AS-10', 'AS-11', 'AS-12', 'AS-13', 'AS-14', 'AS-15'],
  },
  {
    id: 'tools',
    kind: 'Models',
    title: 'Tools and weapons',
    summary: 'A second-generation set of held tools built from scratch: axes, pickaxes, fishing rods and swords, in a named line and a material line from wood to mythril. Each tier gets its own silhouette instead of a recolour, and the top tiers carry their own glow and particle effects.',
    source: 'Captured in Roblox Studio.',
    media: ['AS-22', 'AS-20', 'AS-21', 'AS-23', 'AS-24'],
  },
  {
    id: 'environments',
    kind: 'Environment',
    title: 'Eden world map',
    summary: 'A hand-dressed world map: rivers winding out from a giant tree, cliffs, orchards and meadows, with a stylised low-poly sky.',
    source: 'Screenshots from Roblox Studio.',
    media: ['AS-30', 'AS-31'],
  },
  {
    id: 'ant-costumes',
    kind: 'Models · ANTS!',
    title: 'Ant costumes',
    summary: 'Eighteen costumes for the ANTS! player ant, from knight armour and a samurai helmet to a chef’s hat and a beach hat. Each one is layered onto the same base worker rig, so any costume fits every ant.',
    source: 'Captured in Roblox Studio.',
    media: ['AS-40', 'AS-41', 'AS-42', 'AS-43', 'AS-44', 'AS-45'],
  },
  {
    id: 'ant-castes',
    kind: 'Models · ANTS!',
    title: 'Ant castes',
    summary: 'Five ant castes that share one body plan: worker, resource carrier, ranged, warrior and tank. Size, armour and mandibles tell them apart at a glance.',
    source: 'Captured in Roblox Studio.',
    media: ['AS-50', 'AS-51'],
  },
  {
    id: 'ant-creatures',
    kind: 'Models · ANTS!',
    title: 'Garden creatures',
    summary: 'The other creatures an ant meets: ladybug, firefly, bee, wasp, antlion, stag beetle, rhino beetle and a plush jumping spider. Their legs are generated from the same leg system as the ants.',
    source: 'Captured in Roblox Studio.',
    media: ['AS-55', 'AS-56'],
  },
  {
    id: 'ant-maps',
    kind: 'Environment · ANTS!',
    title: 'ANTS! maps',
    summary: 'Four maps built at ant scale, where a sofa is a mountain: a three-room house, a school cafeteria, a fast-food restaurant and a backyard.',
    source: 'Screenshots from inside the maps in Roblox Studio.',
    media: ['AS-60', 'AS-61', 'AS-62', 'AS-63', 'AS-64'],
  },
];
