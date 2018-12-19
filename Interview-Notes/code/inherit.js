// 组合继承
function Parent(value) {
	this.val = value;
}
Parent.prototype.getValue = function() {
	console.log(this.val);
};
function Child(value) {
	Parent.call(this, value);
}
Child.prototype = new Parent();

const child = new Child(1);

child.getValue(); // 1
child instanceof Parent; // true

// 寄生组合继承
function Parent(value) {
	this.val = value;
}
Parent.prototype.getValue = function() {
	console.log(this.val);
};

function Child(value) {
	Parent.call(this, value);
}
Child.prototype = Object.create(Parent.prototype, {
	constructor: {
		value: Child, // 核心
		enumerable: false, // 不可枚举（不能用for…in遍历）
		writable: true, // 可写
		configurable: true // 可配置
	}
});

const child = new Child(1);

child.getValue(); // 1
child instanceof Parent; // true

// Class继承
class Parent {
	constructor(value) {
		this.val = value;
	}
	getValue() {
		console.log(this.val);
	}
}
class Child extends Parent {
	constructor(value) {
		super(value);
		this.val = value;
	}
}
let child = new Child(1);
child.getValue(); // 1
child instanceof Parent; // true
