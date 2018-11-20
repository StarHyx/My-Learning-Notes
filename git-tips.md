# 一些有用的git技巧

fatal: refusing to merge unrelated histories

```shell
git pull origin master --allow-unrelated-histories`
```

`.gitignore`无效解决方法

```shell
git rm -r --cached .
git add .
git commit -m "fixed untracked files"
```