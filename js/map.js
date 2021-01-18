/*class GameMap {
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
}*/