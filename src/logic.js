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

	this.placeShip = (arr, ship, direction = false) => {
		const [x, y] = this.orientShip(arr, ship.length, direction);

		if (direction) {
			for (let i = 0; i < ship.length; i++) this.grid[y + i][x] = ship;
			return;
		}
		for (let i = 0; i < ship.length; i++) {
			this.grid[y][x + i] = ship;
		}
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
		if(this.grid[x][y] === 1 || this.grid[x][y] === -1) return
		if (this.grid[x][y] === 0) {
			this.grid[x][y] = -1;
			return;
		}
		this.grid[x][y].hit();
		this.grid[x][y] = 1;
	};
}

module.exports = { ship, gameBoard };
