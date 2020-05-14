let fetch = require("node-fetch");

async function get_matches(start, amount, key="8F248B8D4DE625716426DD2A183961CD") {
    let url = "https://api.steampowered.com/IDOTA2Match_205790/GetMatchHistory/v1/?min_players=10&game_mode=1&key=" + key + "&start_at_match_id=" + start + "&matches_requested=" + amount;
    fetch(url, {
        method: "GET"
    }).then(function (response) {
        if (response.status !== 200) {
            console.log("Status error")
            return;
        }
        response.json().then(function (data) {
            //requested data handler
            console.log(data)
        })
    }).catch(function (error) {
        console.log(error);
    })

}