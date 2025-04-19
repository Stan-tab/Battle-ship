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

	this.placeShip = (arr, ship, direction = true) => {
		const positions = this.orientShip(arr, ship.length, direction);
		if (!positions) return false;
		this.placedPos.push(...positions);
		this.ships.push(ship);

		for (let i = 0; i < positions.length; i++)
			this.grid[positions[i][1]][positions[i][0]] = ship;
		return true;
	};
	this.orientShip = (arr, length, direction = false) => {
		let [x, y] = arr;
		const cursor = Math.floor(length / 2);
		let orient = x;
		if (!direction) orient = y;

		let begin = orient - length + cursor;
		if (begin < 0) begin = 0;
		if (begin + length > 10) begin = 10 - length;

		const newArr = [];
		if (!direction) {
			for (let i = 0; i < length; i++) {
				newArr.push([x, begin + i]);
			}
		} else {
			for (let i = 0; i < length; i++) {
				newArr.push([begin + i, y]);
			}
		}
		if (compArr(this.placedPos, newArr)) return false;
		return newArr;
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
			"4": createShips(2, 4),
			"3": createShips(1, 3),
			"2": createShips(1, 2),
			"1": createShips(2, 1)
		};

		this.board = new gameBoard();
	}
}

class playerBot extends player {
	constructor() {
		super();
		this.setShips();
		this.attacked = [];
	}

	setShips() {
		const arr = [];
		for (const item in this.ships) {
			for (let i = 0; i < this.ships[item].length; i++) {
				arr.push(this.ships[item][i]);
			}
		}
		for (let i = 0; i < arr.length; i++) {
			while (true) {
				const nums = [
					Math.floor(Math.random() * 10),
					Math.floor(Math.random() * 10)
				];
				const dir = Math.floor(Math.random() * 2) === 0;
				if (this.board.placeShip(nums, arr[i], dir)) break;
			}
		}
	}

	attack(board) {
		function hasSim(arr1, arr2) {
			if (arr1.length === 0) return false;
			for (let i = 0; i < arr1.length; i++) {
				const checker = [];
				for (let l = 0; l < 2; l++) {
					checker.push(arr1[i][l] === arr2[l]);
				}
				if (checker.includes(false)) return false;
			}
			return true;
		}

		let position;
		while (1) {
			position = [
				Math.floor(Math.random() * 10),
				Math.floor(Math.random() * 10)
			];
			if (!hasSim(this.attacked, position)) break;
		}
		board.receiveAttack(position);
		this.attacked.push(position);
	}
}

export { ship, gameBoard, player, playerBot };
