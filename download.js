const express = require('express')
const router = express.Router()
const fs = require('fs')
const { data } = require('./testdata.json');    
//下载请求实现
router.get('/download/:id.html', (req, res) => {
    // 获取id参数
    let { id } = req.params;
    // 将对应id的数据存到worker里面
    let download = data.find(item => {
        // consle.log(item)
        if (item.id === Number(id)) {
            return true;
        }
    });
    const jsonData = JSON.stringify(download)
    fs.writeFileSync(`./workerData/worker${id}Info.json`, jsonData)
    // 如果download存在，服务器写入文件并返回下载
    if (download) {
        res.download(`./workerData/worker${id}Info.json`) // 下载
        // res.json(worker);   
    } else {
        // 如果worker不存在，返回404
        res.status(404).json({
            state: 404,
            message: 'Worker not found'
        });
    }

})
//图片下载实现
router.get('/img/:id.html', (req, res) => {
let {id} = req.params
    pathes = `./public/img/${id}picture.jpg`
    res.download(pathes)    
})

module.exports = router
