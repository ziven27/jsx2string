const _api = {
  /**
   * 基于数组获取字符串(为了更好的性能)
   * @param arrayObj 数组
   * @param callback 回掉函数
   * @param splitString 分割符
   * @returns {string}
   */
  array2string: function (arrayObj = [], callback, splitString = '') {
    let str = '';
    if (!(arrayObj && arrayObj.length > 0)) {
      return str;
    }
    for (let i = 0, len = arrayObj.length; i < len; i++) {
      // 获取字符串
      const strGet = typeof callback === 'function' ? callback(arrayObj[i]) : arrayObj[i];
      // 第一个元素不需要分割符，即使有
      const splitStr = (i !== 0) ? splitString : '';
      str += splitStr + strGet;
    }
    return str;
  },
  /**
   * 是否为自闭合标签
   * @param element
   * @returns {boolean}
   */
  getIsSelfCloseTag: function (element) {
    // 自闭合标签列表
    const SELF_CLOSE_TAGS = ['img', 'link', 'meta', 'br', 'br', 'hr', 'input', 'col', 'frame', 'area', 'param', 'object', 'embed', 'keygen', 'source'];
    return SELF_CLOSE_TAGS.indexOf(element) > -1;
  },
  /**
   * xss 转译
   * @param content
   * @returns {string}
   */
  againstXss: function (content = '') {
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
  getStringOfAttrs: function ({children, dangerouslySetInnerHTML, ...attrs} = {}) {
    const attrKeys = Object.keys(attrs || {});
    return _api.array2string(attrKeys, function (attrKey) {
      const value = attrs[attrKey];
      // 忽略 false 的属性值
      if (value === false) {
        return '';
      }
      const key = attrKey === 'className' ? 'class' : attrKey;
      return _api.againstXss(`${key}="${value}"`);
    }, ' ');
  },
  /**
   * 获取子元素
   * @param children
   * @param dangerouslySetInnerHTML
   * @returns {string|*}
   */
  getChildrenStr: function ({children = '', dangerouslySetInnerHTML}) {
    if (!children) {
      return '';
    }
    // 返回 render 函数
    if (typeof children === 'object' && typeof children.render === "function") {
      return children.render();
    }
    // 方法
    if (typeof children === 'function') {
      return children();
    }
    // 数组
    if (children instanceof Array && children.length > 0) {
      const result = _api.array2string(children, function (item) {
        return _api.getChildrenStr({children: item, dangerouslySetInnerHTML})
      });
      return result;
    }
    return dangerouslySetInnerHTML ? children : _api.againstXss(children);
  }
};
/**
 * 渲染的方法
 * @type {{children: (function({props?: *}): *), fn: (function({element: *, props?: *}): *), selfClose: (function({element: *, props?: *}): string), element: (function({element: *, props?: *}): string)}}
 */
const render = {
  element: function ({element, props}) {
    // 获取 string of attr
    const strAttrs = _api.getStringOfAttrs(props);
    return `<${element}${strAttrs ? ` ${strAttrs}` : ''}>${_api.getChildrenStr(props)}</${element}>`;
  },
  selfClose: function ({element, props}) {
    // 获取 string of attr
    const strAttrs = _api.getStringOfAttrs(props);
    return `<${element}${strAttrs ? ` ${strAttrs}` : ''}/>`;
  },
  children: function ({props}) {
    return _api.getChildrenStr(props);
  },
  fn: function ({element, props}) {
    const result = element({
      ...props,
      children: _api.getChildrenStr(props)
    });
    return typeof result === 'function' ? result() : result;
  }
};


// 空标签
const Fragment = "Fragment";

/**
 * 获取渲染函数
 * @param element
 * @returns {(function({element: *, props?: *}): *)|(function({props?: *}): *)|(function({element: *, props?: *}): string)}
 */
function getRenderFn(element) {
  // 元素是 function
  if (typeof element === 'function') {
    return render.fn;
  }
  // Fragment
  if (element === Fragment) {
    return render.children;
  }
  // 如果不是 字符串提前返回
  if (typeof element !== 'string') {
    return render.children;
  }
  // 自闭合标签
  if (_api.getIsSelfCloseTag(element)) {
    return render.selfClose;
  }
  // 渲染标准的元素
  return render.element;
};

/**
 * 渲染子元素
 * @param element
 * @param props
 * @returns {function(): *}
 */
const jsx = function jsx(element, props = {}) {
  return function () {
    return getRenderFn(element)({element, props});
  };
};

/**
 * 当有多个子元素当时候
 * 这里处理和只有一个子元素一样
 * @type {function(*=, *=): function(): *}
 */
const jsxs = jsx;

const jsxRuntime = {Fragment, jsx, jsxs};
export default jsxRuntime;
export {Fragment, jsx, jsxs};
