import { useCallback, useEffect, useState } from "react";
import "./TsOrdersApp.css";
import api from "./services/api";
import Header from "./components/Header";
import Filters from "./components/Filters";
import Order from "./components/Order";
import SearchBarModal from "./components/SearchBarModal";
import OrderSkeleton from "./components/OrderSkeleton";
import SearchNoResult from "./components/SearchNoResult";
import useAddressFormatter from "./hooks/useAddressFormatter";
import useCodCountry from "./hooks/useCodCountry";
import useSessionTimeout from "./hooks/useSessionTimeout";
import useScrollVisibility from "./hooks/useScrollVisibility";
import useOrderResources from "./hooks/useOrderResources";
import useShipmentActions from "./hooks/useShipmentActions";
import useShipmentFlow from "./hooks/useShipmentFlow";
import useOrderSwitches from "./hooks/useOrderSwitches";
import { SESSION_CONFIG } from "./config/sessionConfig";
import { findOrderForAction, getRevertedSwitchState } from "./utils/orderActions";
import {
  buildFakeRequest,
  buildStockRequest,
  updateStockFilterCounters,
} from "./utils/orderActionState";

const TsOrdersApp = () => {
  // Session timeout (30 minutos)
  useSessionTimeout(SESSION_CONFIG.TIMEOUT);
  const ordersFilter = [
    {
      id: 1,
      resource: "orderspending",
      label: "Pendientes de envío",
      newBlock: false,
      counter: 0,
      active: true,
    },
    {
      id: 2,
      resource: "orderspending/untiltoday",
      label: "hoy",
      newBlock: false,
      counter: 0,
      active: false,
    },
    {
      id: 3,
      resource: "orderspending/delayed",
      label: "Vencidos",
      newBlock: false,
      counter: 0,
      active: false,
    },
    {
      id: 4,
      resource: "ordersoutofstock",
      label: "Pendientes de envío - Sin stock",
      newBlock: true,
      counter: 0,
      active: false,
    },
    {
      id: 5,
      resource: "ordersoutofstock/untiltoday",
      label: "hoy",
      newBlock: false,
      counter: 0,
      active: false,
    },
    {
      id: 6,
      resource: "ordersoutofstock/delayed",
      label: "Vencidos",
      newBlock: false,
      counter: 0,
      active: false,
    },
    {
      id: 7,
      resource: "ordersshipfake",
      label: "Envios fake",
      newBlock: true,
      counter: 0,
      active: false,
    },
  ];
  const [isOpenModal, setIsOpenModal] = useState(false);
  const {
    filters: itemsFilter,
    orders,
    loading: isLoading,
    selectFilter: handleFilterClick,
    setFilters: setItemsFilter,
    setOrders,
  } = useOrderResources(ordersFilter);
  const getCountryCode = useCodCountry();
  const { createShipment, removeShipment } = useShipmentActions(getCountryCode);
  const {
    switchStates,
    setSwitchStates,
    shipSwitchCount,
    isAnySwitchChecked,
  } = useOrderSwitches({
    orders,
    setFilters: setItemsFilter,
    removeShipment,
  });
  const [addressToFormat, setAddressToFormat] = useState(null);
  const formattedAddress = useAddressFormatter(addressToFormat);
  const updateShipmentSwitch = useCallback(
    (id, value) =>
      setSwitchStates((currentStates) => ({ ...currentStates, [id]: value })),
    [setSwitchStates]
  );
  const { submit: submitShipment } = useShipmentFlow(
    createShipment,
    updateShipmentSwitch
  );
  const showUpButton = useScrollVisibility(1500) ? "show" : "";

  // Función para obtener todas las órdenes de todos los recursos
  // Cargar datos al montar el componente
  useEffect(() => {
    // Solo proceder si hay órdenes disponibles
    if (orders.length > 0) {
      const initialSwitchStates = {};
      orders.forEach((item) => {
        // Usa una propiedad única de cada order como ID
        const id = `ship-${item.amazonOrderId}`;
        const initialValue = item.markForShipment || 0;

        initialSwitchStates[id] = initialValue;
      });

      setSwitchStates(initialSwitchStates);
    }
  }, [orders, setSwitchStates]); // Este efecto se ejecuta cada vez que orders cambia

  useEffect(() => {
    // Solo procedemos si hay una dirección para formatear y ya tenemos la dirección formateada
    if (addressToFormat && formattedAddress) {
      // Continuamos con el proceso de envío aquí
      submitShipment(addressToFormat.targetOrder, formattedAddress).finally(() =>
        setAddressToFormat(null)
      );
    }
  }, [addressToFormat, formattedAddress, submitShipment]);

  // Función para manejar el clic en un filtro
  const handlerModalSearch = () => {
    setIsOpenModal(!isOpenModal);
  };

  const handleSwitchChange = async (id, isChecked, actionSwitch) => {
    // Determinar el prefijo según el tipo de acción
    let prefix = "";
    if (actionSwitch === "ship") {
      prefix = "ship-";
    } else if (actionSwitch === "stock") {
      prefix = "stock-";
    } else if (actionSwitch === "fake") {
      prefix = "fake-";
    } else {
      console.error(`Tipo de acción desconocido: ${actionSwitch}`);
      return;
    }

    // Extraer el ID de la orden del ID del switch
    const orderId = id.replace(prefix, "");

    // Buscar la orden correspondiente en el estado de órdenes
    let targetOrder = findOrderForAction(orders, id, actionSwitch);

    // Buscar en todas las órdenes de todos los recursos

    // Si no encontramos la orden, mostramos un error
    if (!targetOrder) {
      console.error(`No se encontró la orden con ID: ${orderId}`);
      return;
    }

    setSwitchStates((prevStates) => ({
      ...prevStates,
      [id]: isChecked ? 1 : 0,
    }));

    try {
      // Manejar cada tipo de acción según el valor del switch
      if (actionSwitch === "ship") {
        if (isChecked) {
          // Configurar los datos de dirección para formatear
          setAddressToFormat({
            shipAddress1: targetOrder.shipAddress1,
            shipAddress2: targetOrder.shipAddress2,
            shipAddress3: targetOrder.shipAddress3,
            shipPostalCode: targetOrder.shipPostalCode,
            shipCity: targetOrder.shipCity,
            shipState: targetOrder.shipState,
            targetOrder,
          });
        } else {
          // Si el switch se desactivó, hacer solicitud DELETE
          const deleteRequestBody = {
            idOrder: targetOrder.amazonOrderId,
            value: 0,
            shipmentType: "usingFile",
          };

          console.log(
            "Enviando solicitud DELETE para orden:",
            targetOrder.amazonOrderId
          );
          console.log("Cuerpo de la solicitud DELETE:", deleteRequestBody);

          // Realizar la solicitud DELETE
          const removed = await removeShipment(targetOrder);
          if (!removed) throw new Error("Could not remove shipment");
        }
        // Actualiza el estado del switch Ship
        setSwitchStates((prevStates) => ({
          ...prevStates,
          [id]: isChecked ? 1 : 0,
        }));
      }
      // Manejar acción "stock"
      else if (actionSwitch === "stock") {
        const requestBody = buildStockRequest(
          targetOrder.amazonOrderId,
          isChecked
        );

        console.log(
          `Enviando solicitud PATCH para orden (withoutstock=${
            isChecked ? 1 : 0
          }):`,
          targetOrder.amazonOrderId
        );
        console.log("Cuerpo de la solicitud PATCH:", requestBody);

        // Realizar la solicitud PATCH
        const response = await api.patch("/orderspending", requestBody);

        console.log("Respuesta de la API (PATCH) Stock:", response.data);
        if (response.data.message === "Registro actualizado") {
          // Actualizar los filtros con los nuevos contadores
          setItemsFilter((prevFilters) =>
            updateStockFilterCounters(prevFilters, isChecked)
          );
        }
      }
      // Manejar acción "fake"
      else if (actionSwitch === "fake") {
        const requestBody = buildFakeRequest(targetOrder.amazonOrderId, isChecked);

        console.log(
          `Enviando solicitud PATCH para orden (isFake=${isChecked ? 1 : 0}):`,
          targetOrder.amazonOrderId
        );
        console.log("Cuerpo de la solicitud PATCH:", requestBody);

        // Realizar la solicitud PATCH
        const response = await api.patch("/ordersoutofstock", requestBody);

        console.log("Respuesta de la API (PATCH) isFake:", response.data);
      }

    } catch (error) {
      console.error(
        `Error al procesar la acción ${actionSwitch} para la orden:`,
        error
      );

      // Revertir el cambio del switch en caso de error
      setSwitchStates((prevStates) => ({
        ...prevStates,
        [id]: getRevertedSwitchState(isChecked), // Invertir el estado
      }));

      // Limpiar el estado de dirección si es necesario
      if (actionSwitch === "ship" && isChecked) {
        setAddressToFormat(null);
      }
    }
  };

  const handleUpButtonClick = () => {
    window.scroll(0, 0);
  };

  // Renderizado condicional de órdenes según el filtro activo
  const renderOrders = () => {
    if (isLoading) {
      // Renderizar múltiples skeletons según necesidad
      return Array(3)
        .fill(0)
        .map((_, index) => <OrderSkeleton key={index} />);
    }

    if (orders.length === 0) {
      return <SearchNoResult />;
    }

    return orders.map((order, index) => (
      <Order
        key={order.amazonOrderId || index}
        order={order}
        onSwitchChange={handleSwitchChange}
        switchStates={switchStates}
      />
    ));
  };

  return (
    <div className="content">
      <Header
        handlerModalSearch={handlerModalSearch}
        showButton={isAnySwitchChecked}
        shipCount={shipSwitchCount}
        ready={isLoading}
      />
      <Filters filters={itemsFilter} onFilterClick={handleFilterClick} />
      <main className="main">{renderOrders()}</main>
      <button
        className={`fab-button up-button ${showUpButton}`}
        onClick={handleUpButtonClick}
      >
        <span>↑</span>
      </button>
      {isOpenModal && (
        <SearchBarModal
          open={isOpenModal}
          close={() => {
            handlerModalSearch();
            document.getElementsByTagName("html")[0].removeAttribute("style");
          }}
          setOrders={setOrders}
          setItemsFilter={setItemsFilter}
        />
      )}
    </div>
  );
};

export default TsOrdersApp;
