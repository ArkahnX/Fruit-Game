var items;
var shortcutItems;
var shortcut = false;

function new_game() {
	if (fruitLeft()) {
		var shortcut = false;
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
			if (shortcut) {
				if (board[i][q] !== 0) {
					locationsArray.push([i, q]);
				}
			} else {
				if (shortcutItems.indexOf(board[i][q]) > -1) {
					locationsArray.push([i, q]);
				}
			}
		}
	}
	if (locationsArray.length === 0) {
		shortcut = true;
		return itemLocations();
	}
	return locationsArray;
}

function make_move() {
	if (fruitLeft()) {
		var board = get_board();
		// we found an item! take it!
		var index = min();
		if (board[get_my_x()][get_my_y()] > 0) {
			return TAKE;
		}
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
}

function min() {
	items = itemLocations();
	var min = Math.abs(items[0][0] - get_my_x()) + Math.abs(items[0][1] - get_my_y());
	var minIndex = 0;
	for (var i = 1; i < items.length; i++) {
		var newMin = Math.abs(items[i][0] - get_my_x()) + Math.abs(items[i][1] - get_my_y());
		if (newMin < min) {
			min = newMin;
			minIndex = i;
		}
	}
	return items[minIndex];
}