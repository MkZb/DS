let MongoClient = require("mongodb").MongoClient;

//get hero info from database by id
async function getHeroInfo(id) {
    let client = await MongoClient.connect("mongodb://localhost:27017/", {useNewUrlParser: true})
    const db = client.db("main");
    const collection = db.collection("heroes");

    let query1 = {};
    query1[id.toString()] = {$exists: true};

    return await collection.find(query1);

}

async function getMatchInfo(match_id) {
    let client = await MongoClient.connect("mongodb://localhost:27017/", {useNewUrlParser: true})
    const db = client.db("main");
    const collection = db.collection("matches");

    let query1 = {};
    query1["match_id"] = match_id;

    return await collection.find(query1);

}

async function getPlayerMatches(account_id) {
    let client = await MongoClient.connect("mongodb://localhost:27017/", {useNewUrlParser: true})
    const db = client.db("main");
    const collection = db.collection("players");

    let query1 = {};
    query1[account_id.toString()] = {$exists: true};

    return await collection.find(query1);

}

//example how to work with result, that come from DB (make sure to fill database before running)
function examples() {
    let hero_id = 2
    getHeroInfo(hero_id).then(function (result) {
        if (result.count() === 0) {
            console.log("No matches for specified id in database.")
        } else {
            result.forEach(function (doc) {
                console.log(doc[hero_id]);
            })
        }
    })

    let match_id = 5407012875
    getMatchInfo(match_id).then(function (result) {
        if (result.count() === 0) {
            console.log("No matches for specified id in database.")
        } else {
            result.forEach(function (doc) {
                console.log(doc);
            })
        }
    })

    let account_id = 369907450
    getPlayerMatches(account_id).then(function (result) {
        if (result.count() === 0) {
            console.log("No matches for specified id in database.")
        } else {
            result.forEach(function (doc) {
                console.log(doc[account_id]);
            })
        }
    })
}

examples();