var express = require('express');
var router = express.Router();
// import formidable from 'formidable';
//导入db对象
//导入moment
const moment = require('moment')
const FileSync = require('lowdb/adapters/FileSync')
//设置数据路径
const adapter = new FileSync(__dirname + '/../data/db.json')
const { formidable } = require('formidable');
const AccountModel = require('../models/Accountmodel');
const db = require('../db/db')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


//记账本的列表
router.get('/account', function (req, res, next) {
  //获取所有账单信息
  //sort({ time: -1 })按时间倒叙排序
  AccountModel.find().sort({ time: -1 }).then((data) => {
    // console.log(data);   //插入成功的回调
    res.render('list', { accounts: data,moment:moment });  //将moment函数传给ejs方便直接文件里面调用将日期格式化
  }).catch((err) => {
    console.log(err);   //插入失败
  }); 
  
})

  //新增账单
  router.post('/account', function (req, res, next) {
    //先修改time属性类型
    req.body.time = moment(req.body.time).toDate()
    console.log(req.body)
    //插入模型
    AccountModel.create({
      //将所有请求体的内容插入
      ...req.body
    }).then(data=>{
      // console.log(data);   //插入成功的回调
      res.render('success', { msg: '添加成功哦~~', url: '/account',title: data.title})
      // res.redirect('/account')
    }).catch(err=>{
      res.status(500).send(err)
    })
    // res.redirect('/account')

  })

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
    let id = req.params.id;

    // 根据_id查询文档
    AccountModel.findById(id)
        .then(account => {
            if (account) {
                let title = account.title;
                console.log('Title:', title);

                // 删除操作
                return AccountModel.deleteOne({ _id: id })
                    .then(deleteResult => {
                        if (deleteResult.deletedCount > 0) {
                            res.render('success', { msg: '删除成功哦~~~', url: '/account', title: title });
                        } else {
                            res.render('error', { msg: '删除失败，未找到文档', url: '/account' ,title:' '});
                        }
                    });
            } else {
                res.render('未找到文档');
            }
        })
        .catch(err => {
            console.error(err);
            res.render('error', { msg: '查询或删除过程中出现错误', error:err });
        });
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
