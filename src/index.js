import './style.css';
import { gameBoard, player, playerBot } from './logic';

// document.querySelector("div[x='2'][y='5']") //Reference for me
function DOM() {
	this.player = new player();
	this.playerBot = new playerBot();
	this.currentShip = null;

	const boards = [...document.querySelectorAll('.boards > *')];

	const mouseHandler = (e) => {
		if (!this.currentShip) return;
		const position = [
			+e.target.getAttribute('x'),
			+e.target.getAttribute('y')
		];
		const set = this.player.board.orientShip(
			position,
			this.currentShip.length, true
		);
		console.log(JSON.stringify(set));
	};

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
				cell.onmousemove = mouseHandler;
			}
		});
	})();

	(() => {
		//followCursor
		function getClone(arr) {
			for (let i = 0; i < arr.length; i++) {
				if (!arr[i].classList) continue;
				if ([...arr[i].classList].includes('clone')) return arr[i];
			}
		}
		function getDivNodes(childArr) {
			const arr = [];
			for (let i = 0; i < childArr.length; i++) {
				if (childArr[i].nodeType != 1) continue;
				arr.push(childArr[i]);
			}
			return arr;
		}
		const ships = [...document.querySelectorAll('.ship')];
		let pressed = null;
		let bool = false;
		let prevBool = false;
		let clone = null;
		ships.forEach((ship) => {
			ship.onclick = () => {
				bool = true;
				clone = getClone(ship.parentNode.childNodes);
				if (bool && !prevBool) {
					pressed = ship;
					clone.classList.add('ship');
					Object.assign(pressed.style, {
						position: 'fixed'
					});
					const length = getDivNodes([...ship.childNodes]).length;
					if (this.player.ships[`${length}`].length === 0) return;
					this.currentShip = this.player.ships[`${length}`][0];
					this.player.ships[`${length}`].shift();
					return;
				}
			};
		});
		window.onmousemove = (e) => {
			if (!pressed) return;
			Object.assign(pressed.style, {
				top: `${e.pageY - pressed.offsetHeight / 4}px`,
				left: `${e.pageX - pressed.offsetWidth / 2}px`,
				pointerEvents: 'none'
			});
		};
		document.onclick = () => {
			if (bool && !prevBool) {
				prevBool = true;
				return;
			}
			if (!bool && !prevBool) return;
			this.currentShip = null;
			clone.classList.remove('ship');
			Object.assign(pressed.style, {
				position: 'static',
				pointerEvents: 'auto'
			});
			pressed.style.removeProperty('top');
			pressed.style.removeProperty('left');
			pressed = null;
			clone = null;
			bool = prevBool = false;
		};
	})();
}

const manipulate = new DOM();
