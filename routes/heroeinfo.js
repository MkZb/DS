var express = require('express');
var path = require('path');
var router = express.Router();
var database = require('../public/javascripts/db_interaction')

/* GET graphics listing. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', '/public/heroeinfo.html'));
});

router.post('/', async function (req, res, next) {
    let id = await req.body['id'];
    let type = await req.body['type']
    if (type === 'hero') {
        database.getHeroInfo(id).then(async function (result) {
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
    }
})

module.exports = router;
