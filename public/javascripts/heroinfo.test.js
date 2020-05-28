const info = require('./db_interaction.js');

test('HeroId', async () => {
    const data = await info.getHeroInfo(3);
    data[1].close();
    expect(data[0][0]['3']['total_games']).toBe(29);
});