import { useNavigate } from "react-router-dom";
const Button = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/orders-to-ship");
  };
  return (
    <button className="button" onClick={handleClick}>
      Preparar envíos
    </button>
  );
};

export default Button;
