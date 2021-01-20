// Fragment
const Fragment = 'Fragment';

/**
 * 判断元素是否为自闭合标签
 * @param element
 * @returns {boolean}
 */
function getIsSelfCloseTag(element) {
  // 自闭合标签
  const SELF_CLOSE_TAGS = ['img', 'link', 'meta', 'br', 'br', 'hr', 'input', 'col', 'frame', 'area', 'param', 'object', 'embed', 'keygen', 'source'];
  return SELF_CLOSE_TAGS.indexOf(element) > -1;
};


/**
 * 防止 Xss 攻击
 * @param content
 * @returns {string}
 */
function againstXss(content = '') {
  if (!content) {
    return '';
  }
  return String(content).replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
};

/**
 * 获取 Attrs 的字符串
 * @param attrs
 * @returns {string}
 */
function getStringOfAttrs({children, dangerouslySetInnerHTML, ...attrs} = {}) {
  if (!attrs) {
    return '';
  }
  return Object.keys(attrs).map((key) => {
    return `${key}="${againstXss(attrs[key])}"`;
  }).join(' ');
};

/**
 * 获取 children 的字符串
 * @param children
 * @returns {*}
 */
function getChildrenStr({children = '', dangerouslySetInnerHTML}) {
  if (!children) {
    return '';
  }

  // 字符串
  if (typeof children === 'string') {
    return dangerouslySetInnerHTML ? children : againstXss(children);
  }

  // 方法
  if (typeof children === 'function') {
    return children();
  }

  // 数组
  if (children instanceof Array) {
    return children.map((item) => getChildrenStr({children: item, dangerouslySetInnerHTML})).join('');
  }

  return '';
};

/**
 * 渲染的方法
 * @type {{children: (function({props?: *}): *), fn: (function({element: *, props?: *}): *), selfClose: (function({element: *, props?: *}): string), element: (function({element: *, props?: *}): string)}}
 */
const render = {
  element: function ({element, props}) {
    // 获取 string of attr
    const strAttrs = getStringOfAttrs(props);
    return `<${element}${strAttrs ? ` ${strAttrs}` : ''}>${getChildrenStr(props)}</${element}>`;
  },
  selfClose: function ({element, props}) {
    // 获取 string of attr
    const strAttrs = getStringOfAttrs(props);
    return `<${element}${strAttrs ? ` ${strAttrs}` : ''}/>`;
  },
  children: function ({props}) {
    return getChildrenStr(props);
  },
  fn: function ({element, props}) {
    return element({
      ...props,
      children: getChildrenStr(props)
    });
  }
};

/**
 * 获取渲染元素发方法
 * @param element
 * @returns {(function({props?: *}): *)|(function({element: *, props?: *}): string)|(function({element: *, props?: *}): *)}
 */
function getRenderFn(element) {
  // 自闭合标签
  if (getIsSelfCloseTag(element)) {
    return render.selfClose;
  }
  // Fragment
  if (element === 'Fragment' || element === Fragment) {
    return render.children;
  }

  // 元素是 function
  if (typeof element === 'function') {
    return render.fn;
  }

  // 渲染标准的元素
  if (typeof element === 'string') {
    return render.element;
  }

  return render.children;
};


function jsx(element, props = {}) {
  const renderFn = getRenderFn(element);
  const result = renderFn({element, props});
  console.log('jsx', element, 'end', renderFn, result);
  return result;
};

function jsxs(element, {children, ...props}) {
  console.log('========jsxs ', element, ' start');
  const renderFn = getRenderFn(element);
  const newChildren = children.map((item) => {
    console.log(element, 'newChildren', {item});
    const r = getChildrenStr({
      children: item,
      dangerouslySetInnerHTML: true
    });
    console.log(element, 'newChildren', {r});
    return r;
  }).join('');
  const result = renderFn({element, props: {...props, children: newChildren, dangerouslySetInnerHTML: true}});
  console.log('=========jsxs ', element, ' end');
  return result;
};

const jsx2string = {Fragment, jsx, jsxs};

export default jsx2string;
export {Fragment, jsx, jsxs};
