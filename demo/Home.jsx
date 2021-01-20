import jsx2string,{ Fragment } from "../index.js";

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
      <div/>
      <div dangerouslySetInnerHTML>{dangerText}</div>
      <div>{dangerText}</div>
      <input type="checkbox" checked />
      <img src="avatar.png" class="profile"/>
      <h3>{[user.firstName, user.lastName].join(" ")} <span>hello</span></h3>
      <Avatar title="123" />
      <Fragment>Hello world!</Fragment>
      <>Hello world!</>
    </Fragment>
  )
};

export default Home;
