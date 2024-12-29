const express = require('express')
// 创建路由对象
const router = express.Router()
const fs = require('fs');

const path = require('path'); //用于绝对路径生成
//创建路由规则
router.get('/p',(req, res) => {
    fs.readFile(path.resolve( 'C:/Users/wh826/express/p/p.html') ,(error,data) => {
        if(error) {
            console.error(error);
            return;
        }
        res.end(data);
    })
})
router.get('/p:id',(req, res) => {
    let { id } = req.params;
    fs.readFile(`C:/Users/wh826/express/p/p${id}.html`,(error,data) => {
        if(error) {
            console.error(error);
            return;
        }
        res.end(data);
    })
})

//暴露router
module.exports = router;

