import { useCallback, useState } from "react";

const useShipmentFlow = (createShipment, updateSwitch) => {
  const [pendingOrder, setPendingOrder] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const submit = useCallback(
    async (order, formattedAddress) => {
      setPendingOrder(order);
      const success = await createShipment(order, formattedAddress);
      setLastResult({ orderId: order.amazonOrderId, success });
      updateSwitch?.(`ship-${order.amazonOrderId}`, success ? 1 : 0);
      setPendingOrder(null);
      return success;
    },
    [createShipment, updateSwitch]
  );

  return { pendingOrder, lastResult, submit };
};

export default useShipmentFlow;
