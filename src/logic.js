function ship(length) {
	this.length = length;
	this.hits = 0;
	this.hit = () => (this.hits += 1);
	this.isSunk = () => this.length <= this.hits;
}

module.exports = { ship };
