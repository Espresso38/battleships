class Ship {
    constructor(length) {
        this.length = length;
        this.nHits = 0;
        this.sunk = false;
    }

    hit() {
        this.nHits++;
        if (this.nHits == this.length) {
            this.isSunk();
        }
    }

    isSunk() {
        this.sunk = true;
    }
}

module.exports = Ship;