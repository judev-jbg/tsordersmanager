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
  const [switchStates, setSwitchStates] = useState({});
  const {
    filters: itemsFilter,
    orders,
    loading: isLoading,
    selectFilter: handleFilterClick,
    setFilters: setItemsFilter,
    setOrders,
  } = useOrderResources(ordersFilter);
  const [addressToFormat, setAddressToFormat] = useState(null);
  const formattedAddress = useAddressFormatter(addressToFormat);
  const getCountryCode = useCodCountry();
  const { createShipment, removeShipment } = useShipmentActions(getCountryCode);
  const updateShipmentSwitch = useCallback(
    (id, value) =>
      setSwitchStates((currentStates) => ({ ...currentStates, [id]: value })),
    []
  );
  const { submit: submitShipment } = useShipmentFlow(
    createShipment,
    updateShipmentSwitch
  );
  const showUpButton = useScrollVisibility(1500) ? "show" : "";

  // Función para obtener todas las órdenes de todos los recursos
  /*
  const fetchAllOrders = async () => {
    try {
      setIsLoading(true); // Indicamos que estamos cargando
      console.log("Obteniendo todas las órdenes...");
      // Crear un array de promesas para todas las peticiones
      const endpoints = [
        "/orderspending",
        "/orderspending/untiltoday",
        "/orderspending/delayed",
        "/ordersoutofstock",
        "/ordersoutofstock/untiltoday",
        "/ordersoutofstock/delayed",
        "/ordersshipfake",
      ];

      const promises = endpoints.map((endpoint) => api.get(endpoint));
      const responses = await Promise.all(promises);

      // Crear un objeto con todas las respuestas por recurso
      const ordersMap = {};
      responses.forEach((response, index) => {
        ordersMap[endpoints[index].replace("/", "")] = response.data;
      });

      // Actualizar los contadores de los filtros
      updateFilterCounters(responses);

      // Establecer las órdenes del recurso activo
      const activeOrders = responses.find(
        (response) => response.data.header.resource === activeResource
      );

      if (activeOrders) {
        setOrders([activeOrders.data]);
      } else if (responses.length > 0) {
        // Si no se encuentra el recurso activo, usar el primero
        setOrders([responses[0].data]);
        setActiveResource(responses[0].data.header.resource);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener todas las órdenes: ", error);
      setIsLoading(false);
    }
  };

  */
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
  }, [orders]); // Este efecto se ejecuta cada vez que orders cambia

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
  /*
  const legacyHandleFilterClick = async (filterId) => {
    // Actualizar el filtro activo
    const updatedFilters = itemsFilter.map((filter) => ({
      ...filter,
      active: filter.id === filterId,
    }));

    setItemsFilter(updatedFilters);

    // Obtener el recurso del filtro seleccionado
    const selectedFilter = itemsFilter.find((filter) => filter.id === filterId);

    if (selectedFilter) {
      setIsLoading(true);

      // Hacer una petición inmediata para el recurso seleccionado
      // para mostrar rápidamente estos datos mientras se cargan todos
      try {
        const response = await api.get(`/${selectedFilter.resource}`);
        // console.log(`Solicitud de ordenes a /${selectedFilter.resource}`);
        setOrders([response.data]);
        legacyUpdateFilterCounters(response);
        setIsLoading(false);
      } catch (error) {
        console.error(
          `Error al obtener órdenes para ${selectedFilter.resource}:`,
          error
        );
        setIsLoading(false);
      }
    }
  };

  // Función para actualizar los contadores de los filtros
  const legacyUpdateFilterCounters = (responses) => {
    // Crear un mapa de recursos a contadores
    const resourceCountMap = {};

    if (Array.isArray(responses)) {
      responses.forEach((response) => {
        if (response.data.header && response.data.header.resource) {
          resourceCountMap[response.data.header.resource] =
            response.data.header.count;
        }
      });
    } else {
      if (responses.data.header && responses.data.header.resource) {
        resourceCountMap[responses.data.header.resource] =
          responses.data.header.count;
      }
    }

    // Actualizar los filtros con los nuevos contadores
    setItemsFilter((prevFilters) => {
      return prevFilters.map((filter) => {
        const hasResource = Object.prototype.hasOwnProperty.call(
          resourceCountMap,
          filter.resource
        );
        const count = hasResource
          ? resourceCountMap[filter.resource]
          : filter.counter;
        return {
          ...filter,
          counter: count,
        };
      });
    });
  };

  */
  const handlerModalSearch = () => {
    setIsOpenModal(!isOpenModal);
  };

  const continueWithShipmentRequest = async (targetOrder, formattedAddress) => {
    try {
      // Obtener el codigo del país
      const countryName = getCountryCode(targetOrder.shipCountry);

      // Construir el cuerpo de la solicitud
      const requestBody = {
        servicio: 37,
        horario: 3,
        destinatario:
          targetOrder.recipientName.replace(
            "PO" + targetOrder.purchaseOrderNumber,
            ""
          ) || "",
        direccion: formattedAddress,
        pais: countryName || targetOrder.shipCountry,
        cp: targetOrder.shipPostalCode || "",
        poblacion: targetOrder.shipCity || "",
        telefono:
          targetOrder.shipPhoneNumber
            .replace(" ", "")
            .replace(".0", "")
            .replace("+34", "")
            .replace("+34-", "") ||
          targetOrder.buyerPhoneNumber
            .replace(" ", "")
            .replace(".0", "")
            .replace("+34", "")
            .replace("+34-", "") ||
          663142955,
        email: "orders@toolstock.info",
        departamento: targetOrder.amazonOrderId || "",
        contacto:
          targetOrder.recipientName.replace(
            "PO" + targetOrder.purchaseOrderNumber,
            ""
          ) || "",
        observaciones: targetOrder.deliveryInstructions || "",
        bultos: 1,
        movil:
          targetOrder.shipPhoneNumber
            .replace(" ", "")
            .replace(".0", "")
            .replace("+34", "")
            .replace("+34-", "") ||
          targetOrder.buyerPhoneNumber
            .replace(" ", "")
            .replace(".0", "")
            .replace("+34", "")
            .replace("+34-", "") ||
          663142955,
        refC: targetOrder.purchaseOrderNumber || "",
        num_pedido_ahora: targetOrder.num_order_ahora || null,
        idOrder: targetOrder.amazonOrderId || "",
        process: "isFile",
        value: 1,
        shipmentType: "usingFile",
      };

      console.log("Enviando solicitud para orden:", targetOrder.amazonOrderId);
      console.log("Cuerpo de la solicitud:", requestBody);

      // Realizar la solicitud POST
      const created = await createShipment(targetOrder, formattedAddress);
      if (!created) throw new Error("Could not create shipment");

      // Limpiar el estado después de completar la solicitud
      setAddressToFormat(null);
    } catch (error) {
      console.error("Error al enviar la orden para despacho:", error);

      // Revertir el cambio del switch en caso de error
      if (targetOrder && targetOrder.amazonOrderId) {
        setSwitchStates((prevStates) => ({
          ...prevStates,
          [`ship-${targetOrder.amazonOrderId}`]: 0,
        }));
      }

      // Limpiar el estado de dirección
      setAddressToFormat(null);
    }
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

      // Actualizar los datos después de cambios exitosos
      // fetchAllOrders();
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

  // Contar switches activos que empiezan con "ship-"
  const shipSwitchCount = Object.keys(switchStates).filter(
    (key) =>
      key.startsWith("ship-") &&
      (switchStates[key] === 1 || switchStates[key] === true)
  ).length;

  const isAnySwitchChecked = shipSwitchCount > 0;

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
