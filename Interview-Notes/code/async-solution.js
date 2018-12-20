// 传统方法-回调地狱
ajax(url, () => {
  // 处理逻辑
  ajax(url1, () => {
    // 处理逻辑
    ajax(url2, () => {
      // 处理逻辑
    })
  })
})

// Generator方法解决
function* fetch() {
  yield ajax(url, () => { })
  yield ajax(url1, () => { })
  yield ajax(url2, () => { })
}
let it = fetch()
let result1 = it.next()
let result2 = it.next()
let result3 = it.next()

//  Promise的方法解决
ajax(url)
  .then(res => {
    console.log(res)
    return ajax(url1)
  }).then(res => {
    console.log(res)
    return ajax(url2)
  }).then(res => console.log(res))


// 异步终极解决方案， async await
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch(url)
  await fetch(url1)
  await fetch(url2)
}