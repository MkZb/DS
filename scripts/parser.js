let fetch = require("node-fetch");
const MongoClient = require("mongodb").MongoClient;

async function get_match_info(match_id, key="8F248B8D4DE625716426DD2A183961CD"){
    const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
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
                        if (err){
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

async function get_matches(start, amount, key = "8F248B8D4DE625716426DD2A183961CD") {
    let url = "https://api.steampowered.com/IDOTA2Match_205790/GetMatchHistory/v1/?min_players=10&game_mode=1&key=" + key + "&start_at_match_id=" + start + "&matches_requested=" + amount;
    fetch(url, {
        method: "GET"
    }).then(function (response) {
        if (response.status !== 200) {
            console.log("Status error")
            return;
        }
        response.json().then(async function (data) {
            //requested data handler
            for (match in data.result.matches) {
                if (data.result.matches.hasOwnProperty(match)){
                await get_match_info(data.result.matches[match].match_id, key).catch(function (err) {
                    console.log(err);
                })
                }
            }

        });
    })
        .catch(function (error) {
            console.log(error);
        })
}

get_matches(5348956287, 5)


