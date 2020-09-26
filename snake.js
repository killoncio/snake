/// Status:
/// Checking setInterval. For unknown reason, this is pointing to window obj
/// when calling this.direction inside snake.move()


class Square {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	changeColor() {

	}


}


function onKeyPress(e) {

}

class Snake {

	constructor() {
		this.direction = 'down';
		this.squares = [[5,5],[6,5]];
		this.selfTouched = false;
	}

	startMoving() {
		this.moveInterval = setInterval(this.move.bind(this),100);
	}

	move(andGrow) {
		const newHeadCoords = utils.sumCoords(this.getHeadPosition(), utils.newSquare[this.direction]);

		// if (newHeadCoords in foodCoords) {
		// 	this.squares.push(newHeadCoords);
		// } else if (newHeadCoords in limitsCoords) {
		// 	game.end();
		if (utils.includes(this.squares, newHeadCoords)) {
			this.selfTouched = true;
		} else {
			if (!andGrow) {
				this.squares.shift();
			}
			this.squares.push(newHeadCoords);
		}
		console.log(`move to ${this.direction}`);
		console.log(`head in square ${this.getHeadPosition()}`);

		const event = new Event('moved');
		window.dispatchEvent(event);
	}

	render() {

	}

	getHeadPosition() {
		return this.squares[this.squares.length - 1];
	}

	changeDirection(newDirection) {
		this.direction = newDirection;
		clearInterval(this.moveInterval);
		this.move();
		this.startMoving();
	}
}

class Game {

	constructor() {
		this.snake 	= new Snake();
		this.limits = [25, 50];
		this.el 	= document.getElementById('board');
		this.foodCoords = this.getFoodCoord();
		this.limitsCoords = this.getLimitsCoords();
		this.board 	= this.getEmptyBoard();
	}

	getFoodCoord() {
		let random = [utils.getRandomInt(this.limits[0]), utils.getRandomInt(this.limits[1])];

		if (utils.includes(this.snake.squares, random)) {
			random = this.getFoodCoord();
		}

		return random;
	}

	getLimitsCoords() {
		let limits = [];

		for (let i = 0; i <= this.limits[0]; i++) {
			for (let j = 0; j <= this.limits[1]; j++) {
				if (
					i === 0 ||
					i === this.limits[0] ||
					j === 0 ||
					j === this.limits[1]
					) {
					limits.push([i,j]);
				}
			}
		}

		return limits;

	}

	getEmptyBoard() {
		let board = [];

		for (let i =0; i<=this.limits[0]; i++) {
			board[i] = [];
			for (let j=0; j<=this.limits[1];j++) {
				board[i][j] = '_';
			}
		}
		for (const [x,y] of this.limitsCoords) {
			board[x][y] = "v";
		}

		return board;
		//	[1,2,3,4,5,...],
		//	[1,2,3,4,5,...],
		//	[1,2,3,4,5,...],
		//	[1,2,3,4,5,...],
		//	[1,2,3,4,5,...],
		//	[1,2,3,4,5,...],
		//]
	}

	start() {
		window.addEventListener('keydown', this.onKeyDown.bind(this));
		window.addEventListener('moved', this.checkStatusAndUpdate.bind(this));
		this.snake.startMoving();
		this.snake.move();
	}

	onKeyDown(e) {
		if (Object.keys(utils.arrowEvents).includes(e.key)) {
			const newDirection = utils.arrowEvents[e.key];
			const oppositeDirection = utils.getOpposite(this.snake.direction);

			if (this.snake.direction !== newDirection && newDirection !== oppositeDirection) {
				this.snake.changeDirection(newDirection);
				this.checkStatusAndUpdate();
			}
		}
	}

	checkStatusAndUpdate() {
		const head = this.snake.getHeadPosition();

		if (this.snake.selfTouched || utils.includes(this.limitsCoords, head)) {
			game.end();
		} else if (utils.includes(this.foodCoords, head)) {
			this.foodCoords = this.getFoodCoord();
			const andGrow = true;
			this.snake.move(andGrow);
		} else {
			this.updateBoard();
		}
	}

	updateBoard() {
		this.board 	= this.getEmptyBoard();

		for (const [x,y] of this.snake.squares) {
			this.board[x][y] = '*';
		}

		const [a,b] = this.foodCoords;
		this.board[a][b] = 'C';

		this.render();
	}

	render() {
		let boardPlotted  = '';

		for (const ar of this.board) {
			boardPlotted = boardPlotted + ar.join('') + '\n';
		}
		this.el.innerText = boardPlotted;
	}

	end() {
		alert('you failed!');
		clearInterval(this.snake.moveInterval);
	}
}

const utils = {
	newSquare: {
		left: [0, -1],
		right: [0, 1],
		up: [-1, 0],
		down: [1, 0],
	},
	sumCoords: function sumCoords([x1,y1], [x2,y2]) {
		return [x1 + x2, y1 + y2];
	},
	arrowEvents: {
		'ArrowDown'	:'down',
		'ArrowUp'	:'up',
		'ArrowRight':'right',
		'ArrowLeft'	:'left',
	},
	includes(inArray, array) {
		let isIncluded = false;

		if (inArray.length === 2 && !Array.isArray(inArray[0])) {
			if (inArray[0] === array[0] && inArray[1] === array[1]) {
				isIncluded = true;
				return isIncluded;
			}
		} else {
			for (let ar of inArray) {
				if (ar[0] === array[0] && ar[1] === array[1]) {
					isIncluded = true;
					return isIncluded;
				}
			}
		}
	},
	getRandomInt(max) {
  		return Math.floor(Math.random() * Math.floor(max)) || 1;
	},
	getOpposite(direction) {
		const upDown 	= ['up','down'];
		const leftRight = ['left','right'];

		if (upDown.includes(direction)) {
			return upDown.filter(dir => dir !== direction).join();
		} else {
			return leftRight.filter(dir => dir !== direction).join();
		}
	}
}

const game = new Game();

// game.start();

