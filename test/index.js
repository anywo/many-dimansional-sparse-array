const ManyDimansionalSparseArray = require('../index').default;
const arr = new ManyDimansionalSparseArray(3, 4, 5);

arr.set('0,0,0', 0, 0, 0);
arr.set('1,2,3', 1, 2, 3);
arr.set('2,3,4', 2, 3, 4);

console.log("get方法调用结果：")
console.log(arr.get(0, 0, 0), 0, 0, 0);
console.log(arr.get(1, 2, 3), 1, 2, 3);
console.log(arr.get(2, 3, 4), 2, 3, 4);

console.log("")

console.log("forEach调用结果（稀疏遍历）：")
arr.forEach(function () {
  console.log(...arguments);
});

console.log("")

console.log("forEach调用结果（全部遍历）：")
arr.forEach(function () {
  console.log(...arguments);
}, true);