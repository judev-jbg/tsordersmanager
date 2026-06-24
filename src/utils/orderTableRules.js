const maximumLengths = {
  destinatario: 40,
  direccion: 80,
  cp: 10,
  poblacion: 80,
  telefono: 15,
  email: 255,
  departamento: 40,
  contacto: 40,
  observaciones: 98,
  movil: 15,
  refC: 14,
  num_pedido_ahora: 7,
};

export const validateOrderTableValue = (column, value) => {
  const stringValue = String(value ?? "");
  const maximumLength = maximumLengths[column];

  if (maximumLength && stringValue.length > maximumLength) return false;
  if (["telefono", "movil"].includes(column)) {
    return /^[0-9+\-\s]*$/.test(stringValue);
  }
  if (column === "cp") return /^[0-9a-zA-Z\-\s]*$/.test(stringValue);
  return true;
};
