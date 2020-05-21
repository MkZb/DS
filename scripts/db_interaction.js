let MongoClient = require("mongodb").MongoClient;

//get hero info from database by id
async function getHeroInfo(id) {
    let client = await MongoClient.connect("mongodb://localhost:27017/", {useNewUrlParser: true})
    const db = client.db("main");
    const collection = db.collection("heroes");

    let query1 = {};
    query1[id.toString()]={$exists: true};

    return await collection.find(query1);

}

//example how to work with result (make sure to fill database before running)
let hero_id = 2
getHeroInfo(hero_id).then(function (result) {
    result.forEach(function (doc) {
        console.log(doc[hero_id]["total_games"]);
    })
})