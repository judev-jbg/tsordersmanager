const useFormatDate = (date) => {
  const fecha = new Date(date);

  // Formatear la fecha en español con el formato deseado
  const opciones = {
    weekday: "long", // día de la semana completo
    day: "numeric", // día del mes en números
    month: "short", // mes abreviado
    year: "numeric", // año completo
  };

  // Crear un formateador con las opciones y el idioma español
  const formateador = new Intl.DateTimeFormat("es-ES", opciones);

  // Formatear la fecha
  let fechaFormateada = formateador.format(fecha);

  // Reemplazar "de mar de" por "de mar."
  return fechaFormateada.replace(/de mar de/, "de mar.");
};

export default useFormatDate;
