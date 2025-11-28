import * as XLSX from "xlsx";

/**
 * Utilidades para exportaci贸n de Excel
 * Elimina la duplicaci贸n de la funci贸n exportToExcel
 */

/**
 * Campos a excluir del Excel
 */
const DEFAULT_EXCLUDED_FIELDS = [
  "idOrder",
  "exported",
  "engraved",
  "process",
  "fileGenerateName",
  "updateDateTime",
];

/**
 * Exportar datos a archivo Excel
 * @param {Array|Object} data - Datos a exportar
 * @param {string} fileName - Nombre del archivo (con o sin .xlsx)
 * @param {Array} excludedFields - Campos a excluir (opcional)
 * @returns {boolean} - true si se export贸 correctamente
 */
export const exportToExcel = (
  data,
  fileName,
  excludedFields = DEFAULT_EXCLUDED_FIELDS
) => {
  // Normalizar datos (puede venir como array o array de arrays)
  const rawOrdersData =
    Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;

  // Validar que tengamos datos
  if (!Array.isArray(rawOrdersData) || rawOrdersData.length === 0) {
    console.error("No hay datos para exportar a Excel", data);
    return false;
  }

  try {
    // Filtrar campos excluidos de cada objeto
    const filteredOrdersData = rawOrdersData.map((order) => {
      const filteredOrder = {};
      Object.keys(order).forEach((key) => {
        if (!excludedFields.includes(key)) {
          filteredOrder[key] = order[key];
        }
      });
      return filteredOrder;
    });

    // Crear worksheet y workbook
    const worksheet = XLSX.utils.json_to_sheet(filteredOrdersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");

    // Limpiar nombre de archivo y exportar
    const cleanFileName = fileName.replace(/\.xlsx$/i, "");
    XLSX.writeFile(workbook, `${cleanFileName}.xlsx`);

    console.log(
      `Excel exportado: ${cleanFileName}.xlsx con ${filteredOrdersData.length} registros`
    );

    return true;
  } catch (error) {
    console.error("Error al exportar Excel:", error);
    return false;
  }
};

/**
 * Crear Excel con columnas personalizadas
 * @param {Array} data - Datos a exportar
 * @param {Array} columns - Array de objetos {key, header}
 * @param {string} fileName - Nombre del archivo
 * @returns {boolean} - true si se export贸 correctamente
 */
export const exportToExcelCustom = (data, columns, fileName) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error("No hay datos para exportar");
    return false;
  }

  try {
    // Mapear datos seg煤n las columnas especificadas
    const mappedData = data.map((row) => {
      const mappedRow = {};
      columns.forEach((col) => {
        mappedRow[col.header] = row[col.key];
      });
      return mappedRow;
    });

    // Crear y exportar
    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    const cleanFileName = fileName.replace(/\.xlsx$/i, "");
    XLSX.writeFile(workbook, `${cleanFileName}.xlsx`);

    console.log(`Excel exportado: ${cleanFileName}.xlsx`);
    return true;
  } catch (error) {
    console.error("Error al exportar Excel personalizado:", error);
    return false;
  }
};

export default { exportToExcel, exportToExcelCustom };
