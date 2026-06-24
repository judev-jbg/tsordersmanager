import { useCallback, useState } from "react";
import { validateOrderTableValue } from "../utils/orderTableRules";

const emptyCell = { rowId: null, column: null, value: "", originalValue: "" };

const useEditableCell = (onUpdate) => {
  const [cell, setCell] = useState(emptyCell);

  const open = useCallback((rowId, column, value) => {
    const normalizedValue = value ?? "";
    setCell({ rowId, column, value: normalizedValue, originalValue: normalizedValue });
  }, []);

  const change = useCallback((value) => {
    setCell((currentCell) => ({ ...currentCell, value }));
  }, []);

  const cancel = useCallback(() => setCell(emptyCell), []);

  const save = useCallback(async () => {
    if (!cell.rowId || !validateOrderTableValue(cell.column, cell.value)) return false;
    if (cell.value === cell.originalValue) {
      cancel();
      return true;
    }

    const success = await onUpdate(cell.rowId, cell.column, cell.value);
    if (success) cancel();
    return success;
  }, [cancel, cell, onUpdate]);

  return { cell, isValid: validateOrderTableValue(cell.column, cell.value), open, change, cancel, save };
};

export default useEditableCell;
