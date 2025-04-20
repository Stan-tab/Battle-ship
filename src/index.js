import './style.css';
import { gameBoard, player, playerBot } from './logic';

// document.querySelector("div[x='2'][y='5']") //Reference for me
function DOM() {
	this.player = new player();
	this.playerBot = new playerBot();
	this.currentShip = null;
	this.rotate = false;
	this.colored = [];

	const boards = [...document.querySelectorAll('.boards > *')];

	window.onkeydown = (e) => {
		if (e.code === 'KeyR') this.rotate = !this.rotate;
		if (!this.currentUiShip) return;
		this.currentUiShip.style.transform = this.rotate
			? 'rotate(90deg)'
			: 'rotate(0deg)';
	};

	const mouseHandler = (e) => {
		if (!this.currentShip) return;
		const position = [
			+e.target.getAttribute('x'),
			+e.target.getAttribute('y')
		];
		if (this.currentShip.length === 1) {
			if (this.rotate) {
				position[0] += 1;
			} else {
				position[1] += 1;
			}
		}
		const set = this.player.board.orientShip(
			position,
			this.currentShip.length,
			this.rotate
		);
		if (this.colored) {
			this.colored.forEach((e) => {
				e.style.backgroundColor = 'rgba(89, 94, 148, 0.39)';
			});
			this.colored = [];
		}

		set.forEach((e) => {
			const element = document.querySelector(
				`div[x="${e[0]}"][y="${e[1]}"]`
			);
			element.style.backgroundColor = '#42599a';
			this.colored.push(element);
		});
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
		this.currentUiShip = null;
		let bool = false;
		let prevBool = false;
		let clone = null;
		ships.forEach((ship) => {
			ship.onclick = () => {
				bool = true;
				clone = getClone(ship.parentNode.childNodes);
				if (bool && !prevBool) {
					this.currentUiShip = ship;
					clone.classList.add('ship');
					Object.assign(this.currentUiShip.style, {
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
			if (!this.currentUiShip) return;
			Object.assign(this.currentUiShip.style, {
				top: `${e.pageY - this.currentUiShip.offsetHeight / 2}px`,
				left: `${e.pageX - this.currentUiShip.offsetWidth / 2}px`,
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
			Object.assign(this.currentUiShip.style, {
				position: 'static'
			});
			this.currentUiShip.style.removeProperty('transform');
			this.currentUiShip.style.removeProperty('pointer-events');
			this.currentUiShip.style.removeProperty('top');
			this.currentUiShip.style.removeProperty('left');
			this.currentUiShip = null;
			clone = null;
			bool = prevBool = false;
		};
	})();
}

const manipulate = new DOM();
