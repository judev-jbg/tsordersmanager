import React, { useState, useRef, useEffect } from "react";
import "./OrdersTable.css";

const OrdersTable = ({ data, onCellUpdate }) => {
  const [editCell, setEditCell] = useState({
    rowId: null,
    column: null,
    value: "",
    originalValue: "",
  });
  const [validationStatus, setValidationStatus] = useState(true);
  const inputRef = useRef(null);
  const tableRef = useRef(null);

  // Definición de columnas y sus propiedades
  const columns = [
    { id: "servicio", label: "Servicio", editable: false },
    { id: "horario", label: "Horario", editable: false },
    {
      id: "destinatario",
      label: "Destinatario",
      editable: true,
      maxLength: 40,
    },
    { id: "direccion", label: "Dirección", editable: true, maxLength: 40 },
    { id: "pais", label: "País", editable: false },
    { id: "cp", label: "CP", editable: true, maxLength: 10 },
    { id: "poblacion", label: "Población", editable: true, maxLength: 10 },
    { id: "telefono", label: "Teléfono", editable: true, maxLength: 10 },
    { id: "email", label: "Email", editable: false },
    {
      id: "departamento",
      label: "Departamento",
      editable: true,
      maxLength: 20,
    },
    { id: "contacto", label: "Contacto", editable: true, maxLength: 10 },
    {
      id: "observaciones",
      label: "Observaciones",
      editable: true,
      maxLength: 40,
    },
    { id: "bultos", label: "Bultos", editable: false },
    { id: "peso", label: "Peso", editable: false },
    { id: "movil", label: "Móvil", editable: true, maxLength: 10 },
    { id: "refc", label: "RefC", editable: true, maxLength: 14 },
  ];

  // Enfocar el input cuando se activa la edición
  useEffect(() => {
    if (editCell.rowId && editCell.column && inputRef.current) {
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
      setEditCell({
        rowId,
        column,
        value: value || "",
        originalValue: value || "",
      });
      setValidationStatus(true);
    }
  };

  // Validar entrada según la columna
  const validateInput = (column, value) => {
    const columnDef = columns.find((col) => col.id === column);
    if (!columnDef) return true;

    // Verificar longitud máxima
    if (columnDef.maxLength && value.length > columnDef.maxLength) {
      return false;
    }

    // Aquí puedes añadir más validaciones específicas por columna si es necesario
    switch (column) {
      case "telefono":
      case "movil":
        // Solo permitir números y algunos caracteres especiales
        return /^[0-9+\-\s]*$/.test(value);
      case "cp":
        // Permitir alfanuméricos y guiones para códigos postales internacionales
        return /^[0-9a-zA-Z\-\s]*$/.test(value);
      default:
        return true;
    }
  };

  // Manejar cambios en el input
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setEditCell((prev) => ({
      ...prev,
      value: newValue,
    }));

    // Validar el nuevo valor
    const isValid = validateInput(editCell.column, newValue);
    setValidationStatus(isValid);
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

  // Cancelar la edición
  const cancelEdit = () => {
    setEditCell({ rowId: null, column: null, value: "", originalValue: "" });
    setValidationStatus(true);
  };

  // Guardar la edición
  const saveEdit = async () => {
    if (!validationStatus) return;

    const success = await onCellUpdate(
      editCell.rowId,
      columns.find((col) => col.id === editCell.column)?.label ||
        editCell.column,
      editCell.value
    );

    if (success) {
      cancelEdit();
    }
  };

  // Renderizar una celda (normal o con input)
  const renderCell = (row, column) => {
    const isEditing =
      editCell.rowId === row.idOrder && editCell.column === column.id;

    const value = row[column.id];

    if (isEditing) {
      return (
        <input
          ref={inputRef}
          type="text"
          value={editCell.value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={validationStatus ? "valid-input" : "invalid-input"}
        />
      );
    }

    return <span>{value}</span>;
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
                {columns.map((column) => (
                  <td
                    key={`${row.idOrder}-${column.id}`}
                    onDoubleClick={() =>
                      handleCellDoubleClick(
                        row.idOrder || row.id,
                        column.id,
                        row[column.id]
                      )
                    }
                    className={column.editable ? "editable-cell" : ""}
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
