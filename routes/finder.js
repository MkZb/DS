var express = require('express');
var path = require('path');
var router = express.Router();
var database = require('../public/javascripts/db_interaction')
let MongoClient = require("mongodb").MongoClient;
const {getMatchInfo} = require('../public/javascripts/db_interaction')


/* GET finder page. */

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../', '/public/finder.html'));
});

router.post('/', async function (req, res, next) {
    let id = await req.body['id'];
    let type = await req.body['type']
    if (type === 'player') {
        database.getPlayerMatches(id).then(async function (result) {
            let client = result[1];
            let data = result[0];
            const count = await data.length;
            if (count === 0) {
                console.log("No player matches found in database.")
                res.send('0');
            } else {
                data.forEach(function (doc) {
                    res.send(doc[id]);
                })
            }
            return client;
        }).then(function (client) {
            client.close();
        }).catch(function (err) {
            console.log(err);
        })
    } else {
        database.getMatchInfo(id).then(async function (result) {
            let client = result[1];
            let data = result[0];
            const count = await data.length;
            if (count === 0) {
                console.log("No matches found in database.")
                res.send('0');
            } else {
                data.forEach(function (doc) {
                    res.send(doc[id]);
                })
            }
            return client;
        }).then(function (client) {
            client.close();
        }).catch(function (err) {
            console.log(err);
        })
    }
});

module.exports = router;
