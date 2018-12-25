// 获取某个文件夹下所有文件名

const fs = require('fs');
const path = require('path');

function traversal(dir) {
  let res = []
  for (let item of fs.readdirSync(dir)) {
    let filepath = path.join(dir, item);
    try {
      let fd = fs.openSync(filepath, 'r');
      let flag = fs.fstatSync(fd).isDirectory();
      fs.close(fd); // TODO
      if (flag) {
        res.push(...traversal(filepath));
      } else {
        res.push(filepath);
      }
    } catch (err) {
      if (err.code === 'ENOENT' && // link 文件打不开
        !!fs.readlinkSync(filepath)) { // 判断是否 link 文件
        res.push(filepath);
      } else {
        console.error('err', err);
      }
    }
  }
  return res.map((file) => path.basename(file));
}

console.log(traversal('.'));