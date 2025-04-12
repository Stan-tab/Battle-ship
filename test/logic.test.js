const logic = require('../src/logic.js');

test('Testing ship factory', () => {
	const ship = new logic.ship(3);
	expect(ship.length).toBe(3);
	expect(ship.hits).toBe(0);
	expect(ship.isSunk()).toBeFalsy();
	ship.hit();
	ship.hit();
	ship.hit();
	expect(ship.hits).toBe(3);
	expect(ship.isSunk()).toBeTruthy();
});

test('test gameboard', () => {
	const ship = new logic.ship(4);
	const board = new logic.gameBoard();
	board.placeShip([0, 0], ship);
	expect(board.grid).toStrictEqual([
		[ship, ship, ship, ship, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	]);
	board.receiveAttack([0, 0]);
	expect(board.grid[0][0]).toBe(1);
	board.receiveAttack([5, 6]);
	expect(board.grid[6][5]).toBe(-1);
	board.receiveAttack([1, 0]);
	board.receiveAttack([2, 0]);
	expect(board.checkShips()).toBeFalsy();
	board.receiveAttack([3, 0]);
	expect(board.checkShips()).toBeTruthy();
});

test('Playerbot class', () => {
	const bot = new logic.playerBot();
	let num = 0;
	for (let i = 0; i < bot.board.grid.length; i++) {
		const element = bot.board.grid[i];
		for (let l = 0; l < element.length; l++) {
			if (element[l] === 0) num++;
		}
	}
	expect(100 - num).toBe(15);
});
