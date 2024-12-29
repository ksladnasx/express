//导入express
const express = require('express');
const Prouter = require('./p');
// const login = require('./login');
const download = require('./download');
// const admin = require('./admin');
// const background = require('./background');
//创建应用对象
const app = express();
const fs = require('fs');
const path = require('path'); //用于绝对路径生成
//导入json数据（解构赋值直接定位到worker）
const { data } = require('./testdata.json');
//全局ip导入
let ipconfig = require('./config/ipconfig.json')
let ip = ipconfig.ip
// console.log(ip )

//判断登录成功的标志
let flag = false
// module.exports = {
//     setFlag: function(newValue) {
//         flag = newValue;
//         // console.log(flag)
//     }
// }
//使用body-parser之间件,用于获取后续用户post的username, password
const bodyParser = require('body-parser');
const { error } = require('console');

//设置为解析querystring格式的路由中间件
const urlencodedParser = bodyParser.urlencoded({ extends: false });
//这个是解析json的请求体的中间件
// app.use(bodyParser.json())

//定义中间件函数，用于记录访问的url和ip以及请求时间
function recordMiddleware(req, res, next) {
    //获取url和ip
    let { url, ip } = req;
    //获取当前时间
    let time = new Date().toLocaleString();
    //将信息保存到文件
    fs.appendFileSync(path.resolve(__dirname + '/access.log'), `${ip}      ${req.method}        ${time}     ${ip}:3000${url}\r\n`, 'utf8', (err) => {
        if (err) {
            console.error(err);
        }
    });
    //调用next继续后面的响应请求
    next();
}   
//调用这个函数
app.use(recordMiddleware);

//利用中间件创建全局的静态资源目录,直接网址就可以访问这个文件夹
app.use(express.static(__dirname+'/public'));

//定义防盗链
//http://localhost:3000/content这个访问就会被阻止
//原来的访问就不会
    app.use((req, res, next) => {

        //获取请求的hostname
        let url = req.hostname
        // console.log(url)
        // console.log(hostname.hostname)
        //获取本机的ip
        let stan = new URL(ip)
        // 如果referer来自这个ip，就放行，否则返回403
        if (url == stan.hostname) {
            next();
        } else {
            res.status(403).send('<h1>Forbidden</h1>');
        }
    });
//这个中间件用于根据用户传参判断是否跳转对应页面

//后台界面
// app.use(background)  
// 函数在你需要的请求响应后面添加函数名调用
let checkCodeMassage = (req, res, next) => {
    if (req.query.code == '521') {
        next();
    }
    else {
        res.status(403).send('<h1>Forbidden</h1>');
    }
}

//后台界面
app.get('/admin', checkCodeMassage, (req, res) => {// 函数在你需要的请求响应后面添加函数名调用
    flag = true;
    fs.readFile(__dirname + '/page/backstage.html', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.end(data);
    });
})
//主页面
app.get('/', (req, res) => {
    if (flag == false) {
        res.redirect('/content')
    } else {
        // flag = false;
        fs.readFile(__dirname + '/page/homepage.html', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            res.end(data);
        });
    }
})
// 员工界面展示
app.get('/worker/:id.html', (req, res) => {
    // 获取id参数
    let { id } = req.params;
    // console.log(id)
    // 将对应id的数据存到worker里面
    let worker = data.find(item => {
        // console.log(item)
        if (item.id === Number(id)) {
            return true;
        }
    });

    // 如果worker存在，返回worker的详细信息
    if (worker) {
        res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
    *{
            font-family: 'Times New Roman', Times, serif;
        }
        a{
            text-decoration: none;
        }
    </style>
</head>
<body>
    <h1>Hello, Worker!</h1>
    <p>This is a simple HTML page that displays a greeting message from a worker.</p>
           <p>id: ${worker.id}</p> 
           <p>name: ${worker.name}</p> 
           <p>age: ${worker.age}</p> 
           <p>email: ${worker.email}</p> 
           <p>phone: ${worker.phone}</p> 
            <button><a href="${ip}"><<--back to homepage</a></button>
</body>
</html>`)

        // res.json(worker);   
    } else {
        // 如果worker不存在，返回404
        res.status(404).json({
            state: 404,
            message: 'Worker not found'
        });
    }

})


// //下载请求实现
app.use(download)

//响应文件内容
app.get('/content', function (req, res) {
    fs.readFile(__dirname + '/page/post_request_send.html', (error, data) => {
        if (error) {
            //判断错误类型
            res.setHeader('Content-Type', 'text/html; charset=utf-8');  // 统一返回 HTML 格式的文本，便于调试
            switch (error) {
                case 'ENOENT':
                    res.statusCode = 404;
                    res.end('<h1>404 Not Found</h1>');
                    break;
                case 'ETERM':
                    res.statusCode = 403;
                    res.end('<h1>403 Forbidden</h1>');
                    break;
                case 'ECONNREFUSED':
                    res.statusCode = 503;
                    res.end('Service Unavailable');
                    break;
                default:
                    console.log(error)
                    res.statusCode = 500;
                    res.end('Server is Error');
                    break;
            }
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.end(data, 'utf-8');
        }
    })
})



//登录实现
//假设的账号密码
loginname = "wanghan"
loginpassword = "123456"
// 接收post请求并判断是否账号密码正确
//路由中间件执行之后会在req上添加一个属性body
app.post('/login',urlencodedParser, function (req, res) {
    //解构赋值得到
    let { username, password } = req.body;
    username = req.body.username
    password = req.body.password;
    // console.log(username, password) 
    // console.log(req.body)
    if (username === loginname && password === loginpassword) {
        flag = true;
        fs.readFile(__dirname + '/page/watch.html', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            res.end(data);
        })
    } else {
        res.send(`
            <style type="text/css">
             *{
            font-family: 'Times New Roman', Times, serif;
        }
        a{
            text-decoration: none;
        }
        p{
            color: red;
        }
        h1{
            font-size: 24px;
        }
        button{
            margin-top: 20px;
        }
        body{
            background-color:rgb(12, 181, 248);
        }
        h1, p, button{
            margin: 0;
            padding: 20px;
        }
        button{
            margin: 10px;
            padding: 10px;
            border: none;
            border-radius: 10px;
            background-color:rgb(142, 169, 226);
            color: white;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
        }
        button:hover{
            background-color:rgb(202, 235, 120);
        }
        a:hover{
            color: rgb(25, 151, 190);
        }
        h1, p{
            text-align: center;
        }</style>
           <p><h1>Login failed!</h1></p> 
            <p><button><a href="${ip}content">Click to back</a></button></p>
            `);

    }

    // res.send('POST request body received');     
})
//退出登录
app.get('/logout', function (req, res) {
    flag = false;
    res.redirect("/content")
})


// 神秘网址
app.use(Prouter)

// 重定向
app.get('/other', function (req, res) {
    res.redirect('http://www.baidu.com')
})




// 匹配所有不在上面的请求
app.use((req, res) => {
    res.status(404).send('Not Found');
    // res.end('404: Not Found');  // 也可以返回一个404页面
})




// 监听端口
app.listen(3000, () => {
    console.log(`Server is running at ${ip}`);
})