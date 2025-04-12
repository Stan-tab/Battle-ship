function ship(length) {
	this.length = length;
	this.hits = 0;
	this.hit = () => (this.hits += 1);
	this.isSunk = () => this.length <= this.hits;
}

function gameBoard() {
	this.grid = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];
	this.ships = [];
	this.placedPos = [];

	function compArr(arr1, arr2) {
		for (let i = 0; i < arr1.length; i++) {
			for (let l = 0; l < arr2.length; l++) {
				const check = [];
				for (let j = 0; j < 2; j++) {
					check.push(arr1[i][j] === arr2[l][j]);
				}
				if (!check.includes(false)) return true;
			}
		}
		return false;
	}

	this.placeShip = (arr, ship, direction = false) => {
		if (this.ships.includes(ship)) return false;
		const [x, y] = this.orientShip(arr, ship.length, direction);
		const newArr = [];

		this.ships.push(ship);
		if (direction) {
			for (let i = 0; i < ship.length; i++) {
				newArr.push([x, y + i]);
			}
		} else {
			for (let i = 0; i < ship.length; i++) {
				newArr.push([x, y + i]);
			}
		}
		if (compArr(this.placedPos, newArr)) return false;
		this.placedPos.push(...newArr);
		for (let i = 0; i < newArr.length; i++) {
			this.grid[newArr[i][0]][newArr[i][1]] = ship;
		}

		if (newArr) return true;
	};
	this.orientShip = (arr, length, direction = false) => {
		const [x, y] = arr;
		const cursor = Math.floor(length / 2);
		let orient = x;
		if (direction) orient = y;

		let begin = orient - length + cursor;
		if (begin < 0) begin = 0;
		if (begin + length > 10) begin = 10 - length;

		return !direction ? [begin, y] : [x, begin];
	};

	this.receiveAttack = (arr) => {
		const [x, y] = arr;
		if (this.grid[y][x] === 1 || this.grid[y][x] === -1) return;
		if (this.grid[y][x] === 0) {
			this.grid[y][x] = -1;
			return;
		}
		this.grid[y][x].hit();
		this.grid[y][x] = 1;
	};

	this.checkShips = () => {
		const arr = [];
		for (let i = 0; i < this.ships.length; i++) {
			arr.push(this.ships[i].isSunk());
		}
		return !arr.includes(false);
	};
}

class player {
	constructor() {
		function createShips(num, thickness) {
			const arr = [];
			for (let i = 0; i < num; i++) arr.push(new ship(thickness));
			return arr;
		}

		this.ships = {
			four: createShips(2, 4),
			three: createShips(1, 3),
			two: createShips(1, 2),
			one: createShips(2, 1)
		};

		this.board = new gameBoard();
	}
}

class playerBot extends player {
	constructor() {
		super();
		for (const item in this.ships) {
			this.ships[item].forEach((e) => {
				const arr = [
					Math.floor(Math.random() * 11),
					Math.floor(Math.random() * 11)
				];
				const dir = Math.floor(Math.random() * 2) === 0 ? false : true;
				this.board.placeShip(arr, e, dir);
			});
		}
	}
}

module.exports = { ship, gameBoard, player, playerBot };
