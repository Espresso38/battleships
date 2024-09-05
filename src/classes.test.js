const {Ship, GameBoard, Player} = require('./classes');  

describe('Ship', () => {
    test('hit() increments nHits', () => {
        const ship = new Ship(3);
        expect(ship.nHits).toBe(0);

        ship.hit();
        expect(ship.nHits).toBe(1);

        ship.hit();
        expect(ship.nHits).toBe(2);
        
        ship.hit();
        expect(ship.nHits).toBe(3)
    });

    test('hit() calls isSunk when nHits equals length', () => {
        const ship = new Ship(2);
        const isSunkSpy = jest.spyOn(ship, 'isSunk');

        ship.hit();
        expect(isSunkSpy).not.toHaveBeenCalled();
        expect(ship.sunk).toBe(false);

        ship.hit();
        expect(isSunkSpy).toHaveBeenCalled();
        expect(ship.sunk).toBe(true);

        jest.restoreAllMocks();
    });
});

describe('Gameboard', () => {
    let gameboard;

    beforeEach(() => {
        gameboard = new GameBoard(10);
    });

    test('places ship correctly on the board', () => {
        const ship = new Ship(3);
        gameboard.placeShip(ship, 0, 0, 'horizontal');

        expect(gameboard.grid[0][0]).toBe(ship);
        expect(gameboard.grid[0][1]).toBe(ship);
        expect(gameboard.grid[0][2]).toBe(ship);
    });

    test('throws error for invalid ship placement', () => {
        const ship = new Ship(4);

        expect(() => gameboard.placeShip(ship, 0, 8, 'horizontal')).toThrow('Invalid ship placement');

        gameboard.placeShip(ship, 0, 0, 'horizontal');
        expect(() => gameboard.placeShip(ship, 0, 1, 'vertical')).toThrow('Invalid ship placement');
    });

    test('records attack as hit on a ship', () => {
        const ship = new Ship(2);
        gameboard.placeShip(ship, 0, 0, 'horizontal');

        gameboard.recivedAttack(0, 0);
        expect(gameboard.grid[0][0]).toBe('X');
        expect(ship.nHits).toBe(1);

        gameboard.recivedAttack(0, 1);
        expect(gameboard.grid[0][1]).toBe('X');
        expect(ship.nHits).toBe(2);
        expect(ship.isSunk()).toBe(true);
    });

    test('records attack as miss', () => {
        gameboard.recivedAttack(0, 0);
        expect(gameboard.grid[0][0]).toBe('O');
    });

    test('ignores repeated attacks on the same spot', () => {
        gameboard.recivedAttack(0, 0);
        gameboard.recivedAttack(0, 0);
        expect(gameboard.grid[0][0]).toBe('O'); 
    });

    test('allShipsSunk returns true when all ships are sunk', () => {
        const ship1 = new Ship(2);
        const ship2 = new Ship(3);

        gameboard.placeShip(ship1, 0, 0, 'horizontal');
        gameboard.placeShip(ship2, 2, 0, 'vertical');

        gameboard.recivedAttack(0, 0);
        gameboard.recivedAttack(0, 1);

        gameboard.recivedAttack(2, 0);
        gameboard.recivedAttack(3, 0);
        gameboard.recivedAttack(4, 0);

        expect(gameboard.allShipsSunk()).toBe(true);
    });

    test('allShipsSunk returns false when not all ships are sunk', () => {
        const ship1 = new Ship(2);
        const ship2 = new Ship(3);

        gameboard.placeShip(ship1, 0, 0, 'horizontal');
        gameboard.placeShip(ship2, 2, 0, 'vertical');

        gameboard.recivedAttack(0, 0);
        gameboard.recivedAttack(0, 1);

        gameboard.recivedAttack(2, 0);

        expect(gameboard.allShipsSunk()).toBe(false);
    });
});

describe('Player', () => {
    let player1;
    let player2;
    let ship1;
    let ship2;

    beforeEach(() => {
        player1 = new Player('Alice');
        player2 = new Player('Bob');
        ship1 = new Ship(3);
        ship2 = new Ship(4);
    });

    test('should initialize player with a name and a game board', () => {
        expect(player1.name).toBe('Alice');
        expect(player1.playerGameBoard).toBeInstanceOf(GameBoard);
    });

    test('should place ships correctly on the player\'s board', () => {
        player1.placeShip(ship1, 0, 0, 'horizontal');

        expect(player1.playerGameBoard.grid[0][0]).toBe(ship1);
        expect(player1.playerGameBoard.grid[0][1]).toBe(ship1);
        expect(player1.playerGameBoard.grid[0][2]).toBe(ship1);
    });

    test('should not place ships when placement is invalid', () => {
        expect(() => player1.placeShip(ship1, 0, 8, 'horizontal')).toThrow('Invalid ship placement');

        player1.placeShip(ship1, 0, 0, 'horizontal');
        expect(() => player1.placeShip(ship1, 0, 1, 'vertical')).toThrow('Invalid ship placement');
    });

    test('should attack the opponent\'s board and record a hit', () => {
        player2.placeShip(ship2, 1, 0, 'vertical');

        player1.attack(player2.playerGameBoard, 1, 0);
        expect(player2.playerGameBoard.grid[1][0]).toBe('X');
        expect(ship2.nHits).toBe(1);
    });

    test('should attack the opponent\'s board and record a miss', () => {
        player1.attack(player2.playerGameBoard, 0, 0);
        expect(player2.playerGameBoard.grid[0][0]).toBe('O');
    });

    test('should not allow repeated attacks on the same spot', () => {
        player1.attack(player2.playerGameBoard, 0, 0);
        expect(player2.playerGameBoard.grid[0][0]).toBe('O');

        player1.attack(player2.playerGameBoard, 0, 0);
        expect(player2.playerGameBoard.grid[0][0]).toBe('O');
    });
});