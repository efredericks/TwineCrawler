const RACE = {
  HUMAN: 'human',
  ORC:   'orc',
  DWARF: 'dwarf',
  TROLL: 'troll',
  ELF:   'elf',
}
Object.freeze(RACE);
const CHAR_MOD = {
  NORMAL:  'normal',
  VAMPIRE: 'vampire',
  UNDEAD:  'undead',
}
Object.freeze(CHAR_MOD);

const charAdjectives = [
  'small',
  'tiny',
  'miniscule',
  'midsized',
  'average',
  'large',
  'massive'
];
Object.freeze(charAdjectives);

setup.getCharInfo = function(char) {
  let _charinfo = "a"; 
  if (['a','e','i','o','u'].indexOf(char.char_size.charAt(0)) >= 0)  // vowel?
    _charinfo += "n";
  _charinfo += " " + char.char_size; 

  switch (char.char_mod) {
    case CHAR_MOD.NORMAL:
    default:
      break;
    case CHAR_MOD.VAMPIRE:
      _charinfo += "vampire";
      break;
    case CHAR_MOD.UNDEAD:
      _charinfo += "n undead";
      break;
  }

  _charinfo += " ";
  switch (char.race) {
    case 0:
    default:
      _charinfo += "human";
      break;
    case 1:
      _charinfo += "orc";
      break;
    case 2:
      _charinfo += "troll";
      break;
    case 3:
      _charinfo += "elf";
      break;
  }
  return _charinfo;
}

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
setup.NUM_FLOORS  = 7;