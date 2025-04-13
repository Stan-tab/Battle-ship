const logic = require('../src/logic.js');

describe('Testing ship factory', () => {
	const ship = new logic.ship(3);
	test('Ship length', () => {
		expect(ship.length).toBe(3);
	});
	test('Ship hits', () => {
		expect(ship.hits).toBe(0);
		ship.hit();
		ship.hit();
		expect(ship.hits).toBe(2);
	});
	test('IsSunk test', () => {
		expect(ship.isSunk()).toBeFalsy();
		ship.hit();
		expect(ship.isSunk()).toBeTruthy();
	});
});

describe('Gameboard test', () => {
	const ship = new logic.ship(4);
	const board = new logic.gameBoard();
	test('Placing ships', () => {
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
	});

	test('Following attacks', () => {
		board.receiveAttack([0, 0]);
		expect(board.grid[0][0]).toBe(1);
		board.receiveAttack([5, 6]);
		expect(board.grid[6][5]).toBe(-1);
	});

	test('Checking ships', () => {
		board.receiveAttack([1, 0]);
		board.receiveAttack([2, 0]);
		expect(board.checkShips()).toBeFalsy();
		board.receiveAttack([3, 0]);
		expect(board.checkShips()).toBeTruthy();

		// console.log(JSON.stringify(board.grid).split(']')); //simpest way, i hope, to organize the array output
	});
});

describe('Player classes', () => {
	test('Playerbot setting ships', () => {
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
});
