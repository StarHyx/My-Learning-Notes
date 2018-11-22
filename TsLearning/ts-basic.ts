// 五种基本类型，string, any, number, boolean, void
let myname: string = "hyx";
// myname = 111; // error
let alias: any = 111;
alias = "hyx";
let man: boolean = true;
// 用？表示可选参数
function test(a: string, b?: string, c: string = "jojo") {
	console.log(a);
	console.log(b);
	console.log(c);
}
test("xxx");
// test('xxx', 'yyy');
// test('xxx', 'yyy', 'zzz');

// 自定义类型
class Person {
	name: string;
	age: number;
}
let zhangsan: Person = new Person();
zhangsan.name = "zhangsan";
zhangsan.age = 18;

// 泛型
let workers: Array<Person> = [];
workers[0] = new Person();
// workers[1] = 111; 错误

// 接口
interface IPerson {
	name: string;
	age: number;
}
// 类中调用接口
class CPerson {
	constructor(public config: IPerson) {}
}

let p1 = new CPerson({
	name: "zhangsan",
	age: 20
});

interface Animal {
	eat();
}
// 声明类实现接口
class sheep implements Animal {
	// 类中必须实现eat方法
	eat() {
        console.log("eat grass")
    };
}

class Tiger implements Animal {
    eat() {
        console.log("eat meat");
    }
}

// 常用库的ts类型定义
// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types