function new_game() {
}
var items = [];
function itemLocations() {
	var locationsArray = [];
	var board = get_board();
	var xlength = board.length;
	var ylength = board[0].length;
	for(var i=0;i<xlength;i++){
		for(var q=0;q<ylength;q++){
			if (board[i][q] === 1 || board[i][q] === 2) {
				locationsArray.push([i,q]);
			}
		}
	}
	if(locationsArray.length === 0) {
		for(var i=0;i<xlength;i++){
			for(var q=0;q<ylength;q++){
				if (board[i][q] !== 0) {
					locationsArray.push([i,q]);
				}
			}
		}
	}
	return locationsArray;
}
function make_move() {
	var board = get_board();
	items = itemLocations();
	// we found an item! take it!
	if (board[get_my_x()][get_my_y()] > 0) {
		return TAKE;
	}
	var index = min();


	// Takes the resulting one
	var targetx = index[0];
	var targety = index[1];
	// Movement
	if (get_my_y() > targety) return NORTH;
	if (get_my_y() < targety) return SOUTH;
	if (get_my_x() < targetx) return EAST;
	if (get_my_x() > targetx) return WEST;
	return PASS;
}
function min() {
	var min = Math.abs(items[0][0]-get_my_x())+Math.abs(items[0][1]-get_my_y());
	var minIndex = 0;
	for(var i=1;i<items.length;i++) {
		var newMin = Math.abs(items[i][0]-get_my_x())+Math.abs(items[i][1]-get_my_y());
		// console.log(min, newMin)
		if(newMin < min) {
			min = newMin;
			minIndex = i;
		}
	}
	// console.log(items,items[minIndex])
	return items[minIndex];
}