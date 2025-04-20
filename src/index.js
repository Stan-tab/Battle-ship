import './style.css';
import { gameBoard, player, playerBot, ship } from './logic';

//rgb(2 3 6 / 63%) miss color
//rgb(182 5 5 / 63%) ok color
function DOM() {
	this.player = new player();
	this.playerBot = new playerBot();
	this.currentShip = null;
	this.rotate = false;
	this.way = false;
	this.placed = 0;
	this.removeColor = [];
	this.stayColored = [];

	const boards = [...document.querySelectorAll('.boards > *')];

	window.onkeydown = (e) => {
		if (e.code === 'KeyR') this.rotate = !this.rotate;
		if (!this.currentUiShip) return;
		this.currentUiShip.style.transform = this.rotate
			? 'rotate(90deg)'
			: 'rotate(0deg)';
	};

	const getPosition = (e) => {
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
		return position;
	};

	const mouseHandler = (e) => {
		if (!this.currentShip) return;
		const position = getPosition(e);
		const set = this.player.board.orientShip(
			position,
			this.currentShip.length,
			this.rotate
		);
		if (this.removeColor) {
			this.removeColor.forEach((e) => {
				e.style.backgroundColor = 'rgba(89, 94, 148, 0.39)';
			});
			this.removeColor = [];
		}
		this.stayColored.forEach((e) => {
			e.style.backgroundColor = '#42599a';
		});

		if (!set) return;
		set.forEach((e) => {
			const element = document.querySelector(
				`div[x="${e[0]}"][y="${e[1]}"]`
			);
			element.style.backgroundColor = '#42599a';
			this.removeColor.push(element);
		});
	};

	const clickHandler = (e) => {
		if (!this.currentShip) return;
		const position = getPosition(e);
		const arr = this.player.board.orientShip(
			position,
			this.currentShip.length,
			this.rotate
		);
		const set = this.player.board.placeShip(
			position,
			this.currentShip,
			this.rotate
		);
		if (!set) return;
		const p = document.querySelector(
			`.ship${this.currentShip.length} > .num`
		);
		p.textContent = +p.textContent - 1;
		arr.forEach((e) => {
			const element = document.querySelector(
				`div[x="${e[0]}"][y="${e[1]}"]`
			);
			element.style.backgroundColor = '#42599a';
			this.stayColored.push(element);
		});
		this.player.ships[`${this.currentShip.length}`].shift();
		this.placed++;
		if (this.placed === 6) this.way = true;
	};

	const noChange = [];
	const mouseHandlerBot = (e) => {
		if (noChange.includes(e.target)) return;
		e.target.style.backgroundColor =
			e.type === 'mouseover'
				? 'rgb(15 38 107 / 54%)'
				: 'rgba(89, 94, 148, 0.39)';
	};

	const clickHandlerBot = (e) => {
		if (
			this.currentShip ||
			!this.way ||
			this.playerBot.board.checkShips() ||
			this.player.board.checkShips()
		)
			return;
		const arr = [e.target.getAttribute('x'), e.target.getAttribute('y')];
		const isReceived = this.playerBot.board.receiveAttack(arr);
		if (isReceived === null) return;
		e.target.style.backgroundColor = isReceived
			? 'rgb(182 5 5 / 63%)'
			: 'rgb(2 3 6 / 63%)';
		noChange.push(e.target);

		const botAttacks = this.playerBot.attack(this.player.board);
		const attackedElement = document.querySelector(
			`div[x="${botAttacks.position[0]}"][y="${botAttacks.position[1]}"]`
		);
		if (this.playerBot.board.checkShips()) {
			alert('You won!!');
			return;
		}
		attackedElement.style.backgroundColor = botAttacks.attacked
			? 'rgb(182 5 5 / 63%)'
			: 'rgb(2 3 6 / 63%)';
		if (this.player.board.checkShips()) {
			alert('Bot won');
			return;
		}
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
				if (boards.indexOf(board) != 0) {
					cell.onmouseover = cell.onmouseout = mouseHandlerBot;
					cell.onclick = clickHandlerBot;
					continue;
				}
				cell.onmousemove = mouseHandler;
				cell.onclick = clickHandler;
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
		let shipAmount = 0;
		ships.forEach((ship) => {
			ship.onclick = () => {
				bool = true;
				clone = getClone(ship.parentNode.childNodes);
				if (bool && !prevBool) {
					const length = getDivNodes([...ship.childNodes]).length;
					shipAmount = this.player.ships[`${length}`].length;
					if (shipAmount === 0) {
						prevBool = false;
						return;
					}
					clone.classList.add('ship');
					this.currentUiShip = ship;
					this.currentShip = this.player.ships[`${length}`][0];
					Object.assign(this.currentUiShip.style, {
						position: 'fixed',
						transform: this.rotate
							? 'rotate(90deg)'
							: 'rotate(0deg)'
					});
					return;
				}
			};
		});
		window.onmousemove = (e) => {
			if (!this.currentUiShip || !this.currentUiShip) return;
			Object.assign(this.currentUiShip.style, {
				top: `${e.clientY - this.currentUiShip.offsetHeight / 2}px`,
				left: `${e.clientX - this.currentUiShip.offsetWidth / 2}px`,
				pointerEvents: 'none'
			});
		};
		document.onclick = () => {
			if (bool && !prevBool) {
				if (shipAmount === 0) return;
				prevBool = true;
				return;
			}
			if (!this.currentUiShip) {
				prevBool = false;
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
