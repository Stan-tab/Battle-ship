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
