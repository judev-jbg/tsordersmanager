// eslint-disable-next-line react/prop-types
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

export default Switch;
