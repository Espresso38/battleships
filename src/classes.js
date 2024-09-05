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
        this.sunk = this.nHits === this.length;
        return this.sunk;
    }
};

class GameBoard {
    constructor(size = 10) {
        this.size = size;
        this.grid = Array.from({length: size}, () => Array(size).fill(null));
        this.ships = []
    }

    placeShip(ship, xAxis, yAxis, direction) {
        if (!this.isPlaceValid(ship, xAxis, yAxis, direction)) {
            throw new Error('Invalid ship placement');
        }

        for (let i = 0; i < ship.length; i++) {
            if (direction === 'horizontal') {
                this.grid[xAxis][yAxis + i] = ship;
            } else {
                this.grid[xAxis + i][yAxis] = ship;
            }
        }
        this.ships.push(ship);
    }

    isPlaceValid(ship, xAxis, yAxis, direction) {
        for (let i = 0; i < ship.length; i++) {
            if (direction === 'horizontal') {
                if (yAxis + i > this.size || this.grid[xAxis][yAxis + i] !== null) {
                    return false;
                }
            } else {
                if (xAxis + i > this.size || this.grid[xAxis + i][yAxis] !== null) {
                    return false;
                }
            }
        }
        return true;
    }

    recivedAttack(xAxis, yAxis) {
        const target = this.grid[xAxis][yAxis];

        if (target === null) {
            this.grid[xAxis][yAxis] = 'O';
        } else if (target !== 'O' && target !== 'X') {
            target.hit();
            this.grid[xAxis][yAxis] = 'X';
            if (target.isSunk()) {
                this.allShipsSunk();
            }
        }
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.playerGameBoard = new GameBoard();
    }

    placeShip(ship, xAxis, yAxis, direction) {
        try {
            this.playerGameBoard.placeShip(ship, xAxis, yAxis, direction);
        } catch (error) {
            throw new Error(error);
        }
    }

    attack(opponentGameBoard, xAxis, yAxis) {
        opponentGameBoard.recivedAttack(xAxis, yAxis);
    }
}

module.exports = {Ship, GameBoard, Player};