const info = require('./db_interaction.js');

test('MatchId', async () => {
    const data = await info.getMatchInfo(5392744437);
    data[1].close();
    expect(data[0][0]['5392744437']['match_id']).toBe(5392744437);
});