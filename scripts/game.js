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

setup.swapPalette = function() {
  console.log("Swapping palette");
};

function initROT() {
  const tileSet = document.createElement("img");
  tileSet.src = "assets/1bitpack_kenney_1.1/Tilesheet/colored.png";//"assets/colored.png";

  const displayOptions = {
    // Configure the display
    bg: "white", // background
    fg: "dimGrey", // foreground
    fontFamily: "Consolas", // font (use a mono)
    width: setup.MAP_WIDTH,//25,
    height: setup.MAP_HEIGHT,//15, // canvas height and width
    depths: 9,
    fontSize: 12, // canvas fontsize
    forceSquareRatio: true, // make the canvas squared ratio

    layout: "tile",
    tileWidth: 16,//2,
    tileHeight: 16,//2,
    tileSet: tileSet,
    tileMap: {
      "X": [221,272],//[66,40],
      "@": [408,170],//[14,105],
      "+": [170,289],//[1,40],
      ">": [510,357],//[131,1],
      "<": [476,357],//[144,1],
      ".": [17,0],//[40,27],
      "!": [510,136],//[53,105],
    }
  };

  // Object containing colors per tile
  // you may add as much as you want corresponding to characters
  // they are then applied in gameworld.draw
  const colors = {
    ".": "lightgrey" // the moveable path
  };

  setup.Display = null; // give the browser time to load fonts

  setup.Game = {
    map: [],
    maps: [],
    win: false,
    current_depth: 0,
    init: async function () {
      await sleep(500).then(() => {
        setup.Display = new ROT.Display(displayOptions);
        let canvas = document.getElementById("canvas");
        canvas.appendChild(setup.Display.getContainer());
        console.log("Depth " + setup.Game.current_depth);
      });

      setup.Display.clear();
      this.createLevel();
      Player.init();
      this.engine(); // start the game engine
      this.draw();
    },
    engine: async function () {
      while (true) {
        await Player.act();
        this.draw();
      }
    },
    createLevel: function () {
      setup.GameWorld.generate();
    },
    draw: function () {
      setup.Display.clear();
      setup.GameWorld.draw();
      Player.draw();
    },
    endGame: function () {
      this.win = true;
      setup.Display.clear();
      setup.Display.draw(8, 8, "You logged the rocket!", "violet");
    }
  };

  // initialize the game objects
  setup.GameWorld = {
    map: [],
    maps: [],
    freeCells: [],
    moveSpace: [],
    generate: function () {
      for (let d = 0; d < displayOptions.depths; d++) {
      let map = [];

      for (let i = 0; i < displayOptions.width; i++) {
        map[i] = [];
        for (let j = 0; j < displayOptions.height; j++) {
          map[i][j] = "+"; // create the walls
        }
      }

      let freeCells = []; // this is where we shall store the moveable space

      let digger = null;
      switch (d) {
        case 0:
          digger = new ROT.Map.Arena(
            displayOptions.width - 2,
            displayOptions.height - 2
          );
          break;
        case 1:
          digger = new ROT.Map.Cellular(
            displayOptions.width - 2,
            displayOptions.height - 2
          );
          digger.randomize(0.4);
          break;
        case 2:
          digger = new ROT.Map.Uniform(
            displayOptions.width - 2,
            displayOptions.height - 2
          );
          break;
        case 3:
          digger = new ROT.Map.Digger(
            displayOptions.width - 2,
            displayOptions.height - 2
          );
          break;
        case 4:
          digger = new ROT.Map.Rogue(
            displayOptions.width - 2,
            displayOptions.height - 2
          );
          break;
        case 5:
          digger = new ROT.Map.DividedMaze(
            displayOptions.width - 2,
            displayOptions.height - 2
          );
          break;
        case 6:
          digger = new ROT.Map.IceyMaze(
            displayOptions.width - 2,
            displayOptions.height - 2
          );
          break;
        case 7:
        default:
          digger = new ROT.Map.EllerMaze(
            displayOptions.width - 2,
            displayOptions.height - 2
          );
          break;

      }
      //if (d === 0) {
      //} else {

      //let digger = new ROT.Map.Cellular(
      //let digger = new ROT.Map.Uniform(
      //let digger = new ROT.Map.Digger(
      //let digger = new ROT.Map.Rogue(
      //let digger = new ROT.Map.DividedMaze(
      //let digger = new ROT.Map.IceyMaze(
      //digger = new ROT.Map.EllerMaze(
  //      displayOptions.width - 2,
  //     displayOptions.height - 2
    //  );
    // }
      //digger.randomize(0.4);
      digger.create((x, y, value) => {
        if (value) {
          map[x + 1][y + 1] = "X"; // create the walls
        } else {
          freeCells.push({ x: x + 1, y: y + 1 });
          map[x + 1][y + 1] = "."; // add . to every free space just for aesthetics
        }
      });

      // put the exit gate on the last free cell
      const lastFreeCell = freeCells.pop();
      map[lastFreeCell.x][lastFreeCell.y] = ">";

      // if not on depth 0, pick a random cell to go up
      /*
      if (d > 0) {
        const r_idx = getRandomFreeCellIndex(freeCells);
        const r_freeCell = freeCells[r_idx];
        map[r_freeCell.x][r_freeCell.y] = "<";
        freeCells.splice(r_idx, 1);
      }*/

      if (d == 3) {
        const r_idx = getRandomFreeCellIndex(freeCells);
        const r_freeCell = freeCells[r_idx];
        map[r_freeCell.x][r_freeCell.y] = "!";
        freeCells.splice(r_idx, 1);
      }

      //this.map = map;
      //this.freeCells = freeCells;
      this.maps.push(map);
      this.freeCells.push(freeCells);
      }
      Player.justMoved = false;
    },
    // make it impossible to pass through if across an obstacle
    isPassable: function (x, y) {
      if (setup.GameWorld.maps[setup.Game.current_depth][x][y] === "+" || setup.GameWorld.maps[setup.Game.current_depth][x][y] === "X") {
        return false;
      } else {
        return true;
      }
    },
    draw: function () {
      this.maps[setup.Game.current_depth].forEach((element, x) => {
        element.forEach((element, y) => {
          setup.Display.draw(x, y, element, colors[element] || "red");
        });
      });
    }
  };

  let flavorText = [
    "You feel uneasy.",
    "Invisible eyes are upon you.",
    "You feel as though you are being followed.",
    "Silent footsteps in the distance.",
    "Hushed whispers bounce off marble floors.",
    "The hairs on your neck stiffen.",
    "A soft breath on your neck?  No, just an errant breeze.",
    "You hear a chitinous scuttling in a nearby corner.",
  ];

  // create the player
  let Player = {
    x: null,
    y: null,
    depth: null,
    moves: null,
    triggerFlavor: null,
    init: function () {
      let playerStart = setup.GameWorld.freeCells[setup.Game.current_depth][0]; // put the player in the first available freecell
      this.x = playerStart.x;
      this.y = playerStart.y;
      this.depth = 0;
      this.moves = 0;
      this.triggerFlavor = false;
      console.log("Depth " + setup.Game.current_depth);
    },
    draw: function () {
      setup.Display.draw(this.x, this.y, "@", "black");
    },
    act: async function () {
      let action = false;
      while (!action) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        let e = await new Promise((resolve) => {
          window.addEventListener("keydown", resolve, { once: true });
        });
        action = this.handleKey(e);
      } //Await a valid movement

      // Twine interaction let's gooo
      if ((this.x > 10) && (this.y > 10)) {
        $("#procgen-content").html('Welcome to //hell// doom slayer!');
        //$("#procgen-content").wiki('Welcome to //hell// doom slayer!');
      } else {
        $("#procgen-content").html('');
      }

      if (this.triggerFlavor) {
        let x = randomListItem(flavorText);

        //var anim = document.getElementById('anim');
        //anim.style.display = 'block';
        $("#anim").html(x);
        $("#anim").show();
        $('#anim').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function(e) { $(this).hide(); });
        //anim.addEventListener('webkitAnimationEnd',function( event ) { anim.style.display = 'none'; }, false);
        this.triggerFlavor = false;
      }

      // make it end when the rocket reaches the earth
      if (setup.GameWorld.maps[setup.Game.current_depth][this.x][this.y] === ">") {
        setup.Game.endGame();
        this.depth++;
        setup.Game.current_depth++; // used to check enemy depth
        //Game.createLevel();
        this.init();
      } else if (setup.GameWorld.maps[setup.Game.current_depth][this.x][this.y] === "<") {
        setup.Game.endGame();
        this.depth--;
        setup.Game.current_depth--; // used to check enemy depth
        //Game.createLevel();
        this.init();
      } else if (setup.GameWorld.maps[setup.Game.current_depth][this.x][this.y] === "!") {
        UI.alert("HOLY SHITSNACKS YOU RESCUED THE PRINCESS!");
      }
    },
    handleKey: function (e) {
      var keyCode = [];
      //Arrows keys
      keyCode[38] = 0; // key-up
      keyCode[75] = 0;

      keyCode[85] = 1;// key-up-right

      keyCode[39] = 2; // key-right
      keyCode[76] = 2;

      keyCode[78] = 3; // key-down-right

      keyCode[40] = 4; // key-down
      keyCode[74] = 4;

      keyCode[66] = 5; // key-down-left

      keyCode[37] = 6; // key-left
      keyCode[72] = 6;

      keyCode[89] = 7; // key-up-left

      var code = e.keyCode;
      //console.log(code);

      if (!(code in keyCode)) {
        return false;
      }

      let diff = ROT.DIRS[8][keyCode[code]];
      if (setup.GameWorld.isPassable(this.x + diff[0], this.y + diff[1])) {
        this.x += diff[0];
        this.y += diff[1];
        this.justMoved = true;
        this.moves++;

        if (((this.moves % 10) == 0))// && (Math.random() > 0.9))
          this.triggerFlavor = true;

        return true;
      } else {
        return false;
      }
    }
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  window.addEventListener(
    "keydown",
    function (e) {
      // space and arrow keys
      if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
      }
    },
    false
  );

  //window.onload = setup.Game.init();
  setup.Game.init();
  window.focus();
}

/************************* RL DEV FXNS */
function initRLDev() {
  //console.log("yo");
let DEBUG_ALL_EXPLORED = false;

//const WIDTH = 60, HEIGHT = 25;
const WIDTH = setup.MAP_WIDTH
const HEIGHT = setup.MAP_HEIGHT
const STORAGE_KEY = window.location.pathname + '-savegame';
ROT.RNG.setSeed(127);

// emf
const tileSet = document.createElement("img");
tileSet.src = "assets/1bitpack_kenney_1.1/Tilesheet/colored.png";//"assets/colored.png";


const displayOptions = {
    // Configure the display
    bg: "white", // background
    fg: "dimGrey", // foreground
    fontFamily: "Consolas", // font (use a mono)
    width: setup.MAP_WIDTH,//25,
    height: setup.MAP_HEIGHT,//15, // canvas height and width
    depths: 9,
    fontSize: 16, // canvas fontsize
    //forceSquareRatio: true, // make the canvas squared ratio

    layout: "tile",
    tileWidth: 16,//2,
    tileHeight: 16,//2,
    tileSet: tileSet,
    tileMap: {
      "@": [408,170],//[14,105],
      ">": [510,357],//[131,1],
      "T": [510,102],//[53,105],
      "o": [493,34],//[53,105],
      "%": [578,204],//[714,187],//[53,105],
      "!": [714, 187],//[53,105],
      "#": [119,255],//[53,105],
      "-": [595,102],//[53,105],
      "/": [544,119],//[53,105],
      "~": [340,323],//[53,105],
      "[": [629,51],//[53,105],
      "X": [221,272],//[66,40],
      "+": [170,289],//[1,40],
      "<": [476,357],//[144,1],
      ".": [17,0],//[40,27],
      //"\\": [510,136],//[53,105],
      " ": [17,0],//[53,105],
      "*": [119, 255],
      "}": [0,0],
    }
  };
const display = new ROT.Display(displayOptions);//{width: 60, height: 25, fontSize: 16, fontFamily: 'monospace'});
//const display = new ROT.Display({width: 60, height: 25, fontSize: 16, fontFamily: 'monospace'});


display.getContainer().setAttribute('id', "game");
document.getElementById("main_figure").appendChild(display.getContainer());
//document.querySelector("figure").appendChild(display.getContainer());

const EQUIP_MAIN_HAND = 0;
const EQUIP_OFF_HAND = 1;

/** like python's randint */
const randint = ROT.RNG.getUniformInt.bind(ROT.RNG);

/** step function: given a sorted table [[x, y], …] 
    and an input x1, return the y1 for the first x that is <x1 */
function evaluateStepFunction(table, x) {
    let candidates = table.filter(xy => x >= xy[0]);
    return candidates.length > 0 ? candidates[candidates.length-1][1] : 0;
}

/** console messages */
const MAX_MESSAGE_LINES = 100;
let messages = []; // [text, className]
function drawMessages() {
    let messageBox = document.querySelector("#messages");
    // If there are more messages than there are <div>s, add some
    while (messageBox.children.length < messages.length) {
        messageBox.appendChild(document.createElement('div'));
    }
    // Remove any extra <div>s
    while (messages.length < messageBox.children.length) {
        messageBox.removeChild(messageBox.lastChild);
    }
    // Update the <div>s to have the right message text and color
    for (let line = 0; line < messages.length; line++) {
        let div = messageBox.children[line];
        div.textContent = messages[line][0];
        div.setAttribute('class', messages[line][1]);
    }
    // Scroll to the bottom
    messageBox.scrollTop = messageBox.scrollHeight;
}

function print(message, className) {
    messages.push([message, className]);
    messages.splice(0, messages.length - MAX_MESSAGE_LINES);
    drawMessages();
}

/** overlay messages - hide if text is empty, optionally clear automatically */
const [setOverlayMessage, setTemporaryOverlayMessage] = (() => {
    let area = document.querySelector("#message-overlay");
    let timeout = 0;
    function set(text) {
        clearTimeout(timeout);
        area.textContent = text;
        area.classList.toggle('visible', !!text);
    }
    return [
        set,
        function(text) {
            set(text);
            timeout = setTimeout(() => { area.classList.remove('visible'); }, 1000);
        }
    ];
})();

//////////////////////////////////////////////////////////////////////
// entities

/** Entity properties that are shared among all the instances of the type.
    visuals: [char, fg, optional bg, true if can be seen outside fov]
    item: true if can go into inventory
    equipment_slot: 0–25 if it can go into equipment, undefined otherwise
 */
const ENTITY_PROPERTIES = {
    player: { blocks: true, render_order: 5, visuals: ['@', "hsl(60, 100%, 70%)"], },
    stairs: { stairs: true, render_order: 1, visuals: ['>', "hsl(200, 100%, 90%)", undefined, true], },
    troll:  { blocks: true, render_order: 3, visuals: ['T', "hsl(120, 60%, 30%)"], xp_award: 100, },
    orc:    { blocks: true, render_order: 3, visuals: ['o', "hsl(100, 30%, 40%)"], xp_award: 35, },
    corpse: { blocks: false, render_order: 0, visuals: ['%', "darkred"], },
    'healing potion': { item: true, render_order: 2, visuals: ['!', "violet"], },
    'lightning scroll': { item: true, render_order: 2, visuals: ['#', "hsl(60, 50%, 75%)"], },
    'fireball scroll': { item: true, render_order: 2, visuals: ['#', "hsl(0, 50%, 50%)"], },
    'confusion scroll': { item: true, render_order: 2, visuals: ['#', "hsl(0, 100%, 75%)"], },
    dagger: { item: true, equipment_slot: EQUIP_MAIN_HAND, render_order: 2, bonus_power: 0, visuals: ['-', "hsl(200, 30%, 90%)"], },
    sword: { item: true, equipment_slot: EQUIP_MAIN_HAND, render_order: 2, bonus_power: 3, visuals: ['/', "hsl(200, 30%, 90%)"], },
    towel: { item: true, equipment_slot: EQUIP_OFF_HAND, render_order: 2, bonus_defense: 0, visuals: ['~', "hsl(40, 50%, 80%)"], },
    shield: { item: true, equipment_slot: EQUIP_OFF_HAND, render_order: 2, bonus_defense: 1, visuals: ['[', "hsl(40, 50%, 80%)"], },
};
/* Always use the current value of 'type' to get the entity
    properties, so that we can change the object type later (e.g. to
    'corpse'). JS lets us forward these properties to a getter, and I
    use the getter to get the corresponding value from
    ENTITY_PROPERTIES. This loop looks weird but I kept having bugs
    where I forgot to forward a property manually, so I wanted to
    automate it. */
function calculateEquipmentBonus(equipment, field) {
    if (!equipment) return 0;
    return equipment
        .filter(id => id !== null)
        .reduce((sum, id) => sum + (entities.get(id)[field] || 0), 0);
}
const entity_prototype = {
    get increased_max_hp() { return calculateEquipmentBonus(this.equipment, 'bonus_max_hp'); },
    get increased_power() { return calculateEquipmentBonus(this.equipment, 'bonus_power'); },
    get increased_defense() { return calculateEquipmentBonus(this.equipment, 'bonus_defense'); },
    get effective_max_hp() { return this.base_max_hp + this.increased_max_hp; },
    get effective_power() { return this.base_power + this.increased_power; },
    get effective_defense() { return this.base_defense + this.increased_defense; },
};
for (let property of
     new Set(Object.values(ENTITY_PROPERTIES).flatMap(p => Object.keys(p))).values()) {
    Object.defineProperty(entity_prototype, property,
                          {get() { return ENTITY_PROPERTIES[this.type][property]; }});
}

/* Schema:
 * location: {x:int, y:int}
 *          | {carried_by:id, slot:int} -- allowed only if .item
 *          | {equipped_by:id, slot:int} -- allowed only if .equipment === slot
 * inventory: Array<null|int> - should only contain entities with .item
 * equipment: Array<null|int> - should contain only items with .equipment
 */
const NOWHERE = {x: -1, y: -1}; // TODO: figure out a better location
let entities = new Map();
function createEntity(type, location, properties={}) {
    let id = ++createEntity.id;
    let entity = Object.create(entity_prototype);
    entity.name = type;
    Object.assign(entity, { id, type, location: NOWHERE, ...properties });
    moveEntityTo(entity, location);
    if (entity.base_max_hp !== undefined && entity.hp === undefined) {
        entity.hp = entity.base_max_hp;
    }
    entities.set(id, entity);
    return entity;
}
createEntity.id = 0;

/** euclidean distance */
function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

/** return all entities at (x,y) */
function allEntitiesAt(x, y) {
    return Array.from(entities.values()).filter(e => e.location.x === x && e.location.y === y);
}

/** return an item at (x,y) or null if there isn't one */
function itemEntityAt(x, y) {
    let entities = allEntitiesAt(x, y).filter(e => e.item);
    return entities[0] || null;
}

/** return a blocking entity at (x,y) or null if there isn't one */
function blockingEntityAt(x, y) {
    let entities = allEntitiesAt(x, y).filter(e => e.blocks);
    if (entities.length > 1) throw `invalid: more than one blocking entity at ${x},${y}`;
    return entities[0] || null;
}

/** swap an inventory item with an equipment slot */
function swapEquipment(entity, inventory_slot, equipment_slot) {
    let heldId = entity.inventory[inventory_slot],
        equippedId = entity.equipment[equipment_slot];
    if (heldId === null) throw `invalid: swap equipment must be with non-empty inventory slot`;
    if (equippedId === null) throw `invalid: swap equipment must be with non-empty equipment slot`;
    
    let held = entities.get(heldId);
    let equipped = entities.get(equippedId);
    if (held.location.carried_by !== entity.id) throw `invalid: inventory item not held by entity`;
    if (held.location.slot !== inventory_slot) throw `invalid: inventory item not held in correct slot`;
    if (equipped.location.equipped_by !== entity.id) throw `invalid: item not equipped by entity`;
    if (equipped.location.slot !== equipment_slot) throw `invalid: item not equipped in correct slot`;
    
    let held_equipment_slot = held.equipment_slot;
    if (held_equipment_slot === undefined) throw `invalid: swap equipment must be with something equippable`;
    if (held_equipment_slot !== equipment_slot) throw `invalid: swap equipment must be to the correct slot`;
    
    entity.inventory[inventory_slot] = equippedId;
    entity.equipment[equipment_slot] = heldId;
    held.location = {equipped_by: entity.id, slot: equipment_slot};
    equipped.location = {carried_by: entity.id, slot: inventory_slot};
}

/** move an entity to a new location:
 *   {x:int y:int} on the map
 *   {carried_by_by:id slot:int} in id's 'inventory' 
 *   {equipped_by:id slot:int} is a valid location but NOT allowed here
 */
function moveEntityTo(entity, location) {
    if (entity.location.carried_by !== undefined) {
        let {carried_by, slot} = entity.location;
        let carrier = entities.get(carried_by);
        if (carrier.inventory[slot] !== entity.id) throw `invalid: inventory slot ${slot} contains ${carrier.inventory[slot]} but should contain ${entity.id}`;
        carrier.inventory[slot] = null;
    }
    entity.location = location;
    if (entity.location.carried_by !== undefined) {
        let {carried_by, slot} = entity.location;
        let carrier = entities.get(carried_by);
        if (carrier.inventory === undefined) throw `invalid: moving to an entity without inventory`;
        if (carrier.inventory[slot] !== null) throw `invalid: inventory already contains an item ${carrier.inventory[slot]} in slot ${slot}`;
        carrier.inventory[slot] = entity.id;
    }
}

/** inventory is represented as an array with (null | entity.id) */
function createInventoryArray(capacity) {
    return Array.from({length: capacity}, () => null);
}

let player = (function() {
    let player = createEntity(
        'player', NOWHERE,
        {
            base_max_hp: 100,
            base_defense: 1, base_power: 4,
            xp: 0, level: 1,
            inventory: createInventoryArray(26),
            equipment: createInventoryArray(26),
        }
    );

    // Insert the initial equipment with the correct invariants
    function equip(slot, type) {
        let entity = createEntity(type, {equipped_by: player.id, slot: slot});
        player.equipment[slot] = entity.id;
    }
    equip(EQUIP_MAIN_HAND, 'dagger');
    equip(EQUIP_OFF_HAND, 'towel');
    return player;
})();

function populateRoom(room, dungeonLevel) {
    let maxMonstersPerRoom = evaluateStepFunction([[1, 2], [4, 3], [6, 5]], dungeonLevel),
        maxItemsPerRoom = evaluateStepFunction([[1, 1], [4, 2]], dungeonLevel);

    const ai = {behavior: 'move_to_player'};
    const monsterChances = {
        orc: 80,
        troll: evaluateStepFunction([[3, 15], [5, 30], [7, 60]], dungeonLevel),
    };
    const monsterProps = {
        orc:   {base_max_hp: 20, base_defense: 0, base_power: 4, ai},
        troll: {base_max_hp: 30, base_defense: 2, base_power: 8, ai},
    };
    
    const numMonsters = randint(0, maxMonstersPerRoom);
    for (let i = 0; i < numMonsters; i++) {
        let x = randint(room.getLeft(), room.getRight()),
            y = randint(room.getTop(), room.getBottom());
        if (!blockingEntityAt(x, y)) {
            let type = ROT.RNG.getWeightedValue(monsterChances);
            createEntity(type, {x, y}, monsterProps[type]);
        }
    }

    const itemChances = {
        'healing potion': 70,
        'lightning scroll': evaluateStepFunction([[4, 25]], dungeonLevel),
        'fireball scroll': evaluateStepFunction([[6, 25]], dungeonLevel),
        'confusion scroll': evaluateStepFunction([[2, 10]], dungeonLevel),
        sword: evaluateStepFunction([[4, 5]], dungeonLevel),
        shield: evaluateStepFunction([[8, 15]], dungeonLevel),
    };
    const numItems = randint(0, maxItemsPerRoom);
    for (let i = 0; i < numItems; i++) {
        let x = randint(room.getLeft(), room.getRight()),
            y = randint(room.getTop(), room.getBottom());
        if (allEntitiesAt(x, y).length === 0) {
            createEntity(ROT.RNG.getWeightedValue(itemChances), {x, y});
        }
    }
}

function createMap() {
    function key(x, y) { return `${x},${y}`; }
    return {
        _values: {},
        has(x, y) { return this._values[key(x, y)] !== undefined; },
        get(x, y) { return this._values[key(x, y)]; },
        set(x, y, value) { this._values[key(x, y)] = value; },
    };
}

function updateTileMapFov(tileMap) {
    // NOTE: this isn't great because I wanted tileMap to have only
    // the map, and not derived data like this. The map should be in
    // the save file but this fov should not. It just happens to work
    // because ROT doesn't expose the fov data in a JSON compatible
    // way, but it's not a great design.
    tileMap.fov = new ROT.FOV.PreciseShadowcasting(
        (x, y) => tileMap.has(x, y) && tileMap.get(x, y).walkable
    );
}
    
function createTileMap(dungeonLevel) {
    let tileMap = createMap();
    const digger = new ROT.Map.Digger(WIDTH, HEIGHT);
    digger.create((x, y, contents) =>
        tileMap.set(x, y, {
            walkable: contents === 0,
            wall: contents === 1,
            explored: false,
        })
    );
    tileMap.dungeonLevel = dungeonLevel;
    tileMap.rooms = digger.getRooms();
    tileMap.corridors = digger.getCorridors();

    // Put the player in the first room
    let [playerX, playerY] = tileMap.rooms[0].getCenter();
    moveEntityTo(player, {x: playerX, y: playerY});

    // Put stairs in the last room
    let [stairX, stairY] = tileMap.rooms[tileMap.rooms.length-1].getCenter();
    createEntity('stairs', {x: stairX, y: stairY});

    // Put monster and items in all the rooms
    for (let room of tileMap.rooms) {
        populateRoom(room, dungeonLevel);
    }

    updateTileMapFov(tileMap);
    return tileMap;
}

let tileMap = createTileMap(1);



function computeLightMap(center, tileMap) {
    let lightMap = createMap(); // 0.0–1.0
    tileMap.fov.compute(center.x, center.y, 10, (x, y, r, visibility) => {
        lightMap.set(x, y, visibility);
        if (visibility > 0.0) {
            if (tileMap.has(x, y))
            tileMap.get(x, y).explored = true;
        }
    });
    return lightMap;
}

/** compute a per-tile map of entity visuals */
function computeGlyphMap(entities) {
    let glyphMap = createMap();
    entities = Array.from(entities.values());
    entities.sort((a, b) => a.render_order - b.render_order);
    entities
        .filter(e => e.location.x !== undefined)
        .forEach(e => glyphMap.set(e.location.x, e.location.y, e.visuals));
    return glyphMap;
}

const mapColors = {
    [false]: {[false]: "rgb(50, 50, 150)", [true]: "rgb(0, 0, 100)"},
    [true]: {[false]: "rgb(200, 180, 50)", [true]: "rgb(130, 110, 50)"}
};
function draw() {
    display.clear();

    document.querySelector("#health-bar").style.width = `${Math.ceil(100*player.hp/player.effective_max_hp)}%`;
    document.querySelector("#health-text").textContent = ` HP: ${player.hp} / ${player.effective_max_hp}`;

    let lightMap = computeLightMap(player.location, tileMap);
    let glyphMap = computeGlyphMap(entities);

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let tile = tileMap.get(x, y);
            let lit = DEBUG_ALL_EXPLORED || lightMap.get(x, y) > 0.0;
            let ch = ' ',
                fg = "black",
                bg = mapColors[lit][tile.wall];
            if (!tile || (!DEBUG_ALL_EXPLORED && !tile.explored)) { continue; }
            if ((!tile.walkable) && (tile.explored)) ch = '*';
            if ((!tile.walkable) && (!tile.explored)) ch = '}';



            let glyph = glyphMap.get(x, y);
            if (glyph) {
                ch = lit || glyph[3] ? glyph[0] : ch;
                fg = glyph[1];
                bg = glyph[2] || bg;
            }
            display.draw(x, y, ch, fg, bg);
        }
    }

    updateInstructions();
}

function updateInstructions() {
    const instructions = document.getElementById('game-instructions');
    let standingOn = allEntitiesAt(player.location.x, player.location.y);
    
    let html = ``;
    if (currentKeyHandler() === handlePlayerKeys) {
        html = `Arrows move, <kbd>S</kbd>ave`;
        let hasSavedGame = window.localStorage.getItem(STORAGE_KEY) !== null;
        let hasItems = player.inventory.filter(id => id !== null).length > 0;
        let onItem = standingOn.filter(e => e.item).length > 0;
        let onStairs = standingOn.filter(e => e.stairs).length > 0;
        if (hasSavedGame) html += `/<kbd>R</kbd>estore`;
        html += ` game`;
        if (hasItems) html += `, <kbd>U</kbd>se, <kbd>D</kbd>rop`;
        if (onItem) html += `, <kbd>G</kbd>et item`;
        if (onStairs) html += `, <kbd>&gt;</kbd> stairs`;
    }
    instructions.innerHTML = html;
}


//////////////////////////////////////////////////////////////////////
// saving and loading

function serializeGlobalState() {
    const saved = {
        entities: Array.from(entities),
        playerId: player.id,
        tileMap: tileMap,
        messages: messages,
        nextEntityId: createEntity.id,
        rngState: ROT.RNG.getState(),
    };
    return JSON.stringify(saved);
}

function deserializeGlobalState(json) {
    const reattachEntityPrototype = entry =>
          [entry[0], Object.assign(Object.create(entity_prototype), entry[1])];
    const saved = JSON.parse(json);
    entities = new Map(saved.entities.map(reattachEntityPrototype));
    createEntity.id = saved.nextEntityId;
    player = entities.get(saved.playerId);
    Object.assign(tileMap, saved.tileMap);
    updateTileMapFov(tileMap);
    messages = saved.messages;
    ROT.RNG.setState(saved.rngState);
}


//////////////////////////////////////////////////////////////////////
// items

function useItem(entity, item) {
    switch (item.type) {
    case 'healing potion': {
        const healing = 40;
        if (entity.hp === entity.effective_max_hp) {
            print(`You are already at full health`, 'warning');
        } else {
            print(`Your wounds start to feel better!`, 'healing');
            entity.hp = ROT.Util.clamp(entity.hp + healing, 0, entity.effective_max_hp);
            moveEntityTo(item, NOWHERE);
            enemiesMove();
        }
        break;
    }
    case 'lightning scroll': {
        if (castLighting(entity)) {
            moveEntityTo(item, NOWHERE);
            enemiesMove();
            draw();
        }
        break;
    }
    case 'fireball scroll': {
        targetingOverlay.open(
            `Click a location to cast fireball, or <kbd>ESC</kbd> to cancel`,
            (x, y) => {
                if (castFireball(entity, x, y)) {
                    moveEntityTo(item, NOWHERE);
                    enemiesMove();
                }
                targetingOverlay.close();
                draw();
            });
        break;
    }
    case 'confusion scroll': {
        targetingOverlay.open(
            `Click on an enemy to confuse it, or <kbd>ESC</kbd> to cancel`,
            (x, y) => {
                if (castConfusion(entity, x, y)) {
                    moveEntityTo(item, NOWHERE);
                    enemiesMove();
                }
                targetingOverlay.close();
                draw();
            });
        break;
    }
    default: {
        if (item.equipment_slot !== undefined) {
            let oldItem = entities.get(player.equipment[item.equipment_slot]);
            swapEquipment(player, item.location.slot, item.equipment_slot);
            print(`You unquip ${oldItem.type} and equip ${item.type}.`, 'welcome');
            enemiesMove();
        } else {
            throw `useItem on unknown item ${item}`;
        }
    }
    }
}

function dropItem(entity, item) {
    moveEntityTo(item, player.location);
    print(`You dropped ${item.name} on the ground`, 'warning');
    enemiesMove();
}

//////////////////////////////////////////////////////////////////////
// leveling

function xpForLevel(level) {
    return 200 * level + 150 * (level * (level+1)) / 2;
}


function gainXp(entity, amount) {
    if (entity.xp === undefined) { return; } // this entity doesn't gain experience
    entity.xp += amount;
    if (entity.id !== player.id) { throw `XP for non-player not implemented`; }
    print(`You gain ${amount} experience points.`, 'info');
    while (entity.xp > xpForLevel(entity.level)) {
        entity.level += 1;
        print(`Your battle skills grow stronger! You reached level ${entity.level}!`, 'warning');
        upgradeOverlay.open();
    }
}


//////////////////////////////////////////////////////////////////////
// combat

function takeDamage(source, target, amount) {
    target.hp -= amount;
    if (target.hp <= 0) {
        print(`${target.name} dies!`, target.id === player.id? 'player-die' : 'enemy-die');
        if (target.xp_award !== undefined) { gainXp(source, target.xp_award); }
        target.dead = true;
        target.type = 'corpse';
        target.name = `${target.name}'s corpse`;
        delete target.ai;
    }
}

function attack(attacker, defender) {
    let damage = attacker.effective_power - defender.effective_defense;
    let color = attacker.id === player.id? 'player-attack' : 'enemy-attack';
    if (damage > 0) {
        print(`${attacker.name} attacks ${defender.name} for ${damage} hit points.`, color);
        takeDamage(attacker, defender, damage);
    } else {
        print(`${attacker.name} attacks ${defender.name} but does no damage.`, color);
    }
}

/** return true if the item was used */
function castFireball(caster, x, y) {
    const maximum_range = 3;
    const damage = 25;
    let visibleToCaster = computeLightMap(caster.location, tileMap);
    if (!(visibleToCaster.get(x, y) > 0)) {
        print(`You cannot target a tile outside your field of view.`, 'warning');
        return false;
    }

    let visibleFromFireball = computeLightMap({x, y}, tileMap);
    let attackables = Array.from(entities.values())
        .filter(e => e.location.x !== undefined) // on the map
        .filter(e => e.hp !== undefined && !e.dead)
        .filter(e => visibleFromFireball.get(e.location.x, e.location.y) > 0)
        .filter(e => visibleToCaster.get(e.location.x, e.location.y) > 0)
        .filter(e => distance(e.location, {x, y}) <= maximum_range);

    print(`The fireball explodes, burning everything within ${maximum_range} tiles!`, 'player-attack');
    for (let target of attackables) {
        print(`The ${target.name} gets burned for ${damage} hit points.`, 'player-attack');
        takeDamage(caster, target, damage);
    }
    return true;
}

/** return true if the item was used */
function castConfusion(caster, x, y) {
    let visibleToCaster = computeLightMap(caster.location, tileMap);
    if (!(visibleToCaster.get(x, y) > 0)) {
        print(`You cannot target a tile outside your field of view.`, 'warning');
        return false;
    }

    let visibleFromFireball = computeLightMap({x, y}, tileMap);
    let target = blockingEntityAt(x, y);
    if (target && target.hp !== undefined && !target.dead && target.ai) {
        target.ai = {behavior: 'confused', turns: 10};
        print(`The eyes of the ${target.name} look vacant, as it starts to stumble around!`, 'enemy-die');
        return true;
    }
    print(`There is no targetable enemy at that location.`, 'warning');
    return false;
}

/** return true if the item was used */
function castLighting(caster) {
    const maximum_range = 5;
    const damage = 40;
    let visibleToCaster = computeLightMap(caster.location, tileMap);
    let attackables = Array.from(entities.values())
        .filter(e => e.id !== caster.id)
        .filter(e => e.location.x !== undefined) // on the map
        .filter(e => e.hp !== undefined && !e.dead)
        .filter(e => visibleToCaster.get(e.location.x, e.location.y) > 0)
        .filter(e => distance(e.location, caster.location) <= maximum_range);
    attackables.sort((a, b) => distance(a.location, caster.location) - distance(b.location, caster.location));
    let target = attackables[0];
    if (!target) {
        print(`No enemy is close enough to strike.`, 'error');
        return false;
    }
    print(`A lighting bolt strikes the ${target.name} with a loud thunder! The damage is ${damage}`, 'player-attack');
    takeDamage(caster, target, damage);
    return true;
}


//////////////////////////////////////////////////////////////////////
// player actions

function playerPickupItem() {
    let item = itemEntityAt(player.location.x, player.location.y);
    if (!item) {
        print(`There is nothing here to pick up.`, 'warning');
        return;
    }

    let slot = player.inventory.indexOf(null); // first open inventory slot
    if (slot < 0) {
        print(`You cannot carry any more. Your inventory is full.`, 'warning');
        return;
    }

    print(`You pick up the ${item.name}!`, 'pick-up');
    moveEntityTo(item, {carried_by: player.id, slot});
    enemiesMove();
}

function playerMoveBy(dx, dy) {
    let x = player.location.x + dx,
        y = player.location.y + dy;
    if (tileMap.get(x, y).walkable) {
        let target = blockingEntityAt(x, y);
        if (target && target.id !== player.id) {
            attack(player, target);
        } else {
            moveEntityTo(player, {x, y});
        }
        enemiesMove();
    }
}

function playerGoDownStairs() {
    if (!allEntitiesAt(player.location.x, player.location.y).some(e => e.stairs)) {
        print(`There are no stairs here.`, 'warning');
        return;
    }

    // Remove anything that's on the map
    for (let entity of entities.values()) {
        if (entity.id === player.id) { continue; } // player goes on
        if (entity.location.x === undefined) { continue; } // inventory goes on
        entities.delete(entity.id);
    }

    // Make a new map
    tileMap = createTileMap(tileMap.dungeonLevel + 1);

    // Heal the player
    player.hp = ROT.Util.clamp(player.hp + Math.floor(player.effective_max_hp / 2),
                               0, player.effective_max_hp);

    print(`You take a moment to rest, and recover your strength.`, 'welcome');
    draw();
}

//////////////////////////////////////////////////////////////////////
// monster actions

function enemiesMove() {
    let lightMap = computeLightMap(player.location, tileMap);
    for (let entity of entities.values()) {
        if (!entity.dead && entity.location.x !== undefined && entity.ai) {
            switch (entity.ai.behavior) {
            case 'move_to_player': {
                if (!(lightMap.get(entity.location.x, entity.location.y) > 0.0)) {
                    // The player can't see the monster, so the monster
                    // can't see the player, so the monster doesn't move
                    continue;
                }

                let dx = player.location.x - entity.location.x,
                    dy = player.location.y - entity.location.y;

                // Pick either vertical or horizontal movement randomly
                let stepx = 0, stepy = 0;
                if (randint(1, Math.abs(dx) + Math.abs(dy)) <= Math.abs(dx)) {
                    stepx = dx / Math.abs(dx);
                } else {
                    stepy = dy / Math.abs(dy);
                }
                let x = entity.location.x + stepx,
                    y = entity.location.y + stepy;
                if (tileMap.get(x, y).walkable) {
                    let target = blockingEntityAt(x, y);
                    if (target && target.id === player.id) {
                        attack(entity, player);
                    } else if (target) {
                        // another monster there; can't move
                    } else {
                        moveEntityTo(entity, {x, y});
                    }
                }
                break;
            }
            case 'confused': {
                if (--entity.ai.turns > 0) {
                    let stepx = randint(-1, 1), stepy = randint(-1, 1);
                    let x = entity.location.x + stepx,
                        y = entity.location.y + stepy;
                    if (tileMap.get(x, y).walkable) {
                        if (!blockingEntityAt(x, y)) {
                            moveEntityTo(entity, {x, y});
                        }
                    }
                } else {
                    entity.ai = {behavior: 'move_to_player'};
                    print(`The ${entity.name} is no longer confused!`, 'enemy-attack');
                }
                break;
            }
            default: {
                throw `unknown enemy ai: ${entity.ai}`;
            }
            }
        }
    }
}


//////////////////////////////////////////////////////////////////////
// ui

function createTargetingOverlay() {
    const overlay = document.querySelector(`#targeting`);
    let visible = false;
    let callback = () => { throw `set callback`; };

    function onClick(event) {
        let [x, y] = display.eventToPosition(event);
        callback(x, y);
        // Ugh, the overlay is nice for capturing mouse events but
        // when you click, the game loses focus. Workaround:
        display.getContainer().focus();
    }
    function onMouseMove(event) {
        let [x, y] = display.eventToPosition(event);
        // TODO: feedback
    }

    overlay.addEventListener('click', onClick);
    overlay.addEventListener('mousemove', onMouseMove);

    return {
        get visible() { return visible; },
        open(instructions, callback_) {
            visible = true;
            callback = callback_;
            overlay.classList.add('visible');
            overlay.innerHTML = `<div>${instructions}</div>`;
        },
        close() {
            visible = false;
            overlay.classList.remove('visible');
        },
    };
}

function createCharacterOverlay() {
    const overlay = document.querySelector(`#character`);
    let visible = false;

    return {
        get visible() { return visible; },
        open() {
            const experienceToLevel = xpForLevel(player.level) - player.xp;
            const equipmentHTML = Object.values(player.equipment)
                  .filter(id => id !== null)
                  .map(id => entities.get(id).type)
                  .join(" and ");
            overlay.innerHTML = `<div>Character information</div>
             <ul>
               <li>Level: ${player.level}</li>
               <li>Experience: ${player.xp}</li>
               <li>Experience to Level: ${experienceToLevel}</li>
               <li>Maximum HP: ${player.base_max_hp} + ${player.increased_max_hp}</li>
               <li>Attack: ${player.base_power} + ${player.increased_power}</li>
               <li>Defense: ${player.base_defense} + ${player.increased_defense}</li>
             </ul>
             <p>Equipped: ${equipmentHTML}</p>
             <div><kbd>ESC</kbd> to exit</div>`;
            
            visible = true;
            overlay.classList.add('visible');
        },
        close() {
            visible = false;
            overlay.classList.remove('visible');
        },
    };
}

function createUpgradeOverlay() {
    const overlay = document.querySelector(`#upgrade`);
    let visible = false;
    let callback = () => { throw `set callback`; };

    return {
        get visible() { return visible; },
        open() {
            visible = true;
            overlay.innerHTML = `<div>Level up! Choose a stat to raise:</div>
             <ul>
               <li><kbd>A</kbd> Constitution (+20 HP, from ${player.base_max_hp})</li>
               <li><kbd>B</kbd> Strength (+1 attack, from ${player.base_power})</li>
               <li><kbd>C</kbd> Agility (+1 defense, from ${player.base_defense})</li>
             </ul>`;
            overlay.classList.add('visible');
        },
        close() {
            visible = false;
            overlay.classList.remove('visible');
        },
    };
}

function createInventoryOverlay(action) {
    const overlay = document.querySelector(`#inventory-${action}`);
    let visible = false;

    function draw() {
        let html = `<ul>`;
        let empty = true;
        player.inventory.forEach((id, slot) => {
            if (id !== null) {
                let item = entities.get(id);
                html += `<li><kbd>${String.fromCharCode(65 + slot)}</kbd> ${item.name}</li>`;
                empty = false;
            }
        });
        html += `</ul>`;
        if (empty) {
            html = `<div>Your inventory is empty. Press <kbd>ESC</kbd> to cancel.</div>${html}`;
        } else {
            html = `<div>Select an item to ${action} it, or <kbd>ESC</kbd> to cancel.</div>${html}`;
        }
        overlay.innerHTML = html;
    }

    return {
        get visible() { return visible; },
        open() { visible = true; overlay.classList.add('visible'); draw(); },
        close() { visible = false; overlay.classList.remove('visible'); },
    };
}


function handlePlayerDeadKeys(key) {
    const actions = {
        o:  ['toggle-debug'],
        r:  ['restore-game'],
        c:  ['character-open'],
    };
    return actions[key];
}

function handlePlayerKeys(key) {
    const actions = {
        ArrowRight:  ['move', +1, 0],
        ArrowLeft:   ['move', -1, 0],
        ArrowDown:   ['move', 0, +1],
        ArrowUp:     ['move', 0, -1],
        l:           ['move', +1, 0],
        h:           ['move', -1, 0],
        j:           ['move', 0, +1],
        k:           ['move', 0, -1],
        z:           ['move', 0, 0],
        g:           ['pickup'],
        '>':         ['stairs-down'],
        u:           ['inventory-open-use'],
        d:           ['inventory-open-drop'],
        s:           ['save-game'],
    };
    let action = actions[key];
    return action || handlePlayerDeadKeys(key);
}

function handleUpgradeKeys(key) {
    const actions = {
        a:  ['upgrade', 'hp'],
        b:  ['upgrade', 'str'],
        c:  ['upgrade', 'def'],
    };
    return actions[key];
}

function handleInventoryKeys(action) {
    return key => {
        if (key === 'Escape') { return [`inventory-close-${action}`]; }
        let slot = key.charCodeAt(0) - 'a'.charCodeAt(0);
        if (0 <= slot && slot < 26) {
            let id = player.inventory[slot];
            if (id !== null) {
                return [`inventory-do-${action}`, id];
            }
        }
        return undefined;
    };
}

function handleCharacterKeys(key) {
    return (key === 'Escape' || key == 'c') && ['character-close'];
}
    
function handleTargetingKeys(key) {
    return key === 'Escape' && ['targeting-cancel'];
}

function runAction(action) {
    switch (action[0]) {
    case 'move': {
        let [_, dx, dy] = action;
        playerMoveBy(dx, dy);
        break;
    }

    case 'pickup':               { playerPickupItem();           break; }
    case 'stairs-down':          { playerGoDownStairs();         break; }
    case 'inventory-open-use':   { inventoryOverlayUse.open();   break; }
    case 'inventory-close-use':  { inventoryOverlayUse.close();  break; }
    case 'inventory-open-drop':  { inventoryOverlayDrop.open();  break; }
    case 'inventory-close-drop': { inventoryOverlayDrop.close(); break; }
    case 'character-open':       { characterOverlay.open();      break; }
    case 'character-close':      { characterOverlay.close();     break; }
    case 'targeting-cancel':     { targetingOverlay.close();     break; }

    case 'upgrade': {
        let [_, stat] = action;
        switch (stat) {
        case 'hp':
            player.base_max_hp += 20;
            player.hp += 20;
            break;
        case 'str':
            player.base_power += 1;
            break;
        case 'def':
            player.base_defense += 1;
            break;
        default:
            throw `invalid upgrade ${stat}`;
        }
        upgradeOverlay.close();
        break;
    }
    case 'inventory-do-use': {
        let [_, id] = action;
        inventoryOverlayUse.close();
        useItem(player, entities.get(id));
        break;
    }
    case 'inventory-do-drop': {
        let [_, id] = action;
        inventoryOverlayDrop.close();
        dropItem(player, entities.get(id));
        break;
    }
    case 'restore-game': {
        let json = window.localStorage.getItem(STORAGE_KEY);
        if (json === null) {
            setTemporaryOverlayMessage("There is no saved game.");
        } else {
            setTemporaryOverlayMessage("Restored saved game.");
            deserializeGlobalState(json);
            drawMessages();
            draw();
        }
        break;
    }
    case 'save-game': {
        let json = serializeGlobalState();
        window.localStorage.setItem(STORAGE_KEY, json);
        setTemporaryOverlayMessage("Saved game.");
        break;
    }
    case 'toggle-debug': {
        DEBUG_ALL_EXPLORED = !DEBUG_ALL_EXPLORED;
        break;
    }
    default:
        throw `unhandled action ${action}`;
    }
    draw();
}

function currentKeyHandler() {
    return targetingOverlay.visible? handleTargetingKeys
         : upgradeOverlay.visible? handleUpgradeKeys
         : inventoryOverlayUse.visible? handleInventoryKeys('use')
         : inventoryOverlayDrop.visible? handleInventoryKeys('drop')
         : characterOverlay.visible? handleCharacterKeys
         : player.dead? handlePlayerDeadKeys
         : handlePlayerKeys;
}

function handleKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let action = currentKeyHandler()(event.key);
    if (action) {
        event.preventDefault();
        runAction(action);
    }
}

function handleMousemove(event) {
    let lightMap = computeLightMap(player.location, tileMap);
    let [x, y] = display.eventToPosition(event); // returns -1, -1 for out of bounds
    let entities = lightMap.get(x, y) > 0.0 ? allEntitiesAt(x, y) : [];
    let text = entities.map(e => e.name).join("\n");
    setOverlayMessage(text);
}

function handleMouseout(event) {
    setOverlayMessage("");
}

function setupInputHandlers(display) {
    const canvas = display.getContainer();
    const instructions = document.getElementById('focus-instructions');
    canvas.setAttribute('tabindex', "1");
    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('mousemove', handleMousemove);
    canvas.addEventListener('mouseout', handleMouseout);
    canvas.addEventListener('blur', () => { instructions.classList.add('visible'); });
    canvas.addEventListener('focus', () => { instructions.classList.remove('visible'); });
    canvas.focus();
}

print("Hello and welcome, adventurer, to yet another dungeon!", 'welcome');
const inventoryOverlayUse = createInventoryOverlay('use');
const inventoryOverlayDrop = createInventoryOverlay('drop');
const targetingOverlay = createTargetingOverlay();
const upgradeOverlay = createUpgradeOverlay();
const characterOverlay = createCharacterOverlay();
setupInputHandlers(display);
draw();


}
/************************* /RL DEV FXNS */


/*
var doStuff = function () {
  var p1 = promise1();
  var p2 = p1.then(promise2);
  var p3 = p1.then(promise3); // if you actually need to wait for p2 here, do.
  return Promise.all([p1, p2, p3]).catch(function(err){
      // clean up based on err and state, can unwrap promises here
  });
};*/

setup.initGame = function() {
  //$("#passage-procgen").append("<p align='center' id='canvas'></p>");
  //initROT();
  initRLDev();

}

// Load all modules and return a promise here
// REPLACE SIMPLEX WITH FAST SIMPLEX!
setup.loadModules = importScripts("js/helpers.js", 
  "js/simplex-noise.js",
  "https://cdn.jsdelivr.net/npm/rot-js@2/dist/rot.js");//,
  //"scripts/roguelike-dev.js");//, "js/character.js", "scripts/room.js", "js/map.js");

setup.loadModules.then(function() {
//  $("#passages").append("<div id='canvas'></div>");
//  initROT();




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

