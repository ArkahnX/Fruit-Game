var GLOBAL = {
	nextFruit: null
}
function new_game() {
	var board = get_board();
	var fruits = []
	var allfruits = 0;
	for(var i=0;i<get_number_of_item_types();i++) {
		fruits.push(get_total_item_count(i+1));
		allfruits += get_total_item_count(i+1);
	}
	GLOBAL.nextFruit = nearest();
}

function make_move() {
	var board = get_board();
	var nextFruit = nearest();
	var up = NORTH;
	var down = SOUTH;
	var left = WEST;
	var right = EAST;
	var my = {
		x:get_my_x(),
		y:get_my_y()
	};
	var their = {
		x:get_opponent_x(),
		y:get_opponent_y()
	};
	// we found an item! take it!
	if (board[my.x][my.y] > 0) {
		GLOBAL.nextFruit = nearest();
		 return TAKE;
	}
	if(my.x < GLOBAL.nextFruit[0]) {
		return right;
	}
	if(my.x > GLOBAL.nextFruit[0]) {
		return left;
	}
	if(my.y < GLOBAL.nextFruit[1]) {
		return down;
	}
	if(my.y > GLOBAL.nextFruit[1]) {
		return up;
	}

	return PASS;
}
function nearest() {
	var paths = branch(get_board(),get_my_x(),get_my_y());
	var min = function(arr) {
		var min = arr[0];
		var len = arr.length;
		for (var i = 1; i < len; i++) {
			if (arr[i] < min) {
				min = arr[i];
			}
		}
		return min;
	}
	var moves = [];
	for(var i=0;i<paths.length;i++) {
		moves.push(paths[i].moves);
	}

	return [min(paths).x,min(paths).y];
}
function branch(tree,x,y) {
	var board = get_board();
	var fruits = []
	var allfruits = 0;
	for(var i=0;i<get_number_of_item_types();i++) {
		fruits.push(get_total_item_count(i+1));
		allfruits += get_total_item_count(i+1);
	}
	var top = 0;
	var left = 0;
	var right = tree.length;
	var bottom = tree[0].length;
	var visited = [];
	var found = [];
	var moveList = {};
	var u = d = l = r = 0;
	var hasFruit = function(x,y) {
		if (tree[x][y] > 0) {
			return true;
		}
		return false;
	};
	var move = function(x,y,moves) {
		var canMove = {
			up:false,
			left:false,
			right:false,
			down:false
		};
		// left
		if(visited.indexOf(""+(x-1)+y) === -1 && (x-1) > left-1) {
			var newX = x-1;
			var newY = y;
			visited.push(""+newX+newY);
			if(!moveList[moves+1]) {
				moveList[moves+1] = [];
			}
			moveList[moves+1].push({moves:moves+1,x:newX,y:newY})
			if(hasFruit(newX,newY)) {
				found.push({moves:moves+1,x:newX,y:newY});
			}
			canMove.left = true;
		}
		// right
		if(visited.indexOf(""+(x+1)+y) === -1 && (x+1) < right) {
			var newX = x+1;
			var newY = y;
			visited.push(""+newX+newY);
			if(!moveList[moves+1]) {
				moveList[moves+1] = [];
			}
			moveList[moves+1].push({moves:moves+1,x:newX,y:newY})
			if(hasFruit(newX,newY)) {
				found.push({moves:moves+1,x:newX,y:newY});
			}
			canMove.right = true;
		}
		// up
		if(visited.indexOf(""+x+(y-1)) === -1 && (y-1) > top-1) {
			var newX = x;
			var newY = y-1;
			visited.push(""+newX+newY);
			if(!moveList[moves+1]) {
				moveList[moves+1] = [];
			}
			moveList[moves+1].push({moves:moves+1,x:newX,y:newY})
			if(hasFruit(newX,newY)) {
				found.push({moves:moves+1,x:newX,y:newY});
			}
			canMove.up = true;
		}
		// down
		if(visited.indexOf(""+x+(y+1)) === -1 && (y+1) < bottom) {
			var newX = x;
			var newY = y+1;
			visited.push(""+newX+newY);
			if(!moveList[moves+1]) {
				moveList[moves+1] = [];
			}
			moveList[moves+1].push({moves:moves+1,x:newX,y:newY})
			if(hasFruit(newX,newY)) {
				found.push({moves:moves+1,x:newX,y:newY});
			}
			canMove.down = true;
		}
		if(canMove.left) {
			move(x-1,y,moves+1);
		}
		if(canMove.right) {
			move(x+1,y,moves+1);
		}
		if(canMove.up) {
			move(x,y-1,moves+1);
		}
		if(canMove.down) {
			move(x,y+1,moves+1);
		}
	};
	move(x,y,0);
	// console.log(allfruits,found.length,fruits,moveList)
	return found;
}
//branch(get_board(),get_my_x(),get_my_y())