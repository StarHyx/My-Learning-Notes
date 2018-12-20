# 关于Webpack的面试点

## Webpack性能优化

关键点：

+ 减少 Webpack 的打包时间
+ 让 Webpack 打出来的包更小

### 减少Webpack打包时间

#### 优化Loader

```javascript
module.exports = {
  module: {

    rules: [
      {
        // js 文件才使用 babel
        test: /\.js$/,
        // 将 Babel 编译过的文件缓存起来，下次只需要编译更改过的代码文件即可，这样可以大幅度加快打包时间
        loader: 'babel-loader?cacheDirectory=true'
        // 只在 src 文件夹下查找
        include: [resolve('src')],
        // 不会去查找的路径， node_modules 中使用的代码都是编译过的，没有必要再去处理一遍。
        exclude: /node_modules/
      }
    ]
  }
}
```

#### HappyPack

受限于 Node 是单线程运行的，所以 Webpack 在打包的过程中也是单线程的，特别是在执行 Loader 的时候，长时间编译的任务很多，这样就会导致等待的情况。

**HappyPack 可以将 Loader 的同步执行转换为并行的**，这样就能充分利用系统资源来加快打包效率了

```javascript
module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [resolve('src')],
        exclude: /node_modules/,
        // id 后面的内容对应下面
        loader: 'happypack/loader?id=happybabel'
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'happybabel',
      loaders: ['babel-loader?cacheDirectory'],
      // 开启 4 个线程
      threads: 4
    })
}

```

#### DllPlugin

DllPlugin 可以将特定的类库提前打包然后引入。这种方式可以极大的减少打包类库的次数，只有当类库更新版本才有需要重新打包，并且也实现了将公共代码抽离成单独文件的优化方案。

```javascript
// 单独配置在一个文件中
// webpack.dll.conf.js
const path = require('path')
const webpack = require('webpack')
module.exports = {
  entry: {
    // 想统一打包的类库
    vendor: ['react']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].dll.js',
    library: '[name]-[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      // name 必须和 output.library 一致
      name: '[name]-[hash]',
      // 该属性需要与 DllReferencePlugin 中一致
      context: __dirname,
      path: path.join(__dirname, 'dist', '[name]-manifest.json')
    })
  ]
}
```

我们需要执行这个配置文件生成依赖文件，接下来我们需要使用 `DllReferencePlugin` 将依赖文件引入项目中

```javascript
// webpack.conf.js
module.exports = {
  // ...省略其他配置
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      // manifest 就是之前打包出来的 json 文件
      manifest: require('./dist/vendor-manifest.json'),
    })
  ]
}
```

#### 代码压缩

+ Webpack3 - `UglifyJS`
+ Webpack4 - `mode = production`

#### 其他一些小的优化点

+ `resolve.extensions`：用来表明文件后缀列表，默认查找顺序是 ['.js', '.json']，如果你的导入文件没有添加后缀就会按照这个顺序查找文件。我们应该尽可能减少后缀列表长度，然后将出现频率高的后缀排在前面
+ `resolve.alias`：可以通过别名的方式来映射一个路径，能让 Webpack 更快找到路径
+ `module.noPars`e：如果你确定一个文件下没有其他依赖，就可以使用该属性让 Webpack 不扫描该文件，这种方式对于大型的类库很有帮助

### 减少打包后的文件体积

#### 按需加载

在开发 SPA 项目的时候，项目中都会存在十几甚至更多的路由页面。如果我们将这些页面全部打包进一个 JS 文件的话，虽然将多个请求合并了，但是同样也加载了很多并不需要的代码，耗费了更长的时间。那么为了首页能更快地呈现给用户，我们希望首页能加载的文件体积越小越好，这时候我们就可以使用按需加载，将每个路由页面单独打包为一个文件。当然不仅仅路由可以按需加载，对于 `loadash` 这种大型类库同样可以使用这个功能。

按需加载鉴于用的框架不同，实现起来都是不一样的,但是底层的机制都是一样的。**都是当使用的时候再去下载对应文件，返回一个 Promise，当 Promise 成功以后去执行回调。**


#### Scope Hoisting

Scope Hoisting 会分析出模块之间的依赖关系，尽可能的把打包出来的模块合并到一个函数中去

比如希望打包两个文件

```javascript
// test.js
export const a = 1
// index.js
import { a } from './test.js'
```

对于这种情况，我们打包出来的代码会类似这样

```javascript
[
  /* 0 */
  function (module, exports, require) {
    //...
  },
  /* 1 */
  function (module, exports, require) {
    //...
  }
]
```

但是如果我们使用 Scope Hoisting 的话，代码就会尽可能的合并到一个函数中去，也就变成了这样的类似代码

```javascript
[
  /* 0 */
  function (module, exports, require) {
    //...
  }
]
```

这样的打包方式生成的代码明显比之前的少多了。如果在 Webpack4 中希望开启这个功能，只需要启用 `optimization.concatenateModules` 就可以了。

```javascript
module.exports = {
  optimization: {
    concatenateModules: true
  }
}
```

#### Tree Shaking

Tree Shaking 可以实现删除项目中未被引用的代码, Webpack 4 开启`生产环境`就会自动启动这个优化功能。

```javascript
// test.js
export const a = 1
export const b = 2
// index.js
import { a } from './test.js'
```

对于以上情况，test 文件中的变量 b 如果没有在项目中使用到的话，就不会被打包到文件中。

## 实现小型打包工具

打包工具的核心原理:

+ 找出入口文件所有的依赖关系
+ 然后通过构建 CommonJS 代码来获取 exports 导出的内容


该工具可以实现以下两个功能

+ 将 ES6 转换为 ES5
+ 支持在 JS 文件中 import CSS 文件

详细代码：

```javascript
const fs = require("fs");
const path = require("path");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const { transformFromAst } = require("babel-core");

// 用Babel转换代码
function readCode(filePath) {
	// 传入一个文件路径参数，然后通过 fs 将文件中的内容读取出来
	const content = fs.readFileSync(filePath, "utf-8");
	// 通过 babylon 解析代码获取 AST，目的是为了分析代码中是否还引入了别的文件
	const ast = babylon.parse(content, {
		sourceType: "module"
	});
	// 通过 dependencies 来存储文件中的依赖
	const dependencies = [];
	traverse(ast, {
		ImportDeclaration: ({ node }) => {
			dependencies.push(node.source.value);
		}
	});
	// 通过 AST 将代码转为 ES5
	const { code } = transformFromAst(ast, null, {
		presets: ["env"]
	});
	// 最后返回了一个对象，对象中包含了当前文件路径、当前文件依赖和当前文件转换后的代码
	return {
		filePath,
		dependencies,
		code
	};
}

// getDependencies函数
// 调用 readCode 函数，传入入口文件
// 分析入口文件的依赖
// 识别 JS 和 CSS 文件

function getDependencies(entry) {
  // 读取入口文件
  const entryObject = readCode(entry);
  // 创建一个数组，该数组的目的是存储代码中涉及到的所有文件
  const dependencies = [entryObject];
  // 遍历所有文件依赖关系, 在遍历的过程中，如果入口文件有依赖其他的文件，那么就会被 push 到这个数组中
  for (const asset of dependencies) {
  // 获得文件目录
  const dirname = path.dirname(asset.filePath);
  // 遍历当前文件依赖关系
  asset.dependencies.forEach(relativePath => {
  	// 获得绝对路径
  	const absolutePath = path.join(dirname, relativePath);
  	// CSS 文件逻辑就是将代码插入到 `style` 标签中
  	if (/\.css$/.test(absolutePath)) {
  		const content = fs.readFileSync(absolutePath, "utf-8");
  		const code = `
          const style = document.createElement('style')
          style.innerText = ${JSON.stringify(content).replace(/\\r\\n/g, "")}
          document.head.appendChild(style)
        `;
  		dependencies.push({
  			filePath: absolutePath,
  			relativePath,
  			dependencies: [],
  			code
  		});
  	} else {
  		// JS 代码需要继续查找是否有依赖关系
  		const child = readCode(absolutePath);
  		child.relativePath = relativePath;
  		dependencies.push(child);
  	}
  });
  }
  // 已经获取到所有的依赖文件
  return dependencies;
}

// 实现打包功能
function bundle(dependencies, entry) {
  let modules = "";
  // 构建函数参数，生成的结构为
  // { './entry.js': function(module, exports, require) { 代码 } }
  dependencies.forEach(dep => {
  const filePath = dep.relativePath || entry;
  modules += `'${filePath}': (
      function (module, exports, require) { ${dep.code} }
    ),`;
  // module 参数对应 CommonJS 中的 module
  // exports 参数对应 CommonJS 中的 module.export
  // require 参数对应我们自己创建的 require 函数
  });
  // 构建 require 函数，目的是为了获取模块暴露出来的内容
  // 调用 require(entry)，也就是 require('./entry.js')，这样就会从函数参数中找到 ./entry.js 对应的函数并执行
  const result = `
    (function(modules) {
      function require(id) {
        const module = { exports : {} }
        modules[id](module, module.exports, require)
        return module.exports
      }
      require('${entry}')
    })({${modules}})
  `;
  // 当生成的内容写入到文件中
  fs.writeFileSync("./bundle.js", result);
}
```

经过打包后的部分简化代码：

```javascript
;(function(modules) {
  function require(id) {
    // 构造一个 CommonJS 导出代码
    const module = { exports: {} }
    // 去参数中获取文件对应的函数并执行
    modules[id](module, module.exports, require)
    return module.exports
  }
  require('./entry.js')
})({
  './entry.js': function(module, exports, require) {
    // 这里继续通过构造的 require 去找到 a.js 文件对应的函数
    var _a = require('./a.js')
    console.log(_a2.default)
  },
  './a.js': function(module, exports, require) {
    var a = 1
    // 将 require 函数中的变量 module 变成了这样的结构
    // module.exports = 1
    // 这样就能在外部取到导出的内容了
    exports.default = a
  }
  // 省略
})

```
