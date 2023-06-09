import React from "react";

const CheckStatsionarClient = ({ connector, qr, clinica, baseUrl }) => {
  return (
    <div className="container p-3">
      <div className="">
        {clinica?.ifud1 && <div className="row" style={{ fontSize: "10pt" }}>
          <div
            className="col-4"
            style={{ border: "1px solid", textAlign: "center" }}
          >
            <p className="pt-2">
              {clinica?.ifud1}
            </p>
          </div>
          <div
            className="col-4"
            style={{
              border: "1px solid",
              textAlign: "center",
              borderLeft: "none",
            }}
          >
            <p className="pt-2">IFUD: {clinica?.ifud2}</p>
          </div>
          <div
            className="col-4"
            style={{
              border: "1px solid",
              textAlign: "center",
              borderLeft: "none",
            }}
          >
            <p style={{ margin: "0" }}>
              {clinica?.ifud3}
            </p>
          </div>
        </div>}
        <div className="flex justify-between items-center" style={{ fontSize: "20pt", marginBottom: "10px" }}>
          <div className="" style={{ textAlign: "center" }}>
            <pre className="" style={{ fontFamily: "-moz-initial", border: 'none', outline: "none" }}>
              {clinica?.name}
            </pre>
          </div>
          <div style={{ textAlign: "center" }}>
            <img style={{ width: "150px" }} src={baseUrl + '/api/upload/file/' + clinica?.image} alt="logo" />
          </div>
          <div className="" style={{ textAlign: "center" }}>
            <pre className="" style={{ fontFamily: "-moz-initial", border: 'none', outline: "none" }}>
              {clinica?.name2}
            </pre>
          </div>
          <div className="" style={{ textAlign: "center" }}>
            <p className="text-end m-0">
              <img width="100" src={qr} alt="QR" />
            </p>
          </div>
        </div>
        <table
          style={{
            width: "100%",
            border: "2px solid",
            borderTop: "3px solid",
          }}
        >
          <tr style={{ textAlign: "center" }}>
            <td
              className="p-0"
              style={{
                width: "25%",
                backgroundColor: "white",
                border: "1px solid #000",
              }}
            >
              Mijozning F.I.SH
            </td>
            <td
              className="p-0"
              style={{
                fontSize: "20px",
                width: "25%",
                backgroundColor: "white",
                border: "1px solid #000",
              }}
            >
              <h4>
                {connector?.client && connector.client.lastname + " " + connector.client.firstname}
              </h4>
            </td>
            <td colSpan={2} style={{ width: "25%" }}>
              <p className="fw-bold fs-5 m-0">
                {connector?.client?.department}
              </p>
            </td>
          </tr>
          <tr style={{ textAlign: "center" }}>
            <td
              className="p-0"
              style={{
                width: "25%",
                backgroundColor: "white",
                border: "1px solid #000",
              }}
            >
              Tug'ilgan yili
            </td>
            <td
              className="p-0"
              style={{
                width: "25%",
                backgroundColor: "white",
                border: "1px solid #000",
                fontSize: "20px",
              }}
            >
              {connector?.client && new Date(connector.client.born).toLocaleDateString()}
            </td>
            <td
              className="p-0"
              style={{
                width: "25%",
                backgroundColor: "white",
                border: "1px solid #000",
              }}
            >
              Jinsi
            </td>
            <td
              className="p-0"
              style={{
                width: "25%",
                backgroundColor: "white",
                border: "1px solid #000",
                fontSize: "20px",
              }}
            >
              {connector?.client?.gender === 'man' && 'Erkak'}
              {connector?.client?.gender === 'women' && 'Ayol'}
            </td>
          </tr>
          <tr style={{ textAlign: "center" }}>
            <td
              className="p-0"
              style={{
                width: "25%",
                backgroundColor: "white",
                border: "1px solid #000",
              }}
            >
              Kelgan sanasi
            </td>
            <td
              className="p-0"
              style={{
                width: "25%",
                backgroundColor: "white",
                border: "1px solid #000",
                fontSize: "20px",
              }}
            >
              {connector &&
                new Date(connector?.room?.beginday).toLocaleDateString()}
            </td>
            <td
              className="p-0 fw-bold"
              style={{
                width: "100px",
                backgroundColor: "white",
                border: "1px solid #000",
              }}
            >
              Ketgan vaqti
            </td>
            <td
              className="p-0"
              style={{
                width: "100px",
                backgroundColor: "white",
                border: "1px solid #000",
                fontSize: "20px",
              }}
            >
              {connector?.room?.endday && new Date(connector?.room?.endday).toLocaleDateString()}
            </td>
          </tr>

          <tr style={{ textAlign: "center" }}>
            <td
              className="p-0"
              style={{
                width: "25%",
                backgroundColor: "white",
                border: "1px solid #000",
              }}
            >
              Manzil
            </td>
            <td
              className="p-0"
              style={{
                width: "25%",
                backgroundColor: "white",
                border: "1px solid #000",
                fontSize: "20px",
              }}
            >
              {connector?.client?.address}
            </td>
            <td
              className="p-0 fw-bold"
              style={{
                backgroundColor: "white",
                border: "1px solid #000",
              }}
            >
              ID
            </td>
            <td
              className="p-0"
              style={{
                backgroundColor: "white",
                border: "1px solid #000",
                fontSize: "20px",
              }}
            >
              {connector?.client?.id}
            </td>
          </tr>
        </table>
        <div className="mt-2 px-2 py-1 bg-gray-400 flex justify-between items-center">
          <span className="text-[14px] font-bold">{clinica?.organitionName}</span>
          <span className="text-[14px] font-bold">{clinica?.license}</span>
        </div>
      </div>
      <div className="row pt-4" id="statsionar">
        <div className="col-lg-12">
          <div
            className="table-responsive"
            style={{ overflow: "hidden", outline: "none" }}
            tabIndex="0"
          >
            <table
              className="table table-bordered"
              style={{ fontSize: "10pt", fontFamily: "times" }}
            >
              <thead>
                <tr className="bg-white text-dark">
                  <td className="text-center font-weight-bold border py-1">
                    №
                  </td>
                  <td className="text-center font-weight-bold border py-1">
                    Xizmat turi
                  </td>
                  <td className="text-center font-weight-bold border py-1">
                    Miqdori (dona)
                  </td>
                  <td className="text-center font-weight-bold border py-1">
                    Narxi (1 dona)
                  </td>
                  <td className="text-center font-weight-bold border py-1">
                    Narxi (umumiy)
                  </td>
                  <td className="text-center font-weight-bold border py-1">
                    Vaqti
                  </td>
                </tr>
              </thead>
              <tbody>
                {connector.services &&
                  connector.services.map((service, index) => {
                    return (
                      <tr key={index}>
                        <td className="border py-1 text-bold font-weight-bold">
                          {index + 1}
                        </td>
                        <td className="text-left px-2 border py-1 font-weight-bold">
                          {service.service.name}
                        </td>
                        <td className="text-right border py-1">
                          {service.pieces}
                        </td>
                        <td className="text-right border py-1">
                          {service.service.price}
                        </td>
                        <td className="text-right border py-1">
                          {service.pieces * service.service.price}
                        </td>
                        <td className="text-right border py-1">
                          {new Date(service.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                {connector.products &&
                  connector.products.map((product, index) => {
                    return (
                      <tr key={index}>
                        <td className="border py-1 text-bold font-weight-bold">
                          {index + 1}
                        </td>
                        <td className="text-left px-2 border py-1 font-weight-bold">
                          {product.product.name}
                        </td>
                        <td className="text-right border py-1">
                          {product.pieces}
                        </td>
                        <td className="text-right border py-1">
                          {product.product.price}
                        </td>
                        <td className="text-right border py-1">
                          {product.pieces * product.product.price}
                        </td>
                        <td className="text-right border py-1">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                <tr>
                  <td className="border py-1 text-bold">Xona</td>
                  <td className="text-left border px-2 py-1 text-bold font-weight-bold">
                    {connector.room && connector.room.room.type}
                  </td>
                  <td className="text-right border py-1 text-bold">
                    {connector.room &&
                      Math.round(
                        Math.abs(
                          (new Date(connector.room.beginday).getTime()
                            -
                            new Date().getTime())
                          /
                          (24 * 60 * 60 * 1000)
                        )
                      )}
                  </td>
                  <td className="text-right border py-1 text-bold">
                    {connector.room && connector.room.room.price}
                  </td>
                  <td className="text-right border py-1">{connector.room &&
                    Math.round(
                      Math.abs(
                        (new Date(connector.room.beginday).getTime()
                          -
                          new Date().getTime())
                        /
                        (24 * 60 * 60 * 1000)
                      )
                    ) * connector.room.room.price
                  }</td>
                  <td className="text-right border py-1 text-bold">
                    {connector.room &&
                      new Date(connector.room.beginday).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="text-right px-3 font-weight-bold" colSpan="4">
                    Jami to'lov:
                  </td>
                  <td className=" text-right">To'lov</td>
                </tr>
                <tr>
                  <td className="text-right px-3 font-weight-bold" colSpan="4">
                    Oldindan to'lov:
                  </td>
                  <td className=" text-right">Oldindan to'lov</td>
                </tr>
                <tr>
                  <td className="text-right px-3 font-weight-bold" colSpan="4">
                    To'langan:
                  </td>
                  <td className=" text-right">To'lov</td>
                </tr>
                <tr>
                  <td className="text-right px-3 font-weight-bold" colSpan="4">
                    Qarz:
                  </td>
                  <td className=" text-right">To'lov</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <h6
            className="mt-3"
            style={{ fontSize: "10pt", fontFamily: "times" }}
          >
            Qabul:{" "}
          </h6>
          <hr />
          <h6
            className="mt-3"
            style={{
              fontSize: "10pt",
              fontFamily: "times",
            }}
          >
            Mijoz: {connector.client && connector.client.fullname}
          </h6>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default CheckStatsionarClient;
