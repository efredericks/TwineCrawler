function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomFreeCellIndex(cells) {
  return Math.floor(Math.random() * cells.length);
}

const tileSet = document.createElement("img");
tileSet.src = "colored.png";

const displayOptions = {
  // Configure the display
  bg: "white", // background
  fg: "dimGrey", // foreground
  fontFamily: "Consolas", // font (use a mono)
  width: 25,
  height: 15, // canvas height and width
  depths: 9,
  fontSize: 12, // canvas fontsize
  forceSquareRatio: true, // make the canvas squared ratio

  layout: "tile",
  tileWidth: 12,
  tileHeight: 12,
  tileSet: tileSet,
  tileMap: {
    "X": [66,40],
    "@": [14,105],
    "+": [1,40],
    ">": [131,1],
    "<": [144,1],
    ".": [40,27],
  }
};

// Object containing colors per tile
// you may add as much as you want corresponding to characters
// they are then applied in gameworld.draw
const colors = {
  ".": "lightgrey" // the moveable path
};

let Display = null; // give the browser time to load fonts

let Game = {
  map: [],
  maps: [],
  win: false,
  current_depth: 0,
  init: async function () {
    await sleep(500).then(() => {
      Display = new ROT.Display(displayOptions);
      let canvas = document.getElementById("canvas");
      canvas.appendChild(Display.getContainer());
      console.log("Depth " + Game.current_depth);
    });

    Display.clear();
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
    GameWorld.generate();
  },
  draw: function () {
    Display.clear();
    GameWorld.draw();
    Player.draw();
  },
  endGame: function () {
    this.win = true;
    Display.clear();
    Display.draw(8, 8, "You logged the rocket!", "violet");
  }
};

// initialize the game objects
let GameWorld = {
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
        digger = new ROT.Map.Cellular(
          displayOptions.width - 2,
          displayOptions.height - 2
        );
        digger.randomize(0.4);
        break;
      case 1:
        digger = new ROT.Map.Uniform(
          displayOptions.width - 2,
          displayOptions.height - 2
        );
        break;
      case 2:
        digger = new ROT.Map.Digger(
          displayOptions.width - 2,
          displayOptions.height - 2
        );
        break;
      case 3:
        digger = new ROT.Map.Rogue(
          displayOptions.width - 2,
          displayOptions.height - 2
        );
        break;
      case 4:
        digger = new ROT.Map.DividedMaze(
          displayOptions.width - 2,
          displayOptions.height - 2
        );
        break;
      case 5:
        digger = new ROT.Map.IceyMaze(
          displayOptions.width - 2,
          displayOptions.height - 2
        );
        break;
      case 6:
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
        map[x + 1][y + 1] = "."; // add . to every free space just for esthetics
      }
    });

    // put the exit gate on the last free cell
    const lastFreeCell = freeCells.pop();
    map[lastFreeCell.x][lastFreeCell.y] = ">";

    // if not on depth 0, pick a random cell to go up
    if (d > 0) {
      const r_idx = getRandomFreeCellIndex(freeCells);
      const r_freeCell = freeCells[r_idx];
      map[r_freeCell.x][r_freeCell.y] = "<";
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
    if (GameWorld.maps[Game.current_depth][x][y] === "+" || GameWorld.maps[Game.current_depth][x][y] === "X") {
      return false;
    } else {
      return true;
    }
  },
  draw: function () {
    this.maps[Game.current_depth].forEach((element, x) => {
      element.forEach((element, y) => {
        Display.draw(x, y, element, colors[element] || "red");
      });
    });
  }
};

// create the player
let Player = {
  x: null,
  y: null,
  depth: null,
  init: function () {
    let playerStart = GameWorld.freeCells[Game.current_depth][0]; // put the player in the first available freecell
    this.x = playerStart.x;
    this.y = playerStart.y;
    this.depth = 0;
    console.log("Depth " + Game.current_depth);
  },
  draw: function () {
    Display.draw(this.x, this.y, "@", "black");
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

    // make it end when the rocket reaches the earth
    if (GameWorld.maps[Game.current_depth][this.x][this.y] === ">") {
      Game.endGame();
      this.depth++;
      Game.current_depth++; // used to check enemy depth
      //Game.createLevel();
      this.init();
    } else if (GameWorld.maps[Game.current_depth][this.x][this.y] === "<") {
      Game.endGame();
      this.depth--;
      Game.current_depth--; // used to check enemy depth
      //Game.createLevel();
      this.init();
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
    if (GameWorld.isPassable(this.x + diff[0], this.y + diff[1])) {
      this.x += diff[0];
      this.y += diff[1];
      this.justMoved = true;
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

window.onload = Game.init();
window.focus();
