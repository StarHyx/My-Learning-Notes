// 实现简易的深拷贝
function deepClone(obj) {
	function isObject(o) {
		return (typeof o === "object" || typeof o === "function") && o !== null;
	}

	if (!isObject(obj)) {
		throw new Error("非对象");
	}

	let isArray = Array.isArray(obj);
	let newObj = isArray ? [...obj] : { ...obj };
	// 静态方法 Reflect.ownKeys() 返回一个由目标对象自身的属性键组成的数组。
	// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
	Reflect.ownKeys(newObj).forEach(key => {
		newObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key];
	});

	return newObj;
}

// MessageChannel版本，不能包含函数
function deepClone(obj) {
	return new Promise(resolve => {
		const { port1, port2 } = new MessageChannel();
		port2.onmessage = ev => resolve(ev.data);
		port1.postMessage(obj);
	});
}
