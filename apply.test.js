//apply
Function.prototype.myApply = function (context, args = []) {
  if(typeof this !== 'function'){
      throw new Error(this + "it's not callable");
  }
  //事实上args是支持一个类数组对象的，这里没有在进行细致的判断。
  //类数组对象：只要有一个 `length` 属性和`(0..length-1)`范围的整数属性。
  if(!Array.isArray(args)){
      throw new TypeError('CreateListFromArrayLike called on non-object');
  }
  context = Object(context || globalThis);

  const _symbol = Symbol();
  context[_symbol] = this;
  const result = context[_symbol](...args);
  delete context[_symbol];
  return result;
};
function fn(a, b, c) {
  return [a, b, c];
}
function fn1() {
  return this;
}
test("apply", () => {
  //常规测试
  expect(fn.myApply(this, [1, 2, 3])).toEqual(fn.apply(this, [1, 2, 3]));
  //空参数测试1
  expect(fn.myApply(this)).toEqual(fn.apply(this));
  //空参数测试2
  expect(fn1.myApply()).toEqual(fn1.apply());
  //this指向测试
  let objTest = { test: 111 };
  expect(fn1.myApply(objTest)).toEqual(fn1.apply(objTest));
  //toObject测试
  expect(typeof fn1.myApply(1)).toBe(typeof fn1.apply(1))
});
