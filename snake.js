class Game {
	constructor(x,y) {
		this.size 			= {
			x: x,
			y: y
		};
	}
	init() {
		this.wrapper		= document.getElementById('board');
		const startButton 	= document.getElementsByClassName('controls__button__start')[0];

		window.addEventListener('keydown', this.onKeyDown.bind(this));
		window.addEventListener('moved', this.checkStatusAndUpdate.bind(this));
		startButton.addEventListener('click', this.start.bind(this));
	}
	start() {
		this.speed 			= Number(document.getElementsByClassName('controls__input__speed')[0].value);
		this.state 			= this.setEmptyState();
		this.snake 			= new Snake(this.speed);
		this.foodSquare 	= this.getFoodSquare();
		this.limitSquares 	= this.getlimitSquares();
		this.snake.startMoving();
		this.snake.move();
	}
	setEmptyState() {
		let state = [];

		for (let i =0; i<=this.size.y; i++) {
			state[i] = [];
			for (let j=0; j<=this.size.x;j++) {
				state[i][j] = '';
			}
		}

		return state;
	}
	getFoodSquare() {
		let random = [utils.getRandomInt(this.size.x), utils.getRandomInt(this.size.y)];

		if (utils.includes(this.snake.squares, random) || utils.isCorner(random, this.size.x, this.size.y)) {
			random = this.getFoodSquare();
		}

		return random;
	}
	getlimitSquares() {
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
	onKeyDown(e) {
		if (utils.isCursorKey(e.key)) {
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

		if (this.snake.selfTouched || utils.includes(this.limitSquares, head)) {
			game.end();
		} else if (utils.includes(this.foodSquare, head)) {
			this.foodSquare = this.getFoodSquare();
			const andGrow = true;
			this.snake.move(andGrow);
		} else {
			this.updateState();
		}
	}
	updateState() {
		this.state = this.setEmptyState();

		for (const [x,y] of this.snake.squares) {
			this.state[y][x] = this.renderSquare('snake');
		}

		const [x,y] = this.foodSquare;
		this.state[y][x] = this.renderSquare('food');

		this.render();
	}

	render() {
		this.wrapper.innerHTML = this.state.map((row) =>`<div class="row">${row.map((el)=> el || this.renderSquare('empty')).join('')}</div>`).join('');
	}
	renderSquare(type) {
		if (type === 'snake') {
			return '<div class="col snake"></div>';
		} else if (type === 'food') {
			return '<div class="col food"></div>';
		} else if (type === 'empty') {
			return '<div class="col"></div>';
		}
	}
	end() {
		alert('you failed!');
		clearInterval(this.snake.moveInterval);
		window.removeEventListener('keydown', this.onKeyDown.bind(this));
		window.removeEventListener('moved', this.checkStatusAndUpdate.bind(this));
	}
}

class Snake {

	constructor(speed) {
		this.direction 		= 'down';
		this.squares 		= [[5,5],[6,5]];
		this.selfTouched 	= false;
		this.speed 			= speed;
	}

	startMoving() {
		this.moveInterval = setInterval(this.move.bind(this),1000/this.speed);
	}

	move(andGrow) {
		const newHeadCoords = utils.sumCoords(this.getHeadPosition(), utils.newSquare[this.direction]);

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
	},
	isCorner(random, xMax, yMax) {
		const corners = [[1,1], [1,yMax - 1], [xMax - 1, 1], [xMax - 1, yMax - 1]];

		return utils.includes(corners, random);
	},
	isCursorKey(key) {
		return Object.keys(utils.arrowEvents).includes(key);
	}
}

const game = new Game(20,20);

game.init();

