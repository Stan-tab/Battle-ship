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
				outline: "solid 0.5px grey"
			});
			board.appendChild(cell);
		}
	});
})();
