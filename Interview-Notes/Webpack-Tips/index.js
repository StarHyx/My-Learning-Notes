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
