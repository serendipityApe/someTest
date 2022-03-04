Function.prototype.myBind = function (context, ...rest) {
  if (typeof this !== "function") {
    throw new Error(this + "it's not callable");
  }
  let target = this;
  const targetLength = Math.max(0, target.length - rest.length);
  const list = [];
  for (let i = 0; i < targetLength; i++) {
    list[i] = `$${i}`;
  }
  const binder = function () {
    return target.apply(context, [...rest, ...arguments]);
  };
  return Function(
    `binder`,
    `return function(${list.join(",")}){
          return binder(...arguments);
      }`
  )(binder);
};
function fn(a, b, c) {
  return [a, b, c];
}
function fn1() {
  return this;
}
test("bind", () => {
  //常规测试
  expect(fn.myBind(this, 1, 2, 3)()).toEqual(fn.bind(this, 1, 2, 3)());
  //空参数测试1
  expect(fn.myBind(this)()).toEqual(fn.bind(this)());
  //空参数测试2
  expect(fn1.myBind()()).toEqual(fn1.bind()());
  //this指向测试
  let objTest = { test: 111 };
  expect(fn1.myBind(objTest)()).toEqual(fn1.bind(objTest)());
  //多次调用this指向测试
  expect(fn1.myBind(objTest).apply({ test: 222 })).toEqual(
    fn1.bind(objTest).apply({ test: 333 })
  );
  //length测试
  expect(fn.myBind(this, 1).length).toBe(fn.bind(this, 1).length);
  //ToObject测试
  expect(typeof fn1.myBind(1)()).toBe(typeof fn1.bind(1)());
});
