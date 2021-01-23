"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsx = jsx;
exports.jsxs = exports.Fragment = exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var _api = {
  /**
   * 判断是否为安全的元素
   * @param item
   * @returns {boolean}
   */
  isSafeHTML: function isSafeHTML(item) {
    if (item && typeof item.safeHTML === 'string') {
      return true;
    }

    return false;
  },

  /**
   * 基于数组获取字符串(为了更好的性能)
   * @param arrayObj 数组
   * @param callback 回掉函数
   * @param splitString 分割符
   * @returns {string}
   */
  array2string: function array2string() {
    var arrayObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var callback = arguments.length > 1 ? arguments[1] : undefined;
    var splitString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var str = '';

    if (!(arrayObj && arrayObj.length > 0)) {
      return str;
    }

    for (var i = 0, len = arrayObj.length; i < len; i++) {
      // 获取字符串
      var strGet = typeof callback === 'function' ? callback(arrayObj[i]) : arrayObj[i]; // 第一个元素不需要分割符，即使有

      var splitStr = i !== 0 ? splitString : '';
      str += splitStr + strGet;
    }

    return str;
  },

  /**
   * 是否为自闭合标签
   * @param element
   * @returns {boolean}
   */
  getIsSelfCloseTag: function getIsSelfCloseTag(element) {
    // 自闭合标签列表
    var SELF_CLOSE_TAGS = ['img', 'link', 'meta', 'br', 'br', 'hr', 'input', 'col', 'frame', 'area', 'param', 'object', 'embed', 'keygen', 'source'];
    return SELF_CLOSE_TAGS.indexOf(element) > -1;
  },

  /**
   * xss 转译
   * @param content
   * @returns {string}
   */
  againstXss: function againstXss() {
    var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (!content) {
      return '';
    }

    return String(content).replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
  },

  /**
   * 基于 attrs 获取 字符串
   * @param children
   * @param dangerouslySetInnerHTML
   * @param attrs
   * @returns {string}
   */
  getStringOfAttrs: function getStringOfAttrs() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        children = _ref.children,
        dangerouslySetInnerHTML = _ref.dangerouslySetInnerHTML,
        attrs = _objectWithoutProperties(_ref, ["children", "dangerouslySetInnerHTML"]);

    var attrKeys = Object.keys(attrs || {});
    return _api.array2string(attrKeys, function (attrKey) {
      var value = attrs[attrKey]; // 忽略 false 的属性值

      if (value === false) {
        return '';
      }

      var key = attrKey === 'className' ? 'class' : attrKey;
      return _api.againstXss("".concat(key, "=\"").concat(value, "\""));
    }, ' ');
  },

  /**
   * 获取多个子元素
   * @param children
   * @param dangerouslySetInnerHTML
   */
  getChildrensStr: function getChildrensStr(_ref2) {
    var _ref2$children = _ref2.children,
        children = _ref2$children === void 0 ? '' : _ref2$children;
    var safeHTML = '';

    for (var i = 0, len = children.length; i < len; i++) {
      safeHTML += _api.getSafeChildren({
        children: children[i]
      }).safeHTML;
    }

    return safeHTML;
  },

  /**
   * 获取子元素
   * @param children
   * @param dangerouslySetInnerHTML
   * @returns {string|*}
   */
  getSafeChildren: function getSafeChildren(_ref3) {
    var _ref3$children = _ref3.children,
        children = _ref3$children === void 0 ? '' : _ref3$children,
        dangerouslySetInnerHTML = _ref3.dangerouslySetInnerHTML;

    var safeHTML = function () {
      // 返回危险的元素
      // 当有 dangerouslySetInnerHTML 会忽略子元素
      if (dangerouslySetInnerHTML && typeof dangerouslySetInnerHTML['__html'] === 'string') {
        return dangerouslySetInnerHTML['__html'];
      } // 子元素不存在


      if (!children) {
        return '';
      } // 本身就是安全的文案


      if (_api.isSafeHTML(children)) {
        return children.safeHTML;
      } // 方法


      if (typeof children === 'function') {
        return _api.againstXss(children());
      } // 数组


      if (children instanceof Array) {
        return _api.getChildrensStr({
          children: children
        });
      } // 返回转译文本


      return _api.againstXss(children);
    }();

    return {
      safeHTML: safeHTML
    };
  }
};
var render = {
  /**
   * 渲染标准元素
   * @param element
   * @param props
   * @returns {string}
   */
  element: function element(_ref4) {
    var _element = _ref4.element,
        props = _ref4.props;

    // 获取 string of attr
    var strAttrs = _api.getStringOfAttrs(props);

    var childrenObj = _api.getSafeChildren(props);

    return "<".concat(_element).concat(strAttrs ? " ".concat(strAttrs) : '', ">").concat(childrenObj.safeHTML, "</").concat(_element, ">");
  },

  /**
   * 渲染自闭合标签
   * @param element
   * @param props
   * @returns {string}
   */
  selfClose: function selfClose(_ref5) {
    var element = _ref5.element,
        props = _ref5.props;

    // 获取 string of attr
    var strAttrs = _api.getStringOfAttrs(props);

    return "<".concat(element).concat(strAttrs ? " ".concat(strAttrs) : '', "/>");
  },

  /**
   * 直接渲染子元素
   * @param props
   * @returns {string|string}
   */
  children: function children(_ref6) {
    var props = _ref6.props;
    return _api.getSafeChildren(props).safeHTML;
  },

  /**
   * 渲染function
   * @param element
   * @param props
   * @returns {string}
   */
  fn: function fn(_ref7) {
    var element = _ref7.element,
        props = _ref7.props;
    var elementReturn = element(_objectSpread({}, props)); // fn 有可能返回的不是 safeHTML 的对象, 也有可能返回的是字符串
    // 所以这里需要再执行一下

    var result = _api.getSafeChildren({
      children: elementReturn
    }).safeHTML;

    return result;
  }
}; // 空标签

var Fragment = "Fragment";
/**
 * 渲染子元素
 * @param element
 * @param props
 */

exports.Fragment = Fragment;

function jsx(element) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var safeHTML = function () {
    // 元素是 function
    if (typeof element === 'function') {
      return render.fn({
        element: element,
        props: props
      });
    } // Fragment


    if (element === Fragment) {
      return render.children({
        element: element,
        props: props
      });
    } // 如果不是 字符串提前返回


    if (typeof element !== 'string') {
      return render.children({
        element: element,
        props: props
      });
    } // 自闭合标签


    if (_api.getIsSelfCloseTag(element)) {
      return render.selfClose({
        element: element,
        props: props
      });
    } // 渲染标准的元素


    return render.element({
      element: element,
      props: props
    });
  }(); // console.log({
  //   element, props, safeHTML
  // });


  return {
    safeHTML: safeHTML
  };
}

;
/**
 * 当有多个子元素当时候
 * 这里处理和只有一个子元素一样
 * @type {function(*=, *=): function(): *}
 */

var jsxs = jsx;
exports.jsxs = jsxs;
var jsxRuntime = {
  Fragment: Fragment,
  jsx: jsx,
  jsxs: jsxs
};
var _default = jsxRuntime;
exports["default"] = _default;