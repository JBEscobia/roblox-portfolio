export const site = {
  name: 'FloppySide',
  username: 'FloppySide',
  role: 'Roblox Systems Developer',
  email: '',
  introduction: 'I enjoy making games. These four projects started as hobby ideas: I thought the mechanics would be fun, so I built them.',
  ownership: 'I made each game independently, from the builds and UI to the code that brings it all together.',
  responsibility: 'Independently Developed',
  responsibilityNote: 'I made these hobby projects independently, including the builds, UI, gameplay, and supporting code. Libraries and adapted techniques are credited where relevant.',
};
export const services = [
  { title: 'Character movement', description: 'Building movement for unusual surfaces and keeping the character’s animations consistent.', project: 'gravity-dash', tag: 'Movement' },
  { title: 'Abilities & projectiles', description: 'Homing projectiles that lock on and curve toward moving targets, power-ups with catch-up odds, and server checks on every hit, gravity flip, and buff.', project: 'gravity-dash', tag: 'Combat & abilities' },
  { title: 'Dashes & rewind abilities', description: 'Planning movement around obstacles and recording positions for rewind mechanics.', project: 'time-tag', tag: 'Gameplay abilities' },
  { title: 'Multiplayer interactions', description: 'Making grabbing, shared objects, and knockdowns work together across players.', project: 'ants', tag: 'Multiplayer physics' },
  { title: 'Currencies, shops & saved progress', description: 'Connecting currencies, round leaderboards, and purchase handling to saved player profiles, with a session lock against two servers writing the same save. Time Tag shows the prototype implementation and its current limits.', project: 'time-tag', tag: 'Economy & persistence' },
  { title: 'Inventories & storage', description: 'Building storage chests with filters and capacity, inventory transfers, and item records that follow resources as companions move them.', project: 'anipal-archipelago', tag: 'Inventory & storage' },
  { title: 'Shared shops', description: 'Shop stock that rotates on a schedule and comes out the same on every server, with each player’s purchases tracked separately.', project: 'anipal-archipelago', tag: 'Shared economy' },
  { title: 'Weather & world events', description: 'Choosing weather, tide, and sky events through one shared record, with checks that stop an old timer ending a newer event.', project: 'anipal-archipelago', tag: 'World events' },
  { title: 'Companions & saved worlds', description: 'Building companion jobs, work scheduling, and saved world state.', project: 'anipal-archipelago', tag: 'World simulation' },
];
