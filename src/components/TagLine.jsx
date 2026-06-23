import { useState } from "react";
import getBackgroundState from "../services/ConfigOrderState";
import PropTypes from "prop-types";

const TagLine = ({ statusOrder }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="tag-line"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: getBackgroundState(statusOrder),
      }}
    >
      {statusOrder}
      {isHovered && <div className="tooltip">Estado del pedido</div>}
    </div>
  );
};

TagLine.propTypes = { statusOrder: PropTypes.string.isRequired };

export default TagLine;
