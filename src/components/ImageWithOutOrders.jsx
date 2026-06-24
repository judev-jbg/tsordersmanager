import PropTypes from "prop-types";
import emptyOrdersReadyToShip from "../assets/img/search-no-result.svg";

const ImageWithOutOrders = ({ className = "" }) => {
  return (
    <div className={`no-results-container ${className}`}>
      <figure className={`no-results-img ${className}`}>
        <img
          src={emptyOrdersReadyToShip}
          alt="No se encontraron resultados"
          width="100%"
          height="auto"
        />
      </figure>
      <p>No hay órdenes listas para enviar</p>
    </div>
  );
};

ImageWithOutOrders.propTypes = {
  className: PropTypes.string,
};

export default ImageWithOutOrders;
