# many-dimansional-sparse-array
多维稀疏数组，一维数组存储方案，可能有维度扩展缺陷，可能有单元素复用缺陷

## build
```
yarn build
```

## test
```
yarn test
```

## demo
```typescript
import ManyDimansionalSparseArray from many-dimansional-sparse-array;

let twoDimensionalArray = new ManyDimansionalSparseArray(2, 3); // 下标范围：0,0~1,2
twoDimensionalArray.set('0,0', 0, 0); // 设置首个元素
twoDimensionalArray.set('1,2', 1, 2); // 设置末尾的元素

// 遍历，跳过未设置值的部分
twoDimensionalArray.forEach(function(...args):void{
  console.log(...args);
  // 0,0 0 0
  // 1,2 1 2
});

// 遍历全部
twoDimensionalArray.forEach(function(...args):void{
  console.log(...args);
  // 0,0 0 0
  // undefined 0 1
  // undefined 0 2
  // undefined 1 0
  // undefined 1 1
  // 1,2 1 2
}, true);
```