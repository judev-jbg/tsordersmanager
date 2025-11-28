import Logo from "./Logo";
import SearchBar from "./SearchBar";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";

// eslint-disable-next-line react/prop-types
const Header = ({ handlerModalSearch, showButton, shipCount = 0, ready }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { showToast } = useToast();

  const handleHistoryClick = () => {
    navigate("/orders-shipments-history");
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      showToast("Sesión cerrada exitosamente", "success");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      showToast("Error al cerrar sesión", "error");
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Logo />
        </div>
        <div className="header-search">
          <SearchBar handlerModalSearch={handlerModalSearch} />
        </div>
        <div className="header-action">
          {!ready && (
            <div className="flex">
              <ThemeToggle />
              {showButton && <Button shipCount={shipCount} />}
              <button className="button-line" onClick={handleHistoryClick}>
                <span>Historial de envíos</span>
              </button>
              {user && (
                <button
                  className="button-text"
                  onClick={handleLogout}
                  style={{ marginLeft: "10px" }}
                >
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
