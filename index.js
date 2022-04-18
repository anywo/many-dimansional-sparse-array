"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
/**
 * 多维稀疏数组
 * 一维数组存储方案，可能有维度扩展缺陷，可能有单元素复用缺陷
 * 维度从左向右上升，后面的高度全部为0可以做省略
 * 每层维度的下标从0开始，到length-1结束
 */
var ManyDimansionalSparseArray = /** @class */ (function () {
    function ManyDimansionalSparseArray() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.baseNumberOfEveryDimansional = new Array(); // 每个维度的基数
        this.lengthOfAxis = args; // 初始化轴长
        // 计算一维数组长度, 并且计算每个维度的基数
        var lengthOfBody = this.lengthOfAxis.reduce(function (total, curr) {
            _this.baseNumberOfEveryDimansional.push(total * curr);
            return _this.baseNumberOfEveryDimansional[_this.baseNumberOfEveryDimansional.length - 1];
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
    ManyDimansionalSparseArray.prototype.get = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var indexOfBody = this.calculateindexOfBody.apply(this, args);
        return this.body[indexOfBody];
    };
    /**
     * 多维数组值设定
     * @param value 要设定的值
     * @param args 多维数组的下标集合（可变参）
     */
    ManyDimansionalSparseArray.prototype.set = function (value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var indexOfBody = this.calculateindexOfBody.apply(this, args);
        this.body[indexOfBody] = value;
    };
    /**
     * 计算多维坐标在一维数组中的下标，与其他进制转10进制相似
     * @param args 多维数组的下标集合（可变参）
     * @returns 一维稀疏数组存储体
     */
    ManyDimansionalSparseArray.prototype.calculateindexOfBody = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args.reduce(function (total, x, i) { return total + x * _this.baseNumberOfEveryDimansional[i]; }, 0);
    };
    /**
     * 元素循环
     * @param callback
     * @param isEachAll 是否循环全部，默认：false
     */
    ManyDimansionalSparseArray.prototype.forEach = function (callback, isEachAll) {
        var _this = this;
        if (isEachAll === void 0) { isEachAll = false; }
        if (isEachAll) {
            // 循环所有元素
            this.forEachAll(callback);
        }
        else {
            // Array.forEach会跳过empty部分
            this.body.forEach(function (value, i) {
                callback.apply(void 0, __spreadArray([value], _this.calculateIndexsOfManyDimansionalArray(i)));
            });
        }
    };
    /**
     * 循环所有元素
     * @param callback
     */
    ManyDimansionalSparseArray.prototype.forEachAll = function (callback) {
        var indexsOfCurr = Array.apply(null, { length: this.lengthOfAxis.length }); // 当前维度
        for (var i = 0; i < this.body.length; i++) { // 遍历所有元素
            callback.apply(void 0, __spreadArray([this.body[i]], indexsOfCurr)); // 执行回调
            // 进位处理
            for (var j = 0; j < indexsOfCurr.length; j++) {
                indexsOfCurr[j] += 1; // 累加
                if (indexsOfCurr[j] == this.lengthOfAxis[j]) { // 判断是否需要进位
                    indexsOfCurr[j] = 0; // 当前位置零，继续循环进行进位
                }
                else {
                    break; // 跳出进位
                }
            }
        }
    };
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
    ManyDimansionalSparseArray.prototype.calculateIndexsOfManyDimansionalArray = function (indexOfBody) {
        var ret = new Array();
        this.baseNumberOfEveryDimansional.reduceRight(function (residue, baseNumber) {
            ret.unshift(Math.floor(residue / baseNumber)); // 计算当前维度下标
            return residue % baseNumber; // 计算剩余
        }, indexOfBody);
        return ret;
    };
    return ManyDimansionalSparseArray;
}());
exports["default"] = ManyDimansionalSparseArray;
