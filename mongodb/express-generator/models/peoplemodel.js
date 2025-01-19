//导入要用的mongoose
const mongoose = require('mongoose')
//导入配置文件的属性
const {DBHOST, DBPORT, DBNAME} = require('../config/config')

  // 连接成功后，开始创建 schema设置文档的属性以及属性值的类型
  const personSchema = new mongoose.Schema({
    name: {
        type: String,
        default: '匿名',  //default设置默认的名字
        required: true,  //required表示必填项
        unique: true  //unique保证每一项的值在集合中是唯一的,但是必须创建集合才能有效
    },
    age: Number,
    email: String,
    sex: {
        type: String,
        enum: ['male', 'female'], //enum限制性
        default: 'male'  //default设置默认的性别
    },
    tags: Array,
    pub_time: Date,
    test: {
        type: mongoose.Schema.Types.Mixed, //mongoose.Schema.Types.Mixed这个指定是任意类型
        default: 0
    }
});

// 定义模型对象，是对文档操作的一个封装对象，第一个参数是模型名称，第二个参数是 schema
const Person = mongoose.model('Person', personSchema);


// 暴露模型对象
module.exports = Person;
