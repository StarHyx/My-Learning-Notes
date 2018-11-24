# 一些有用的终端命令

#### 将C程序转换为汇编程序

```shell
gcc -S -masm=intel example.c -o example.asm  # intel语法的汇编
gcc -S -O0 -o example.s example.c # .s结尾的汇编
```

#### gcc编译步骤：

1.预处理

```shell
gcc -E test.c -o test.i
```

2.编译为汇编代码

```shell
gcc -S test.i -o test.s
```

3.汇编器将其编译为目标代码

```shell
gcc -c test.s -o test.o
```

4.连接（将其与标准库进行连接）

```shell
gcc test.o -o test
```

#### tar.xz后缀文件的解压（编译linux内核中使用过）

```shell
xz -d filename.tar.xz
tar -xvf  filename.tar
```