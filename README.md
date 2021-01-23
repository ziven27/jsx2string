## jsx2string

Transpile JSX to plain javascript strings, without React or other runtime libraries.

| NPM package                          | github                          |
| ------------------------------------ | ------------------------------- |
| [![npm package][npm-badge]][npm-url] | [![github][git-badge]][git-url] |

[npm-badge]: https://img.shields.io/npm/v/jsx2string.svg
[npm-url]: https://www.npmjs.org/package/jsx2string
[git-url]: https://github.com/ziven27/jsx2string
[git-badge]: https://img.shields.io/github/stars/ziven27/jsx2string.svg?style=social


### Features

- Render Basic Single Component `<div />`
- ClassName to class `<div className="clearfix" />`
- Ignore `false` props `<input checked={false} />`
- Conditional Component `{condition ? <foo/> : <bar/>}`
- Component with Data Attributes `<div data-some="attr">`
- Component with Attributes `<img src="foo.jpg">`
- Nested Component ul>li>a
- Siblings Components ul>li\*3
- Components with classname p.chan
- Map components & numbers `array.map(item => <div>{item}</div>)`
- Fragment `<>hello world</> <Fragment>hello world</Fragment>`
- Component Props `<Custom foo="foo">`
- Component Children `<Custom>children</Custom>`
- [dangerouslySetInnerHTML](#dangerouslysetinnerhtml)

### How To Install

1. The required packages are `@babel/plugin-syntax-jsx`, `@babel/plugin-transform-react-jsx` and of course `jsx2string`。
2. Need `@babel/core`, webpack or any other way to transpile the code that you prefer.

```sh
$ npm install jsx2string @babel/plugin-syntax-jsx @babel/plugin-transform-react-jsx
```

### Getting started

Make sure you have the "runtime" and "importSource" fn defined like below.

```json
// .babelrc
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
    "@babel/plugin-syntax-jsx",
    [
      "@babel/plugin-transform-react-jsx",
      {
        "runtime": "automatic",
        "importSource": "jsx2string"
      }
    ]
  ]
}
```

Now you can create components e.g.

```jsx
import jsx2string, {Fragment} from "jsx2string";

const Avatar = ({children, title = "avatar", ...rest}) => {
  return <span title={title} {...rest}>{children}</span>;
};

const dangerText=`<i>hello</i>`;

const Home = function () {
  const user = {
    "firstName": "hello",
    "lastName": `world<br/>`
  };
  return jsx2string(
    <div>
      <Fragment dangerouslySetInnerHTML={{__html: dangerText}}/>
      <hr/>
      <>{null}</>
      <div/>
      <div dangerouslySetInnerHTML={{__html: dangerText}}/>
      <div className="123">{dangerText}</div>
      <div>{() => 'hello'}</div>
      <div>{['1', '2', '3']}</div>
      <input type="checkbox" checked/>
      <input type="checkbox" checked={false}/>
      <img src="avatar.png" className="profile"/>
      <h3>{[user.firstName, user.lastName].join(" ")} {dangerText} <span>hello</span></h3>
      <Avatar title="1232">1232</Avatar>
      {[1, 2, 3].map((item) => <Avatar>{item}</Avatar>)}
    </div>
  )
};

export default Home;
```

> It just looks like React，but it's totally plain javascript. 

### dangerouslySetInnerHTML

```jsx
const dangerText=`<i>hello</i>`;

function render() {
  return <div dangerouslySetInnerHTML={{__html:dangerText}}>this children will be ignore</div>
}
```
