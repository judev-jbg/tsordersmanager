// import reactLogo from './assets/react.svg'

import Header from "./components/Header";
import Filters from "./components/Filters";
import Order from "./components/Order";
import SearchBarModal from "./components/SearchBarModal";
import { useState, useEffect } from "react";

import "./TsOrdersApp.css";

const TsOrdersApp = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [switchStates, setSwitchStates] = useState({});

  const mockData = [
    { id: 1, mark: 0 },
    { id: 2, mark: 0 },
    { id: 3, mark: 0 },
  ];

  useEffect(() => {
    const initialSwitchStates = {};
    mockData.forEach((item) => {
      initialSwitchStates[item.id] = item.mark; // Establece el estado inicial
    });
    setSwitchStates(initialSwitchStates);
  }, []);

  const handlerModalSearch = () => {
    setIsOpenModal(!isOpenModal);
  };

  const handleSwitchChange = (id, isChecked, actionSwitch) => {
    const actionMessage = isChecked ? "seleccionado" : "DESeleccionado";

    if (actionSwitch === "ship") {
      console.log(`Pedido ${id} ${actionMessage} para enviar: ${actionSwitch}`);

      // Actualiza el estado del switch solo si actionSwitch es "ship"
      setSwitchStates((prevStates) => ({
        ...prevStates,
        [id]: isChecked,
      }));
    } else {
      console.log(`Pedido ${id} ${actionMessage} sin stock: ${actionSwitch}`);
      // No actualiza el estado del switch si actionSwitch no es "ship"
    }
  };

  const isAnySwitchChecked = Object.values(switchStates).some(
    (state) => state === 1 || state === true
  );

  return (
    <div className="content">
      <Header
        handlerModalSearch={handlerModalSearch}
        showButton={isAnySwitchChecked}
      />
      <Filters />
      <main className="main">
        {mockData.map((order) => (
          <Order
            key={order.id}
            order={order}
            onSwitchChange={handleSwitchChange}
          />
        ))}
      </main>
      {isOpenModal && (
        <SearchBarModal
          open={isOpenModal}
          close={() => {
            handlerModalSearch();
            document.getElementsByTagName("html")[0].removeAttribute("style");
          }}
        />
      )}
    </div>
  );
};

export default TsOrdersApp;
