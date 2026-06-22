import api from "./api";

const hasOkStatus = (data) => data?.header?.status === "ok";

const ordersService = {
  async getReadyToShip() {
    const response = await api.get("/ordersreadytoship");
    return hasOkStatus(response.data) ? response.data.payload || [] : null;
  },

  async updateReadyToShipCell(idOrder, columnName, columnValue) {
    const response = await api.patch("/ordersreadytoship", {
      idOrder,
      columnName,
      columnValue,
    });

    return (
      hasOkStatus(response.data) &&
      response.data.header.updatedRows > 0 &&
      response.data.message === "Registro actualizado"
    );
  },

  async getShipmentList() {
    const response = await api.get("/ordershistory");
    return hasOkStatus(response.data) ? response.data.payload || [] : null;
  },

  async getShipmentHistory(nameFile) {
    const response = await api.get(`/ordershistory/${nameFile}`);
    return hasOkStatus(response.data) && response.data.header.content === 1
      ? response.data.payload || []
      : null;
  },
};

export default ordersService;
