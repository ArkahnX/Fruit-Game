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
var priority = false;

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

function clean(array, deleteValue) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == deleteValue) {
			array.splice(i, 1);
			i--;
		}
	}
	return array;
};

function distance(x, y) {
	return Math.abs(x - get_my_x()) + Math.abs(y - get_my_y());
}

function typeOf(value) {
	var s = typeof value;
	if (s === "object") {
		if (value) {
			if (value instanceof Array) {
				s = "array";
			}
		} else {
			s = "null";
		}
	}
	return s;
}

function clone(object) {
	var newObj = (object instanceof Array) ? [] : {};
	for (i in object) {
		if (i === "clone") {
			continue;
		}
		if (object[i] && typeof object[i] === "object") {
			newObj[i] = clone(object[i]);
		} else {
			newObj[i] = object[i];
		}
	}
	return newObj;
};

function sort(array) {
	var arrayClone = clone(array);
	var length = array.length;
	var newArray = [];
	for (var i = 0; i < length; i++) {
		newArray.push([]);
		for (var z = 0; z < array[i].length; z++) {
			var min = Math.abs(arrayClone[i][0].x - get_my_x()) + Math.abs(arrayClone[i][0].y - get_my_y());
			var minIndex = 0;
			for (var e = 1; e < array[i].length; e++) {
				if (arrayClone[i][e]) {
					var newMin = Math.abs(arrayClone[i][e].x - get_my_x()) + Math.abs(arrayClone[i][e].y - get_my_y());
					if (newMin < min) {
						min = newMin;
						minIndex = e;
					}
				}
			}
			newArray[newArray.length - 1].push(arrayClone[i][minIndex])
			arrayClone[i].splice(minIndex, 1);
		}
	}
	return newArray
}

function itemLocations() {
	var locationsArray = [];
	var cleanArray = [];
	var minArray = [];
	var shouldReturns = [];
	var board = get_board();
	var xlength = board.length;
	var ylength = board[0].length;
	//save every fruit and its location to an array
	for (var i = 0; i < xlength; i++) {
		for (var q = 0; q < ylength; q++) {
			if (board[i][q] > 0) {
				// save fruit as name-1 so it can be accessed from 0-4
				if (!locationsArray[board[i][q] - 1]) {
					locationsArray[board[i][q] - 1] = [];
				}
				locationsArray[board[i][q] - 1].push({
					x: i,
					y: q,
					fruit: board[i][q]
				});
			}
		}
	}
	//clean the above array for proper usage
	for (var i = 0; i < fruits.types; i++) {
		if (locationsArray[i]) {
			cleanArray.push([]);
			for (var e = 0; e < locationsArray[i].length; e++) {
				cleanArray[cleanArray.length - 1].push(locationsArray[i][e]);
			}
		}
	}
	cleanArray = sort(cleanArray);
	// sort by priority
	for (var i = 0; i < fruits.types; i++) {
		if (cleanArray[i]) {
			shouldReturns.push(shouldCollect(cleanArray[i][0].fruit, true))
			// if there are more than half of the fruit on the board we will continue
			if (shouldCollect(cleanArray[i][0].fruit, true)) {
				minArray.push([]);
				for (var e = 0; e < cleanArray[i].length; e++) {
					// continue if we have less than half of the fruits
					// we have to reference [i+1] because we removed one index value in the previous loop
					if (minArray[minArray.length - 1].length < Math.ceil(fruits[i + 1] / 2)) {
						minArray[minArray.length - 1].push(cleanArray[i][e]);
					}
				}
			}
		}
	}
	//lastly prioritize items that we almost have the correct ammount
	for (var i = 0; i < minArray.length; i++) {
		if (minArray[i].length === 1 && minArray[i][0].fruit !== 1 && minArray[0].length !== 1 && shouldCollect(minArray[i][0].fruit)) {
			var spliced = minArray.splice(i, 1);
			minArray.splice(0, 0, spliced[0]);
			priority = true;
		}
	}
	return minArray;
}

function shouldCollect(item, simple) {
	// we only want to prioritize the minimum amount of items
	if (item <= myVictory || simple) {
		//should return false if more than half of the items are picked up
		if (get_my_item_count(item) > Math.ceil(fruits[item] / 2) || get_opponent_item_count(item) > Math.ceil(fruits[item] / 2)) {
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
		items = itemLocations();
		var index = min(items);
		var targetx = index.x;
		var targety = index.y;
		var x = get_my_x();
		var y = get_my_y();
		// we found an item! take it!
		if (board[x][y] > 0 && !priority) {
			return TAKE;
		}
		if (x === targetx && y === targety) {
			priority = false;
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

function min(array) {
	var board = get_board();
	var min = Math.abs(array[0][0].x - get_my_x()) + Math.abs(array[0][0].y - get_my_y());
	var minIndex = 0;
	for (var i = 1; i < array[0].length; i++) {
		var newMin = Math.abs(array[0][i].x - get_my_x()) + Math.abs(array[0][i].y - get_my_y());
		if (newMin < min && shouldCollect(board[array[0][i].x][array[0][i].y])) {
			min = newMin;
			minIndex = i;
		}
	}
	return array[0][minIndex];
}