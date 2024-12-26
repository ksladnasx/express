//导入express
const express = require('express');
//创建应用对象
const app = express();
fs = require('fs');
//导入json数据（解构赋值直接定位到worker）
const { data } = require('./testdata.json');
//判断登录成功的标志
flag = false
//使用body-parser之间件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extends: false}));
app.use(bodyParser.json())


//主页面
app.get('/', (req, res) => {
    
   if(flag==false){
    res.redirect('/content')
   }else{
    flag = false;
    fs.readFile(__dirname + '/homepage.html', 'utf8', (err,data) => {
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
</head>
<body>
    <h1>Hello, Worker!</h1>
    <p>This is a simple HTML page that displays a greeting message from a worker.</p>
           <p>id: ${worker.id}</p> 
           <p>name: ${worker.name}</p> 
           <p>age: ${worker.age}</p> 
           <p>email: ${worker.email}</p> 
           <p>phone: ${worker.phone}</p> 
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


//下载请求实现
app.get('/download/:id.html', (req, res) => {
    // 获取id参数
    let { id } = req.params;
    if (id > 12) {
        res.status(404).json({
            state: 404,
            message: 'Worker not found'
        });
        return;
    }
    // console.log(id)
    // 将对应id的数据存到worker里面
    let download = data.find(item => {
        // consle.log(item)
        if (item.id === Number(id)) {
            return true;
        }
    });
    const jsonData = JSON.stringify(download)
    fs.writeFileSync(`worker${id}Info.json`, jsonData)
    // 如果download存在，服务器写入文件并返回下载
    if (download) {
        res.download(`worker${id}Info.json`) // 下载
        // res.json(worker);   
    } else {
        // 如果worker不存在，返回404
        res.status(404).json({
            state: 404,
            message: 'Worker not found'
        });
    }
})

//响应文件内容
app.get('/content', function (req, res) {
    fs.readFile(__dirname + '/post_request_send.html', (error, data) => {
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
            res.setHeader('Content-Type',  'text/html');
            res.end(data, 'utf-8');
        }
    })
})



//登录实现
//假设的账号密码
loginname = "wanghan"
loginpassword = "123456"
// 接收post请求并判断是否账号密码正确
app.post('/login', function (req, res) {
    console.log(req.body);
    let { username, password } = req.body;
    username = req.body.username
    password = req.body.password;
    // console.log(username, password) 
    // console.log(req.body)
    if (username === loginname && password === loginpassword) {
        flag = true;
        fs.readFile(__dirname + '/watch.html',(err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            res.end(data);
        })
        // res.sendFile(__dirname+'/homepage.html');
        // req.redirect('/')
    } else {
        res.send(`<h1>Login failed!</h1>
            <button><a href="http://192.168.1.105:3000/content">Click to back</a></button>
            `);
        
    }
    
    // res.send('POST request body received');     
})
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
    console.log('Server is running at http://localhost:3000');
})