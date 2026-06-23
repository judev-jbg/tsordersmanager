import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { findOrderForAction, getRevertedSwitchState } from "../utils/orderActions";
import {
  buildFakeRequest,
  buildStockRequest,
  updateStockFilterCounters,
} from "../utils/orderActionState";

const actionPrefixes = {
  ship: "ship-",
  stock: "stock-",
  fake: "fake-",
};

const useOrderSwitches = ({ orders, setFilters, removeShipment }) => {
  const [switchStates, setSwitchStates] = useState({});
  const [addressToFormat, setAddressToFormat] = useState(null);

  useEffect(() => {
    setSwitchStates(
      Object.fromEntries(
        orders.map((order) => [
          `ship-${order.amazonOrderId}`,
          order.markForShipment || 0,
        ])
      )
    );
  }, [orders]);

  const handleSwitchChange = useCallback(
    async (id, isChecked, actionSwitch) => {
      const prefix = actionPrefixes[actionSwitch];
      if (!prefix) return;

      const targetOrder = findOrderForAction(orders, id, actionSwitch);
      if (!targetOrder) return;

      setSwitchStates((currentStates) => ({
        ...currentStates,
        [id]: isChecked ? 1 : 0,
      }));

      try {
        if (actionSwitch === "ship") {
          if (isChecked) {
            setAddressToFormat({
              shipAddress1: targetOrder.shipAddress1,
              shipAddress2: targetOrder.shipAddress2,
              shipAddress3: targetOrder.shipAddress3,
              shipPostalCode: targetOrder.shipPostalCode,
              shipCity: targetOrder.shipCity,
              shipState: targetOrder.shipState,
              targetOrder,
            });
          } else if (!(await removeShipment(targetOrder))) {
            throw new Error("Could not remove shipment");
          }
          return;
        }

        if (actionSwitch === "stock") {
          const response = await api.patch(
            "/orderspending",
            buildStockRequest(targetOrder.amazonOrderId, isChecked)
          );
          if (response.data.message === "Registro actualizado") {
            setFilters((filters) => updateStockFilterCounters(filters, isChecked));
          }
          return;
        }

        await api.patch(
          "/ordersoutofstock",
          buildFakeRequest(targetOrder.amazonOrderId, isChecked)
        );
      } catch {
        setSwitchStates((currentStates) => ({
          ...currentStates,
          [id]: getRevertedSwitchState(isChecked),
        }));
        if (actionSwitch === "ship" && isChecked) setAddressToFormat(null);
      }
    },
    [orders, removeShipment, setFilters]
  );

  const shipSwitchCount = useMemo(
    () =>
      Object.entries(switchStates).filter(
        ([key, value]) => key.startsWith("ship-") && (value === 1 || value === true)
      ).length,
    [switchStates]
  );

  return {
    switchStates,
    shipSwitchCount,
    addressToFormat,
    clearAddressToFormat: () => setAddressToFormat(null),
    handleSwitchChange,
  };
};

export default useOrderSwitches;
