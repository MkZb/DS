const info = require('./db_interaction.js');

test('PlayerId', async () => {
    const data = await info.getPlayerMatches(133399822);
    data[1].close();
    expect(data[0][0]['133399822']).toMatchObject([5389009009]);
});