import PropTypes from "prop-types";

const Switch = ({ label, checked, onChange, id, action }) => {
  const handleSwitchChange = (event) => {
    onChange(id, event.target.checked, action);
  };

  return (
    <label className="switch-container">
      <label className="switch-label" htmlFor={id}>
        {label}
      </label>
      <input
        className="switch-checkbox"
        type="checkbox"
        id={id}
        checked={Boolean(checked)}
        onChange={handleSwitchChange}
      />
      <div className="switch"></div>
    </label>
  );
};

Switch.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  action: PropTypes.oneOf(["ship", "stock", "fake"]).isRequired,
};

export default Switch;
