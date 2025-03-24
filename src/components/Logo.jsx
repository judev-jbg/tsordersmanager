import appLogo from "../assets/img/tom-dark.png";

const Logo = () => {
  return (
    <figure className="container-logo">
      <img src={appLogo} alt="App Logo" className="logo" />
    </figure>
  );
};

export default Logo;
