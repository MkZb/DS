var express = require('express');
var path = require('path');
var router = express.Router();

/* GET finder page. */

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', '/public/finder.html'));
});

module.exports = router;
