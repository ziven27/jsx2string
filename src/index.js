/**
 * jsx-runtime 返回的 结果是 {safeHTML:'**'} 的结构
 * @param obj
 * @returns {string|string|*}
 */
function jsx2string(obj) {
  if (!obj) {
    return '';
  }
  // 普通对象
  if (typeof obj.safeHTML === 'string') {
    return obj.safeHTML;
  }
  // 如果是数组
  if (obj instanceof Array) {
    let result = '';
    for (let i = 0, len = obj.length; i < len; i++) {
      result += jsx2string(obj[i]);
    }
    return result;
  }
  return obj;
}

export default jsx2string;

// 空标签
const Fragment = "Fragment";
export {Fragment};
