// eslint-disable-next-line react/prop-types
const Filter = ({ label, counter, newBlock }) => {
  return (
    <>
      {newBlock && <span className="new-block"></span>}
      <span className="filter">
        {label} <span className="counter"> {counter}</span>
      </span>
    </>
  );
};

export default Filter;
