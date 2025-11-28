import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Button = ({ shipCount = 0 }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/orders-to-ship");
  };
  return (
    <button className="button" onClick={handleClick}>
      Preparar envios {shipCount > 0 && <span className="badge">{shipCount}</span>}
    </button>
  );
};

export default Button;
