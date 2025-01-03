/** 
 * 
 * @param {*} success 数据库链接成功的回调
 * @param {*} error 数据库链接失败的回调
 */
const {DBHOST, DBPORT, DBNAME} = require('../config/config')

module.exports = function(success,error){//导入mongoose

const mongoose = require('mongoose');

//设置
mongoose.set('strictQuery', true);

// 建立 MongoDB 連接
mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

//设置回调,输出链接状态
mongoose.connection.once('open', () => {
    success()
}
)

mongoose.connection.on('error',()=>{
    error()
    // console.error.bind(console, 'connection error:');
});


mongoose.connection.once('close', () => {
    console.log('MongoDB disconnected!');
});

//设置关闭
setTimeout(() => {
    mongoose.disconnect();
}, 2000)}
