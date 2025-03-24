import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

// eslint-disable-next-line react/prop-types
export default function SearchBarModal({ open, close }) {
  const [search, setSearch] = useState("");
  if (!open) return null;
  document.getElementsByTagName("html")[0].style.overflow = "hidden";
  return (
    <div
      className="searchBarModal-container"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="searchBarModal">
        <input
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
          type="text"
          placeholder="Buscar pedido o envío..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          className="inputSearch"
        />
        {search && (
          <span className="search-icon-modal clear">
            <IoCloseOutline onClick={() => setSearch("")} />
          </span>
        )}

        <span className="search-icon-modal">
          <FaSearch />
        </span>
      </div>
    </div>
  );
}
