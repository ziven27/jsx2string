import jsx2string,{ Fragment } from "../lib/jsx2string.js";

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
