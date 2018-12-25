//  Node.js 将 VM 的接口暴露了出来, 可以让你自己创建一个新的 js 上下文, 这一点上跟前端 js 还是区别挺大的.
// 在执行外部代码的时候, 通过创建新的上下文沙盒 (sandbox) 可以避免上下文被污染

"use strict";
const vm = require("vm");
const http = require("http");
const os = require('os')

// let code = `(function(require) {

//   const http = require('http');

//   http.createServer( (request, response) => {
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     response.end('Hello World\\n');
//   }).listen(8124);

//   console.log('Server running at http://127.0.0.1:8124/');
// })`;

// vm.runInThisContext(code)(require); // Server running at http://127.0.0.1:8124/

// console.log(http.METHODS);
// console.log(http.STATUS_CODES);

console.log(os.loadavg());
