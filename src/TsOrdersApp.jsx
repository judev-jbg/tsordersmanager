import { useState, useEffect } from "react";
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

const TsOrdersApp = () => {
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
  const [itemsFilter, setItemsFilter] = useState(ordersFilter);
  const [orders, setOrders] = useState([]);
  const [showUpButton, setShowUpButton] = useState("");
  const [activeResource, setActiveResource] = useState("orderspending");
  const [isLoading, setIsLoading] = useState(true);
  const [addressToFormat, setAddressToFormat] = useState(null);
  const formattedAddress = useAddressFormatter(addressToFormat);
  const getCountryCode = useCodCountry();

  // Función para obtener todas las órdenes de todos los recursos
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
        "/ordersoutofStock/delayed",
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
        setOrders([activeOrders.data]); //TODO: ELIMINAR DATOS ESTATICOS Y DESCOMENTAR ESTA LINEA
        // setOrders([
        //   {
        //     header: {
        //       status: "ok",
        //       content: 1,
        //       resource: "orderbyid",
        //       count: 1,
        //     },
        //     payload: [
        //       {
        //         amazonOrderId: "404-1345458-7375513",
        //         buyerEmail: "wvs9dg67f350xx5@marketplace.amazon.es",
        //         orderStatus: "Pendiente de envío",
        //         latestShipDate: "2025-03-27 22:59:59",
        //         latestDeliveryDate: "2025-04-01 21:59:59",
        //         purchaseDate: "2025-03-26 11:15:54",
        //         buyerName: "PIMASA",
        //         buyerPhoneNumber: "608158140",
        //         recipientName: "Isidro Cabrera Aragón",
        //         shipAddress1: "P.I. Espaldillas, calle 9, nave 8",
        //         shipAddress2: null,
        //         shipAddress3: null,
        //         shipCity: "Alcalá de Guadaira",
        //         shipState: "sevilla",
        //         shipPostalCode: "41500",
        //         shipCountry: "ES",
        //         shipPhoneNumber: "608158140",
        //         billName: "Isidro Cabrera Aragon",
        //         billAddress1: "Calle Monte Carmelo",
        //         billAddress2: "31 bajo",
        //         billAddress3: null,
        //         billCity: "Sevilla",
        //         billState: "Sevilla",
        //         billPostalCode: "41011",
        //         billCountry: "ES",
        //         deliveryInstructions: "Horario de 8h a 14h de L-V",
        //         salesChannel: "Amazon.es",
        //         isBusinessOrder: 1,
        //         purchaseOrderNumber: null,
        //         buyerCompanyName: "PIMASA",
        //         buyerTaxRegistrationId: "ESA41670910",
        //         buyerTaxRegistrationCountry: "ES",
        //         isAmazonInvoiced: 1,
        //         isBuyerRequestedCancellation: 0,
        //         pendingWithoutStock: 0,
        //         markForShipment: null,
        //         selectedForShipment: null,
        //         expeditionTraking: null,
        //         codBar: null,
        //         isShipFake: 0,
        //         qOrders: 2,
        //         qOrderShip: 2,
        //         items: [
        //           {
        //             orderItemId: "47698212192602",
        //             sku: "4932478620",
        //             productName:
        //               "Milwaukee - Tijeras de electricista con almacenamiento",
        //             quantityPurchased: 2,
        //             itemPrice: "46.00",
        //             itemTax: "7.98",
        //             shippingPrice: "0.00",
        //             shippingTax: "0.00",
        //             vatExclusiveItemPrice: "38.02",
        //             vatExclusiveShippingPrice: "0.00",
        //             asin: "B0B12Q2XTQ",
        //             referenciaProv: "5808  4932478620",
        //           },
        //         ],
        //       },
        //     ],
        //   },
        // ]);
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

  // Cargar ordenes
  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    // Solo proceder si hay órdenes disponibles
    if (orders.length > 0 && orders[0]?.payload) {
      const initialSwitchStates = {};
      orders[0].payload.forEach((item) => {
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
      continueWithShipmentRequest(
        addressToFormat.targetOrder,
        formattedAddress
      );
    }
  }, [addressToFormat, formattedAddress]);

  // Función para manejar el clic en un filtro
  const handleFilterClick = async (filterId) => {
    // Actualizar el filtro activo
    const updatedFilters = itemsFilter.map((filter) => ({
      ...filter,
      active: filter.id === filterId,
    }));

    setItemsFilter(updatedFilters);

    // Obtener el recurso del filtro seleccionado
    const selectedFilter = itemsFilter.find((filter) => filter.id === filterId);

    if (selectedFilter) {
      setActiveResource(selectedFilter.resource);
      setIsLoading(true);

      // Hacer una petición inmediata para el recurso seleccionado
      // para mostrar rápidamente estos datos mientras se cargan todos
      try {
        const response = await api.get(`/${selectedFilter.resource}`);
        // console.log(`Solicitud de ordenes a /${selectedFilter.resource}`);
        setOrders([response.data]);
        updateFilterCounters(response);
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
  const updateFilterCounters = (responses) => {
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
        destinatario: targetOrder.recipientName || "",
        direccion: formattedAddress,
        pais: countryName || targetOrder.shipCountry,
        cp: targetOrder.shipPostalCode || "",
        poblacion: targetOrder.shipCity || "",
        telefono:
          targetOrder.shipPhoneNumber || targetOrder.buyerPhoneNumber || "",
        email: "orders@toolstock.info",
        departamento: targetOrder.amazonOrderId || "",
        contacto: targetOrder.recipientName || "",
        observaciones: targetOrder.deliveryInstructions || "",
        bultos: 1,
        movil:
          targetOrder.shipPhoneNumber || targetOrder.buyerPhoneNumber || "",
        refC: targetOrder.purchaseOrderNumber || "",
        idOrder: targetOrder.amazonOrderId || "",
        process: "isFile",
        value: 1,
        shipmentType: "usingFile",
      };

      console.log("Enviando solicitud para orden:", targetOrder.amazonOrderId);
      console.log("Cuerpo de la solicitud:", requestBody);

      // Realizar la solicitud POST
      const response = await api.post("/ordersreadytoship", requestBody);
      console.log("Respuesta de la API:", response.data);

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
    let targetOrder = null;

    // Buscar en todas las órdenes de todos los recursos
    orders.forEach((orderGroup) => {
      if (orderGroup && orderGroup.payload) {
        const foundOrder = orderGroup.payload.find(
          (order) => order.amazonOrderId === orderId
        );

        if (foundOrder) {
          targetOrder = foundOrder;
        }
      }
    });

    // Si no encontramos la orden, mostramos un error
    if (!targetOrder) {
      console.error(`No se encontró la orden con ID: ${orderId}`);
      return;
    }

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
          const response = await api.delete("/ordersreadytoship", {
            data: deleteRequestBody,
          });

          console.log("Respuesta de la API (DELETE):", response.data);
        }
        // Actualiza el estado del switch Ship
        setSwitchStates((prevStates) => ({
          ...prevStates,
          [id]: isChecked ? 1 : 0,
        }));
      }
      // Manejar acción "stock"
      else if (actionSwitch === "stock") {
        const requestBody = {
          withoutstock: isChecked ? 1 : 0,
          idOrder: targetOrder.amazonOrderId,
        };

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
          setItemsFilter((prevFilters) => {
            return prevFilters.map((filter) => {
              let newCounter = filter.counter;

              // El signo determina si sumamos o restamos basado en isChecked
              const sign = isChecked ? -1 : 1;

              if (filter.resource === "orderspending") {
                newCounter += sign;
              }
              if (filter.resource === "ordersoutofstock") {
                newCounter -= sign;
              }

              return {
                ...filter,
                counter: newCounter,
              };
            });
          });
        }
      }
      // Manejar acción "fake"
      else if (actionSwitch === "fake") {
        const requestBody = {
          isFake: isChecked ? 1 : 0,
          idOrder: targetOrder.amazonOrderId,
        };

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
        [id]: isChecked ? 0 : 1, // Invertir el estado
      }));

      // Limpiar el estado de dirección si es necesario
      if (actionSwitch === "ship" && isChecked) {
        setAddressToFormat(null);
      }
    }
  };

  const isAnySwitchChecked = Object.values(switchStates).some(
    (state) => state === 1 || state === true
  );

  window.addEventListener("scroll", () => {
    setShowUpButton(window.pageYOffset > 1500 ? "show" : "");
  });

  const handleUpButtonClick = () => {
    window.scroll(0, 0);
    setShowUpButton("");
  };

  // Renderizado condicional de órdenes según el filtro activo
  const renderOrders = () => {
    if (isLoading) {
      // Renderizar múltiples skeletons según necesidad
      return Array(3)
        .fill(0)
        .map((_, index) => <OrderSkeleton key={index} />);
    }

    if (orders.length === 0 || orders[0].payload.length === 0) {
      return <SearchNoResult />;
    }

    const activeOrder = orders[0];

    if (!activeOrder || !activeOrder.payload) {
      return <SearchNoResult />;
    }

    if (activeOrder.payload.length === 0) {
      return <SearchNoResult />;
    }

    return activeOrder.payload.map((order, index) => (
      <Order
        key={order.amazonOrderId || index}
        order={order}
        onSwitchChange={handleSwitchChange}
      />
    ));
  };

  return (
    <div className="content">
      <Header
        handlerModalSearch={handlerModalSearch}
        showButton={isAnySwitchChecked}
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
