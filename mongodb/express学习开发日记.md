```

```

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

   



​	