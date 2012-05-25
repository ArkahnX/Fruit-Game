function new_game() {
	items = itemLocations();
}
var previousGrabbedItems = 0;
var items = [];
function itemTaken() {
	var itemTypes = get_number_of_item_types();
	var grabbedItems = 0;
	for(var i=0;i<itemTypes;i++) {
		grabbedItems = grabbedItems+get_my_item_count(i+1);
		grabbedItems = grabbedItems+get_opponent_item_count(i+1);
	}
	if(grabbedItems > previousGrabbedItems) {
		previousGrabbedItems = grabbedItems;
		return true;
	}
	return false;
}
function itemLocations() {
	var locationsArray = [];
	var board = get_board();
	var xlength = board.length;
	var ylength = board[0].length;
	for(var i=0;i<xlength;i++){
		for(var q=0;q<ylength;q++){
			if (board[i][q] != 0) {
				locationsArray.push([i,q]);
			}
		}
	}
	return locationsArray;
}
function make_move() {
	var board = get_board();
	if(itemTaken()) {
		items = itemLocations();
	}
	// we found an item! take it!
	if (board[get_my_x()][get_my_y()] > 0) {
		return TAKE;
	}
	// Searching for a target fruit
	for(var i=0;i<xlength;i++){
		for(var q=0;q<ylength;q++){
			// Checks each space for a fruit
			if (board[i][q] != 0) {
				// Finds the x and y distances from the robot
				distx = Math.abs(i-get_my_x());
				disty = Math.abs(q-get_my_y());
				// Finds the direct distance from the robot
				distz = Math.sqrt(distx*distx + disty+ disty);
				// Saves only the SMALLEST distance
				if (distz < minz) {
					minz = distz;
					// Saves the coordinates of the closest one
					minx = i;
					miny = q;
				}
			}
		}
	}
	// Takes the resulting one
	targetx = minx;
	targety = miny;
	// Movement
	if (get_my_y() > targety) return NORTH;
	if (get_my_y() < targety) return SOUTH;
	if (get_my_x() < targetx) return EAST;
	if (get_my_x() > targetx) return WEST;
	return PASS;
}
function min() {
	var min = (get_my_x()-items[0][0])+(get_my_y()-items[0][1]);
	var minIndex = 0;
	for(var i=1;i<items.length;i++) {
		var newMin = (get_my_x()-items[0][0])+(get_my_y()-items[0][1]);
		if(newMin < min) {
			min = newMin;
			minIndex = i;
		}
	}
}