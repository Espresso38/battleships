const Ship = require('./classes');  

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