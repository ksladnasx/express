//导入要用的mongoose
const mongoose = require('mongoose')
//导入配置文件的属性
const {DBHOST, DBPORT, DBNAME} = require('../config/config')

  // 连接成功后，开始创建 schema设置文档的属性以及属性值的类型
  const AccountSchema = new mongoose.Schema({
   title:{
    type: String,
    required: true //设为必填项

   },
   time: {
    type: Date,
    required: true,
    default: Date.now //default设置默认的创建时间为当前时间
    //required: true //设为必填项
    //unique: true  //unique保证每一项的值在集合中是唯一的,但是必须创建集合才能有效
    //index: true  //index建立索引，提高查询速度
    //sparse: true  //sparse 使得在查询时忽略空值，提高查询速度
    //validate: {
    // validator: function(v) {
    //    return /^\d{4}-\d{2}-\d{2}$/.test(v);
    // },
    // message: 'Date must be in YYYY-MM-DD format'
    // }
   }, //Date是一个日期对象
   //类型
   type:{
    type:Number,
    default:-1
   },
   //金额
   account:{
    type:Number,
    required: true //设为必填项
   },
   //备注
   remark:{
    type: String,
    // required: true //设为必填项
   }
   
});


// 定义模型对象，是对文档操作的一个封装对象，第一个参数是模型名称，第二个参数是 schema
const AccountModel = mongoose.model('account', AccountSchema);


// 暴露模型对象
module.exports = AccountModel;
