import './style.css';

// document.querySelector("div[x='2'][y='5']") //Reference for me
const boards = [...document.querySelectorAll('.boards > *')];
(function createCells() {
	boards.forEach((board) => {
		for (let i = 0; i < 100; i++) {
			const cell = document.createElement('div');
			cell.setAttribute('x', `${i % 10}`);
			cell.setAttribute('y', `${Math.floor(i / 10)}`);
			Object.assign(cell.style, {
				backgroundColor: 'rgb(89 94 148 / 39%)',
				outline: 'solid 0.5px grey'
			});
			board.appendChild(cell);
		}
	});
})();

(function followMouse() {
	function getClone(arr) {
		for (let i = 0; i < arr.length; i++) {
			if (!arr[i].classList) continue;
			if ([...arr[i].classList].includes('clone')) return arr[i];
		}
	}
	const ships = [...document.querySelectorAll('.ship')];
	let pressed = null;
	ships.forEach((ship) => {
		let bool = false;
		ship.onclick = () => {
			bool = !bool;
			const clone = getClone(ship.parentNode.childNodes);
			if (bool) {
				pressed = ship;
				clone.classList.add('ship');
				Object.assign(pressed.style, {
					position: 'fixed'
				});
				return;
			}
			clone.classList.remove('ship');
			Object.assign(ship.style, {
				position: 'static'
			});
			ship.style.removeProperty('top');
			ship.style.removeProperty('left');
			pressed = null;
		};
	});
	window.onmousemove = (e) => {
		if (!pressed) return;
		Object.assign(pressed.style, {
			top: `${e.pageY - pressed.offsetHeight / 4}px`,
			left: `${e.pageX - pressed.offsetWidth / 2}px`
		});
	};
})();
