/*
* game.js
* Global vars
* Setup map
* Setup enemies
*/


/*** * MOVE THIS INTO SEPARATE FILES AFTER WE FIGURE OUT THE WHOLE ... IMPORT ORDER ISSUE * ***/
class Character {
  constructor(name, row, col, race, race_mod, hp) {
    this.name     = name;
    this.row      = row;
    this.col      = col;
    this.race     = race;
    this.race_mod = race_mod;
    this.hp       = hp;
  }
}
class GameMap {
  constructor(width, height) {
    // Generate map 
    var simplex = new SimplexNoise();
  	this.map = new Array(height);
    for (var row = 0; row < height; row++) {
	    var t_row = new Array(width);
      for (var col = 0; col < width; col++) {
        t_row[col] = new Room("title " + row + "," + col, "desc", simplex.noise2D(col, row));
      }
      this.map[row] = t_row;
	  }
  }
}
// Class that outlines a room
class Room {
	constructor (title, description, noise_value) {
		this.title       = title;
		this.description = description;
		this.noise_value = noise_value;
		this.items       = new Array();
		this.encounters  = new Array();
		this.prior_room  = -1;
		this.connectors  = new Array();
		this.discovered  = false;
    this.blocked     = false;//true;
		
		// Generate room type from Simplex noise 
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
	}	
}

setup.getInteractions = function(_map, _player, _friends) {
  let _objs = Array();
  for (let f = 0; f < _friends.length; f++) {
	  if (_friends[f].row == _player.row && _friends[f].col == _player.col) {
      _objs.push(_friends[f]);
    }
  }
  return _objs;
}

setup.drawMap = function(_map, _player, _friends) {
  let _render = "<div class='map_wrapper'>";
  //let _render = "<table cellspacing='0'>";
  for (let _row = 0; _row < _map.map.length; _row++) {
    //_render += "<tr>";
    for (let _col = 0; _col < _map.map[_row].length; _col++) {
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
      if (_max_diff == 3)
        _cls = "half";
      else if (_max_diff == 2)
        _cls = "quarter";
      else if (_max_diff == 1)
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
				if (isEmpty && !_map.map[_row][_col].blocked) {
          if ((_cls == "full") && !(_map.map[_row][_col].discovered)){
            _render += "<div class='dark'></div>";
          } else {
            // override visibility if discovered
            if (_map.map[_row][_col].discovered)
              _cls = "quarter";

		  			switch (_map.map[_row][_col].room_type) {
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
  							_render += "<div id='rocky' class='" + _cls + "'></div>";
  							//_render += "<div class='rocky " + _cls + "'>⋙</div>";
				  			break;
			  			case ROOM_TYPES.NORMAL:
		  				default:
  							_render += "<div class='normal " + _cls + "'></div>";
  							break;
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
	_render += "</div>";
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

	// iterate over row and cols to check which path is blocked
	for (var _r = up_row; _r <= down_row; _r++) {
		for (var _c = left_col; _c <= right_col; _c++) {
			if ((!(_map[_r][_c].blocked)) && ((_r != _row) || (_c != _col)))
			// try this next time: if (!_map[_r][_c].blocked && !(_r === _row && _c === _col))
          moves.push([_r, _c]);
		}
	}

	//console.log("map", _map);
	//console.log("moves", moves);

	return moves;
}

setup.tickGame = function() {
  // update room state
  setup.map.map[setup.player.row][setup.player.col].discovered = true;

  // update enemies
  for (let i = 0; i < setup.enemies.length; i++) {
    if (Math.random() > 0.7) { // move
      /*
      0 1 2
      3 4 5
      6 7 8
      */
      let _dir = randomInt(0,9);
      switch (_dir) {
        case 0: // up left
          if ((setup.enemies[i].row > 0) && (setup.enemies[i].col > 0)) {
            setup.enemies[i].row--;
            setup.enemies[i].col--;
          }
          break;
        case 1: // up
          if (setup.enemies[i].row > 0) {
            setup.enemies[i].row--;
          }
          break;
        case 2: // up right
          if ((setup.enemies[i].row > 0) && (setup.enemies[i].col < (setup.MAP_WIDTH-1))) {
            setup.enemies[i].row--;
            setup.enemies[i].col++;
          }
          break;
        case 3: // left
          if (setup.enemies[i].col > 0) {
            setup.enemies[i].col--;
          }
          break;
        case 4: // pass
          break;
        case 5: // right
          if (setup.enemies[i].col < (setup.MAP_WIDTH-1)) {
            setup.enemies[i].col++;
          }
          break;
        case 6: // down left
          if ((setup.enemies[i].row < (setup.MAP_HEIGHT-1)) && (setup.enemies[i].col > 0)) {
            setup.enemies[i].row++;
            setup.enemies[i].col--;
          }
          break;
        case 6: // down 
          if (setup.enemies[i].row < (setup.MAP_HEIGHT-1)) {
            setup.enemies[i].row++;
          }
          break;
        case 7: // down right
        default:
          if ((setup.enemies[i].row < (setup.MAP_HEIGHT-1)) && (setup.enemies[i].col < (setup.MAP_WIDTH-1))) {
            setup.enemies[i].row++;
            setup.enemies[i].col--;
          }
          break;
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

// Load all modules and return a promise here
setup.loadModules = importScripts("js/helpers.js", "js/simplex-noise.js");//, "js/character.js", "scripts/room.js", "js/map.js");

setup.loadModules.then(function() {
  setup.player = new Character("Erik", 0, 0, RACE.HUMAN, RACE.NORMAL, 100);
  setup.enemies = new Array();
  for (let i = 0; i < setup.NUM_ENEMIES; i++) {
    let _n = "Enemy " + i;
    let _r = randomEnum(RACE);
    let _rm = randomEnum(RACE_MOD);
    let _row = randomInt(1, setup.MAP_HEIGHT-1);
    let _col = randomInt(1, setup.MAP_WIDTH-1);
    setup.enemies.push(new Character(_n, _row, _col, _r, _rm, 100));
  }
  setup.map = new GameMap(setup.MAP_WIDTH, setup.MAP_HEIGHT);
  setup.map.map[0][0].discovered = true;
  setup.map.map[0][0].blocked = false;
  //console.log(setup.map);

}).catch(function (err) {
  console.log(err);
});

