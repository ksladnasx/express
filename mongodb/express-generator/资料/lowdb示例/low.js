const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)
 
// 设置初始化数据
db.defaults({ posts: [], user: {} })
  .write()
 
//添加数据
// Add a post
db.get('posts')
  .push({ id: 1, title: 'lowdb is awesome'})
  .write()
db.get('posts')
  .push({ id: 2, title: 'fafs'})
  .write()
 
// 查询数据
 const allPosts = db.get('posts').value()
 console.log(allPosts) // [{ id: 1, title: 'lowdb is awesome'}]
 
 // 删除数据
 db.get('posts')
  .remove({ id: 1 }) 
//更新数据
 db.get('posts')
  .find({ id: 2 })
  .assign({ title: 'fafs updated' })
  .write()
  
 console.log(db.get('posts').value()) // [{ id: 2, title: 'fafs updated'}]