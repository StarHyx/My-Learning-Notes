# Vue相关面试

## 常见问题

### v-show 与 v-if 区别

`v-show` 只是 CSS 级别的 `display: none`; 和 `display: block`; 之间的切换，而 `v-if `决定是否会选择代码块的内容（或组件）。

频繁操作时，使用 `v-show`，一次性渲染完的，使用 `v-if`

当 `v-if="false"` 时，内部组件是不会渲染的，所以在特定条件才渲染部分组件（或内容）时，可以先将条件设置为 `false`，需要时（或异步，比如 $nextTick）再设置为 `true`，这样可以优先渲染重要的其它内容，合理利用，可以进行性能优化。



### 路由的跳转方式

一般有两种：

+ 通过 `<router-link to="home">`，`router-link` 标签会渲染为 `<a>` 标签，在 template 中的跳转都是用这种；
+ 另一种是编程式导航，也就是通过 JS 跳转，比如 `router.push('/home')`。

### Vue.js 2.x 双向绑定原理

核心的 API 是通过 `Object.defineProperty()` 来劫持各个属性的 `setter / getter`，在数据变动时发布消息给订阅者，触发相应的监听回调

### 什么是 MVVM，与 MVC 有什么区别

MVVM 模式是由经典的软件架构 MVC 衍生来的。当 View（视图层）变化时，会自动更新到 ViewModel（视图模型），反之亦然。View 和 ViewModel 之间通过双向绑定（data-binding）建立联系。与 MVC 不同的是，它没有 Controller 层，而是演变为 ViewModel。

ViewModel 通过双向数据绑定把 View 层和 Model 层连接了起来，而 View 和 Model 之间的同步工作是由 Vue.js 完成的，我们不需要手动操作 DOM，只需要维护好数据状态。