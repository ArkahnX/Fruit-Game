// http://www.scribd.com/jobs/botrace_bot/315
var items;
var shortcutItems;
var fruits = {
	types: 0,
	all: 0,
	1: 0,
	2: 0,
	3: 0,
	4: 0,
	5: 0
};
var minForVictory = {
	3: 2,
	4: 3,
	5: 3
};
var myVictory = 0;

function new_game() {
	fruits = {
		types: 0,
		all: 0,
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0
	};
	var itemAmounts = [];
	fruits.types = get_number_of_item_types();
	myVictory = minForVictory[fruits.types];
	for (var i = 0; i < fruits.types; i++) {
		fruits[i + 1] = get_total_item_count(i + 1);
		itemAmounts.push(get_total_item_count(i + 1));
	}
	var sorted = itemAmounts.sort();
	shortcutItems = [];
	for (var i = 0; i < myVictory; i++) {
		shortcutItems.push(itemAmounts.indexOf(sorted[i]) + 1);
	}
	items = itemLocations();
}


function itemLocations() {
	var locationsArray = [];
	var board = get_board();
	var xlength = board.length;
	var ylength = board[0].length;
	for (var i = 0; i < xlength; i++) {
		for (var q = 0; q < ylength; q++) {
			if (board[i][q] > 0) {
				if (shouldCollect(board[i][q], true)) {
					if (!locationsArray[board[i][q] - 1]) {
						locationsArray[board[i][q] - 1] = [];
					}
					if (locationsArray[board[i][q] - 1].length < Math.ceil(fruits[board[i][q]] / 2)) {
						locationsArray[board[i][q] - 1].push([i, q, board[i][q]]);
					}
				}
			}
		}
	}
	var newLocations = [];
	for (var i = 0; i < locationsArray.length; i++) {
		if (locationsArray[i]) {
			newLocations.push(locationsArray[i]);
		}
	}
	return newLocations;
}

function shouldCollect(item, simple) {
	if (item <= myVictory || simple) {
		if (get_my_item_count(item) > Math.ceil(fruits[item] / 2) || get_my_item_count(item) > Math.ceil(fruits[item] / 2)) {
			return false;
		}
		return true;
	}
	return false;
}

function make_move() {
	items = itemLocations();
	if (items.length) {
		var board = get_board();
		var index = min();
		var targetx = index[0];
		var targety = index[1];
		var x = get_my_x();
		var y = get_my_y();
		// we found an item! take it!
		if (board[x][y] > 0) {
			return TAKE;
		}
		if (x === targetx && y === targety) {
			return TAKE;
		}
		if (board[x + 1] && board[x + 1][y] > 0 && shouldCollect(board[x + 1][y])) return EAST;
		if (board[x - 1] && board[x - 1][y] > 0 && shouldCollect(board[x - 1][y])) return WEST;
		if (board[x][y + 1] && board[x][y + 1] > 0 && shouldCollect(board[x][y + 1])) return SOUTH;
		if (board[x][y - 1] && board[x][y - 1] > 0 && shouldCollect(board[x][y - 1])) return NORTH;
		// Movement
		if (y > targety) return NORTH;
		if (y < targety) return SOUTH;
		if (x < targetx) return EAST;
		if (x > targetx) return WEST;
	}
	return PASS;
}

function min() {
	var board = get_board();
	items = itemLocations();
	var min = Math.abs(items[0][0][0] - get_my_x()) + Math.abs(items[0][0][1] - get_my_y());
	var minIndex = 0;
	for (var i = 1; i < items[0].length; i++) {
		var newMin = Math.abs(items[0][i][0] - get_my_x()) + Math.abs(items[0][i][1] - get_my_y());
		if (newMin < min && shouldCollect(board[items[0][i][0]][items[0][i][1]])) {
			min = newMin;
			minIndex = i;
		}
	}
	return items[0][minIndex];
}