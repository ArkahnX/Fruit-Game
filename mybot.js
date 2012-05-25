var GLOBAL = {
	destinations: null,
	moves: null,
	i: -1
}
function flatten( oArray ) {
  var retVal = [];
  for (var i=0;i<oArray.length;i++) {
    if (!isArray( oArray[i]) ) {
      retVal.push( oArray[i] );
    } else {
      var tempFlatt = flatten(oArray[i]);
      for (var j=0;j<tempFlatt.length;j++) {
        retVal.push( tempFlatt[j] );
      }
    }
  }
  return retVal;
}
clean = function(array,deleteValue) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == deleteValue) {
      array.splice(i, 1);
      i--;
    }
  }
  return array;
};


function isArray( anElement ) {
  return (typeof anElement=="object" && anElement.constructor == Array);
}
function new_game() {
	// console.log(move_list());
}

function make_move() {
	var board = get_board();
	var fruits = []
	var allfruits = 0;
	for(var i=0;i<get_number_of_item_types();i++) {
		fruits.push(get_total_item_count(i+1));
		allfruits += get_total_item_count(i+1);
	}
	if(allfruits) {
	var up = NORTH;
	var down = SOUTH;
	var left = WEST;
	var right = EAST;
	if(!GLOBAL.destinations) {
		GLOBAL.destinations = move_list();
		console.log(GLOBAL.destinations)
	}
	var destinationX = GLOBAL.destinations[0].x;
	var destinationY = GLOBAL.destinations[0].y;
	var my = {
		x:get_my_x(),
		y:get_my_y()
	};
	var their = {
		x:get_opponent_x(),
		y:get_opponent_y()
	};

	//bugfix: enemy took my fruit! >:(
	//bugfix 2!: has_item appears to be based off of the initial map. LIES! So instead we refer to local board, which is kind enough to update itself.
	if(board[destinationX][destinationY] === 0) {
		console.log("jacked")
		GLOBAL.destinations = move_list();
	}
	// we found an item! take it!
	if (board[my.x][my.y] > 0) {
		delete GLOBAL.destinations[0];
			GLOBAL.destinations = clean(GLOBAL.destinations);
		// GLOBAL.destinations = move_list();
		console.log("take")
		 return TAKE;
	}
		if(my.x === destinationX && my.y === destinationY) {
			delete GLOBAL.destinations[0];
			GLOBAL.destinations = clean(GLOBAL.destinations);
		}
	if(my.x < destinationX) {
		console.log("right")
		return right;
	}
	if(my.x > destinationX) {
		console.log("left")
		return left;
	}
	if(my.y < destinationY) {
		console.log("down")
		return down;
	}
	if(my.y > destinationY) {
		console.log("up")
		return up;
	}

	// console.log("PASS",nearest(),my,get_my_x(),get_my_y())
	return PASS;
}
}
function nearest() {
	var paths = branch();
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
function move_list() {
	var min = function(arr) {
		var min = arr[0];
		var len = arr.length;
		for (var i = 1; i < len; i++) {
			if (arr[i].length < min.length) {
				min = arr[i];
			}
		}
		console.log(min)
		return min;
	}
	var sort_by = function(field, reverse, primer) {
		var key = function (x) {return primer ? primer(x[field]) : x[field]};
		return function (a,b) {
			var A = key(a), B = key(b);
			return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];
		}
	}
	var fruitList = [];
	var xlength = get_board().length;
	var ylength = get_board()[0].length;
	for(var i=0;i<xlength;i++){
		for(var q=0;q<ylength;q++){
			// Checks each space for a fruit
			if (get_board()[i][q] !== 0) {
				fruitList.push(AStar(get_board(), [get_my_x(),get_my_y()], [i,q], "Manhattan"));
			}
		}
	}
	var sorted = [];
	var length = fruitList.length;
	console.log(fruitList)
	for(var i=0;i<length;i++) {
		var smallest = min(fruitList);
		sorted.push(smallest[smallest.length-1]);
		delete fruitList[fruitList.indexOf(smallest)];
		fruitList = clean(fruitList);
	}
	console.log(sorted)
	return sorted;
}
function destination_list() {
	var destinations = [];
	var xlength = get_board().length;
	var ylength = get_board()[0].length;
	for(var i=0;i<xlength;i++){
		for(var q=0;q<ylength;q++){
			// Checks each space for a fruit
			if (get_board()[i][q] !== 0) {
				destinations.push({x:i,y:q});
			}
		}
	}
	destinations = destinations.sort(function(a, b) {
		return a - b;
	});
	destinations = destinations.reverse();
	return flatten(destinations);
}
function branch() {
	var board = get_board();
	var fruits = []
	var allfruits = 0;
	for(var i=0;i<get_number_of_item_types();i++) {
		fruits.push(get_total_item_count(i+1));
		allfruits += get_total_item_count(i+1);
	}
	var top = 0;
	var left = 0;
	var right = board.length;
	var bottom = board[0].length;
	var visited = [];
	var found = [];
	var moveList = {};
	var u = d = l = r = 0;
	var hasFruit = function(x,y) {
		if (board[x][y] > 0) {
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
	move(get_my_x(),get_my_y(),0);
	// console.log(allfruits,found.length,fruits,moveList)
	return found;
}
//branch(get_my_x(),get_my_y())


// (C) Andrea Giammarchi
//  Special thanks to Alessandro Crugnola [www.sephiroth.it]
function AStar(Grid, Start, Goal, Find) {
	function AStar() {
		switch(Find) {
		case "Diagonal":
		case "Euclidean":
			Find = DiagonalSuccessors;
			break;
		case "DiagonalFree":
		case "EuclideanFree":
			Find = DiagonalSuccessors$;
			break;
		default:
			Find = function () {};
			break;
		};
	};
	function $Grid(x, y) {
		// return Grid[y][x] === 0;
		return true;
	};
	function Node(Parent, Point) {
		return {
			Parent: Parent,
			value: Point.x + (Point.y * cols),
			x: Point.x,
			y: Point.y,
			f: 0,
			g: 0
		};
	};
	function Path() {
		var $Start = Node(null, {
			x: Start[0],
			y: Start[1]
		}),
			$Goal = Node(null, {
				x: Goal[0],
				y: Goal[1]
			}),
			AStar = new Array(limit),
			Open = [$Start],
			Closed = [],
			result = [],
			$Successors, $Node, $Path, length, max, min, i, j;
		while(length = Open.length) {
			max = limit;
			min = -1;
			for(i = 0; i < length; i++) {
				if(Open[i].f < max) {
					max = Open[i].f;
					min = i;
				}
			};
			$Node = Open.splice(min, 1)[0];
			if($Node.value === $Goal.value) {
				$Path = Closed[Closed.push($Node) - 1];
				do {
					result.push({x:$Path.x, y:$Path.y});
				} while ($Path = $Path.Parent);
				AStar = Closed = Open = [];
				result.reverse();
			} else {
				$Successors = Successors($Node.x, $Node.y);
				for(i = 0, j = $Successors.length; i < j; i++) {
					$Path = Node($Node, $Successors[i]);
					if(!AStar[$Path.value]) {
						$Path.g = $Node.g + Distance($Successors[i], $Node);
						$Path.f = $Path.g + Distance($Successors[i], $Goal);
						Open.push($Path);
						AStar[$Path.value] = true;
					};
				};
				Closed.push($Node);
			};
		};
		return result;
	};
	function Successors(x, y) {
		var N = y - 1,
			S = y + 1,
			E = x + 1,
			W = x - 1,
			$N = N > -1 && $Grid(x, N),
			$S = S < rows && $Grid(x, S),
			$E = E < cols && $Grid(E, y),
			$W = W > -1 && $Grid(W, y),
			result = [];
		if($N) result.push({
			x: x,
			y: N
		});
		if($E) result.push({
			x: E,
			y: y
		});
		if($S) result.push({
			x: x,
			y: S
		});
		if($W) result.push({
			x: W,
			y: y
		});
		Find($N, $S, $E, $W, N, S, E, W, result);
		return result;
	};
	function DiagonalSuccessors($N, $S, $E, $W, N, S, E, W, result) {
		if($N) {
			if($E && $Grid(E, N)) result.push({
				x: E,
				y: N
			});
			if($W && $Grid(W, N)) result.push({
				x: W,
				y: N
			});
		};
		if($S) {
			if($E && $Grid(E, S)) result.push({
				x: E,
				y: S
			});
			if($W && $Grid(W, S)) result.push({
				x: W,
				y: S
			});
		};
	};
	function DiagonalSuccessors$($N, $S, $E, $W, N, S, E, W, result) {
		$N = N > -1;
		$S = S < rows;
		$E = E < cols;
		$W = W > -1;
		if($E) {
			if($N && $Grid(E, N)) result.push({
				x: E,
				y: N
			});
			if($S && $Grid(E, S)) result.push({
				x: E,
				y: S
			});
		};
		if($W) {
			if($N && $Grid(W, N)) result.push({
				x: W,
				y: N
			});
			if($S && $Grid(W, S)) result.push({
				x: W,
				y: S
			});
		};
	};
	function Diagonal(Point, Goal) {
		return max(abs(Point.x - Goal.x), abs(Point.y - Goal.y));
	};
	function Euclidean(Point, Goal) {
		return sqrt(pow(Point.x - Goal.x, 2) + pow(Point.y - Goal.y, 2));
	};
	function Manhattan(Point, Goal) {
		return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
	};
	var abs = Math.abs,
		max = Math.max,
		pow = Math.pow,
		sqrt = Math.sqrt,
		cols = Grid[0].length,
		rows = Grid.length,
		limit = cols * rows,
		Distance = {
			Diagonal: Diagonal,
			DiagonalFree: Diagonal,
			Euclidean: Euclidean,
			EuclideanFree: Euclidean,
			Manhattan: Manhattan
		}[Find] || Manhattan;
	return Path(AStar());
};
/*td.onclick = function () {
	var endPoint = [this.x, this.y],
		bench = (new Date()).getTime(),
		result = AStar(grid, startPoint, endPoint, "Manhattan"),
		endTime = (new Date()).getTime() - bench;
	if(table.last.first) {
		table.last.remonmouseout = this.onmouseout;
		table.last.remonmouseover = this.onmouseover;
		table.last.remonclick = this.onclick;
	};
	table.last.onmouseout = table.last.remonmouseout;
	table.last.onmouseover = table.last.remonmouseover;
	table.last.onclick = table.last.remonclick;
	table.last = this;
	ClearEvents(tdList);
	document.getElementById("result").innerHTML = "".concat("Time (ms): <strong>", endTime, "</strong><br />", result.length === 0 ? "<strong>No Match</strong>" : "Path Length: <strong>" + result.length + "</strong>");
	for(var x, y, i = 0, j = result.length; i < j; i++) {
		x = result[i][0];
		y = result[i][1];
		tdList[y][x].x = x;
		tdList[y][x].y = y;
		tdList[y][x].i = i;
		tdList[y][x].last = j - 1;
		tdList[y][x].onmouseout = null;
		tdList[y][x].change = function () {
			var self = this;
			this.change = function () {
				setTimeout(function () {
					self.className = "over";
					setTimeout(function () {
						self.className = "";
						if(self.i === self.last) {
							ClearGrid(tdList);
							startPoint = [self.x, self.y];
							self.className = "start-point";
							self.onmouseover = self.onmouseout = self.onclick = null;
						};
					}, self.i * 20);
				}, 500);
			};
			setTimeout(function () {
				self.className = "over2";
				self.change();
			}, self.i * 20);
		};
		tdList[y][x].change();
	};
	if(result.length === 0) {
		this.className = "";
		ClearGrid(tdList);
	};
};*/