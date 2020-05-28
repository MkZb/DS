let fetch = require("node-fetch");
let MongoClient = require("mongodb").MongoClient;

//returns true if object with "match_id" is not in database.
async function search_for_match(collection, match_id) {
    let query1 = {}
    query1[match_id.toString()] = {$exists: true}
    const res = await collection.find(query1).count()
    if (res === 0) {
        return true;
    } else {
        console.log(match_id + " already in database.")
        return false;
    }
}

//parses "amount" matches, starting from "start" and adds them to database. Also changes heroes statistics at database while parsing.
/**
 *Parses "amount" matches and adds them to database. Also changes heroes statistics at database while parsing
 *
 *@constructor
 *@param {Number} start - Parsing match start number
 *@param {Number} amount - Amount of matches for parsing
 *@param {String} key - DotaApi Access Key
 */
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
            let client = await MongoClient.connect("mongodb://admin:administrator123@ds151817.mlab.com:51817/heroku_fqqg0zld", {useNewUrlParser: true})
            const db = client.db("heroku_fqqg0zld");
            const collection = db.collection("matches");
            const collection2 = db.collection("heroes");
            const collection3 = db.collection("players");

            for (let match in data.result.matches) {
                if (data.result.matches[match].game_mode === 22 && data.result.matches[match].human_players === 10 && data.result.matches[match].duration >= 900) {
                    const res = await search_for_match(collection, data.result.matches[match].match_id)
                    if (res) {
                        try {
                            let query1 = {};
                            query1[data.result.matches[match].match_id.toString()] = data.result.matches[match];
                            const res2 = await collection.insertOne(query1);
                        } catch (e) {
                            console.log(e);
                        }

                        console.log(data.result.matches[match].match_id + " added.")
                        for (player in data.result.matches[match].players) {
                            let query1 = {};
                            let hero = data.result.matches[match].players[player].hero_id.toString()
                            query1[hero] = {$exists: true}
                            let query2 = {};
                            query2[hero.toString() + ".total_games"] = 1
                            let query3 = {};
                            query3[hero.toString() + ".total_won"] = 1
                            let query4 = {};
                            query4[data.result.matches[match].players[player].account_id.toString()] = {$exists: true};
                            let query5 = {};
                            query5[data.result.matches[match].players[player].account_id.toString()] = data.result.matches[match].match_id

                            let date = new Date((data.result.matches[match].start_time) * 1000)
                            query2[hero.toString() + ".total_games_by_day." + date.getFullYear().toString() + "." + date.getMonth().toString() + "." + date.getDate().toString()] = 1;
                            query3[hero.toString() + ".games_won_by_day." + date.getFullYear().toString() + "." + date.getMonth().toString() + "." + date.getDate().toString()] = 1;
                            query2[hero.toString() + ".total_kills"] = data.result.matches[match].players[player].kills;
                            query2[hero.toString() + ".total_gpm"] = data.result.matches[match].players[player].gold_per_min;
                            query2[hero.toString() + ".total_xpm"] = data.result.matches[match].players[player].xp_per_min

                            let deaths = data.result.matches[match].players[player].deaths;
                            if (deaths === 0) {
                                deaths = 1;
                            }
                            query2[hero.toString() + ".total_kda"] = Math.round(((data.result.matches[match].players[player].kills + data.result.matches[match].players[player].assists) / deaths) * 100) / 100
                            query2[hero.toString() + ".total_last_hits"] = data.result.matches[match].players[player].last_hits


                            await collection2.updateOne(query1, {
                                $inc: query2
                            }, {"upsert": true})

                            await collection3.updateOne(query4, {
                                $push: query5
                            }, {"upsert": true})

                            if ((data.result.matches[match].radiant_win === true && player < 5) || (data.result.matches[match].radiant_win === false) && player >= 5) {
                                await collection2.updateOne(query1, {
                                    $inc: query3
                                }, {"upsert": true})
                            }
                        }
                    }


                }
            }
            return client
        }).then(function (client) {
            client.close();
        })
    })
        .catch(function (error) {
            console.log(error);
        })
}

//wait "milliseconds" milliseconds before sending solution for promise
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//getting 100 matches from everyday since 05.01


const getFromSeqNum = seq => {
    return sleep(1000).then(async function () {
        await get_matches(seq, 100)
    })
}

const forLoop = async _ => {
    console.log('Start')
    let seq_list = [4517784253, 4520829776, 4522470662, 4524315818, 4525667807, 4526150293, 4528784049, 4529139055, 4530671765, 4532587637]
    for (let i=0; i<seq_list.length; i++) {
        let current_seq = seq_list[i];
        for (let index = 0; index < 300; index++) {
            const wait = await getFromSeqNum(current_seq);
            current_seq = current_seq + 100;
        }
    }

}

forLoop().then(r => console.log("Done."))

/*
get_matches(4517784253, 100)
    .then(async function () {
        sleep(500)
    }).then(async function () {
    await get_matches(4520829776, 100)
}).then(async function () {
    await sleep(500)
}).then(async function () {
    await get_matches(4522470662, 100)
}).then(async function () {
    await sleep(500)
}).then(async function () {
    await get_matches(4524315818, 100)
}).then(async function () {
    await sleep(500)
}).then(async function () {
    await get_matches(4525667807, 100)
}).then(async function () {
    await sleep(500)
}).then(async function () {
    await get_matches(4526150293, 100)
}).then(async function () {
    await sleep(500)
}).then(async function () {
    await get_matches(4528784049, 100)
}).then(async function () {
    await sleep(500)
}).then(async function () {
    await get_matches(4529139055, 100)
}).then(async function () {
    await sleep(500)
}).then(async function () {
    await get_matches(4530671765, 100)
}).then(async function () {
    await sleep(500)
}).then(async function () {
    await get_matches(4532587637, 100)
})

*/

