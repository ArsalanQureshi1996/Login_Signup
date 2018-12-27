var express = require('express');
var router = express.Router();

const authCheck= (req,res,next)=>{
  if(req.user){
    res.redirect('/');
  } else{next();}
};

/* GET submit page. */
router.get('/', authCheck, function(req, res, next) {
  res.render('dashboard', { title: 'Express' });
});

module.exports = router;