const OrderProducts = () => {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-left ps-2 border-l">Imagen</th>
          <th className="text-left">Titulo / SKU</th>
          <th>Cantidad</th>
          <th>PxU (sIVA)</th>
          <th>PxU (cIVA)</th>
          <th>Importe (cIVA)</th>
          <th>Importe (sIVA)</th>
          <th className="border-r">IVA</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border-l">
            <img
              alt=""
              loading="lazy"
              width="50"
              height="50"
              decoding="async"
              data-nimg="1"
              src="../img/be.svg"
              style={{ color: "transparent" }}
            />
          </td>
          <td>
            <div className="flex">
              <div className="text-end me-1">
                <div className="font__bold">Titulo: </div>
                <div className="font__bold">SKU: </div>
              </div>
              <div className="text-start">
                <div>Adaptador angular OSD </div>
                <div>493345125</div>
              </div>
            </div>
          </td>
          <td className="text-center">1</td>
          <td className="text-center">53.58</td>
          <td className="text-center">64</td>
          <td className="text-center">
            <div className="flex justify-center items-center">
              <div className="text-end me-1">
                <div className="font__bold">Sub total: </div>
                <div className="font__bold">Envio: </div>
                <div className="font__bold">Total: </div>
              </div>
              <div className="text-start">
                <div>64 </div>
                <div>4</div>
                <div>68</div>
              </div>
            </div>
          </td>
          <td className="text-center">
            <div>52.14</div>
            <div>3.33</div>
            <div>55.47</div>
          </td>
          <td className="text-center border-r">
            <div>68.47</div>
            <div>25.1</div>
            <div>94.48</div>
          </td>
        </tr>
        <tr>
          <td className="border-l">
            <img
              alt=""
              loading="lazy"
              width="50"
              height="50"
              decoding="async"
              data-nimg="1"
              src="../img/be.svg"
              style={{ color: "transparent" }}
            />
          </td>
          <td>
            <div className="flex">
              <div className="text-end me-1">
                <div className="font__bold">Titulo: </div>
                <div className="font__bold">SKU: </div>
              </div>
              <div className="text-start">
                <div>Adaptador angular OSD </div>
                <div>493345125</div>
              </div>
            </div>
          </td>
          <td className="text-center">1</td>
          <td className="text-center">53.58</td>
          <td className="text-center">64</td>
          <td className="text-center">
            <div className="flex justify-center items-center">
              <div className="text-end me-1">
                <div className="font__bold">Sub total: </div>
                <div className="font__bold">Envio: </div>
                <div className="font__bold">Total: </div>
              </div>
              <div className="text-start">
                <div>64 </div>
                <div>4</div>
                <div>68</div>
              </div>
            </div>
          </td>
          <td className="text-center">
            <div>52.14</div>
            <div>3.33</div>
          </td>
          <td className="text-center border-r">
            <div>68.47</div>
            <div>25.1</div>
          </td>
        </tr>
        <tr>
          <td
            colSpan="8"
            className="text-right font-bold text-[1.1rem] pb-2 pe-10 color-acent border-l border-r"
          >
            TOTAL DEL PEDIDO: 256
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default OrderProducts;
