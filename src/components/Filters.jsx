import PropTypes from "prop-types";
import Filter from "./Filter";

const Filters = ({ filters, onFilterClick }) => {
  return (
    <div className="filters">
      <div className="filters-container">
        {filters.map((item) => (
          <Filter
            key={item.id}
            id={item.id}
            label={item.label}
            counter={item.counter}
            newBlock={item.newBlock}
            active={item.active}
            onClick={onFilterClick}
          />
        ))}
      </div>
    </div>
  );
};

Filters.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      counter: PropTypes.number,
      newBlock: PropTypes.bool,
      active: PropTypes.bool,
    })
  ).isRequired,
  onFilterClick: PropTypes.func.isRequired,
};

export default Filters;
