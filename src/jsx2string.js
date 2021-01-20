// 自闭合标签
const SELF_CLOSE_TAGS = ['img', 'link', 'meta', 'br', 'br', 'hr', 'input', 'col', 'frame', 'area', 'param', 'object', 'embed', 'keygen', 'source'];

// Fragment
const Fragment = 'Fragment';


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
function getStringOfAttrs(attrs) {
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
function getStrChildren(children, isXss) {
  // console.log('=========== getStrChildren', isXss, children);
  return children.map((children) => {
    if (typeof children === 'string') {
      return isXss ? againstXss(children) : children;
    }
    if (typeof children === 'function') {
      return children();
    }
    return '';
  }).join('')
}


const render = {
  function: ({element, attrs, children, isXss}) => {
    // console.log('function', isXss, element, attrs, children);
    // children 转字符串
    const strChildren = getStrChildren(children, isXss);
    return element({
      children: strChildren,
      ...attrs,
    })
  },
  element: ({element, attrs, children, isXss}) => {
    // console.log('element', isXss, element, attrs, children);
    // children 转字符串
    const strChildren = getStrChildren(children, isXss);
    const strAttrs = getStringOfAttrs(attrs);
    return `<${element}${strAttrs ? ` ${strAttrs}` : ''}>${strChildren}</${element}>`;
  },
  selfElement: ({element, attrs}) => {
    // console.log('selfElement', element, attrs);
    const strAttrs = getStringOfAttrs(attrs);
    return `<${element}${strAttrs ? ` ${strAttrs}` : ''}/>`;
  },
  children: ({children, isXss}) => {
    // console.log('just children', isXss, children);
    return getStrChildren(children, isXss);
  }
};

function jsx2string(element, props, ...children) {

  const {dangerouslySetInnerHTML, ...attrs} = props || {};
  // 是否需要 XSS
  const isXss = children && children.length === 1 && typeof children[0] === 'string' && !dangerouslySetInnerHTML;

  console.log(element, isXss, children);
  // 元素是 function
  if (typeof element === 'function') {
    return render.function({element, attrs, children, isXss});
  }
  // 如果是 Fragment 直接渲染子元素
  // 不知道是个啥, 直接渲染子元素
  if (element === Fragment || typeof element !== 'string') {
    return render.children({children, isXss});
  }
  // 自闭合标签, 没有 children
  if (SELF_CLOSE_TAGS.includes(element)) {
    return render.selfElement({element, attrs});
  }
  // 标准 Tag
  return render.element({element, attrs, children, isXss});
};

export default jsx2string;
export {Fragment};
