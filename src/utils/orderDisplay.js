export const formatRecipient = (recipient = "", purchaseOrderNumber = "") =>
  purchaseOrderNumber
    ? recipient.replace(`PO${purchaseOrderNumber}`, "")
    : recipient;

export const normalizePhone = (phone = "") =>
  phone
    .replace(" ", "")
    .replace(".0", "")
    .replace("+34-", "")
    .replace("+34", "");

export const formatPostalCode = (postalCode = "") =>
  String(postalCode).length === 4 ? `0${postalCode}` : postalCode;
