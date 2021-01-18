const RACE = {
  HUMAN: 'human',
  ORC:   'orc',
  DWARF: 'dwarf',
  TROLL: 'troll',
  ELF:   'elf',
}
Object.freeze(RACE);
const RACE_MOD = {
  NORMAL:  'normal',
  VAMPIRE: 'vampire',
  UNDEAD:  'undead',
}
Object.freeze(RACE_MOD);

const ROOM_TYPES = {
	NORMAL:  0,
	OPEN:    1,
	TIGHT:   2,
	STREAM:  3,
	POOL:    4,
	VOID:    5,
	ROCKY:   6,
	STALAGS: 7,
};
Object.freeze(ROOM_TYPES);

setup.MAP_WIDTH   = 30;
setup.MAP_HEIGHT  = 15;
setup.NUM_ENEMIES = 4;
