const fs = require('fs');
const ejs = require('ejs');

const china = "中国"
const weather = "weather is good"

//声明变量
let str = fs.readFileSync("./011.html").toString()
console.log(str)
//使用ejs渲染
let result = ejs.render(str, {china:china,weather})

console.log(result);