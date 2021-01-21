## jsx2string

Transpile JSX to plain javascript strings, without React or other runtime libraries.

### Features

- Render Basic Single Component `<div />`
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

/* here you need return the instence of Home */
/* Home() will return a function */
/* Home()() will get the string */
export default Home();
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
