/**
 * jsx-runtime 返回的 结果是 {safeHTML:'**'} 的结构
 * @param obj
 * @returns {string|string|*}
 */
export default function (obj) {
  if (obj && typeof obj.safeHTML === 'string') {
    return obj.safeHTML;
  }
  return obj;
};
// 空标签
const Fragment = "Fragment";
export {Fragment};
