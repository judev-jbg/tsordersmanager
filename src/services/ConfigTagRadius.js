const getBackgroundTagRadius = (label) => {
  const labels = {
    Empresarial: "#707070",
    "Pago con IVA": "#00BCD4",
    "Pago sin IVA": "#fd5957",
  };

  return labels[label] || "#707070";
};
export default getBackgroundTagRadius;
