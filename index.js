"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Fragment = exports["default"] = void 0;

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 自闭合标签
var SELF_CLOSE_TAGS = ['img', 'link', 'meta', 'br', 'br', 'hr', 'input', 'col', 'frame', 'area', 'param', 'object', 'embed', 'keygen', 'source']; // Fragment

var Fragment = 'Fragment';
/**
 * 防止 Xss 攻击
 * @param content
 * @returns {string}
 */

exports.Fragment = Fragment;

function againstXss() {
  var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (!content) {
    return '';
  }

  return String(content).replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
}

;
/**
 * 获取 Attrs 的字符串
 * @param attrs
 * @returns {string}
 */

function getStringOfAttrs(attrs) {
  if (!attrs) {
    return '';
  }

  return Object.keys(attrs).map(function (key) {
    return "".concat(key, "=\"").concat(againstXss(attrs[key]), "\"");
  }).join(' ');
}

;
/**
 * 获取 children 的字符串
 * @param children
 * @returns {*}
 */

function getStrChildren(children, isXss) {
  // console.log('=========== getStrChildren', isXss, children);
  return children.map(function (children) {
    if (typeof children === 'string') {
      return isXss ? againstXss(children) : children;
    }

    if (typeof children === 'function') {
      return children();
    }

    return '';
  }).join('');
}

var render = {
  "function": function _function(_ref) {
    var element = _ref.element,
        attrs = _ref.attrs,
        children = _ref.children,
        isXss = _ref.isXss;
    // console.log('function', isXss, element, attrs, children);
    // children 转字符串
    var strChildren = getStrChildren(children, isXss);
    return element(_objectSpread({
      children: strChildren
    }, attrs));
  },
  element: function element(_ref2) {
    var _element = _ref2.element,
        attrs = _ref2.attrs,
        children = _ref2.children,
        isXss = _ref2.isXss;
    // console.log('element', isXss, element, attrs, children);
    // children 转字符串
    var strChildren = getStrChildren(children, isXss);
    var strAttrs = getStringOfAttrs(attrs);
    return "<".concat(_element).concat(strAttrs ? " ".concat(strAttrs) : '', ">").concat(strChildren, "</").concat(_element, ">");
  },
  selfElement: function selfElement(_ref3) {
    var element = _ref3.element,
        attrs = _ref3.attrs;
    // console.log('selfElement', element, attrs);
    var strAttrs = getStringOfAttrs(attrs);
    return "<".concat(element).concat(strAttrs ? " ".concat(strAttrs) : '', "/>");
  },
  children: function children(_ref4) {
    var _children = _ref4.children,
        isXss = _ref4.isXss;
    // console.log('just children', isXss, children);
    return getStrChildren(_children, isXss);
  }
};

function jsx2string(element, props) {
  var _ref5 = props || {},
      dangerouslySetInnerHTML = _ref5.dangerouslySetInnerHTML,
      attrs = _objectWithoutProperties(_ref5, ["dangerouslySetInnerHTML"]); // 是否需要 XSS


  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  var isXss = children && children.length === 1 && typeof children[0] === 'string' && !dangerouslySetInnerHTML;
  console.log(element, isXss, children); // 元素是 function

  if (typeof element === 'function') {
    return render["function"]({
      element: element,
      attrs: attrs,
      children: children,
      isXss: isXss
    });
  } // 如果是 Fragment 直接渲染子元素
  // 不知道是个啥, 直接渲染子元素


  if (element === Fragment || typeof element !== 'string') {
    return render.children({
      children: children,
      isXss: isXss
    });
  } // 自闭合标签, 没有 children


  if (SELF_CLOSE_TAGS.includes(element)) {
    return render.selfElement({
      element: element,
      attrs: attrs
    });
  } // 标准 Tag


  return render.element({
    element: element,
    attrs: attrs,
    children: children,
    isXss: isXss
  });
}

;
var _default = jsx2string;
exports["default"] = _default;
