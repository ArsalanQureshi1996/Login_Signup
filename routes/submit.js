var express = require('express');
var router = express.Router();

/* GET submit page. */
router.get('/', function(req, res, next) {
  res.render('submit', { title: 'Express' });
});

module.exports = router;