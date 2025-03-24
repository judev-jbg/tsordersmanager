import Filter from "./Filter";

const itemsFilter = [
  {
    id: 1,
    label: "Pendientes de envío",
    route: "/pendientes",
    newBlock: false,
  },
  { id: 2, label: "hoy", route: "/pendientesHoy", newBlock: false },
  { id: 3, label: "Vencidos", route: "/pendientesVencidos", newBlock: false },
  {
    id: 4,
    label: "Pendientes de envío - Sin stock",
    route: "/pendientesSin Stock",
    newBlock: true,
  },
  { id: 5, label: "hoy", route: "/pendientesSinStockHoy", newBlock: false },
  {
    id: 6,
    label: "Vencidos",
    route: "/pendientesSinStockVencidos",
    newBlock: false,
  },
  { id: 7, label: "Envios fake", route: "/enviosFalsos", newBlock: true },
];

const Filters = () => {
  return (
    <div className="filters">
      <div className="filters-container">
        {itemsFilter.map((item) => (
          <Filter
            key={item.id}
            label={item.label}
            counter={0}
            newBlock={item.newBlock}
          />
        ))}
      </div>
    </div>
  );
};

export default Filters;
