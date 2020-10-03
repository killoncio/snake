class Game {

	constructor(x,y) {
		this.size 			= {
			x: x,
			y: y
		};
		this.state 			= this.setEmptyState();
		this.snake 			= new Snake();
		this.wrapper		= document.getElementById('board');

			// [25, 50];
		this.foodCoords 	= this.getFoodCoord();
		this.limitsCoords 	= this.getLimitsCoords();
		// this.board 			= this.getEmptyBoard();
		// this.$emptyBoard 	= this.$el.children().clone();
	}

	setEmptyState() {
		let state = [];

		for (let i =0; i<=this.size.y; i++) {
			state[i] = [];
			for (let j=0; j<=this.size.x;j++) {
				state[i][j] = '';
			}
		}
		// for (const [x,y] of this.getLimitsCoords(x,y)) {
		// 	board[x][y] = "v";
		// }

		return state;
	}

	getFoodCoord() {
		let random = [utils.getRandomInt(this.size.x), utils.getRandomInt(this.size.y)];

		if (utils.includes(this.snake.squares, random)) {
			random = this.getFoodCoord();
		}

		return random;
	}

	getLimitsCoords() {
		let limits = [];

		for (let i = 0; i <= this.size.x; i++) {
			for (let j = 0; j <= this.size.y; j++) {
				if (
					i === 0 ||
					i === this.size.x ||
					j === 0 ||
					j === this.size.y
					) {
					limits.push([i,j]);
				}
			}
		}

		return limits;

	}

	getEmptyBoard() {
		let board = [];

		for (let i =0; i<=this.size.y; i++) {
			board[i] = [];
			for (let j=0; j<=this.size.x;j++) {
				board[i][j] = '_';
			}
		}
		for (const [x,y] of this.limitsCoords) {
			board[x][y] = "v";
		}

		return board;
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
			this.updateState();
		}
	}

	updateState() {
		this.state = this.setEmptyState();

		for (const [x,y] of this.snake.squares) {
			this.state[y][x] = '*';
		}

		const [x,y] = this.foodCoords;
		this.state[y][x] = 'C';

		// this.$el.html($board.html());

		this.render();
	}

	render() {
		this.wrapper.innerHTML = this.state.map((row) =>`<div class="row">${row.map((el)=>`<div class="col ${el === '*' ? `snake` : (el === 'C' ? `food` : ``)}"></div>`).join('')}</div>`).join('');
	}

	end() {
		alert('you failed!');
		clearInterval(this.snake.moveInterval);
	}
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

	// render() {

	// ${state.map((row) => `<div class="row">${row.map((el)=>`<div class="col">${el}</div>`).join('')}</div>`).join('')}

	// }

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

const utils = {
	newSquare: {
		left: [-1, 0],
		right: [1, 0],
		up: [0, -1],
		down: [0, 1],
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

const game = new Game(20,20);

game.start();

