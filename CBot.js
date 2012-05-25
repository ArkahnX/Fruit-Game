function new_game() {
	var board = get_board();
	var fruits = {length:0};
	for(var attr in get_number_of_item_types()) {
		fruits[attr] = get_number_of_item_types(attr);
		fruits.length++;
	}
}

function make_move() {
	var up = NORTH;
	var down = SOUTH;
	var left = WEST;
	var right = EAST;
	var board = get_board();
	var my = {
		x:get_my_x(),
		y:get_my_y()
	};
	var their = {
		x:get_opponent_x(),
		y:get_opponent_y()
	};
	for(var i=0;i<board.length;i++) {
		for(var e=0;e<board.length;e++) {

		}
	}

	// we found an item! take it!
	if (board[my.x][my.y] > 0) {
		 return TAKE;
	}

	var rand = Math.random() * 4;

	if (rand < 1) return NORTH;
	if (rand < 2) return SOUTH;
	if (rand < 3) return EAST;
	if (rand < 4) return WEST;

	return PASS;
}
function branch(tree,x,y) {
	var top = 0;
	var left = 0;
	var right = tree.length;
	var bottom = tree[0].length;
	var visited = [];
	var found = [];
	var u = d = l = r = 0;
	var hasFruit = function(x,y) {
		if (tree[x][y] > 0) {
			return true;
		}
		return false;
	};
	var move = function(x,y,moves) {
		// left
		if(visited.indexOf(""+(x-1)+y) === -1 && (x-1) > left) {
			var newX = x-1;
			var newY = y;
			console.log(newX,newY,"left")
			visited.push(""+newX+newY);
			if(hasFruit(newX,newY)) {
				found.push({moves:moves+1,x:newX,y:newY});
			}
			move(newX,newY,moves+1);
		}
		// right
		if(visited.indexOf(""+(x+1)+y) === -1 && (x+1) < right) {
			var newX = x+1;
			var newY = y;
			console.log(newX,newY,"right")
			visited.push(""+newX+newY);
			if(hasFruit(newX,newY)) {
				found.push({moves:moves+1,x:newX,y:newY});
			}
			move(newX,newY,moves+1);
		}
		// up
		if(visited.indexOf(""+x+(y-1)) === -1 && (y-1) > up) {
			var newX = x;
			var newY = y-1;
			console.log(newX,newY,"up")
			visited.push(""+newX+newY);
			if(hasFruit(newX,newY)) {
				found.push({moves:moves+1,x:newX,y:newY});
			}
			move(newX,newY,moves+1);
		}
		// down
		if(visited.indexOf(""+x+(y+1)) === -1 && (y+1) < down) {
			var newX = x;
			var newY = y+1;
			console.log(newX,newY,"down")
			visited.push(""+newX+newY);
			if(hasFruit(newX,newY)) {
				found.push({moves:moves+1,x:newX,y:newY});
			}
			move(newX,newY,moves+1);
		}
	};
	move(x,y,0);
	return found;
}
//branch(get_board(),get_my_x(),get_my_y())