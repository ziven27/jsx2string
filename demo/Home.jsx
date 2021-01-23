import jsx2string, {Fragment} from "../index.js";

const Avatar = ({children, title = "avatar", ...rest}) => {
  return <span title={title} {...rest}>{children}</span>;
};

const dangerText = `<i>danger</i>`;
const Home = function () {
  const user = {
    "firstName": "firstName",
    "lastName": `lastName<br/>`
  };
  // return jsx2string(<Fragment dangerouslySetInnerHTML={{__html: dangerText}} />);
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
  );
};
export default Home;
