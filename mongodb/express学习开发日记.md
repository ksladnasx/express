# express学习开发日记

## Mongodb

### 启动

1. **注意版本**: 6.0以后就将客户端分离了，确实已经移除了`mongo`命令，取而代之的是`mongosh`作为新的MongoDB Shell。需要去专门的页面下载mongosh的压缩包：https://www.mongodb.com/try/download/shell（下载完成后，解压压缩包。通常只需要关注`bin`目录下的`mongosh.exe`文件并解压到对应bin目录就行。）

2. **配置环境变量**: 注意将`MongoDB`的`bin`目录添加到系统的环境变量中，这样就可以在任何命令行窗口中使用`mongosh`命令。
3. **启动：**在命令行中输入`mongosh`启动客户端，输入`mongod`启动服务端
4. **插入方法与查询方法的更改：**在6.0版本中一般是`insertOne()`和`insertMany()`方法来插入，而不是一个insert解决。

## 常用方法

增删改查：

​		





## 模块化

1. **models文件夹存模型，每个模型作为一个暴露的js文件，**

   ```js
   
   const mongoose = require('mongoose')
   
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
   
   ​    type: String,
   
   ​    enum: ['male', 'female'], //enum限制性
   
   ​    default: 'male'  //default设置默认的性别
   
     },
   
     tags: Array,
   
     pub_time: Date,
   
     test: {
   
   ​    type: mongoose.Schema.Types.Mixed, //mongoose.Schema.Types.Mixed这个指定是任意类型
   
   ​    default: 0
   
     }
   
   });
   
   // 定义模型对象，是对文档操作的一个封装对象，第一个参数是模型名称，第二个参数是 schema
   
   const Person = mongoose.model('Person', personSchema);
   
   // 暴露模型对象
   
   module.exports = Person;```
   
   
```
   
   **具体需要的时候再用就行,要新添加再在model文件添加就模型文件就行**
   
```js
   const Person = require('./models/peoplemodel');

2. db文件夹存一个暴露的函数，函数接收两个参数success（数据库链接成功的回调）和error，

   ```js
   //直接作为函数暴露
   module.exports = function(success,error){//导入mongoose
   
   const mongoose = require('mongoose');
   
   //设置
   
   mongoose.set('strictQuery', true);
   
   // 建立 MongoDB 連接
   
   mongoose.connect('mongodb://127.0.0.1:27017/test');
   
   //设置回调,输出链接状态
   
   mongoose.connection.once('open', () => {
   //链接成功就执行 success()
     success()
   
   }
   
   )
   
   mongoose.connection.on('error',()=>{
   
     error()
   
   });
   
   mongoose.connection.once('close', () => {
   
     console.log('MongoDB disconnected!');
   
   });
   
   //设置关闭
   
   setTimeout(() => {
   
     mongoose.disconnect();
   
   }, 2000)}
```

   

3. 在真正的执行文件中只需要对db的模板传入这对应两个函数的具体内容就行，实现复用模板

    db(()=>{确保db服务链接启动之后才执行内容})

   ```js
    //导入要用的mongoose
   const mongoose = require('mongoose');
   //导入db文件
   const db = require('./db/db');
   //导入模型
   const Person = require('./models/peoplemodel');
   
   //调用函数
   db(
       //对应db文件里面的success函数
   ()=>{
      // 函数具体操作内容
   },
        //对应db文件里面的error函数
   ()=>{
        // 函数具体操作内容
   } 
   ```


4. 注意因为主机名在变，数据库的名字也在变，所以做一个config文件夹，下面做一个config.js配置文件，需要文件里面的变量直接引入就行，将来更改也只需要改一个文件就行

   ```js
   //配置文件,要用到就导入方便后续统一修改
   module.exports = {
       DBHOST: '127.0.0.1',
       DBPORT: '27017',
       DBNAME: 'test' //数据库名称
   }
   ```

   在需要的文件（如db.js）前面导入（注意解构引用）

   ```js
   const {DBHOST, DBPORT, DBNAME} = require('../config/config')
   
   //使用
   // 建立 MongoDB 連接
   mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);
   ```

   moment将日期字符串解析为对象，然后再转化为日期对象存入数据库
   
   `npm i moment`
   
   使用
   
   `moment('2023-11-22').toData()`
   
   
   
   # 注意回调函数的写法
   
   从 Mongoose 6.0 版本开始，`Model.findById()` 方法不再接受回调函数作为参数。你需要使用 Promise 或 async/await 来处理异步操作。以下是修改后的代码示例，展示了如何使用 async/await 来查询对应 `_id` 的文档并获取其 `title` 值：
   
   JavaScript复制
   
   ```javascript
   const express = require('express');
   const app = express();
   const mongoose = require('mongoose');
   
   // 连接MongoDB数据库
   mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
   
   const accountSchema = new mongoose.Schema({
       title: String,
       time: Date,
       type: Number,
       account: Number
   });
   
   const AccountModel = mongoose.model('Account', accountSchema);
   
   // 设置路由
   app.get('/account/:id', async (req, res) => {
       let id = req.params.id;
   
       try {
           // 根据_id查询文档
           const account = await AccountModel.findById(id);
           if (account) {
               let title = account.title;
               console.log('Title:', title);
   
               // 删除操作
               const deleteResult = await AccountModel.deleteOne({ _id: id });
               if (deleteResult.deletedCount > 0) {
                   res.render('success', { msg: '删除成功哦~~~', url: '/account', title: title });
               } else {
                   res.render('error', { msg: '删除失败，未找到文档', url: '/account' });
               }
           } else {
               res.render('error', { msg: '未找到文档', url: '/account' });
           }
       } catch (err) {
           console.error(err);
           res.render('error', { msg: '查询或删除过程中出现错误', url: '/account' });
       }
   });
   
   // 启动服务器
   app.listen(3000, () => {
       console.log('Server is running on http://localhost:3000');
   });
   ```
   
   ### 代码解释
   
   1. **连接数据库**：使用 `mongoose.connect` 连接到 MongoDB 数据库。
   2. **定义模型**：定义一个 `Account` 模型，包含 `title`、`time`、`type` 和 `account` 字段。
   3. **设置路由**：
      - 使用 `app.get` 定义一个路由，路径为 `/account/:id`，其中 `:id` 是路由参数，用于捕获 URL 中的 `_id`。 **查询文档**：
        - 使用 `await AccountModel.findById(id)` 根据 `_id` 查询文档。
        - 如果查询到文档，提取 `title` 值。 **删除操作**：
        - 使用 `await AccountModel.deleteOne({ _id: id })` 删除文档。
        - 如果删除成功，使用 `res.render` 渲染成功页面，并传递 `title` 值。
        - 如果删除失败，渲染错误页面。
      - 如果查询不到文档，渲染错误页面。
   4. **启动服务器**：使用 `app.listen` 启动服务器，监听 3000 端口。
   
   ### 修改步骤
   
   1. **找到问题代码**：根据错误信息，问题出现在 `express-generator\routes\index.js` 文件的第 67 行。
   2. **修改代码**：将回调函数改为使用 async/await 或 Promise 的方式。
   
   例如，将原来的回调函数代码：
   
   JavaScript复制
   
   ```javascript
   AccountModel.findById(id, (err, account) => {
       // 回调函数中的逻辑
   });
   ```
   
   修改为使用 async/await 的方式：
   
   JavaScript复制
   
   ```javascript
   const account = await AccountModel.findById(id);
   // 后续逻辑
   ```
   
   这样，你就可以避免使用回调函数，符合 Mongoose 6.0 及以上版本的要求。
   
   



​	