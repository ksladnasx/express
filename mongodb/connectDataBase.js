//导入要用的mongoose
const mongoose = require('mongoose');
//导入db文件
const db = require('./express-generator/db/db');
//导入模型
const Person = require('./express-generator/models/peoplemodel');

    
//调用函数
db(
    //对应db文件里面的success函数
()=>{
  

    //document
    const person = new Person({
        name: '王21',
        sex: "male",
        age: 22,
        email: 'wanghan.doe@example.com',
        tags: ["外向", "诚实"],
        pub_time: new Date()

    })
    const person2 = new Person({
        name: '李1',
        sex: "male",
        age: 222,
        email: 'wanghan.doe@example.com',
        tags: ["外向", "不诚实"],
        pub_time: new Date()

    })
    const person1 = new Person({
        name: '王3',
        sex: "female",
        age: 21,
        email: 'wanghan.doe@example.com',
        tags: ["不外向", "诚实"],
        pub_time: new Date()

    })
    //新增
    Person.create(person).then((err, person) => {
        if (err) {
            console.error(err);
            return
        }
        // console.log('Created new person:', person);
    });

    //新增多条
    Person.create([person2, person1]).then((err, persons) => {
        if (err) {
            console.error(err);
            return
        }
        // console.log('Created new persons:', persons);
    });


    // //删除一条
    // Person.deleteOne({ name: '王1' }, (err, result) => {
    //     if (err) {
    //         console.error(err);
    //         return
    //     }
    //     console.log('Deleted person:', result);
    // });  

    // // 删除多条（这里删除20岁的）
    // Person.deleteMany({ age: 20 }, (err, result) => {
    //     if (err) {
    //         console.error(err);
    //         return
    //     }
    //     console.log('Deleted persons:', result);
    // });

    // // 查询
    // Person.find({ age: 22 }, (err, persons) => {
    //     if (err) {
    //         console.error(err);
    //         return
    //     }
    //     console.log('Found persons:', persons);
    // });
    ////通过ID查找
    // Person.findById('5e9577b6a605520e716a6941', (err, person) => {
    //     if (err) {
    //         console.error(err);
    //         return
    //     }
    //     console.log('Found person:', person);
    // });
    ////批量获取{ age: {$lt<20} }表示查询年龄小于20的，其余的用其他标识$gt表示大于，$or表示逻辑或
    // Person.find({ age: {$lt<20} }, (err, persons) => {
    //     if (err) {
    //         console.error(err);
    //         return
    //     }
    //     console.log('Found persons:', persons);
    // }).limit(2).skip(1);  //limit(2)表示只取前2个，skip(1)表示跳过前1个

    // // 更新一条
    // Person.updateOne({ name: '王3' }, { $set: { age: 23 } }, (err, result) => {
    //     if (err) {
    //         console.error(err);
    //         return
    //     }
    //     console.log('Updated person:', result);
    // });
    // // 更新多条（将22的都改成24）
    // Person.updateMany({ age: 22 }, { $set: { age: 24 } }, (err, result) => {
    //     if (err) {
    //         console.error(err);
    //         return
    //     }
    //     console.log('Updated persons:', result);
    // });


    // { age: {$lt<20} }表示查询年龄小于20的，其余的用其他标识$gt表示大于，$or表示逻辑或，$and，$gte,$lte,$ne
    //还有正则表达式搜索的方式/22/表示检索带有22的
    // Person.find({ $or: [{ age: {$lt<20} }, { name: /22/ }] }, (err, persons) => {
    //     if (err) {
    //         console.error(err);
    //         return
    //     }
    //     console.log('Found persons:', persons);
    // });
    

    ////个性化读取（把要读取的属性的值设置为1）
    // Person.find.select( { name: 1, age: 0, _id: 0 }).exec((err, persons) => {
    //     if (err) {
    //         console.error(err);
    //         return
    //     }
    //     console.log('Found persons:', persons);
    // }
    // });
        ////方式2
    // Person.find({ age: {$lt<20} }, { name: 1, age: 1, _id: 0 }, (err, persons) => {
    //     if (err) {
    //         console.error(err);
    //         return
    //     }
    //     console.log('Found persons:', persons);
    // });

    ////数据排序  { age: -1 }表示按age降序排序
    // Person.find().sort({ age: -1 }).exec((err, persons) => {
    //     if (err) {
    //         console.error(err);
    //         return
    //     }
    //     console.log('Found persons:', persons);
    // });  

    ////数据截取skip(1)表示跳过前一个limit(2)表示截取跳过后剩下的前两个
    // Person.find()
    // .sort({ age: -1 })
    // .limit(2)
    // .skip(1)
    // .exec((err, persons) => {
    //     if (err) {
    //         console.error(err);
    //         return
    //     }
    //     console.log('Found persons:', persons);
    // });


    console.log('MongoDB connected!');
}
//对应db文件里面的error函数
,()=>{
    console.error.bind(console, 'connection error:');
    console.log('数据库连接失败');
}
); 

//once表示事件监听只执行，on是对绑定的事件可以绑定多次
