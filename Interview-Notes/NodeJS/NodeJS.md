# 关于Node.js的面试知识

## 模块

### 模块机制

每个 node 进程只有一个 VM 的上下文

```javascript
function require(...) {
  var module = { exports: {} };
  ((module, exports) => {
    // Your module code here. In this example, define a function.
    function some_func() {};
    exports = some_func;
    // At this point, exports is no longer a shortcut to module.exports, and
    // this module will still export an empty default object.
    module.exports = some_func;
    // At this point, the module will now export some_func, instead of the
    // default object.
  })(module, module.exports);
  return module.exports;
}
```

> 如果 a.js require 了 b.js, 那么在 b 中定义全局变量 t = 111 能否在 a 中直接打印出来?

每个 .js 能独立一个环境只是因为 node 帮你在外层包了一圈自执行, 所以使用 t = 111 定义全局变量在其他地方当然能拿到. 情况如下:

```javascript
// b.js
(function (exports, require, module, __filename, __dirname) {
  t = 111;
})();

// a.js
(function (exports, require, module, __filename, __dirname) {
  // ...
  console.log(t); // 111
})();
```

> a.js 和 b.js 两个文件互相 require 是否会死循环? 双方是否能导出变量? 如何从设计上避免这种问题?

不会, 先执行的导出其未完成的副本, 通过导出工厂函数让对方从函数去拿比较好避免

模块在导出的只是 `var module = { exports: {...} }`; 中的 exports,

以从 `a.js` 启动为例, `a.js` 还没执行完会返回一个 `a.js` 的 exports 对象的 `未完成的副本` 给 `b.js` 模块。 然后 `b.js` 完成加载，并将 exports 对象提供给 `a.js` 模块。

### 上下文

Node.js 将 VM 的接口暴露了出来, 可以让你自己创建一个新的 js 上下文, 这一点上跟前端 js 还是区别挺大的.

在执行外部代码的时候, 通过创建新的上下文沙盒 (sandbox) 可以避免上下文被污染

```javascript
"use strict";
const vm = require("vm");

let code = `(function(require) {

  const http = require('http');

  http.createServer( (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

vm.runInThisContext(code)(require); // Server running at http://127.0.0.1:8124/
```

## 事件/异步

### Events

`Events` 是 Node.js 中一个非常重要的 core 模块, 在 node 中有许多重要的 core API 都是依赖其建立的. 比如 `Stream` 是基于 `Events` 实现的, 而 `fs`, `net`, `http` 等模块都依赖 `Stream`, 所以 `Events` 模块的重要性可见一斑.

通过继承 `EventEmitter` 来使得一个类具有 node 提供的基本的 event 方法, 这样的对象可以称作 emitter, 而触发(emit)事件的 cb 则称作 listener. **与前端 DOM 树上的事件并不相同, emitter 的触发不存在冒泡, 逐层捕获等事件行为, 也没有处理事件传递的方法**.

Node.js 中 Eventemitter 的 emit 是同步的. 在官方文档中有说明

