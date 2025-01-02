var express = require('express');
var router = express.Router();
// import formidable from 'formidable';
//导入db对象
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
//设置数据路径
const adapter = new FileSync(__dirname + '/../data/db.json')
//获取db对象
const db = low(adapter)
const { formidable } = require('formidable')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


//记账本的列表
router.get('/account', function (req, res, next) {
  //获取所有账单信息
  let accounts = db.get('accounts').value();
  res.render('list', { accounts: accounts }); //list是模板名称
});

//新增账单
router.post('/account', function (req, res, next) {
  // console.log(req.body
  //导入shortid
  const shortid = require('shortid')

  // 随机生成一个id
  let id = shortid.generate()
  // 写入数据,利用unshift
  db.get('accounts')
    .unshift({ "id": id, ...req.body })
    .write()
  // res.redirect('/account')
  // {msg:'添加成功哦~~~'}将变量msg传入，能动态显示网页内容
  res.render('success', { msg: '添加成功哦~~~', url: '/account' })
});

//添加新账单
router.get('/create', function (req, res, next) {
  res.render('create')
});

//显示网页的表单
router.get('/portrait', function (req, res, next) {
  res.render('portrait')
});

//删除记录
router.get('/account/:id', function (req, res, next) {
  let id = req.params.id
  db.get('accounts')
   .remove({ id: id })
   .write()
   res.render('success', { msg: '删除成功哦~~~', url: '/account' })

  // res.redirect('/account')
});

//处理用户的文件上传
router.post('/portrait', function (req, res, next) {
  // 创建 formidable 实例对象，里面是配置项的设置
  const form = formidable({
    multiples: true,
    //设置文件上传后的保存目录  记住绝对路径这样写/../public/images
    uploadDir: __dirname + '/../public/images',
    // 保存上传文件后缀名
    keepExtensions: true,
    // 保留原始文件名
    keepExtensions: true,
    // 上传文件大小限制，单位：MB
    maxFileSize: 2 * 1024 * 1024  // 2MB

  });
  //解析请求报文
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    //服务器保存访问文件的url
    let url = '/images/' + files.portrait[0].newFilename //将来保存到数据库中

    res.send(url);

    // console.log(fields);  //多选框，文本输入框等等放这里
    // console.log(files);    //上传的文件保存的地方
    // res.send("OK")
    // res.json({ fields, files });
  });
  // res.send('上传成功');
});


module.exports = router;
