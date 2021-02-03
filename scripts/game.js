/*
* game.js
* Global vars
* Setup map
* Setup enemies
*/


// TODO
// camera centered around player (larger map)
// decouple twine from jquery (only update when triggered)


/*** * MOVE THIS INTO SEPARATE FILES AFTER WE FIGURE OUT THE WHOLE ... IMPORT ORDER ISSUE * ***/
class Character {
  constructor(name, row, col, depth, race, char_mod, hp) {
    this.name      = name;
    this.row       = row;
    this.col       = col;
    this.depth     = depth;
    this.race      = race;
    this.char_mod  = char_mod;
    this.hp        = hp;
    this.char_size = randomListItem(charAdjectives);
    this.inventory = {};
    //this.description = this.genDescription();
  }
  /*
  genDescription() {
    let _desc = "";
    _desc += charAdjectives;
    switch (this.race) {
      case RACE.HUMAN:
      default:
        break;
      case RACE.DWARF:
        break;
      case RACE.ELF:
        break;
      case RACE.ORC:
        break;
      case RACE.TROLL:
        break;
    }
    return _desc;
    */
}
class GameMap {
  /*
  Floor types:
    0 - open
    1 - simplex
    2 - cells (long corridor)
    3 - radial/spiral
    4 - CA
  */
  /* 
    Layers:
      https://historylists.org/art/9-circles-of-hell-dantes-inferno.html
      0 - Limbo - eternity in an inferior form of Heaven
      1 - Lust - blown violently back and forth by strong winds, preventing them from finding peace and rest.
      2 - Gluttony - lie in a vile slush that is produced by never-ending icy rain
      3 - Greed - jousting
      4 - Anger - furious fighting each other on the surface of the river Styx and the sullen gurgling beneath the surface of the water
      5 - Heresy - condemned to eternity in flaming tombs
      6 - Violence - The Seventh Circle of Hell is divided into three rings. The Outer Ring houses murderers and others who were violent to other people and property. Here, Dante sees Alexander the Great (disputed), Dionysius I of Syracuse, Guy de Montfort and many other notable historical and mythological figures such as the Centaurus, sank into a river of boiling blood and fire. In the Middle Ring, the poet sees suicides who have been turned into trees and bushes which are fed upon by harpies. But he also sees here profligates, chased and torn to pieces by dogs. In the Inner Ring are blasphemers and sodomites, residing in a desert of burning sand and burning rain falling from the sky.
      7 - Fraud - The Eight Circle of Hell is resided by the fraudulent. Dante and Virgil reach it on the back of Geryon, a flying monster with different natures, just like the fraudulent. This circle of Hell is divided into 10 Bolgias or stony ditches with bridges between them. In Bolgia 1, Dante sees panderers and seducer. In Bolgia 2 he finds flatterers. After crossing the bridge to Bolgia 3, he and Virgil see those who are guilty of simony. After crossing another bridge between the ditches to Bolgia 4, they find sorcerers and false prophets. In Bolgia 5 are housed corrupt politicians, in Bolgia 6 are hypocrites and in the remaining 4 ditches, Dante finds hypocrites (Bolgia 7), thieves (Bolgia 7), evil counselors and advisers (Bolgia 8), divisive individuals (Bolgia 9) and various falsifiers such as alchemists, perjurers, and counterfeits (Bolgia 10).
      8 - Treachery - The last Ninth Circle of Hell is divided into 4 Rounds according to the seriousness of the sin. Though all residents are frozen in an icy lake. Those who committed more severe sin are deeper within the ice. Each of the 4 Rounds is named after an individual who personifies the sin. Thus Round 1 is named Caina after Cain who killed his brother Abel, Round 2 is named Antenora after Anthenor of Troy who was Priam’s counselor during the Trojan War, Round 3 is named Ptolomaea after Ptolemy (son of Abubus), while Round 4 is named Judecca after Judas Iscariot, the apostle who betrayed Jesus with a kiss.

  */
  constructor(width, height, num_depths) {
    this.maps = new Array(num_depths); 
    this.maps_names = new Array(num_depths);
    this.maps_interactions = new Array(num_depths);

    for (let i = 0; i < num_depths; i++) {
      if (i == 0) { // hand craft level 1
        let _lvl0 = [
          [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 1, 1, 1, 1,10, 7,10, 1,10, 7,10, 1,10, 7,10, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 2, 2, 2,10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,10, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 2, 2, 2, 7, 2, 1, 1, 6, 1, 1, 1, 1, 1, 1, 2, 7, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 2, 2, 2,10, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2,10, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 2, 2, 2,10, 2, 1, 2, 2, 2, 1, 2, 2, 9, 1, 2,10, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 2, 2, 2, 7, 2, 1, 1, 1, 1, 1, 1, 6, 1, 1, 2, 7, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 2, 2, 2,10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,10, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 1, 1, 1, 1,10, 7,10, 1,10, 7,10, 1,10, 7,10, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        ];

        // iterate over this later to ensure it is walkable/interactable
        let _lvl0_interactions = [];
        for (let _i = 0; _i < _lvl0.length; _i++) { // row
          for (let _j = 0; _j < _lvl0[_i].length; _j++) { // col
            switch (_lvl0[_i][_j]) {
              case 0: // undiggable wall
              case 7: // doors
              case 6:
              case 1: // concrete wall (diggable)
                _lvl0_interactions.push((_lvl0[_i][_j],[_i,_j]));
              break;
            }
          }
        }
        this.maps_interactions[0] = _lvl0_interactions;
        console.log(this.maps_interactions);


        let _lvl0_flavor = [ // lookup table to twine passages
          [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 1, 1, 1, 1,10, 7,10, 1,10, 7,10, 1,10, 7,10, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 2, 2, 2,10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,10, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 2, 2, 2, 7, 2, 1, 1, 6, 1, 1, 1, 1, 1, 1, 2, 7, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 2, 2, 2,10, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2,10, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 2, 2, 2,10, 2, 1, 2, 2, 2, 1, 2, 2, 9, 1, 2,10, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 2, 2, 2, 7, 2, 1, 1, 1, 1, 1, 1, 6, 1, 1, 2, 7, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 2, 2, 2,10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,10, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [1, 1, 1, 1, 1,10, 7,10, 1,10, 7,10, 1,10, 7,10, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
          [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        ];

        let _map = new Array(height);
        for (var row = 0; row < height; row++) {
  	      let t_row = new Array(width);
          for (var col = 0; col < width; col++) {
            t_row[col] = new Room("title " + row + "," + col, "desc", _lvl0[row][col], true);
          }
          _map[row] = t_row;
        }
        this.maps[i] = _map;
      } else {
        // Generate map 
        let simplex = new SimplexNoise();
      	let _map = new Array(height);
        for (var row = 0; row < height; row++) {
  	      let t_row = new Array(width);
          for (var col = 0; col < width; col++) {
            t_row[col] = new Room("title " + row + "," + col, "desc", simplex.noise2D(col, row));
          }
          _map[row] = t_row;
        }
        this.maps[i] = _map;
      }
    }

    this.maps_names[0] = "Limbo";
    this.maps_names[1] = "Lust";
    this.maps_names[2] = "Gluttony";
    this.maps_names[3] = "Greed";
    this.maps_names[4] = "Anger";
    this.maps_names[5] = "Heresy";
    this.maps_names[6] = "Violence";
    this.maps_names[7] = "Fraud";
    this.maps_names[8] = "Treachery";
  }
}
class Item {
  constructor(name, row, col, is_unique = false) {
    this.name      = name;
    this.is_unique = is_unique;
    this.room_loc  = [row, col];
  }
}
var uniqueItems = new Array(); // list of globally-unique items and where they're located

// Class that outlines a room
class Room {
	constructor (title, description, noise_value, hand_made=false) {
		this.title       = title;
		this.description = description;
    this.noise_value = noise_value;
    this.hand_made   = hand_made;
		this.items       = new Array();
		this.encounters  = new Array();
		this.prior_room  = -1;
		this.connectors  = new Array();
		this.discovered  = false;
    this.blocked     = false;//true;
    this.items       = new Array();
		
    // Generate room type from Simplex noise 
    if (!hand_made) {
		  if (noise_value < 0) {
			  this.room_type = ROOM_TYPES.NORMAL;
  		 	this.title = "A normal room";
	  		this.description = "A normal room description";
  		} else if (noise_value < 0.25) {
	  		this.room_type = ROOM_TYPES.OPEN;
		  	this.title = "An open room";
  			this.description = "A room with a view!";
	  	} else if (noise_value < 0.35) {
		  	this.room_type = ROOM_TYPES.TIGHT;
  			this.title = "A tight room";
	  		this.description = "There is a very tight squeeze here";
		  } else if (noise_value < 0.55) {
  			this.room_type = ROOM_TYPES.STREAM;
	  		this.title = "A streamy room";
		  	this.description = "A stream meanders about";
  		} else if (noise_value < 0.65) {
	  		this.room_type = ROOM_TYPES.POOL;
		  	this.title = "A room with a shimmering pool";
  			this.description = "There is a large, shimmering pool in this room.";
	  	} else if (noise_value < 0.75) {
		  	this.room_type = ROOM_TYPES.ROCKY;
  			this.title = "A room with rocky ground";
	  		this.description = "Lots of rocks abound on this ground.  Watch your step.";
		  } else if (noise_value < 0.95) {
  			this.room_type = ROOM_TYPES.STALAGS;
	  		this.title = "A room with stalagtites/mites";
		  	this.description = "Many rocky outcroppings seem to be in this room";
  		} else {
	  		this.room_type = ROOM_TYPES.VOID;
		  	this.title = "A room with a precipice";
			  this.description = "There is a gaping void here.  Don't fall.";
      }
    } else { // hand-made room
 		  this.room_type = noise_value;
		  this.title = "TBD";
      this.description = "TBD";

      if (noise_value == ROOM_SPRITES.BLANK_FLOOR) {
        let _r = Math.random();
        if (_r > 0.6)
 		      this.room_type = noise_value;
        else if (_r > 0.4)
 		      this.room_type = ROOM_SPRITES.FLOOR_1;
        else if (_r > 0.2)
 		      this.room_type = ROOM_SPRITES.FLOOR_2;
        else
 		      this.room_type = ROOM_SPRITES.FLOOR_3;

      }
    }
	}	
}

setup.getInteractions = function(_map, _player, _friends) {
  let _objs = Array();
  for (let f = 0; f < _friends.length; f++) {
	  if (_friends[f].row == _player.row && _friends[f].col == _player.col) {
      _objs.push(_friends[f]);
    }
  }
//  if (_map.maps[_player.depth][_player.row][_player.col] == ROOM_SPRITES.STAIRS_DOWN)
 //   _objs.push("GO-DOWN");
  return _objs;
}

setup.drawMap = function(_map, _player, _friends) {
  let _render = "";//<div class='map_wrapper'>";
  //let _render = "<table cellspacing='0'>";
  for (let _row = 0; _row < _map.maps[_player.depth].length; _row++) {
    //_render += "<tr>";
    for (let _col = 0; _col < _map.maps[_player.depth][_row].length; _col++) {
      // only show a little area around the player, it's dark here!
      /*
    3 3 3 3 3 3 3
    3 2 2 2 2 2 3
    3 2 1 1 1 2 3
    3 2 1 @ 1 2 3
    3 2 1 1 1 2 3
    3 2 2 2 2 2 3
    3 3 3 3 3 3 3
      */
      let _row_diff = Math.abs(_player.row - _row);
      let _col_diff = Math.abs(_player.col - _col);
      let _max_diff = Math.max(_row_diff, _col_diff);
      let _cls = "full";
//      if (_max_diff == 3)
//        _cls = "half";
//      else if (_max_diff == 2)
//        _cls = "quarter";
//      else if (_max_diff == 1)
        _cls = "";

			//_render += `<td style="background-color: ${(_map.map[_row][_col].blocked ? "#666": "#444")};">`;
			if (_player.col == _col && _player.row == _row)
				//_render += "<span id='pc'>😐</span>";
				_render += "<div id='pc'></div>";
		  else {
				var isEmpty = true;
				for (let f = 0; f < _friends.length; f++) {
					if (_friends[f].row == _row && _friends[f].col == _col) {
						if (isEmpty)
						  //_render += "🤪";
              if (_cls == "full")
                _render += "<div class='dark'></div>";
              else 
  				      _render += "<div id='npc' class='" + _cls + "'></div>";
						isEmpty = false;
					}
				}
				if (isEmpty && !_map.maps[_player.depth][_row][_col].blocked) {
          if ((_cls == "full") && !(_map.maps[_player.depth][_row][_col].discovered)){
            _render += "<div class='dark'></div>";
          } else {
            // override visibility if discovered
            if (_map.maps[_player.depth][_row][_col].discovered)
              _cls = "quarter";

            if (!_map.maps[_player.depth][_row][_col].hand_made) {
		  	  		switch (_map.maps[_player.depth][_row][_col].room_type) {
	  	  				case ROOM_TYPES.STALAGS:
  	  						_render += "<div id='stalags' class='" + _cls + "'></div>";
    							//_render += "<div class='stalags " + _cls + "'>△</div>";
	  					  	break;
  					  	case ROOM_TYPES.OPEN:
				  		  	_render += "<div id='open' class='" + _cls + "'></div>";
				  	  		//_render += "<div class='open " + _cls + "'>_</div>";
			  	  			break;
		  	  			case ROOM_TYPES.TIGHT:
	  	  					//_render += "<div class='tight " + _cls + "'>⁜</div>";
	    						_render += "<div id='tight' class='" + _cls + "'></div>";
    							break;
	  					  case ROOM_TYPES.STREAM:
  					  		//_render += "<div class='stream'>~</div>";
				          _render += "<div id='stream' class='" + _cls + "'></div>";
			  	  			break;
		  	  			case ROOM_TYPES.POOL:
	  	  					_render += "<div id='pool' class='" + _cls + "'></div>";
	    						//_render += "<div class='pool " + _cls + "'>⊜</div>";
    							break;
	  			  		case ROOM_TYPES.VOID:
  			  				//_render += "<div class='void " + _cls + "'>ↈ</div>";
			  		  		_render += "<div id='void' class='" + _cls + "'></div>";
		  		  			break;
	  		  			case ROOM_TYPES.ROCKY:
  		  					_render += "<div id='concrete-wall' class='" + _cls + "'></div>";
  	  						//_render += "<div class='rocky " + _cls + "'>⋙</div>";
		  		  			break;
	  		  			case ROOM_TYPES.NORMAL:
  		  				default:
    							_render += "<div class='normal " + _cls + "'></div>";
    							break;
              }
            } else {
		  	  		switch (_map.maps[_player.depth][_row][_col].room_type) {
                case ROOM_SPRITES.BLANK:
                default:
    							_render += "<div class='normal " + _cls + "'></div>";
                  break;
                case ROOM_SPRITES.BLANK_FLOOR:
                  // for now, randomize floor placement with preference to blank
                  //let _r = Math.random();
                  //if (_r > 0.6)
                    _render += "<div class='blank-floor " + _cls + "'></div>";
                  //else if (_r > 0.4)
                   // _render += "<div class='floor-1 " + _cls + "'></div>";
                  //else if (_r > 0.2)
                   // _render += "<div class='floor-2 " + _cls + "'></div>";
                  //else
                   // _render += "<div class='floor-3 " + _cls + "'></div>";
                  break;
                case ROOM_SPRITES.CONCRETE_WALL:
    							_render += "<div class='concrete-wall " + _cls + "'></div>";
                  break;
                case ROOM_SPRITES.METAL_GATE:
    							_render += "<div class='metal-gate " + _cls + "'></div>";
                  break;
                case ROOM_SPRITES.DOOR:
    							_render += "<div class='door " + _cls + "'></div>";
                  break;
                case ROOM_SPRITES.DOOR_GATE:
    							_render += "<div class='door-gate " + _cls + "'></div>";
                  break;
                case ROOM_SPRITES.FLOOR_1:
    							_render += "<div class='floor-1 " + _cls + "'></div>";
                  break;
                case ROOM_SPRITES.FLOOR_2:
    							_render += "<div class='floor-2 " + _cls + "'></div>";
                  break;
                case ROOM_SPRITES.FLOOR_3:
    							_render += "<div class='floor-3 " + _cls + "'></div>";
                  break;
                case ROOM_SPRITES.STAIRS_DOWN:
    							_render += "<div class='stairs-down " + _cls + "'></div>";
                  break;
              }
            }
          }
					 //_render += "";
				} else {
				  _render += " ";
				}
			}
//			_render += `</td>`;
    }
//    _render += "</tr>";
  }
	//_render += "</div>";
	//_render += "</table>";
	return _render;
}

setup.checkValidMoves = function(_map, _row, _col) {
	var moves = new Array();

	// clamp boundaries
	var up_row    = Math.max(_row-1, 0);
	var down_row  = Math.min(_row+1, _map.length-1);//setup.HEIGHT-1);
	var left_col  = Math.max(_col-1, 0);
  var right_col = Math.min(_col+1, _map[0].length-1);//setup.WIDTH-1);


  
  let _invalidMoves = [0,1,7,6,10];


  // iterate over row and cols to check which path is blocked
	for (var _r = up_row; _r <= down_row; _r++) {
		for (var _c = left_col; _c <= right_col; _c++) {
			if ((!(_map[_r][_c].blocked)) && ((_r != _row) || (_c != _col))) {

      // try this next time: if (!_map[_r][_c].blocked && !(_r === _row && _c === _col))
        
        if (!_invalidMoves.includes(_map[_r][_c].room_type))
          moves.push([_r, _c]);
      }
		}
	}

	//console.log("map", _map);
	//console.log("moves", moves);

	return moves;
}

setup.redrawMap = function() {
  let _map = setup.drawMap(setup.map, setup.player, setup.enemies);
  console.log(setup.player.row, setup.player.col);
  console.log(_map);
  $("#map_wrapper").html(_map);
}

setup.tickGame = function() {
  // update room state
  setup.map.maps[setup.player.depth][setup.player.row][setup.player.col].discovered = true;

  // update enemies
  for (let i = 0; i < setup.enemies.length; i++) {
    if (Math.random() > 0.7) { // move
      let _validMoves = setup.checkValidMoves(setup.map.maps[setup.player.depth], setup.enemies[i].row, setup.enemies[i].col);
      let _newRow = setup.enemies[i].row;
      let _newCol = setup.enemies[i].col;

      /*
      0 1 2
      3 4 5
      6 7 8
      */
      let _dir = randomInt(0,9);
      switch (_dir) {
        case 0: // up left
          if ((setup.enemies[i].row > 0) && (setup.enemies[i].col > 0)) {
            _newRow--;
            _newCol--;
            //setup.enemies[i].row--;
            //setup.enemies[i].col--;
          }
          break;
        case 1: // up
          if (setup.enemies[i].row > 0) {
            _newRow--;
            //setup.enemies[i].row--;
          }
          break;
        case 2: // up right
          if ((setup.enemies[i].row > 0) && (setup.enemies[i].col < (setup.MAP_WIDTH-1))) {
            _newRow--;
            _newCol++;
            //setup.enemies[i].row--;
            //setup.enemies[i].col++;
          }
          break;
        case 3: // left
          if (setup.enemies[i].col > 0) {
            _newCol--;
            //setup.enemies[i].col--;
          }
          break;
        case 4: // pass
          break;
        case 5: // right
          if (setup.enemies[i].col < (setup.MAP_WIDTH-1)) {
            _newCol++;
            //setup.enemies[i].col++;
          }
          break;
        case 6: // down left
          if ((setup.enemies[i].row < (setup.MAP_HEIGHT-1)) && (setup.enemies[i].col > 0)) {
            _newRow++;
            _newCol--;
            //setup.enemies[i].row++;
            //setup.enemies[i].col--;
          }
          break;
        case 6: // down 
          if (setup.enemies[i].row < (setup.MAP_HEIGHT-1)) {
            _newRow++;
            //setup.enemies[i].row++;
          }
          break;
        case 7: // down right
        default:
          if ((setup.enemies[i].row < (setup.MAP_HEIGHT-1)) && (setup.enemies[i].col < (setup.MAP_WIDTH-1))) {
            _newRow++;
            _newCol--;
            //setup.enemies[i].row++;
            //setup.enemies[i].col--;
          }
          break;
      }
      for (let j = 0; j < _validMoves.length; j++) {
        if ((_newRow == _validMoves[j][0]) && (_newCol == _validMoves[j][1])) {
          setup.enemies[i].row = _newRow;
          setup.enemies[i].col = _newCol;
          break;
        }
      }
    }
  }
}


/*
https://stackoverflow.com/questions/28080290/managing-promise-dependencies
var doStuff = function () {
  var p1 = promise1();
  var p2 = p1.then(promise2);
  var p3 = p1.then(promise3); // if you actually need to wait for p2 here, do.
  return Promise.all([p1, p2, p3]).catch(function(err){
      // clean up based on err and state, can unwrap promises here
  });
};*/

function initRot() {

}

// Load all modules and return a promise here
// REPLACE SIMPLEX WITH FAST SIMPLEX!
setup.loadModules = importScripts("js/helpers.js", 
  "js/simplex-noise.js",
  "https://cdn.jsdelivr.net/npm/rot-js@2/dist/rot.js");//, "js/character.js", "scripts/room.js", "js/map.js");

setup.loadModules.then(function() {
  initROT();




  /*
  setup.player = new Character("Erik", 0, 0, 0, RACE.HUMAN, RACE.NORMAL, 100);
  setup.map = new GameMap(setup.MAP_WIDTH, setup.MAP_HEIGHT, setup.NUM_FLOORS);
  setup.map.maps[setup.player.depth][0][0].discovered = true;
  setup.map.maps[setup.player.depth][0][0].blocked = false;
  //console.log(setup.map);

  // place enemies and player
  setup.player.col = 2;
  setup.player.row = 6;

  setup.enemies = new Array();
  for (let i = 0; i < setup.NUM_ENEMIES; i++) {
    let _n = "Enemy " + i;
    let _r = randomEnum(RACE);
    let _rm = randomEnum(CHAR_MOD);
    let _row = randomInt(1, setup.MAP_HEIGHT-1);
    let _col = randomInt(1, setup.MAP_WIDTH-1);

    let _validSpots = [ROOM_SPRITES.BLANK_FLOOR,ROOM_SPRITES.FLOOR_1,ROOM_SPRITES.FLOOR_2,ROOM_SPRITES.FLOOR_3];
    while (!_validSpots.includes(setup.map.maps[0][_row][_col].room_type)) {
      _row = randomInt(1, setup.MAP_HEIGHT-1);
      _col = randomInt(1, setup.MAP_WIDTH-1);
    }
    setup.enemies.push(new Character(_n, _row, _col, 0, _r, _rm, 100));
  }


  $(function() {
    jQuery(document).keyup((event) => {
      let _validMoves = setup.checkValidMoves(setup.map.maps[setup.player.depth], setup.player.row, setup.player.col);
      let _check = null;

      // state update keys
      // update the game state if one of these keys are pressed
      let _tick_keys = [101,190,38,75,104,40,74,98,37,72,100,39,76,102,78,99,66,97,85,105,89,103];
      _tick_keys.push(49);
      _tick_keys.push(50);

      let _update_engine_keys = [32,49,50];



      // TODO
      // - add check to see if passage should update
      // - add function to redraw map

      //alert(event.which);

      switch (event.which) {
        //DEBUG!
        case 49: // 1
          _check = "DEBUG-inc"
          break;
        case 50: // 2
          _check = "DEBUG-dec"
          break;


        case 101: // numpad 5
        case 190: // period
          _check = "wait";
          break;

        case 38:  // up arrow
        case 75:  // k
        case 104: // numpad 8
          _check = [setup.player.row-1, setup.player.col];
          break;
        
      //DEBUG
        case 40: // down arrow 
        case 74: // j
        case 98: // numpad 2
          _check = [setup.player.row+1, setup.player.col];
          break;

        case 37:  // left arrow 
        case 72:  // h
        case 100: // numpad 4
          _check = [setup.player.row, setup.player.col-1];
          break;

        case 39:  // right arrow 
        case 76:  // l
        case 102: // numpad 6
          _check = [setup.player.row, setup.player.col+1];
          break;

        case 78: // n (down right)
        case 99: // numpad 3
          _check = [setup.player.row+1, setup.player.col+1];
          break;

        case 66: // b (down left)
        case 97: // numpad 1
          _check = [setup.player.row+1, setup.player.col-1];
          break;

        case 85:  // u (up right)
        case 105: // numpad 9
          _check = [setup.player.row-1, setup.player.col+1];
          break;

        case 89:  // y (up left)
        case 103: // numpad 7
          _check = [setup.player.row-1, setup.player.col-1];
          break;

        default: // trap keys not doing anything
          _check = null;
          break;
      }


      // DEBUG!
      if (_check == "DEBUG-inc") {
        if (setup.player.depth > 0)
          setup.player.depth--;
        Engine.play("ProcGen");
      } else if (_check == "DEBUG-dec") {
        if (setup.player.depth < (setup.NUM_FLOORS-1))
          setup.player.depth++;
        Engine.play("ProcGen");
      } else if (_check == "wait") { // don't move but refresh
        console.log("wait");
 //       setup.tickGame();
  //      Engine.play("ProcGen");
      } else if (_check != null) { // check if move exists
        let _exists = false;

        for (let i = 0; i < _validMoves.length; i++) {
          if ((_check[0] == _validMoves[i][0]) && (_check[1] == _validMoves[i][1])) {
            _exists = true;

            setup.player.row = _check[0];
            setup.player.col = _check[1];

 //           setup.tickGame();
//            Engine.play("ProcGen");
            break;
          }
        }
      } 

      if (_tick_keys.includes(event.which)) {
        setup.tickGame();
        setup.redrawMap();
      }
      if (_update_engine_keys.includes(event.which))
        Engine.play("ProcGen");

//      if (_tick_keys.includes(event.which)) {
 //       setup.tickGame();
  //      Engine.play("ProcGen");
   //   }

    });
  }());
  */


}).catch(function (err) {
  console.log(err);
});

