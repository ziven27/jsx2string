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
- Fragments `<>hello world</>`
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
import jsx2string from "./jsx2string";
const Avatar=({children, ...rest})=>{
  return <avatar {...rest}>{children}</avatar>;
};

const dangerText=`<i>hello</i>`;

const Home = function () {
  const user = {
    "firstName": "hello",
    "lastName": `world<br/>`
  };
  return jsx2string(
    <Fragment>
      <div>{dangerText}</div>
      <div dangerouslySetInnerHTML>{dangerText}</div>
      <input type="checkbox" checked />
      <img src="avatar.png" class="profile"/>
      <h3>{[user.firstName, user.lastName].join(" ")} <span>hello</span></h3>
      <Avatar title="123" />
      <Fragment>再见</Fragment>
      <>再见2</>
    </Fragment>
  )
};

export default Home;
```

> It just looks like React，but it's totally plain javascript. 

### dangerouslySetInnerHTML

```jsx
function render() {
  const dangerText=`<i>hello</i>`;
  return <div dangerouslySetInnerHTML>{dangerText}</div>
}
```

> it's not like `dangerouslySetInnerHTML={{__html:'**'}}`, Only need this attribute
