
### Vue Cli3 构建库

在 scripts 中新增一条命令

```json
"script": {
  "lib": "vue-cli-service build --target lib --name mylib --dest lib packages/index.js"
}
```

`--target:` 构建目标，默认为应用模式。这里修改为 lib 启用库模式。
`--dest :` 输出目录，默认 dist。这里我们改成 lib
`entry:` 最后一个参数为入口文件，默认为 src/App.vue。这里我们指定编译 packages/ 组件库目录。