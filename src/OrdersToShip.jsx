import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import OrdersTable from "./components/OrdersTable";
import ToastNotifier from "./components/ToastNotifier";
import "./OrdersToShip.css";
import * as XLSX from "xlsx";

const OrdersToShip = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  // Obtener órdenes listas para enviar al cargar la página
  useEffect(() => {
    const fetchOrdersToShip = async () => {
      try {
        setLoading(true);
        const response = await api.get("/ordersreadytoship");
        if (
          response.data &&
          response.data.header &&
          response.data.header.status === "ok"
        ) {
          setOrders(response.data.payload || []);
        } else {
          showToast("No se pudieron cargar las órdenes", "error");
        }
      } catch (error) {
        console.error("Error al obtener órdenes para enviar:", error);
        showToast("Error al cargar órdenes", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersToShip();
  }, []);

  // Mostrar notificación toast
  const showToast = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "" });
    }, 3000);
  };

  // Función para actualizar el valor de una celda
  const handleCellUpdate = async (rowId, columnName, columnValue) => {
    try {
      const requestBody = {
        columnName,
        columnValue,
        idOrder: rowId,
      };

      const response = await api.patch("/ordersreadytoship", requestBody);

      if (
        response.data &&
        response.data.header &&
        response.data.header.status === "ok" &&
        response.data.header.updatedRows > 0 &&
        response.data.message === "Registro actualizado"
      ) {
        // Actualizar estado local con el nuevo valor
        setOrders(
          orders.map((order) => {
            if (order.idOrder === rowId) {
              return { ...order, [columnName.toLowerCase()]: columnValue };
            }
            return order;
          })
        );
        showToast("Dato actualizado correctamente", "success");
        return true;
      } else {
        showToast("No se pudo actualizar el dato", "error");
        return false;
      }
    } catch (error) {
      console.error("Error al actualizar celda:", error);
      showToast("Error de conexión", "error");
      return false;
    }
  };

  // Función para procesar el envío de órdenes
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
        const nameFile = response.data.nameFile;

        // Paso 2: Hacer solicitud GET a /ordersHistory/{nameFile}
        const historyResponse = await api.get(`/ordersHistory/${nameFile}`);

        if (
          historyResponse.data &&
          historyResponse.data.header &&
          historyResponse.data.header.status === "ok" &&
          historyResponse.data.header.content === 1
        ) {
          // Generar y exportar Excel
          exportToExcel(historyResponse.data.payload, nameFile);
          showToast("Proceso completado. Descargando Excel...", "success");

          // Redirigir a la página principal después de un breve retraso
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          showToast("Error al obtener historial de órdenes", "error");
        }
      } else {
        showToast("Error al registrar envío", "error");
      }
    } catch (error) {
      console.error("Error en el proceso de envío:", error);
      showToast("Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

  // Función para exportar a Excel
  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Órdenes");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div className="orders-to-ship-container">
      <div className="content-wrapper">
        <h1>Órdenes Listas para Enviar</h1>

        <div className="actions-top">
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
          <div className="no-orders">No hay órdenes listas para enviar</div>
        ) : (
          <OrdersTable data={orders} onCellUpdate={handleCellUpdate} />
        )}

        <button
          className="fab-button"
          onClick={handleShipmentProcess}
          disabled={loading || orders.length === 0}
        >
          <span>✓</span>
        </button>
      </div>

      {toast.visible && (
        <ToastNotifier message={toast.message} type={toast.type} />
      )}
    </div>
  );
};

export default OrdersToShip;
