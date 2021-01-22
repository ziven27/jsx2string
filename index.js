/**
 * 需要这个的原因在于 jsx-runtime 返回的是一个 2 级嵌套的方法，
 * 需要执行一次拿到 render 方法然后再执行才能返回结果
 * @param fn
 * @returns {*}
 */
function jsx2string(fn) {
  return typeof fn === 'function' ? fn() : fn;
};
module.exports = jsx2string;
