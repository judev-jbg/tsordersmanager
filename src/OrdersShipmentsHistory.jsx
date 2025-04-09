import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./OrdersShipmentsHistory.css";
import api from "./services/api";
import ToastNotifier from "./components/ToastNotifier";
import ShipmentsTable from "./components/ShipmentsTable";
import ImageWithOutOrders from "./components/ImageWithOutOrders";
import * as XLSX from "xlsx";

const OrdersShipmentsHistory = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  // Obtener órdenes listas para enviar al cargar la página
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        const response = await api.get("/ordersHistory");
        if (
          response.data &&
          response.data.header &&
          response.data.header.status === "ok"
        ) {
          setShipments(response.data.payload || []);
        } else {
          showToast("No se pudo cargar la lista de Envíos", "error");
        }
      } catch (error) {
        console.error("Error al obtener la lista de envíos:", error);
        showToast("Error al cargar la lista de envíos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // Mostrar notificación toast
  const showToast = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "" });
    }, 3000);
  };

  // Función para procesar el envío de órdenes
  const handleShipmentProcess = async (nameFile) => {
    try {
      setLoading(true);

      // Hacer solicitud GET a /ordersHistory/{nameFile}
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
    } catch (error) {
      console.error("Error en el proceso de envío:", error);
      showToast("Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

  // Función para exportar a Excel
  const exportToExcel = (data, fileName) => {
    const rawOrdersData =
      Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data;

    if (!Array.isArray(rawOrdersData) || rawOrdersData.length === 0) {
      console.error("No hay datos para exportar a Excel", data);
      return;
    }
    // Lista de campos a excluir del Excel
    const excludedFields = [
      "idOrder",
      "exported",
      "engraved",
      "process",
      "fileGenerateName",
      "updateDateTime",
    ];
    // Filtrar los campos excluidos de cada objeto
    const filteredOrdersData = rawOrdersData.map((order) => {
      const filteredOrder = {};
      Object.keys(order).forEach((key) => {
        if (!excludedFields.includes(key)) {
          filteredOrder[key] = order[key];
        }
      });
      return filteredOrder;
    });
    const worksheet = XLSX.utils.json_to_sheet(filteredOrdersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");
    const cleanFileName = fileName.replace(/\.xlsx$/i, "");
    XLSX.writeFile(workbook, `${cleanFileName}.xlsx`);
    console.log(
      `Excel exportado: ${cleanFileName}.xlsx con ${filteredOrdersData.length} registros`
    );
  };

  const hanleBackMainPage = () => {
    navigate("/");
  };

  return (
    <div className="orders-to-ship-container">
      <div className="content-wrapper">
        <h1>Historial de ficheros de envios</h1>

        <div className="actions-top">
          <button
            className="back-button"
            onClick={hanleBackMainPage}
            disabled={loading}
          >
            Volver
          </button>
        </div>

        {loading ? (
          <div className="loading">Cargando lista de ficheros...</div>
        ) : shipments.length === 0 ? (
          <ImageWithOutOrders />
        ) : (
          <ShipmentsTable
            data={shipments}
            onExportClick={handleShipmentProcess}
          />
        )}
      </div>

      {toast.visible && (
        <ToastNotifier message={toast.message} type={toast.type} />
      )}
    </div>
  );
};

export default OrdersShipmentsHistory;
