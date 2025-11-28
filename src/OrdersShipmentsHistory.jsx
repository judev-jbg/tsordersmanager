import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import ToastNotifier from "./components/ToastNotifier";
import ShipmentsTable from "./components/ShipmentsTable";
import ImageWithOutOrders from "./components/ImageWithOutOrders";
import useToast from "./hooks/useToast";
import { exportToExcel } from "./utils/excelUtils";

/**
 * Componente OrdersShipmentsHistory - REFACTORIZADO
 * - Usa hook useToast para eliminar duplicaci贸n
 * - Usa exportToExcel desde utils para eliminar duplicaci贸n
 */
const OrdersShipmentsHistory = () => {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener lista de env铆os al cargar la p谩gina
  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/ordershistory");

      if (
        response.data &&
        response.data.header &&
        response.data.header.status === "ok"
      ) {
        setShipments(response.data.payload || []);
      } else {
        showToast("No se pudo cargar la lista de Env铆os", "error");
      }
    } catch (error) {
      console.error("Error al obtener la lista de env铆os:", error);
      showToast("Error al cargar la lista de env铆os", "error");
    } finally {
      setLoading(false);
    }
  };

  // Funci贸n para procesar la descarga de un archivo de env铆o
  const handleShipmentProcess = async (nameFile) => {
    try {
      setLoading(true);

      // Hacer solicitud GET a /ordersHistory/{nameFile}
      const historyResponse = await api.get(`/ordershistory/${nameFile}`);

      if (
        historyResponse.data &&
        historyResponse.data.header &&
        historyResponse.data.header.status === "ok" &&
        historyResponse.data.header.content === 1
      ) {
        // Generar y exportar Excel usando la utilidad refactorizada
        const exported = exportToExcel(historyResponse.data.payload, nameFile);

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
    } catch (error) {
      console.error("Error en el proceso de env铆o:", error);
      showToast("Error de conexi贸n", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBackMainPage = () => {
    navigate("/");
  };

  return (
    <div className="orders-to-ship-container">
      <div className="content-wrapper">
        <h1>Historial de ficheros de env铆os</h1>

        <div className="actions-top">
          <button
            className="back-button"
            onClick={handleBackMainPage}
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
