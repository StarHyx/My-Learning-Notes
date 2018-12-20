Function.prototype.myCall = function(context) {
	if (typeof context !== "function") {
		throw new TypeError("Error, Require function");
	}
	context = context || window;
	context.fn = this;
	const args = [...arguments].slice(1);
	const result = context.fn(...args);
	delete context.fn;
	return result;
};

// apply和call的实现方式基本一致，就是传参方式略有区别
Function.prototype.myApply = function(context) {
	if (typeof context !== "function") {
		throw new TypeError("Error, Require function");
	}
	context = context || window;
	context.fn = this;
	let result;
	if (arguments[1]) {
		result = context.fn(...arguments[1]);
	} else {
		result = context.fn;
	}
	delete context.fn;
	return result;
};

Function.prototype.myBind = function (context) {
	if (typeof this !== 'function') {
		throw new TypeError('Error')
	}
	const _this = this
	const args = [...arguments].slice(1)
	// 返回一个函数
	return function F() {
		// 因为返回了一个函数，我们可以 new F()，所以需要判断
		if (this instanceof F) {
			return new _this(...args, ...arguments)
		}
		return _this.apply(context, args.concat(...arguments))
	}
}

function myNew() {
	// 创建一个空对象
	let obj = Object.create(null)
	// 获取构造函数
	let Con = [].shift.call(arguments) // 传入的第一个值是构造对象
	// 设置空对象的原型
	obj.__proto__ = Con.prototype
	// 绑定 this 并执行构造函数
	let result = Con.apply(obj, arguments)
	// 确保返回值为对象
	return typeof result === 'object' ? result : obj
}

function myInstanceof(left, right) {
	// 获取类型的原型链
	let prototype = right.prototype;
	// 获得对象的原型
	left = left._proto_;
	// 循环判断对象的原型是否等于类型的原型，直到对象原型为 null，因为原型链最终为 null
	while (true) {
		if (left == null) {
			return false;
		}
		if (left == prototype) {
			return true;
		}
		left = left._proto_;
	}
}
