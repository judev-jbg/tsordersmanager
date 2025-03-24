import { useState } from "react";

// eslint-disable-next-line react/prop-types
const TagRadius = ({ statusOrder, tooltipText }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="tag-radius"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "#28a745",
      }}
    >
      {statusOrder}
      {isHovered && <div className="tooltip">{tooltipText}</div>}
    </div>
  );
};

export default TagRadius;
