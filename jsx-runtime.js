"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsx = jsx;
exports.jsxs = jsxs;
exports.Fragment = exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Fragment = "Fragment";
exports.Fragment = Fragment;
var _api = {
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

    if (!attrs) {
      return '';
    }

    return Object.keys(attrs).map(function (key) {
      return "".concat(key, "=\"").concat(_api.againstXss(attrs[key]), "\"");
    }).join(' ');
  },

  /**
   * 获取子元素
   * @param children
   * @param dangerouslySetInnerHTML
   * @returns {string|*}
   */
  getChildrenStr: function getChildrenStr(_ref2) {
    var _ref2$children = _ref2.children,
        children = _ref2$children === void 0 ? '' : _ref2$children,
        dangerouslySetInnerHTML = _ref2.dangerouslySetInnerHTML;

    if (!children) {
      return '';
    } // 字符串


    if (typeof children === 'string') {
      return dangerouslySetInnerHTML ? children : _api.againstXss(children);
    } // 方法


    if (typeof children === 'function') {
      return children();
    } // 数组


    if (children instanceof Array) {
      return children.map(function (item) {
        return _api.getChildrenStr({
          children: item,
          dangerouslySetInnerHTML: dangerouslySetInnerHTML
        });
      }).join('');
    }

    return '';
  }
};
/**
 * 渲染的方法
 * @type {{children: (function({props?: *}): *), fn: (function({element: *, props?: *}): *), selfClose: (function({element: *, props?: *}): string), element: (function({element: *, props?: *}): string)}}
 */

var render = {
  element: function element(_ref3) {
    var _element = _ref3.element,
        props = _ref3.props;

    // 获取 string of attr
    var strAttrs = _api.getStringOfAttrs(props);

    return "<".concat(_element).concat(strAttrs ? " ".concat(strAttrs) : '', ">").concat(_api.getChildrenStr(props), "</").concat(_element, ">");
  },
  selfClose: function selfClose(_ref4) {
    var element = _ref4.element,
        props = _ref4.props;

    // 获取 string of attr
    var strAttrs = _api.getStringOfAttrs(props);

    return "<".concat(element).concat(strAttrs ? " ".concat(strAttrs) : '', "/>");
  },
  children: function children(_ref5) {
    var props = _ref5.props;
    return _api.getChildrenStr(props);
  },
  fn: function fn(_ref6) {
    var element = _ref6.element,
        props = _ref6.props;
    var result = element(_objectSpread(_objectSpread({}, props), {}, {
      children: _api.getChildrenStr(props)
    }));
    return typeof result === 'function' ? result() : result;
  }
};
/**
 * 获取渲染函数
 * @param element
 * @returns {(function({element: *, props?: *}): *)|(function({props?: *}): *)|(function({element: *, props?: *}): string)}
 */

function getRenderFn(element) {
  // 自闭合标签
  if (_api.getIsSelfCloseTag(element)) {
    return render.selfClose;
  } // Fragment


  if (element === 'Fragment' || element === Fragment) {
    return render.children;
  } // 元素是 function


  if (typeof element === 'function') {
    return render.fn;
  } // 渲染标准的元素


  if (typeof element === 'string') {
    return render.element;
  }

  return render.children;
}

;
/**
 * 渲染子元素
 * @param element
 * @param props
 * @returns {function(): *}
 */

function jsx(element) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function () {
    return getRenderFn(element)({
      element: element,
      props: props
    });
  };
}

;
/**
 * 表示当前标签有多个子元素
 * @param element
 * @param children
 * @param props
 * @returns {function(): *}
 */

function jsxs(element, _ref7) {
  var children = _ref7.children,
      props = _objectWithoutProperties(_ref7, ["children"]);

  return function () {
    var newChildren = children.map(function (item) {
      // 没有这个方法，会导致子元素为字符串和非字符串混排的时候，导致这里的字符串不会被xss
      // 为了兼容这个让 jsxs 和 jsx 返回的是function
      // 目前没有找到解决方案
      if (typeof item === 'string') {
        return function () {
          return _api.getChildrenStr({
            children: item,
            dangerouslySetInnerHTML: props.dangerouslySetInnerHTML
          });
        };
      }

      return item;
    });
    var renderFn = getRenderFn(element);
    var result = renderFn({
      element: element,
      props: _objectSpread(_objectSpread({}, props), {}, {
        children: newChildren
      })
    });
    return result;
  };
}

;
var jsx2string = {
  Fragment: Fragment,
  jsx: jsx,
  jsxs: jsxs
};
var _default = jsx2string;
exports["default"] = _default;
