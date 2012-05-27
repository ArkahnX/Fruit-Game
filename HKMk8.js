// http://www.scribd.com/jobs/botrace_bot/478
//define functions to make jslint happy
var get_number_of_item_types = get_number_of_item_types;
var get_total_item_count = get_total_item_count;
var get_board = get_board;
var get_my_x = get_my_x;
var items;
var shortcutItems;
var simpleList = [];
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
// priority levels
// null pick everything
// false head to target
// true head directly to target
var priority = false;

function new_game() {
	var itemAmounts = [];
	simpleList = [];
	fruits = {
		types: 0,
		all: 0,
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0
	};
	priority = false;
	fruits.types = get_number_of_item_types();
	myVictory = minForVictory[fruits.types];
	for (var i = 0; i < fruits.types; i++) {
		fruits[i + 1] = get_total_item_count(i + 1);
		itemAmounts.push(get_total_item_count(i + 1));
	}
	var sorted = itemAmounts.sort();
	shortcutItems = [];
	for (var e = 0; e < myVictory; e++) {
		shortcutItems.push(itemAmounts.indexOf(sorted[e]) + 1);
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
}

function my_distance(x, y, myX, myY) {
	var mx = myX || get_my_x();
	var my = myY || get_my_y();
	return Math.abs(x - mx) + Math.abs(y - my);
}

function opponent_distance(x, y) {
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
	for (var attribute in object) {
		if (attribute === "clone") {
			continue;
		}
		if (object[attribute] && typeof object[attribute] === "object") {
			newObj[attribute] = clone(object[attribute]);
		} else {
			newObj[attribute] = object[attribute];
		}
	}
	return newObj;
}

function sort(array) {
	var clonedArray = clone(array);
	var length = array.length;
	var newArray = [];
	for (var i = 0; i < length; i++) {
		newArray.push([]);
		for (var z = 0; z < array[i].length; z++) {
			var distance = my_distance(clonedArray[i][0].x, clonedArray[i][0].y);
			var minIndex = 0;
			for (var e = 1; e < array[i].length; e++) {
				if (clonedArray[i][e]) {
					var newDistance = my_distance(clonedArray[i][e].x, clonedArray[i][e].y);
					if (newDistance < distance) {
						distance = newDistance;
						minIndex = e;
					}
					if (distance === newDistance) {
						// get the one the enemy is closer to if we can reach it
						var enemyDistance = opponent_distance(clonedArray[i][e].x, clonedArray[i][e].y);
						if (newDistance <= enemyDistance) {
							distance = newDistance;
							minIndex = e;
						}
					}
				}
			}
			newArray[newArray.length - 1].push(clonedArray[i][minIndex]);
			clonedArray[i].splice(minIndex, 1);
		}
	}
	return newArray;
}

function itemLocations() {
	var locationsArray = [];
	var cleanArray = [];
	var minArray = [];
	var shouldReturns = [];
	var board = get_board();
	var xlength = board.length;
	var ylength = board[0].length;
	simpleList = [];
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
	for (var e = 0; e < fruits.types; e++) {
		if (locationsArray[e]) {
			cleanArray.push([]);
			for (var w = 0; w < locationsArray[e].length; w++) {
				cleanArray[cleanArray.length - 1].push(locationsArray[e][w]);
			}
		}
	}
	cleanArray = sort(cleanArray);
	// only collect the minimum amount
	for (var t = 0; t < fruits.types; t++) {
		if (cleanArray[t]) {
			shouldReturns.push(shouldCollect(cleanArray[t][0].fruit));
			// if there are more than half of the fruit on the board we will continue
			if (shouldCollect(cleanArray[t][0].fruit, true)) {
				minArray.push([]);
				for (var r = 0; r < cleanArray[t].length; r++) {
					// continue if we have less than half of the fruits
					// we have to reference [t+1] because we removed one index value in the previous loop
					if (minArray[minArray.length - 1].length < Math.ceil(fruits[t + 1] / 2)) {
						minArray[minArray.length - 1].push(cleanArray[t][r]);
						simpleList.push(cleanArray[t][r].x+","+cleanArray[t][r].y);
					}
				}
			}
		}
	}
	// bugfix for resetting game
	if (minArray.length > 0 && minArray[0][0].fruit === 1) {
		priority = false;
	} else {
		priority = null;
	}
	//lastly prioritize items that we almost have the correct ammount
	for (var a = 0; a < minArray.length; a++) {
		var spliced;
/*if (get_opponent_item_count(minArray[a][0].fruit) + 1 >= remaining(minArray[a][0].fruit) / 2 && get_opponent_item_count(minArray[a][0].fruit) < remaining(minArray[a][0].fruit) / 2) {
			priority = true;
			spliced = minArray.splice(a, 1);
			minArray.splice(0, 0, spliced[0]);
		} else */
		if (minArray[a].length === 1 && minArray[a][0].fruit !== 1 && minArray[0].length !== 1 && shouldCollect(minArray[a][0].fruit)) {
			priority = true;
			spliced = minArray.splice(a, 1);
			minArray.splice(0, 0, spliced[0]);
		}
	}
	if (minArray.length > 0) {
		// console.log(shouldCollect(min(minArray).fruit),remaining(min(minArray).fruit), priority,min(minArray).fruit, toVictory(minArray), minArray);
		// console.log(simpleList,minArray)
	}
	return minArray;
}

function remaining(item) {
	return fruits[item] - get_my_item_count(item) - get_opponent_item_count(item);
}

function toVictory(array) {
	var victory = [];
	for(var i=0;i<array.length;i++) {
		if(victory.length <= myVictory) {
			var thisFruit = array[i][0].fruit;
			var halfWay = Math.ceil(fruits[thisFruit] / 2);
			if(get_my_item_count(thisFruit) < halfWay && get_opponent_item_count(thisFruit) < halfWay) {
				victory.push(array[i]);
			}
		}
	}
	return victory;
}

function shouldCollect(item, simple) {
	//should return false if more than half of the items are picked up
	if (get_opponent_item_count(item) >= Math.ceil(fruits[item] / 2)) {
		return false;
	}
	if (get_my_item_count(item) >= Math.ceil(fruits[item] / 2)) {
		return false;
	}
	// we only want to prioritize the minimum amount of items
	if (item <= myVictory || simple) {
		if (get_my_item_count(item) + remaining(item) >= Math.ceil(fruits[item] / 2)) {
			priority = true;
			return true;
		}
		return true;
	}
	return false;
}
function indexOf(x,y) {
	for(var i=0;i<simpleList.length;i++) {
		var string = simpleList[i].split(",");
		if(parseInt(string[0],10) === x && parseInt(string[1],10) === y) {
			return true;
		}
	}
	return false;
}

function nearMe() {
	var finds = 0;
	var findsLocations = [];
	var destination = min(itemLocations());
	var destinationx = destination.x;
	var destinationy = destination.y;
	var destinationDistance = my_distance(destinationx,destinationy);
	var x = get_my_x();
	var y = get_my_y();
	var minx = x - 2;
	var maxx = x + 2;
	var miny = y - 2;
	var maxy = y + 2;
	var board = get_board();
	for (var i = minx; i <= maxx; i++) {
		for (var e = miny; e <= maxy; e++) {
			if (board[i] && board[i][e]) {
				if (board[i][e] > 0) {
					if(indexOf(i,e)) {
						finds = finds+1;
						findsLocations.push([i,e]);
					}
				}
			}
		}
	}
	for(var r=0;r<findsLocations.length;r++) {
		if(my_distance(destinationx,destinationy,findsLocations[r][0],findsLocations[r][1]) < destinationDistance) {
			destinationDistance = my_distance(destinationx,destinationy,findsLocations[r][0],findsLocations[r][1]);
			destination.x = findsLocations[r][0];
			destination.y = findsLocations[r][1];
		}
	}
	return destination;
}

function make_move() {
	items = itemLocations();
	if (items.length) {
		var board = get_board();
		items = itemLocations();
		var index = min(items);
		if (!index) {
			return PASS;
		}
		var targetx = index.x;
		var targety = index.y;
		var x = get_my_x();
		var y = get_my_y();
		// we found an item! take it!
		if (board[x][y] > 0 && (priority !== true || shouldCollect(board[x][y]))) {
			return TAKE;
		}
		if (x === targetx && y === targety) {
			priority = null;
			return TAKE;
		}
		if (board[x + 1] && board[x + 1][y] > 0 && shouldCollect(board[x + 1][y]) && ((priority !== false && priority !== true) || shouldCollect(board[x][y]))) return EAST;
		if (board[x - 1] && board[x - 1][y] > 0 && shouldCollect(board[x - 1][y]) && ((priority !== false && priority !== true) || shouldCollect(board[x][y]))) return WEST;
		if (board[x][y + 1] && board[x][y + 1] > 0 && shouldCollect(board[x][y + 1]) && ((priority !== false && priority !== true) || shouldCollect(board[x][y]))) return SOUTH;
		if (board[x][y - 1] && board[x][y - 1] > 0 && shouldCollect(board[x][y - 1]) && ((priority !== false && priority !== true) || shouldCollect(board[x][y]))) return NORTH;
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
	if (array[0]) {
		var distance = my_distance(array[0][0].x, array[0][0].y);
		var minIndex = 0;
		for (var i = 1; i < array[0].length; i++) {
			var newDistance = my_distance(array[0][i].x, array[0][i].y);
			if (newDistance < distance && shouldCollect(board[array[0][i].x][array[0][i].y])) {
				distance = newDistance;
				minIndex = i;
			}
		}
		return array[0][minIndex];
	}
	return false;
}