import { useCallback } from "react";
import api from "../services/api";
import { buildShipmentRequest } from "../utils/orderActions";

const useShipmentActions = (getCountryCode) => {
  const createShipment = useCallback(
    async (order, formattedAddress) => {
      try {
        await api.post(
          "/ordersreadytoship",
          buildShipmentRequest(order, formattedAddress, getCountryCode)
        );
        return true;
      } catch (error) {
        console.error("Error creating shipment:", error);
        return false;
      }
    },
    [getCountryCode]
  );

  const removeShipment = useCallback(async (order) => {
    try {
      await api.delete("/ordersreadytoship", {
        data: {
          idOrder: order.amazonOrderId,
          value: 0,
          shipmentType: "usingFile",
        },
      });
      return true;
    } catch (error) {
      console.error("Error removing shipment:", error);
      return false;
    }
  }, []);

  return { createShipment, removeShipment };
};

export default useShipmentActions;
