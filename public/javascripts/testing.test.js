const clown = require('./testing.js');

test('HeroId', () => {
	expect(clown.Winrate(2)).toBe(2);
});