//导入express
const express =  require('express');

//创建应用对象
const app = express();


//创建路由
app.get('/home',(req, res) => {
    res.end('Welcome to the Home page')
    //获取请求的查询字符串
    console.log("请求的查询字符串:"+req.query)
    //获取请求路径
    console.log("请求路径:"+"  "+req.path)
    //获取请求ip
    console.log("获取请求ip is"+req.ip)
    //获取请求头,这里指定获取请求头的host值
    console.log("获取请求头,这里指定获取请求头的host值"+"  "+req.get("host"))
});

//:id表示匹配任意后缀字符串
app.get("/goods/:id.html",  (req, res) => {
    //获取路由参数
    console.log("获取id:"+req.params.id)
    res.setHeader("Content-Type", "text/html;charset=utf-8");
    res.end(`Welcome to the Goods page, goods id is ${req.params.id}`)
});


app.get('/',(req, res) => {
    res.end('Welcome ')
});

//post request

app.post('/login',(req, res) => {
    console.log(req.body);
    res.end('Login success');
});

//put request
app.put('/user/:id',(req, res) => {
    console.log(req.params.id);
    res.end('User updated');
});

//匹配所有类型请求
app.all("/test",(req, res)=>{
    res.end("good test")
})

//404响应，匹配所有路径
app.get('*',(req, res) => {
    res.status(404).end('<h1>Not Found<\h1>');
});


//监听端口，启动服务
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

