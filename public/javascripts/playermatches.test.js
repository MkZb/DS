const info = require('./db_interaction.js');

test('HeroId', () => {
	info.getPlayerMatches("Kaka333").then(async function (result){
    		let client = await result[1]
    		let data = await result[0]
    		data.forEach(function (doc) {
		expect(data["3"]).toBe(0)
		})
    		return client
    	}).then(function (cl){
    return cl.close()}).catch(function(e){console.log(e)})
});