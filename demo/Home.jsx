const Avatar = ({children, ...rest}) => {
  return <span title="avatar" {...rest}>{children}</span>;
};

const dangerText = `<i>danger</i>`;

const Home = function () {
  const user = {
    "firstName": "firstName",
    "lastName": `lastName<br/>`
  };
  return (
    <div>
      <>{dangerText}</>
      <div/>
      <div dangerouslySetInnerHTML>{dangerText}</div>
      <div className="123">{dangerText}</div>
      <div>{() => {
        return "function return hello world";
      }}</div>
      <div>{['1', '2', '3']}</div>
      <input type="checkbox" checked/>
      <input type="checkbox" checked={false}/>
      <img src="avatar.png" className="profile"/>
      <h3>{[user.firstName, user.lastName].join(" ")} {dangerText} <span>hello</span></h3>
      <Avatar title="123">1232</Avatar>
      {[1, 2, 3].map((item) => <Avatar>{item}</Avatar>)}
    </div>
  )
};

export default Home();
