import { useCallback, useEffect, useState } from "react";
import "./TsOrdersApp.css";
import Header from "./components/Header";
import Filters from "./components/Filters";
import Order from "./components/Order";
import SearchBarModal from "./components/SearchBarModal";
import OrderSkeleton from "./components/OrderSkeleton";
import SearchNoResult from "./components/SearchNoResult";
import { ORDER_FILTERS } from "./config/orderFilters";
import { SESSION_CONFIG } from "./config/sessionConfig";
import useAddressFormatter from "./hooks/useAddressFormatter";
import useCodCountry from "./hooks/useCodCountry";
import useOrderResources from "./hooks/useOrderResources";
import useOrderSwitches from "./hooks/useOrderSwitches";
import useScrollVisibility from "./hooks/useScrollVisibility";
import useSessionTimeout from "./hooks/useSessionTimeout";
import useShipmentActions from "./hooks/useShipmentActions";
import useShipmentFlow from "./hooks/useShipmentFlow";

const TsOrdersApp = () => {
  useSessionTimeout(SESSION_CONFIG.TIMEOUT);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { filters: itemsFilter, orders, loading: isLoading, selectFilter: handleFilterClick, setFilters: setItemsFilter, setOrders } = useOrderResources(ORDER_FILTERS);
  const getCountryCode = useCodCountry();
  const { createShipment, removeShipment } = useShipmentActions(getCountryCode);
  const { switchStates, setSwitchStates, shipSwitchCount, isAnySwitchChecked, addressToFormat, clearAddressToFormat, handleSwitchChange } = useOrderSwitches({ orders, setFilters: setItemsFilter, removeShipment });
  const formattedAddress = useAddressFormatter(addressToFormat);
  const updateShipmentSwitch = useCallback((id, value) => setSwitchStates((states) => ({ ...states, [id]: value })), [setSwitchStates]);
  const { submit: submitShipment } = useShipmentFlow(createShipment, updateShipmentSwitch);
  const showUpButton = useScrollVisibility(1500) ? "show" : "";

  useEffect(() => {
    if (addressToFormat && formattedAddress) submitShipment(addressToFormat.targetOrder, formattedAddress).finally(clearAddressToFormat);
  }, [addressToFormat, clearAddressToFormat, formattedAddress, submitShipment]);

  const renderOrders = () => {
    if (isLoading) return Array.from({ length: 3 }, (_, index) => <OrderSkeleton key={index} />);
    if (!orders.length) return <SearchNoResult />;
    return orders.map((order, index) => <Order key={order.amazonOrderId || index} order={order} onSwitchChange={handleSwitchChange} switchStates={switchStates} />);
  };

  return <div className="content">
    <Header handlerModalSearch={() => setIsOpenModal((open) => !open)} showButton={isAnySwitchChecked} shipCount={shipSwitchCount} ready={isLoading} />
    <Filters filters={itemsFilter} onFilterClick={handleFilterClick} />
    <main className="main">{renderOrders()}</main>
    <button className={`fab-button up-button ${showUpButton}`} onClick={() => window.scroll(0, 0)}><span>↑</span></button>
    {isOpenModal && <SearchBarModal open close={() => { setIsOpenModal(false); document.getElementsByTagName("html")[0].removeAttribute("style"); }} setOrders={setOrders} setItemsFilter={setItemsFilter} />}
  </div>;
};

export default TsOrdersApp;
