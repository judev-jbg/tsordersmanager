import PropTypes from "prop-types";

const Filter = ({ id, label, counter, newBlock, active, onClick }) => {
  return (
    <>
      {newBlock && <span className="new-block"></span>}
      <span
        className={`filter ${active ? "active" : ""}`}
        onClick={() => onClick(id)}
      >
        {label}
        <span className={`counter ${counter > 0 ? "flagger" : ""}`}>
          {counter}
        </span>
      </span>
    </>
  );
};

Filter.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  counter: PropTypes.number,
  newBlock: PropTypes.bool,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default Filter;
