import { useState } from "react";
import "./OrdersToShip.css";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import ordersService from "./services/ordersService";
import OrdersTable from "./components/OrdersTable";
import ToastNotifier from "./components/ToastNotifier";
import ImageWithOutOrders from "./components/ImageWithOutOrders";
import useToast from "./hooks/useToast";
import { exportToExcel } from "./utils/excelUtils";
import { updateOrderCell } from "./utils/orderUtils";
import useInitialLoad from "./hooks/useInitialLoad";

/**
 * Componente OrdersToShip - REFACTORIZADO
 * - Usa hook useToast para eliminar duplicaci贸n
 * - Usa exportToExcel desde utils para eliminar duplicaci贸n
 * - Mejor manejo de errores y estados
 */
const OrdersToShip = () => {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener 贸rdenes listas para enviar al cargar la p谩gina
  const fetchOrdersToShip = async () => {
    try {
      setLoading(true);
      const readyToShipOrders = await ordersService.getReadyToShip();

      if (readyToShipOrders) {
        setOrders(readyToShipOrders);
      } else {
        showToast("No se pudieron cargar las 贸rdenes", "error");
      }
    } catch (error) {
      console.error("Error al obtener 贸rdenes para enviar:", error);
      showToast("Error al cargar 贸rdenes", "error");
    } finally {
      setLoading(false);
    }
  };

  useInitialLoad(fetchOrdersToShip);

  // Funci贸n para actualizar el valor de una celda
  const handleCellUpdate = async (rowId, columnName, columnValue) => {
    try {
      const updated = await ordersService.updateReadyToShipCell(
        rowId,
        columnName,
        columnValue
      );

      if (updated) {
        // Actualizar estado local con el nuevo valor
        setOrders((currentOrders) =>
          updateOrderCell(currentOrders, rowId, columnName, columnValue)
        );
        showToast("Dato actualizado correctamente", "success");
        return true;
      } else {
        showToast("No se pudo actualizar el dato", "error");
        return false;
      }
    } catch (error) {
      console.error("Error al actualizar celda:", error);
      showToast("Error de conexi贸n", "error");
      return false;
    }
  };

  // Funci贸n para procesar el env铆o de 贸rdenes
  const handleShipmentProcess = async () => {
    try {
      setLoading(true);

      // Paso 1: Hacer solicitud PATCH a /registershipment
      const response = await api.patch("/registershipment", {
        shipmentType: "usingFile",
      });

      if (
        response.data &&
        response.data.header &&
        response.data.header.status === "ok" &&
        response.data.header.content === 1
      ) {
        if (
          response.data.payload &&
          Array.isArray(response.data.payload) &&
          response.data.payload.length > 0
        ) {
          const nameFile = response.data.payload[0].fileGenerateName;

          // Paso 2: Hacer solicitud GET a /ordersHistory/{nameFile}
          const historyResponse = await api.get(`/ordershistory/${nameFile}`);

          if (
            historyResponse.data &&
            historyResponse.data.header &&
            historyResponse.data.header.status === "ok" &&
            historyResponse.data.header.content === 1
          ) {
            // Generar y exportar Excel usando la utilidad refactorizada
            const exported = exportToExcel(
              historyResponse.data.payload,
              nameFile
            );

            if (exported) {
              showToast("Proceso completado. Descargando Excel...", "success");

              // Redirigir a la p谩gina principal despu茅s de un breve retraso
              setTimeout(() => {
                navigate("/");
              }, 2000);
            } else {
              showToast("Error al generar archivo Excel", "error");
            }
          } else {
            showToast("Error al obtener historial de 贸rdenes", "error");
          }
        } else {
          showToast("No hay 贸rdenes para procesar", "error");
        }
      } else {
        showToast("Error al registrar env铆o", "error");
      }
    } catch (error) {
      console.error("Error en el proceso de env铆o:", error);
      showToast("Error de conexi贸n", "error");
    } finally {
      setLoading(false);
    }
  };

  // Funci贸n para volver a la p谩gina principal
  const handleBackMainPage = () => {
    navigate("/");
  };

  return (
    <div className="orders-to-ship-container">
      <div className="content-wrapper">
        <h1>
          Pedidos listos para Enviar{" "}
          {orders.length > 0 && <span className="badge">{orders.length}</span>}
        </h1>

        <div className="actions-top">
          <button
            className="back-button"
            onClick={handleBackMainPage}
            disabled={loading}
          >
            Volver
          </button>
          <button
            className="process-button"
            onClick={handleShipmentProcess}
            disabled={loading || orders.length === 0}
          >
            Procesar Envíos
          </button>
        </div>

        {loading ? (
          <div className="loading">Cargando órdenes...</div>
        ) : orders.length === 0 ? (
          <ImageWithOutOrders />
        ) : (
          <OrdersTable data={orders} onCellUpdate={handleCellUpdate} />
        )}

        <button
          className="fab-button"
          onClick={handleShipmentProcess}
          disabled={loading || orders.length === 0}
        >
          <span>➤</span>
        </button>
      </div>

      {toast.visible && (
        <ToastNotifier message={toast.message} type={toast.type} />
      )}
    </div>
  );
};

export default OrdersToShip;
