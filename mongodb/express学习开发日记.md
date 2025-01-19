# express学习开发日记

## Mongodb

### 启动

1. **注意版本**: 6.0以后就将客户端分离了，确实已经移除了`mongo`命令，取而代之的是`mongosh`作为新的MongoDB Shell。需要去专门的页面下载mongosh的压缩包：https://www.mongodb.com/try/download/shell（下载完成后，解压压缩包。通常只需要关注`bin`目录下的`mongosh.exe`文件并解压到对应bin目录就行。）

2. **配置环境变量**: 注意将`MongoDB`的`bin`目录添加到系统的环境变量中，这样就可以在任何命令行窗口中使用`mongosh`命令。
3. **启动：**在命令行中输入`mongosh`启动客户端，输入`mongod`启动服务端
4. **插入方法与查询方法的更改：**在6.0版本中一般是`insertOne()`和`insertMany()`方法来插入，而不是一个insert解决。

## Mongoose常用方法示例

Mongoose 提供了许多用于操作集合（Collection）的方法，这些方法可以帮助你进行数据的增删改查等操作。以下是一些常用的 Mongoose 集合方法：

### 1. 创建文档（Create）

- **`Model.create(doc(s), [options], [callback])`**

  - **功能**：创建一个或多个新的文档，并将其保存到数据库中。
  - **参数**：
    - `doc(s)`：要创建的文档对象或对象数组。
    - `[options]`：可选参数，例如可以设置`session`来指定事务会话。
    - `[callback]`：不再支持的回调函数，现在应使用Promise或async/await。
  - **示例**：

  JavaScript复制

  ```javascript
  const userSchema = new mongoose.Schema({ name: String, age: Number });
  const User = mongoose.model('User', userSchema);
  
  // 创建单个文档
  User.create({ name: '张三', age: 20 })
      .then((user) => {
          console.log(user); // 打印创建的文档
      })
      .catch((err) => {
          console.error(err); // 处理错误
      });
  
  // 创建多个文档
  User.create([{ name: '李四', age: 22 }, { name: '王五', age: 25 }])
      .then((users) => {
          console.log(users); // 打印创建的文档数组
      })
      .catch((err) => {
          console.error(err); // 处理错误
      });
  ```

### 2. 查询文档（Read）

- **`Model.find([conditions], [projection], [options], [callback])`**

  - **功能**：查询满足条件的文档。
  - **参数**：
    - `[conditions]`：查询条件，是一个对象，用于指定查询的过滤条件。
    - `[projection]`：投影，用于指定返回的字段，`1`表示包含，`0`表示排除。
    - `[options]`：查询选项，如`sort`排序、`limit`限制返回数量等。
    - `[callback]`：不再支持的回调函数。
  - **示例**：

  JavaScript复制

  ```javascript
  // 查询所有用户
  User.find()
      .then((users) => {
          console.log(users);
      })
      .catch((err) => {
          console.error(err);
      });
  
  // 查询年龄大于20的用户，并按年龄升序排序，只返回名字和年龄字段
  User.find({ age: { $gt: 20 } }, { name: 1, age: 1, _id: 0 })
      .sort({ age: 1 })
      .then((users) => {
          console.log(users);
      })
      .catch((err) => {
          console.error(err);
      });
  ```

- **`Model.findById(id, [projection], [options], [callback])`**

  - **功能**：根据文档的 `_id` 字段查询文档。
  - **参数**：
    - `id`：文档的 `_id` 值。
    - `[projection]`：投影。
    - `[options]`：查询选项。
    - `[callback]`：不再支持的回调函数。
  - **示例**：

  JavaScript复制

  ```javascript
  User.findById('64c9f7d9e2f5d23d5b7a3b3b')
      .then((user) => {
          console.log(user);
      })
      .catch((err) => {
          console.error(err);
      });
  ```

### 3. 更新文档（Update）

- **`Model.updateOne(conditions, update, [options], [callback])`**

  - **功能**：更新满足条件的第一个文档。
  - **参数**：
    - `conditions`：查询条件。
    - `update`：更新操作，是一个对象，用于指定如何更新文档。
    - `[options]`：更新选项，如`upsert`是否在文档不存在时插入新文档。
    - `[callback]`：不再支持的回调函数。
  - **示例**：

  JavaScript复制

  ```javascript
  // 更新第一个年龄为20的用户的姓名
  User.updateOne({ age: 20 }, { $set: { name: '新名字' } })
      .then((result) => {
          console.log(result); // 打印更新结果，包含匹配的文档数量和实际更新的文档数量等信息
      })
      .catch((err) => {
          console.error(err);
      });
  ```

- **`Model.updateMany(conditions, update, [options], [callback])`**

  - **功能**：更新满足条件的所有文档。
  - **参数**：与`updateOne`类似。
  - **示例**：

  JavaScript复制

  ```javascript
  // 更新所有年龄大于20的用户的年龄加1
  User.updateMany({ age: { $gt: 20 } }, { $inc: { age: 1 } })
      .then((result) => {
          console.log(result);
      })
      .catch((err) => {
          console.error(err);
      });
  ```

- **`Model.findByIdAndUpdate(id, update, [options], [callback])`**

  - **功能**：根据 `_id` 更新文档。
  - **参数**：
    - `id`：文档的 `_id` 值。
    - `update`：更新操作。
    - `[options]`：更新选项，如`new`是否返回更新后的文档。
    - `[callback]`：不再支持的回调函数。
  - **示例**：

  JavaScript复制

  ```javascript
  // 根据id更新用户姓名，并返回更新后的文档
  User.findByIdAndUpdate('64c9f7d9e2f5d23d5b7a3b3b', { $set: { name: '新名字' } }, { new: true })
      .then((user) => {
          console.log(user);
      })
      .catch((err) => {
          console.error(err);
      });
  ```

### 4. 删除文档（Delete）

- **`Model.deleteOne(conditions, [callback])`**

  - **功能**：删除满足条件的第一个文档。
  - **参数**：
    - `conditions`：查询条件。
    - `[callback]`：不再支持的回调函数。
  - **示例**：

  JavaScript复制

  ```javascript
  // 删除第一个年龄为20的用户
  User.deleteOne({ age: 20 })
      .then((result) => {
          console.log(result); // 打印删除结果
      })
      .catch((err) => {
          console.error(err);
      });
  ```

- **`Model.deleteMany(conditions, [callback])`**

  - **功能**：删除满足条件的所有文档。
  - **参数**：与`deleteOne`类似。
  - **示例**：

  JavaScript复制

  ```javascript
  // 删除所有年龄大于20的用户
  User.deleteMany({ age: { $gt: 20 } })
      .then((result) => {
          console.log(result);
      })
      .catch((err) => {
          console.error(err);
      });
  ```

- **`Model.findByIdAndDelete(id, [options], [callback])`**

  - **功能**：根据 `_id` 删除文档。
  - **参数**：
    - `id`：文档的 `_id` 值。
    - `[options]`：可选参数。
    - `[callback]`：不再支持的回调函数。
  - **示例**：

  JavaScript复制

  ```javascript
  // 根据id删除用户
  User.findByIdAndDelete('64c9f7d9e2f5d23d5b7a3b3b')
      .then((result) => {
          console.log(result);
      })
      .catch((err) => {
          console.error(err);
      });
  ```

### 5. 其他常用方法

- **`Model.countDocuments(conditions, [callback])`**

  - **功能**：统计满足条件的文档数量。
  - **参数**：
    - `conditions`：查询条件。
    - `[callback]`：不再支持的回调函数。
  - **示例**：

  JavaScript复制

  ```javascript
  // 统计年龄大于20的用户数量
  User.countDocuments({ age: { $gt: 20 } })
      .then((count) => {
          console.log(count);
      })
      .catch((err) => {
          console.error(err);
      });
  ```

- **`Model.distinct(field, [conditions], [callback])`**

  - **功能**：获取指定字段的不同值。
  - **参数**：
    - `field`：字段名。
    - `[conditions]`：查询条件。
    - `[callback]`：不再支持的回调函数。
  - **示例**：

  JavaScript复制

  ```javascript
  // 获取所有用户的年龄不同值
  User.distinct('age')
      .then((ages) => {
          console.log(ages);
      })
      .catch((err) => {
          console.error(err);
      });
  ```

这些方法是 Mongoose 中进行数据库操作的基础，通过

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

## 注意回调函数写法

### 异步的方式

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

#### 代码解释

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



#### 修改步骤

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

### Promise的方式(推荐)

使用Promise来处理`Model.findById()`和`Model.deleteOne()`的方法也很简单。以下是使用Promise的示例代码，展示了如何查询对应`_id`的文档并获取其`title`值，然后进行删除操作：

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
app.get('/account/:id', (req, res) => {
    let id = req.params.id;

    // 根据_id查询文档
    AccountModel.findById(id)
        .then(account => {
            if (account) {
                let title = account.title;
                console.log('Title:', title);

                // 删除操作
                return AccountModel.deleteOne({ _id: id })
                    .then(deleteResult => {
                        if (deleteResult.deletedCount > 0) {
                            res.render('success', { msg: '删除成功哦~~~', url: '/account', title: title });
                        } else {
                            res.render('error', { msg: '删除失败，未找到文档', url: '/account' });
                        }
                    });
            } else {
                res.render('error', { msg: '未找到文档', url: '/account' });
            }
        })
        .catch(err => {
            console.error(err);
            res.render('error', { msg: '查询或删除过程中出现错误', url: '/account' });
        });
});

// 启动服务器
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
```

#### 代码解释

1. **连接数据库**：使用`mongoose.connect`连接到MongoDB数据库。
2. **定义模型**：定义一个`Account`模型，包含`title`、`time`、`type`和`account`字段。
3. **设置路由**：
   - 使用`app.get`定义一个路由，路径为`/account/:id`，其中`:id`是路由参数，用于捕获URL中的`_id`。 **查询文档**：
     - 使用`AccountModel.findById(id)`根据`_id`查询文档，返回一个Promise。
     - 如果查询到文档，提取`title`值。 **删除操作**：
     - 使用`AccountModel.deleteOne({ _id: id })`删除文档，返回一个Promise。
     - 如果删除成功，使用`res.render`渲染成功页面，并传递`title`值。
     - 如果删除失败，渲染错误页面。
   - 如果查询不到文档，渲染错误页面。
4. **启动服务器**：使用`app.listen`启动服务器，监听3000端口。

#### 错误处理

- **查询错误**：如果`findById`或`deleteOne`过程中出现错误，`catch`块会捕获这些错误，并渲染错误页面。
- **未找到文档**：如果`findById`没有找到文档，直接渲染错误页面。

这样，你就可以使用Promise来处理异步操作，避免使用回调函数，符合Mongoose 6.0及以上版本的要求。

## 小细节

### 添加按钮的点击方式防止误删

```js
<script>
    // 获取所有的删除按钮
    const delBtns = document.querySelectorAll('.delBtn');
    // 给每一个删除按钮添加点击事件
    delBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        // 确认是否要删除
        if (confirm('确定要删除吗？')) {
          // 如果确认，跳转到删除的 URL
          return true
        }else{
          // 阻止默认的跳转行为
          e.preventDefault();
        }
      });
    });
  </script>
```

​	

### ejs的一些传参方式

​	EJS（Embedded JavaScript templating）是一个简单的模板引擎，允许你生成HTML页面。在EJS中，你可以通过多种方式传递参数到模板中，以便在模板中使用这些参数生成动态内容。以下是一些常见的传参方式：

#### 1. 通过`res.render`方法传参

这是最常用的方式，通过`res.render`方法将数据传递到EJS模板中。`res.render`方法的第一个参数是模板文件的名称，第二个参数是一个对象，包含要传递到模板中的数据。

##### 示例代码

JavaScript复制

```javascript
app.get('/user/:id', (req, res) => {
    let userId = req.params.id;
    // 假设你从数据库中查询到了用户信息
    let user = {
        id: userId,
        name: '张三',
        age: 25,
        email: 'zhangsan@example.com'
    };

    // 使用res.render传递数据到EJS模板
    res.render('user', { user: user });
});
```

在EJS模板（`user.ejs`）中，你可以这样使用传递过来的`user`对象：

HTML复制

```html
<!DOCTYPE html>
<html>
<head>
    <title>User Information</title>
</head>
<body>
    <h1>User Information</h1>
    <p>ID: <%= user.id %></p>
    <p>Name: <%= user.name %></p>
    <p>Age: <%= user.age %></p>
    <p>Email: <%= user.email %></p>
</body>
</html>
```

#### 2. 传递数组

你也可以传递数组到EJS模板中，并在模板中遍历数组。

##### 示例代码

JavaScript复制

```javascript
app.get('/users', (req, res) => {
    // 假设你从数据库中查询到了用户列表
    let users = [
        { id: 1, name: '张三', age: 25 },
        { id: 2, name: '李四', age: 30 },
        { id: 3, name: '王五', age: 28 }
    ];

    // 使用res.render传递数据到EJS模板
    res.render('users', { users: users });
});
```

在EJS模板（`users.ejs`）中，你可以使用`<% %>`标签来遍历数组：

HTML复制

```html
<!DOCTYPE html>
<html>
<head>
    <title>User List</title>
</head>
<body>
    <h1>User List</h1>
    <ul>
        <% users.forEach(function(user) { %>
            <li>
                <p>ID: <%= user.id %></p>
                <p>Name: <%= user.name %></p>
                <p>Age: <%= user.age %></p>
            </li>
        <% }) %>
    </ul>
</body>
</html>
```

#### 3. 传递布尔值

你可以在EJS模板中使用布尔值来控制某些内容的显示或隐藏。

#### 示例代码

JavaScript复制

```javascript
app.get('/profile', (req, res) => {
    let isAuthenticated = true; // 假设用户已经登录
    let user = {
        name: '张三',
        age: 25
    };

    // 使用res.render传递数据到EJS模板
    res.render('profile', { isAuthenticated: isAuthenticated, user: user });
});
```

在EJS模板（`profile.ejs`）中，你可以使用`<% if %>`语句来判断是否显示某些内容：

HTML复制

```html
<!DOCTYPE html>
<html>
<head>
    <title>User Profile</title>
</head>
<body>
    <h1>User Profile</h1>
    <% if (isAuthenticated) { %>
        <p>Welcome, <%= user.name %>!</p>
        <p>Your age is <%= user.age %>.</p>
    <% } else { %>
        <p>You are not logged in.</p>
    <% } %>
</body>
</html>
```

#### 4. 传递函数

你可以在EJS模板中传递函数，并在模板中调用这些函数。

##### 示例代码

JavaScript复制

```javascript
app.get('/greet', (req, res) => {
    let user = {
        name: '张三'
    };

    // 定义一个函数
    function greet(name) {
        return `Hello, ${name}!`;
    }

    // 使用res.render传递数据到EJS模板
    res.render('greet', { user: user, greet: greet });
});
```

在EJS模板（`greet.ejs`）中，你可以调用传递过来的函数：

HTML复制

```html
<!DOCTYPE html>
<html>
<head>
    <title>Greet User</title>
</head>
<body>
    <h1>Greet User</h1>
    <p><%= greet(user.name) %></p>
</body>
</html>
```

#### 5. 传递局部变量

你可以在EJS模板中使用局部变量，这些变量可以在模板的任何地方使用。

##### 示例代码

JavaScript复制

```javascript
app.get('/example', (req, res) => {
    // 使用res.render传递数据到EJS模板
    res.render('example', { title: 'Example Page', message: 'Hello, World!' });
});
```

在EJS模板（`example.ejs`）中，你可以使用传递过来的局部变量：

HTML复制

```html
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1><%= message %></h1>
</body>
</html>
```

#### 总结

EJS模板引擎提供了多种传参方式，你可以根据需要传递对象、数组、布尔值、函数等。通过`res.render`方法，你可以将这些参数传递到EJS模板中，并在模板中使用这些参数生成动态内容。这些传参方式非常灵活，可以帮助你构建复杂的动态网页。

# API接口学习

> 免费的接口网址：https://free-api.com/

## Json Server创建接口

#### 1. 安装 Json Server

首先，你需要安装 `json-server`。可以使用 npm 或 yarn 来安装：

sh复制

```sh
npm install -g json-server
```

或者

sh复制

```sh
yarn global add json-server
```

#### 2. 创建数据文件

创建一个 JSON 文件来存储歌曲信息。假设文件名为 `db.json`，内容如下：

JSON复制

```json
{
  "songs": [
    {
      "id": 1,
      "title": "Shape of You",
      "artist": "Ed Sheeran",
      "album": "÷ (Deluxe)",
      "releaseYear": 2017
    },
    {
      "id": 2,
      "title": "Blinding Lights",
      "artist": "The Weeknd",
      "album": "After Hours",
      "releaseYear": 2020
    },
    {
      "id": 3,
      "title": "Bad Guy",
      "artist": "Billie Eilish",
      "album": "Happier Than Ever",
      "releaseYear": 2019
    },
    {
      "id": 4,
      "title": "Dance Monkey",
      "artist": "Tones and I",
      "album": "The Kids Are Coming",
      "releaseYear": 2019
    },
    {
      "id": 5,
      "title": "Watermelon Sugar",
      "artist": "Harry Styles",
      "album": "Fine Line",
      "releaseYear": 2019
    }
  ]
}
```

#### 3. 启动 Json Server

在终端中运行以下命令来启动 `json-server`：

sh复制

```sh
json-server --watch db.json --port 3000
```

这将启动一个本地服务器，监听 3000 端口。`--watch` 参数指定要监视的 JSON 文件，`--port` 参数指定服务器端口。

#### 4. 访问接口

启动服务器后，你可以通过以下 URL 访问歌曲信息：

- 获取所有歌曲：`http://localhost:3000/songs`
- 获取单个歌曲：`http://localhost:3000/songs/1`（其中 `1` 是歌曲的 `id`）

## 利用apipost测试接口

#### 1. 安装 ApiPost

如果你还没有安装 ApiPost，可以从 [ApiPost 官网](https://apipost.cn/)下载并安装。

#### 2. 创建请求

打开 ApiPost，创建一个新的请求：

1. **选择请求方法**：选择 `GET` 方法。
2. **输入请求 URL**：输入 `http://localhost:3000/songs`。
3. **发送请求**：点击“发送”按钮，查看响应。

#### 3. 测试获取所有歌曲

- **请求 URL**：`http://localhost:3000/songs`
- **请求方法**：`GET`

发送请求后，你应该会看到类似以下的响应：

JSON

```json
[
  {
    "id": 1,
    "title": "Shape of You",
    "artist": "Ed Sheeran",
    "album": "÷ (Deluxe)",
    "releaseYear": 2017
  },
  {
    "id": 2,
    "title": "Blinding Lights",
    "artist": "The Weeknd",
    "album": "After Hours",
    "releaseYear": 2020
  },
  {
    "id": 3,
    "title": "Bad Guy",
    "artist": "Billie Eilish",
    "album": "Happier Than Ever",
    "releaseYear": 2019
  },
  {
    "id": 4,
    "title": "Dance Monkey",
    "artist": "Tones and I",
    "album": "The Kids Are Coming",
    "releaseYear": 2019
  },
  {
    "id": 5,
    "title": "Watermelon Sugar",
    "artist": "Harry Styles",
    "album": "Fine Line",
    "releaseYear": 2019
  }
]
```

#### 4. 测试获取单个歌曲

- **请求 URL**：`http://localhost:3000/songs/1`（其中 `1` 是歌曲的 `id`）
- **请求方法**：`GET`

发送请求后，你应该会看到类似以下的响应：

JSON

```json
{
  "id": 1,
  "title": "Shape of You",
  "artist": "Ed Sheeran",
  "album": "÷ (Deluxe)",
  "releaseYear": 2017
}
```

### 总结

通过以上步骤，你成功创建了一个包含多个歌曲信息的接口，并使用 ApiPost 测试了这些接口。你可以继续使用 ApiPost 测试其他 HTTP 方法（如 POST、PUT、DELETE）来实现增删改查操作。

