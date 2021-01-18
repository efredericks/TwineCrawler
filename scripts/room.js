/*// Class that outlines a room
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
		this.blocked     = true;
		
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
}*/