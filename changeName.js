const fs = require('fs');
const path = require('path');

// 指定文件夹路径
const folderPath = './public/img';

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    const prefix = 'new_';
    let i = 0
    files.forEach((file) => {
        const oldFilePath = path.join(folderPath, file);
        // 获取文件扩展名
        const ext = path.extname(file);
        // 构建新的文件名
        const newFileName = `${i}` + 'picture.jpg';
        const newFilePath = path.join(folderPath, newFileName);
         i = i + 1;
        fs.rename(oldFilePath, newFilePath, (err) => {
            if (err) {
                console.error('Error renaming file:', err);
            } else {
                console.log(`Renamed ${file} to ${newFileName}`);
            }
        });
    });
});