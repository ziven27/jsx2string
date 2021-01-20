## jsx2string

Transpile JSX to plain javascript strings, without React or other runtime libraries.

### How To Install

1. The required packages are `@babel/plugin-syntax-jsx`, `@babel/plugin-transform-react-jsx` and of course `jsx2string`。
2. Need `@babel/core`, webpack or any other way to transpile the code that you prefer.

```sh
$ npm install jsx2string @babel/plugin-syntax-jsx @babel/plugin-transform-react-jsx
```

### Getting started

Make sure you have the "pragma" and "pragmaFrag" fn defined and its name is "jsx2string" and "Fragment"

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
        "pragma": "jsx2string",
        "pragmaFrag": "Fragment"
      }
    ]
  ]
}
```

Now you can create components e.g.

```jsx
import jsx2string,{ Fragment } from "jsx2string";

const Avatar=({children, ...rest})=>{
  return <avatar {...rest}>{children}</avatar>;
};

const dangerText=`<i>hello</i>`;

const Home = function () {
  const user = {
    "firstName": "hello",
    "lastName": `world<br/>`
  };
  return (
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

> it just looks like React，but it's totally plain javascript. 

### Features

- Render Basic Single Components `<div />`
- Conditional Component `{condition ? <foo/> : <bar/>}`
- Component with Data Attributes `<div data-some="attr">`
- Component with Attributes `<img src="foo.jpg">`
- Nested Component ul>li>a
- Siblings Components ul>li\*3
- Components with classname p.chan
- Map components & numbers `array.map(item => <div>{item}</div>)`
- Fragments
- Component Props `<Custom foo="foo">`
- Component Children `<Custom>children</Custom>`
- [dangerouslySetInnerHTML](#dangerouslysetinnerhtml)

### dangerouslySetInnerHTML

```jsx
function render() {
  const dangerText=`<i>hello</i>`;
  return <div dangerouslySetInnerHTML>{dangerText}</div>
}
```

> it's not like `dangerouslySetInnerHTML={{__html:'**'}}`, Only this attributes ok
