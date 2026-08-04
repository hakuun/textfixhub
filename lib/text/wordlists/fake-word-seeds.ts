/**
 * Style-specific seed word lists for the Fake Word Generator.
 * The English style combines the shared NOUNS / ADJECTIVES / VERBS lists
 * (see fake-word-generator.ts). Fantasy and SciFi use dedicated seeds so
 * the Markov model produces names that *feel* like the genre.
 */

/** Fantasy-style names and words (elves, dragons, wizards, magical places). */
export const FANTASY_SEEDS: string[] = [
  'elven', 'dwarven', 'dragon', 'wizard', 'mage', 'sorcerer', 'arcane',
  'rune', 'glyph', 'mystic', 'elara', 'arathor', 'thorin', 'galadriel',
  'elrond', 'legolas', 'gandalf', 'saruman', 'aeron', 'wynne', 'bram',
  'thalia', 'cassian', 'morwen', 'aelar', 'sylas', 'isolde', 'faelan',
  'rovin', 'vaelen', 'thessia', 'orin', 'calder', 'maris', 'elowen',
  'riordan', 'kael', 'cassa', 'odessa', 'perrin', 'zephyr', 'maeve',
  'corbin', 'ember', 'frost', 'shadow', 'raven', 'storm', 'wolf',
  'griffin', 'phoenix', 'seraph', 'drakon', 'morrigan', 'rowan',
  'sienna', 'eldrin', 'lyra', 'thorne', 'ivy', 'onora', 'silas',
  'dorian', 'aeris', 'nylah', 'korbin', 'falcon', 'halcyon',
  'meridian', 'obsidian', 'opal', 'talisman', 'glimmer', 'morrow',
];

/** Sci-fi style words (space, tech, futuristic names). */
export const SCIFI_SEEDS: string[] = [
  'nebula', 'quantum', 'plasma', 'photon', 'android', 'neutron',
  'comet', 'meteor', 'orbit', 'galaxy', 'cosmos', 'starfield',
  'nova', 'axion', 'quasar', 'vector', 'xenon', 'volt', 'nano',
  'cyber', 'aurora', 'blitz', 'orion', 'vega', 'rigel', 'cassini',
  'halley', 'kepler', 'turing', 'eris', 'nimbus', 'argon', 'kestrel',
  'nodus', 'pulsar', 'warp', 'drone', 'matrix', 'circuit', 'synth',
  'mira', 'celeste', 'nox', 'silicon', 'ion', 'flux', 'cryo', 'astro',
  'vex', 'zeta', 'astra', 'rover', 'helix', 'binary', 'vortex', 'zero',
  'omni', 'terra', 'stella', 'cosmo', 'lumen', 'sonic', 'radar',
  'laser', 'probe', 'navigo', 'astral', 'hyper', 'tachyon', 'antares',
];
