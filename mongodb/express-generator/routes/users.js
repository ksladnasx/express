var express = require('express');
var router = express.Router();

/* GET users listing. */
//外层已经写了/user结构了这里就不用了，属于嵌套路由
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
  res.send("用户测试")
});


module.exports = router;
