# 异步相关的知识总结

## 并发和并行的区别

**并发是宏观概念**，分别有任务 A 和任务 B，在一段时间内通过任务间的切换完成了这两个任务，这种情况就可以称之为并发。

**并行是微观概念**，假设 CPU 中存在两个核心，那么就可以同时完成任务 A、B。同时完成多个任务的情况就可以称之为并行。

## 回调地狱

```javascript
ajax(url, () => {
    // 处理逻辑
    ajax(url1, () => {
        // 处理逻辑
        ajax(url2, () => {
            // 处理逻辑
        })
    })
})
```

回调地狱的问题：

+ 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身
+ 嵌套函数一多，就很难处理错误
+ 不能使用 try catch 捕获错误，不能直接 return。

## Generator

```javascript
function *foo(x) {
  let y = 2 * (yield (x + 1))
  let z = yield (y / 3)
  return (x + y + z)
}
let it = foo(5)
console.log(it.next())   // => {value: 6, done: false}
console.log(it.next(12)) // => {value: 8, done: false}
console.log(it.next(13)) // => {value: 42, done: true}

```

对于上述代码：

+ `Generator` 函数调用和普通函数不同，它会返回一个迭代器
+ 当执行第一次 `next` 时，传参会被忽略，并且函数暂停在 `yield (x + 1)` 处，所以返回 `5 + 1 = 6`
+ 当执行第二次 `next` 时，传入的参数等于上一个 `yield` 的返回值，如果不传参，`yield` 永远返回 `undefined`。此时 `let y = 2 * 12`，所以第二个 `yield` 等于 `2 * 12 / 3 = 8`
+ 当执行第三次 `next` 时，传入的参数会传递给 `z`，所以 `z = 13, x = 5, y = 24`，相加等于 `42`

所以可以用`Generator`函数解决回调地狱的问题

``` javascript
function *fetch() {
    yield ajax(url, () => {})
    yield ajax(url1, () => {})
    yield ajax(url2, () => {})
}
let it = fetch()
let result1 = it.next()
let result2 = it.next()
let result3 = it.next()
```

## Promise

`Promise` 翻译过来就是承诺的意思，这个承诺会在未来有一个确切的答复，并且该承诺有三种状态，分别是：

+ 等待（pending）
+ 完成 （resolved）
+ 拒绝（rejected）

`Promise`一旦从`pending`状态变成为其他状态就永远不能更改状态了，也就是说一旦状态变为 `resolved` 后，就不能再次改变

<img src='./image/promisestatus.png' width='400px'>

在构造 `Promise` 的时候，构造函数内部的代码是立即执行的

```javascript
new Promise((resolve, reject) => {
  console.log('new Promise')
  resolve('success')
})
console.log('finifsh')
// new Promise -> finifsh
```

`Promise` 实现了链式调用，也就是说每次调用 `then` 之后返回的都是一个 `Promise`，并且是一个全新的 `Promise`，原因也是因为状态不可变。如果在 `then` 中 使用了 `return`，那么 `return` 的值会被 `Promise.resolve()` 包装

```javascript
Promise.resolve(1)
  .then(res => {
    console.log(res) // => 1
    return 2 // 包装成 Promise.resolve(2)
  })
  .then(res => {
    console.log(res) // => 2
  })
```

所以之前回调地狱的例子可以改写为

```javascript
ajax(url)
  .then(res => {
      console.log(res)
      return ajax(url1)
  }).then(res => {
      console.log(res)
      return ajax(url2)
  }).then(res => console.log(res))
```

Promise的缺点：

+ 无法取消
+ 错误需要通过回调函数捕获


## Async Await

一个函数如果加上 `async` ，那么该函数就会返回一个 `Promise`

<img src='./image/asynctest.png' width='300px'>

`async` 就是将函数返回值使用 `Promise.resolve()` 包裹了下，和 `then` 中处理返回值一样，并且 `await` 只能配套 `async` 使用

```javascript
async function test() {
  let value = await sleep()
}
```

async await的优缺点：

+ 处理then的调用链，更加清晰准确地写出代码，优雅处理回调地域问题
+ `await`将异步代码改为同步，如果多个异步代码没有依赖性且使用`await`，性能会降低

```javascript
// 异步终极解决方案
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch(url)
  await fetch(url1)
  await fetch(url2)
}
```

<img src='./image/asyncdemo.png' width='300px'>

对于上段代码输出结果的理解：

+ 首先函数`b`先执行，在执行到 `await 10` 之前变量 `a` 还是 0，因为 `await` 内部实现了 `generator` ，`generator` 会保留堆栈中东西，所以这时候 `a = 0` 被保存了下来
+ 因为 `await` 是异步操作，后来的表达式不返回 `Promise` 的话，就会包装成 `Promise.reslove(返回值)`，然后会去执行函数外的同步代码, 输出`a = 1`
+ 同步代码执行完毕后开始执行异步代码，将保存下来的值拿出来使用，这时候 `a = 0 + 10`

`await` 就是 `generator` 加上 `Promise` 的语法糖，且内部实现了自动执行 `generator`


## 常用定时器函数

`setInterval` 作用和 `setTimeout` 基本一致，只是该函数是每隔一段时间执行一次回调函数。通常来说不建议使用 `setInterval`。第一，它和 `setTimeout` 一样，不能保证在预期的时间执行任务。第二，它存在执行累积的问题：

```javascript
function demo() {
  setInterval(function(){
    console.log(2)
  },1000)
  sleep(2000)
}
demo()

```

以上代码在浏览器环境中，如果定时器执行过程中出现了耗时操作，多个回调函数会在耗时操作结束以后同时执行，这样可能就会带来性能上的问题。

如果有循环定时器的要求，可以通过 `requestAnimationFrame` 实现

```javascript
function setInterval(callback, interval) {
  const now = Date.now
  let startTime = now()
  let endTime = startTime
  let intervalTimer
  const loop = () => {
    intervalTimer = window.requestAnimationFrame(loop)
    endTime = now()
    if (endTime - startTime >= interval) {
      startTime = endTime = now()
      callback()
    }
  }
  intervalTimer = window.requestAnimationFrame(loop)
  return this.intervalTimer
}

setInterval(() => {
  console.log(1)
}, 1000)
```

首先 `requestAnimationFrame` 自带函数节流功能，可以保证只在 16 毫秒内只执行一次，并且该函数的延时效果是精确的，没有其他定时器时间不准的问题，当然也可以通过该函数来实现 `setTimeout`。

## 手写Promise

[Promise A+规范](http://www.ituring.com.cn/article/66566)

大体框架

```javascript
// 首先我们创建三个常量用于表示状态，对于经常使用的一些值都应该通过常量来管理，便于开发及后期维护
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
  // 在函数体内部首先创建了常量 that，因为代码可能会异步执行，用于获取正确的 this 对象
  const that = this
  //一开始 Promise 的状态应该是 pending
  that.state = PENDING
  // value 变量用于保存 resolve 或者 reject 中传入的值
  that.value = null
  // resolvedCallbacks 和 rejectedCallbacks 用于保存 then 中的回调，
  // 因为当执行完 Promise 时状态可能还是等待中，这时候应该把 then 中的回调保存起来用于状态改变时使用
  that.resolvedCallbacks = []
  that.rejectedCallbacks = []
}
```

完善resolve和reject函数(写在MyPromise里)

```javascript

// 首先两个函数都得判断当前状态是否为等待中，因为规范规定只有等待态才可以改变状态
// 将当前状态更改为对应状态，并且将传入的值赋值给 value
// 遍历回调数组并执行
function resolve(value) {
  if (that.state === PENDING) {
    that.state = RESOLVED
    that.value = value
    that.resolvedCallbacks.map(cb => cb(that.value))
  }
}

function reject(value) {
  if (that.state === PENDING) {
    that.state = REJECTED
    that.value = value
    that.rejectedCallbacks.map(cb => cb(that.value))
  }
}
```

执行promise中传入的函数(写在MyPromise里)

```javascript
try {
  fn(resolve, reject)
} catch (e) {
  that.reject(e)
}
```

实现`then`函数

```javascript
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  const that = this
  // 首先判断两个参数是否为函数类型，因为这两个参数是可选参数
  // 当参数不是函数类型时，需要创建一个函数赋值给对应的参数，同时也实现了透传
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : r => {
          throw r
        }
  // 接下来就是一系列判断状态的逻辑，
  // 当状态不是等待态时，就去执行相对应的函数。
  // 如果状态是等待态的话，就往回调函数中 push 函数
  if (that.state === PENDING) {
    that.resolvedCallbacks.push(onFulfilled)
    that.rejectedCallbacks.push(onRejected)
  }
  if (that.state === RESOLVED) {
    onFulfilled(that.value)
  }
  if (that.state === REJECTED) {
    onRejected(that.value)
  }
}
```

测试结果

<img src='./image/mypromisetest.png' width='500px'>

以上实现的是简易版Promise, 实现完整A+规范的Promise参考 https://github.com/xieranmaya/blog/issues/3

## Eventloop

### 进程与线程

**进程描述了 CPU 在运行指令及加载和保存上下文所需的时间**，放在应用上来说就代表了一个程序。线程是进程中的更小单位，描述了执行一段指令所需的时间。

把这些概念拿到浏览器中来说，当你打开一个 Tab 页时，其实就是创建了一个进程，一个进程中可以有多个线程，比如渲染线程、JS 引擎线程、HTTP 请求线程等等。当发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能就会被销毁。

### 执行栈

执行栈是一个存储函数调用的栈结构，遵循先进后出的原则。当开始执行 JS 代码时，首先会执行一个 `main` 函数，然后执行我们的代码。根据先进后出的原则，后执行的函数会先弹出栈.栈可存放的函数是有限制的，一旦存放了过多的函数且没有得到释放的话，就会出现爆栈的问题，所以在递归调用时要格外注意。

### 浏览器中的Eventloop

遇到异步的代码时，会被**挂起**并在需要执行的时候加入到 Task（有多种 Task） 队列中。一旦执行栈为空，Eventloop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行，所以本质上来说 JS 中的异步还是同步行为。

<img src='./image/browsereventloop.png' width='500px'>

不同的任务源会被分配到不同的 Task 队列中，任务源可以分为 `微任务（microtask）` 和 `宏任务（macrotask）`。在 ES6 规范中，microtask 称为 `jobs`，macrotask 称为 `task`。

```javascript
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}
async1()

// async1()代码等同于
// new Promise((resolve, reject) => {
//   console.log('async2 end')
//   // Promise.resolve() 将代码插入微任务队列尾部
//   // resolve 再次插入微任务队列尾部
//   resolve(Promise.resolve())
// }).then(() => {
//   console.log('async1 end')
// })

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
// 输出顺序为
// script start
// async2 end
// Promise
// script end
// promise1
// promise2
// async1 end
// setTimeout

```

Eventloop 执行顺序如下所示：

+ 首先执行同步代码，这属于宏任务
+ 当执行完所有同步代码后，执行栈为空，查询是否有异步代码需要执行
+ 执行所有微任务
+ 当执行完所有微任务后，如有必要会渲染页面
+ 然后开始下一轮 Eventloop，执行宏任务中的异步代码，也就是 setTimeout 中的回调函数

微任务包括 `process.nextTick` ，`promise` ，`Object.observe` ，`MutationObserver`。
宏任务包括 `script` ， `setTimeout` ，`setInterval` ，`setImmediate` ，`I/O` ，`UI rendering`

### Node中的Eventloop

**Node 中的 Eventloop 和浏览器中的是完全不相同的东西。**Node 的 Eventloop 分为 6 个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

<img src='./image/nodeeventloop.png' width='500px'>

#### timer

`timers` 阶段会执行 `setTimeout` 和 `setInterval` 回调，并且是由 `poll` 阶段控制的。
同样，在 Node 中定时器指定的时间也不是准确时间，只能是尽快执行。

#### I/O

I/O 阶段会处理一些上一轮循环中的少数未执行的 I/O 回调

#### idle, prepare

#### poll

poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情

+ 回到 timer 阶段执行回调
+ 执行 I/O 回调

并且在进入该阶段时如果没有设定了 `timer` 的话，会发生以下两件事情

+ 如果 `poll` 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
+ 如果 `poll` 队列为空时，会有两件事发生
  + 如果有 `setImmediate` 回调需要执行，`poll` 阶段会停止并且进入到 `check` 阶段执行回调
  + 如果没有 `setImmediate` 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去，当然设定了 `timer` 的话且 `poll` 队列为空，则会判断是否有 `timer` 超时，如果有的话会回到 `timer` 阶段执行回调。

#### check

check 阶段执行 `setImmediate`

#### close callbacks

close callbacks 阶段执行 close 事件

#### 例子

```javascript
setTimeout(() => {
    console.log('setTimeout')
}, 0)
setImmediate(() => {
    console.log('setImmediate')
})
```

`setTimeout` 可能执行在前，也可能执行在后

+ 首先 `setTimeout(fn, 0) === setTimeout(fn, 1)`，这是由源码决定的
+ 进入事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 `timer` 阶段就会直接执行 `setTimeout` 回调
+ 那么如果准备时间花费小于 1ms，那么就是 `setImmediate` 回调先执行了

```javascript
const fs = require('fs')

fs.readFile(__filename, () => {
    setTimeout(() => {
        console.log('timeout');
    }, 0)
    setImmediate(() => {
        console.log('immediate')
    })
})
```

在上述代码中，`setImmediate` 永远先执行。因为两个代码写在 IO 回调中，IO 回调是在 `poll` 阶段执行，当回调执行完毕后队列为空，发现存在 `setImmediate` 回调，所以就直接跳转到 `check` 阶段去执行回调了。


上面介绍的都是 macrotask 的执行情况，对于 microtask 来说，它会在以上每个阶段完成前**清空 microtask 队列**，下图中的 Tick 就代表了 microtask

<img src='./image/nodemicrotask.png' width='400px'>

#### proceess.nextTick

Node 中的 `process.nextTick`，这个函数其实是独立于 `Eventloop` 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会**清空队列中的所有回调函数**，并且优先于其他 microtask 执行。

```javascript
setTimeout(() => {
 console.log('timer1')

 Promise.resolve().then(function() {
   console.log('promise1')
 })
}, 0)

process.nextTick(() => {
 console.log('nextTick')
 process.nextTick(() => {
   console.log('nextTick')
   process.nextTick(() => {
     console.log('nextTick')
     process.nextTick(() => {
       console.log('nextTick')
     })
   })
 })
})
```

无论如何，永远都是先把 nextTick 全部打印出来。
<img src='./image/nodetest.png' width='500px'>