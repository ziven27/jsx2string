const _api = {
  /**
   * 判断是否为安全的元素
   * @param item
   * @returns {boolean}
   */
  isSafeHTML: function (item) {
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
   * 获取多个子元素
   * @param children
   * @param dangerouslySetInnerHTML
   */
  getChildrensStr: function ({children = ''}) {
    let safeHTML = '';
    for (let i = 0, len = children.length; i < len; i++) {
      safeHTML += _api.getSafeChildren({children: children[i]}).safeHTML;
    }
    return safeHTML;
  },
  /**
   * 获取子元素
   * @param children
   * @param dangerouslySetInnerHTML
   * @returns {string|*}
   */
  getSafeChildren: function ({children = '', dangerouslySetInnerHTML}) {
    const safeHTML = (function () {
      // 返回危险的元素
      // 当有 dangerouslySetInnerHTML 会忽略子元素
      if (dangerouslySetInnerHTML && (typeof dangerouslySetInnerHTML['__html'] === 'string')) {
        return dangerouslySetInnerHTML['__html'];
      }
      // 子元素不存在
      if (!children) {
        return '';
      }
      // 本身就是安全的文案
      if (_api.isSafeHTML(children)) {
        return children.safeHTML;
      }
      // 方法
      if (typeof children === 'function') {
        return _api.againstXss(children());
      }
      // 数组
      if (children instanceof Array) {
        return _api.getChildrensStr({children});
      }
      // 返回转译文本
      return _api.againstXss(children);
    })();

    return {safeHTML};
  }
};
const render = {
  /**
   * 渲染标准元素
   * @param element
   * @param props
   * @returns {string}
   */
  element: function ({element, props}) {
    // 获取 string of attr
    const strAttrs = _api.getStringOfAttrs(props);
    const childrenObj = _api.getSafeChildren(props);
    return `<${element}${strAttrs ? ` ${strAttrs}` : ''}>${childrenObj.safeHTML}</${element}>`;
  },
  /**
   * 渲染自闭合标签
   * @param element
   * @param props
   * @returns {string}
   */
  selfClose: function ({element, props}) {
    // 获取 string of attr
    const strAttrs = _api.getStringOfAttrs(props);
    return `<${element}${strAttrs ? ` ${strAttrs}` : ''}/>`;
  },
  /**
   * 直接渲染子元素
   * @param props
   * @returns {string|string}
   */
  children: function ({props}) {
    return _api.getSafeChildren(props).safeHTML;
  },
  /**
   * 渲染function
   * @param element
   * @param props
   * @returns {string}
   */
  fn: function ({element, props}) {
    const elementReturn = element({...props});
    // fn 有可能返回的不是 safeHTML 的对象, 也有可能返回的是字符串
    // 所以这里需要再执行一下
    const result = _api.getSafeChildren({
      children: elementReturn
    }).safeHTML;
    return result;
  }
};

// 空标签
const Fragment = "Fragment";

/**
 * 渲染子元素
 * @param element
 * @param props
 */
function jsx(element, props = {}) {
  const safeHTML = (function () {
    // 元素是 function
    if (typeof element === 'function') {
      return render.fn({element, props});
    }
    // Fragment
    if (element === Fragment) {
      return render.children({element, props});
    }
    // 如果不是 字符串提前返回
    if (typeof element !== 'string') {
      return render.children({element, props});
    }
    // 自闭合标签
    if (_api.getIsSelfCloseTag(element)) {
      return render.selfClose({element, props});
    }
    // 渲染标准的元素
    return render.element({element, props});
  })();

  // console.log({
  //   element, props, safeHTML
  // });
  return {safeHTML};
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
