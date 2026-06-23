import { MdOutlineManageSearch } from "react-icons/md";
import PropTypes from "prop-types";

const SearchBar = ({ handlerModalSearch }) => {
  return (
    <>
      <span className="search-bar" onClick={handlerModalSearch}>
        <span className="search-icon">
          <MdOutlineManageSearch />
        </span>
        <input type="text" placeholder="Buscar pedido..." className="input" />
      </span>
    </>
  );
};

SearchBar.propTypes = { handlerModalSearch: PropTypes.func.isRequired };

export default SearchBar;
