import React, { useState, useRef, useEffect } from "react";
import { validateOrderTableValue } from "../utils/orderTableRules";
import { ORDER_TABLE_COLUMNS } from "../config/orderTableColumns";
import useEditableCell from "../hooks/useEditableCell";

const OrdersTable = ({ data, onCellUpdate }) => {
  const {
    cell: editCell,
    isValid: validationStatus,
    open: openEdit,
    change: changeEdit,
    cancel: cancelEdit,
    save: saveEdit,
  } = useEditableCell(onCellUpdate);
  const [cellValidationMap, setCellValidationMap] = useState({});
  const inputRef = useRef(null);
  const tableRef = useRef(null);
  const columns = ORDER_TABLE_COLUMNS;

  // Validar todos los datos al cargar el componente
  useEffect(() => {
    const newValidationMap = {};

    data.forEach((row) => {
      const rowId = row.idOrder || row.id;

      columns.forEach((column) => {
        if (column.editable) {
          const cellKey = `${rowId}-${column.id}`;
          const value = row[column.id] || "";
          newValidationMap[cellKey] = validateInput(column.id, value);
        }
      });
    });

    setCellValidationMap(newValidationMap);
  }, [data]);

  // Enfocar el input cuando se activa la edición
  useEffect(() => {
    if (editCell.rowId && editCell.column && inputRef.current) {
      const content = editCell.value;
      const widthEstimated = Math.max(100, content.length * 8);
      inputRef.current.style.width = `${widthEstimated}px`;
      inputRef.current.focus();
    }
  }, [editCell]);

  // Manejar clic fuera del input para cerrar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        cancelEdit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editCell]);

  // Manejar doble clic en una celda
  const handleCellDoubleClick = (rowId, column, value) => {
    // Solo permitir edición en columnas editables
    const columnDef = columns.find((col) => col.id === column);
    if (columnDef && columnDef.editable) {
      openEdit(rowId, column, value);
    }
  };

  // Validar entrada según la columna
  const validateInput = (column, value) => {
    return validateOrderTableValue(column, value);
  };

  // Manejar cambios en el input
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    changeEdit(newValue);
  };

  // Manejar teclas (Enter para guardar, Escape para cancelar)
  const handleKeyDown = async (e) => {
    if (e.key === "Escape") {
      cancelEdit();
    } else if (e.key === "Enter") {
      if (editCell.value === editCell.originalValue) {
        // Si no hay cambios, simplemente cancelar
        cancelEdit();
      } else if (validationStatus) {
        // Si hay cambios y son válidos, guardar
        await saveEdit();
      }
    }
  };

  // Renderizar una celda (normal o con input)
  const renderCell = (row, column) => {
    const rowId = row.idOrder || row.id;
    const isEditing = editCell.rowId === rowId && editCell.column === column.id;

    const value = row[column.id];
    const cellKey = `${rowId}-${column.id}`;
    const isValid = cellValidationMap[cellKey];

    if (isEditing) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={editCell.value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={validationStatus ? "valid-input" : "invalid-input"}
          onDoubleClick={(e) => {
            e.stopPropagation();
          }}
        />
      );
    }

    // Para celdas editables, añadir clase según la validación
    const cellClass = column.editable
      ? `cell-data ${column.id} ${isValid === false ? "invalid-cell" : ""}`
      : "";

    return <span className={cellClass}>{value}</span>;
  };

  return (
    <div className="table-container">
      <div className="table-wrapper" ref={tableRef}>
        <table className="orders-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.idOrder || row.id}>
                {columns.map((column) => {
                  const rowId = row.idOrder || row.id;
                  const cellKey = `${rowId}-${column.id}`;
                  const isValid = cellValidationMap[cellKey];
                  const isCurrentlyEditing =
                    editCell.rowId === rowId && editCell.column === column.id;

                  return (
                    <td
                      key={cellKey}
                      {...(!isCurrentlyEditing
                        ? {
                            onDoubleClick: () =>
                              handleCellDoubleClick(
                                rowId,
                                column.id,
                                row[column.id]
                              ),
                          }
                        : {})}
                      className={
                        column.editable
                          ? isValid === false
                            ? `editable-cell invalid-cell`
                            : `editable-cell`
                          : ``
                      }
                    >
                      {renderCell(row, column)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
