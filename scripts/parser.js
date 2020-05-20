let fetch = require("node-fetch");
let MongoClient = require("mongodb").MongoClient;

async function get_match_info(match_id, key = "8F248B8D4DE625716426DD2A183961CD") {
    const mongoClient = new MongoClient("mongodb://localhost:27017/", {useNewUrlParser: true});
    let url = "https://api.steampowered.com/IDOTA2Match_205790/GetMatchDetails/v1/?match_id=" + match_id + "&key=" + key
    fetch(url, {
        method: "GET"
    }).then(function (response) {
        if (response.status !== 200) {
            console.log("Status error")
            return;
        }
        response.json().then(function (data) {
            mongoClient.connect(function (err, client) {
                const db = client.db("maindb");
                const collection = db.collection("matches");
                collection.insertOne(data, function (err, result) {  //Need to add existence in database check before inserting
                    if (err) {
                        return console.log(err);
                    }
                    console.log(result.ops);
                    client.close();
                })
            })
        })
    }).catch(function (err) {
        console.log(err);
    })
}

//returns true if object with "match_id" is not in database
async function search_for_match(collection, match_id) {
    return await collection.find({"match_id": match_id}).count() === 0;
}

//parses "amount" matches, starting from "start" and adds them to database
async function get_matches(start, amount, key = "8F248B8D4DE625716426DD2A183961CD") {
    let url = "https://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/v1/?key=" + key + "&start_at_match_seq_num=" + start + "&matches_requested=" + amount
    fetch(url, {
        method: "GET"
    }).then(function (response) {
        if (response.status !== 200) {
            return console.log("Status error");
        }
        response.json().then(async function (data) {
            //requested data handler
            let client = await MongoClient.connect("mongodb://localhost:27017/", {useNewUrlParser: true})
            let db = client.db("main");
            const collection = db.collection("matches");

            for (match in data.result.matches) {
                if (data.result.matches[match].game_mode === 22 && data.result.matches[match].human_players === 10 && data.result.matches[match].duration >= 900) {
                    try {
                        const res = await search_for_match(collection, data.result.matches[match].match_id)
                        if (res) {
                            await collection.insertOne(data.result.matches[match])
                        }

                    } finally {
                        console.log("Match added to DB.")
                    }
                }
            }
            await client.close();
        });
    })
        .catch(function (error) {
            console.log(error);
        })
}

get_matches(4390827227, 100)


