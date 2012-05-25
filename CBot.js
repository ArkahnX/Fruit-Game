var items;
var shortcutItems;
var shortcut = false;

function new_game() {
	if (fruitLeft()) {
		shortcut = false;
		var itemAmounts = [];
		var itemTypes = get_number_of_item_types();
		for (var i = 0; i < itemTypes; i++) {
			itemAmounts.push(get_total_item_count(i + 1));
		}
		var sorted = itemAmounts.sort();
		shortcutItems = [];
		for (var i = 0; i < Math.ceil(itemTypes / 2); i++) {
			shortcutItems.push(itemAmounts.indexOf(sorted[i]) + 1);
		}
		items = itemLocations();
	}
}

function fruitLeft() {
	var itemTypes = get_number_of_item_types();
	var itemAmounts = 0;
	for (var i = 0; i < itemTypes; i++) {
		itemAmounts = itemAmounts + get_total_item_count(i + 1);
	}
	return itemAmounts;
}

function itemLocations() {
	var locationsArray = [];
	var board = get_board();
	var xlength = board.length;
	var ylength = board[0].length;
	for (var i = 0; i < xlength; i++) {
		for (var q = 0; q < ylength; q++) {
			if(board[i][q] > 0) {
				if(!locationsArray[board[i][q]-1]) {
					locationsArray[board[i][q]-1] = [];
				}
				locationsArray[board[i][q]-1].push([i, q]);
			}
		}
	}
	var newLocations = [];
	for (var i = 0; i < locationsArray.length; i++) {
		if(locationsArray[i]) {
			newLocations.push(locationsArray[i]);
		}
	}
	return newLocations;
}
function shouldCollect(item) {
	var itemTypes = get_number_of_item_types();
	if(item <= Math.ceil(itemTypes/2)) {
		if(get_my_item_count(item) > (get_total_item_count(item)/2) || get_my_item_count(item) > (get_total_item_count(item)/2)) {
			return false;
		}
		return true;
	}
	return false;
}

function make_move() {
	if (fruitLeft()) {
		var board = get_board();
		var index = min();
		var targetx = index[0];
		var targety = index[1];
		// we found an item! take it!
		if (board[get_my_x()][get_my_y()] > 0) {
			return TAKE;
		}
		if(get_my_x() === targetx && get_my_y() === targety) {
			return TAKE;
		}
		if(board[get_my_x()+1] && board[get_my_x()+1][get_my_y()] > 0 && shouldCollect(board[get_my_x()+1][get_my_y()])) return EAST;
		if(board[get_my_x()-1] && board[get_my_x()-1][get_my_y()] > 0 && shouldCollect(board[get_my_x()-1][get_my_y()])) return WEST;
		if(board[get_my_x()][get_my_y()+1] && board[get_my_x()][get_my_y()+1] > 0 && shouldCollect(board[get_my_x()][get_my_y()+1])) return SOUTH;
		if(board[get_my_x()][get_my_y()-1] && board[get_my_x()][get_my_y()-1] > 0 && shouldCollect(board[get_my_x()][get_my_y()-1])) return NORTH;
		// Movement
		if (get_my_y() > targety) return NORTH;
		if (get_my_y() < targety) return SOUTH;
		if (get_my_x() < targetx) return EAST;
		if (get_my_x() > targetx) return WEST;
		return PASS;
	}
}

function min() {
	items = itemLocations();
	var min = Math.abs(items[0][0][0] - get_my_x()) + Math.abs(items[0][0][1] - get_my_y());
	var minIndex = 0;
	for (var i = 1; i < items[0].length; i++) {
		var newMin = Math.abs(items[0][i][0] - get_my_x()) + Math.abs(items[0][i][1] - get_my_y());
		if (newMin < min) {
			min = newMin;
			minIndex = i;
		}
	}
	return items[0][minIndex];
}