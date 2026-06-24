import useFetchFlag from "../hooks/useFetchFlag";
import PropTypes from "prop-types";

const Flag = ({ channel }) => {
  const flagImage = useFetchFlag(channel);

  return (
    <figure className="container-flag">
      {flagImage && <img src={flagImage} alt={channel} className="flag" />}
    </figure>
  );
};

Flag.propTypes = { channel: PropTypes.string };

export default Flag;
