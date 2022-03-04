//call
Function.prototype.myCall = function (context,...args) {
  if(typeof this !== 'function'){
      throw new Error(this + "it's not callable");
  }
  //args默认值为[],这里不用进行判断。
  context = Object(context || globalThis);
  const _symbol = Symbol();
  context[_symbol] = this;
  let result = context[_symbol](...args);
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
  expect(fn.myCall(this, 1, 2, 3)).toEqual(fn.call(this, 1, 2, 3));
  //空参数测试1
  expect(fn.myCall(this)).toEqual(fn.call(this));
  //空参数测试2
  expect(fn1.myCall()).toEqual(fn1.call());
  //this指向测试
  let objTest = { test: 111 };
  expect(fn1.myCall(objTest)).toEqual(fn1.call(objTest));
  //toObject测试
  expect(typeof fn1.myCall(1)).toBe(typeof fn1.call(1))
});
