/**
 * 多维稀疏数组
 * 一维数组存储方案，可能有维度扩展缺陷，可能有单元素复用缺陷
 * 维度从左向右上升，后面的高度全部为0可以做省略
 * 每层维度的下标从0开始，到length-1结束
 */
export default class ManyDimansionalSparseArray<T> {
  private lengthOfAxis:number[]; // 轴长
  private body:any[]; // 一维稀疏数组存储体
  private baseNumberOfEveryDimansional:number[] = new Array(); // 每个维度的基数
  constructor(...args:number[]) {
      this.lengthOfAxis = args; // 初始化轴长

      // 计算一维数组长度, 并且计算每个维度的基数
      let lengthOfBody:number = this.lengthOfAxis.reduce((total, curr)=> {
          this.baseNumberOfEveryDimansional.push(total * curr);
          return this.baseNumberOfEveryDimansional[this.baseNumberOfEveryDimansional.length - 1];
      }, 1);

      // 完善基数数组
      this.baseNumberOfEveryDimansional.pop();
      this.baseNumberOfEveryDimansional.unshift(1);

      this.body = Array(lengthOfBody); // 初始化一维数组
  }

  /**
   * 多维数组值取得
   * @param args 多维数组的下标集合（可变参）
   * @returns 多维数组值
   */
  public get(...args:number[]):T{
      let indexOfBody:number = this.calculateindexOfBody(...args);
      return this.body[indexOfBody];
  }

  /**
   * 多维数组值设定
   * @param value 要设定的值
   * @param args 多维数组的下标集合（可变参）
   */
  public set(value:T, ...args:number[]):void{
      let indexOfBody:number = this.calculateindexOfBody(...args);
      this.body[indexOfBody] = value;
  }


  /**
   * 计算多维坐标在一维数组中的下标，与其他进制转10进制相似
   * @param args 多维数组的下标集合（可变参）
   * @returns 一维稀疏数组存储体
   */
  public calculateindexOfBody(...args:number[]):number{
      return args.reduce((total, x, i)=> total + x * this.baseNumberOfEveryDimansional[i], 0);
  }

  /**
   * 元素循环
   * @param callback
   * @param isEachAll 是否循环全部，默认：false
   */
  public forEach(callback:(value:T, ...args:number[])=>void, isEachAll:boolean = false):void{
      if(isEachAll){
          // 循环所有元素
          this.forEachAll(callback);
      }else{
          // Array.forEach会跳过empty部分
          this.body.forEach((value, i)=>{
              callback(value, ...this.calculateIndexsOfManyDimansionalArray(i));
          });
      }
  }

  /**
   * 循环所有元素
   * @param callback 
   */
  private forEachAll(callback:(value:T, ...args:number[])=>void):void{
      let indexsOfCurr = Array.apply(null, {length: this.lengthOfAxis.length}); // 当前维度
      for(let i:number = 0; i < this.body.length; i++){ // 遍历所有元素
          callback(this.body[i], ...indexsOfCurr); // 执行回调
          
          // 进位处理
          for(let j:number = 0; j < indexsOfCurr.length; j++){
              indexsOfCurr[j] += 1; // 累加
              if(indexsOfCurr[j] == this.lengthOfAxis[j]){ // 判断是否需要进位
                  indexsOfCurr[j] = 0; // 当前位置零，继续循环进行进位
              }else{
                  break; // 跳出进位
              }
          }
      }
  }

  /**
   * 计算多维数组的下标集合
   * 轴长：一维3，二维4，三维5
   * 基数：一维1，二维3(二维最小下标)，三维12(三维最小下标)
   * 存储体一维数组最大小标：59
   * 三维 坐标：4(59 / 12) 剩余：11(59 % 12)
   * 二维 坐标：3(11 / 3) 剩余：2(11 % 3)
   * 一维 坐标：2(2 / 1) 剩余：0(2 % 1)
   * @param indexOfBody 一维数组的下标
   * @returns 多维数组的下标集合
   */
  public calculateIndexsOfManyDimansionalArray(indexOfBody:number):number[]{
      let ret:number[] = new Array();
      this.baseNumberOfEveryDimansional.reduceRight((residue, baseNumber)=>{
          ret.unshift(Math.floor(residue / baseNumber)); // 计算当前维度下标
          return residue % baseNumber; // 计算剩余
      }, indexOfBody);

      return ret;
  }
}