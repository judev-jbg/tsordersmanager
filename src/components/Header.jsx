import Logo from "./Logo";
import SearchBar from "./SearchBar";
import Button from "./Button";

// eslint-disable-next-line react/prop-types
const Header = ({ handlerModalSearch, showButton }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Logo />
        </div>
        <div className="header-action">{showButton && <Button />}</div>
        <div className="header-search">
          <SearchBar handlerModalSearch={handlerModalSearch} />
        </div>
      </div>
    </header>
  );
};

export default Header;
