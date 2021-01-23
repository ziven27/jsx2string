"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
exports.Fragment = void 0;

/**
 * jsx-runtime 返回的 结果是 {safeHTML:'**'} 的结构
 * @param obj
 * @returns {string|string|*}
 */
function _default(obj) {
  if (obj && typeof obj.safeHTML === 'string') {
    return obj.safeHTML;
  }

  return obj;
}

; // 空标签

var Fragment = "Fragment";
exports.Fragment = Fragment;