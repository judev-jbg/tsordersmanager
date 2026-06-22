import { useCallback, useState } from "react";

const useShipmentFlow = (createShipment) => {
  const [pendingOrder, setPendingOrder] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const submit = useCallback(
    async (order, formattedAddress) => {
      setPendingOrder(order);
      const success = await createShipment(order, formattedAddress);
      setLastResult({ orderId: order.amazonOrderId, success });
      setPendingOrder(null);
      return success;
    },
    [createShipment]
  );

  return { pendingOrder, lastResult, submit };
};

export default useShipmentFlow;
