import { faAngleDown, faAngleUp, faMoneyBill, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { Pagination } from "../../../cashier/components/Pagination";
import { DatePickers } from "../../../cashier/offlineclients/clientComponents/DatePickers";
import { Sort } from "../../../cashier/offlineclients/clientComponents/Sort";

export const MainReportTable = ({
    changeClient,
    baseUrl,
    setVisible,
    setCheck,
    setModal1,
    modal,
    changeStart,
    changeEnd,
    searchPhone,
    setClient,
    searchId,
    searchFullname,
    searchProbirka,
    connectors,
    setConnector,
    setCurrentPage,
    countPage,
    currentConnectors,
    setCurrentConnectors,
    currentPage,
    setPageSize,
    loading,
    setServices,
    setProducts,
    searchStorage,
    expenseTotal,
    beginDay,
    endDay
}) => {

    // const setPosition = (connector) => {
    //     const payments = connector.payments.reduce((prev, el) => prev + el.payment, 0)
    //     if (debt) {
    //         return "bg-red-400"
    //     }
    //     if (total > 0 && payments > 0 && (total - (connector?.discount?.discount || 0)) === payments) {
    //         return 'bg-green-400'
    //     }
    //     return "bg-orange-400"
    // }

    return (
        <div className="border-0 table-container">
            <div className="border-0 table-container">
                <div className="table-responsive">
                    <div className="bg-white flex gap-6 items-center py-2 px-2">
                        <div>
                            <select
                                className="form-control form-control-sm selectpicker"
                                placeholder="Bo'limni tanlang"
                                onChange={setPageSize}
                                style={{ minWidth: "50px" }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={'all'}>Barchasi</option>
                            </select>
                        </div>
                        <div>
                            <input
                                onChange={searchFullname}
                                style={{ maxWidth: "100px", minWidth: "100px" }}
                                type="search"
                                className="w-100 form-control form-control-sm selectpicker"
                                placeholder="F.I.O"
                            />
                        </div>
                        <div>
                            <input
                                onChange={searchPhone}
                                style={{ maxWidth: "100px", minWidth: "100px" }}
                                type="search"
                                className="w-100 form-control form-control-sm selectpicker"
                                placeholder="Tel"
                            />
                        </div>
                        <div>
                            <input
                                onChange={searchId}
                                style={{ maxWidth: "60px" }}
                                type="search"
                                className="form-control form-control-sm selectpicker"
                                placeholder="ID"
                            />
                        </div>
                        <div>
                            <input
                                onChange={searchProbirka}
                                style={{ maxWidth: "50px" }}
                                type="search"
                                className="form-control form-control-sm selectpicker"
                                placeholder="Probirka"
                            />
                        </div>
                        <div className="text-center">
                            <Pagination
                                setCurrentDatas={setCurrentConnectors}
                                datas={connectors}
                                setCurrentPage={setCurrentPage}
                                countPage={countPage}
                                totalDatas={connectors.length}
                            />
                        </div>
                        <div
                            className="text-center"
                            style={{ maxWidth: "120px", overflow: "hidden" }}
                        >
                            <DatePickers changeDate={changeStart} />
                        </div>
                        <div
                            className="text-center"
                            style={{ maxWidth: "120px", overflow: "hidden" }}
                        >
                            <DatePickers changeDate={changeEnd} />
                        </div>
                        <div className="texte-center">
                            <div className="btn btn-primary">
                                <ReactHtmlTableToExcel
                                    id="reacthtmltoexcel"
                                    table="mainreport-table"
                                    sheet="Sheet"
                                    buttonText="Excel"
                                    filename="Kunduzgi"
                                />
                            </div>
                        </div>
                    </div>
                    <table className="overflow-scroll table m-0 table-sm" style={{display: 'block', maxHeight: "600px"}} id="mainreport-table">
                        <thead style={{position: 'sticky', top: "0"}}>
                            <tr>
                                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    F.I.O
                                    <div className="btn-group-vertical ml-2">
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        a.client.fullname > b.client.fullname ? 1 : -1
                                                    )
                                                )
                                            }
                                            icon={faAngleUp}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <FontAwesomeIcon
                                            icon={faAngleDown}
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        b.client.fullname > a.client.fullname ? 1 : -1
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">Tel</th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    ID
                                    <div className="btn-group-vertical ml-2">
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        a.client.id > b.client.id ? 1 : -1
                                                    )
                                                )
                                            }
                                            icon={faAngleUp}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <FontAwesomeIcon
                                            icon={faAngleDown}
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        b.client.id > a.client.id ? 1 : -1
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Probirka
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"probirka"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    To'lov summasi
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"totalprice"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    To'langan
                                    <div className="btn-group-vertical ml-2">
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        a.services.length > b.services.length ? 1 : -1
                                                    )
                                                )
                                            }
                                            icon={faAngleUp}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <FontAwesomeIcon
                                            icon={faAngleDown}
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        b.services.length > a.services.length ? 1 : -1
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Naqt
                                    <div className="btn-group-vertical ml-2">
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        a.services.length > b.services.length ? 1 : -1
                                                    )
                                                )
                                            }
                                            icon={faAngleUp}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <FontAwesomeIcon
                                            icon={faAngleDown}
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        b.services.length > a.services.length ? 1 : -1
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Plastik
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    O'tkazma
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Chegirma
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Qarz
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Qarzdan to'lov
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Qaytarilgan summa
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Chek
                                    <div className="btn-group-vertical ml-2">
                                        <Sort
                                            data={currentConnectors}
                                            setData={setCurrentConnectors}
                                            property={"counterAgentProcient"}
                                        />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentConnectors.map((connector, key) => {
                                return (
                                    <tr key={key}>
                                        <td
                                            className={` border py-1 font-weight-bold text-right text-[16px]`}
                                            style={{ maxWidth: "30px !important" }}
                                        >
                                            {currentPage * countPage + key + 1}
                                        </td>
                                        <td className="border py-1 text-[16px] font-weight-bold">
                                            {connector?.client?.lastname +
                                                " " +
                                                connector?.client?.firstname}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            +998{connector?.client?.phone}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector?.client?.id}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector?.connector?.probirka}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector.payment < 0 || connector.isPayDebt ? 0 : connector?.total}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector.payment < 0 ? 0 : connector?.payment}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector?.cash}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector?.card}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector?.transfer}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {(connector?.discount?.discount || 0)}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector?.debt}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector?.isPayDebt && connector?.payment}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {connector?.payment < 0 && connector?.payment}
                                        </td>
                                        <td className="border py-1 text-[16px] text-center">
                                            {loading ? (
                                                <button className="btn btn-success" disabled>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Loading...
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary py-0"
                                                    onClick={() => {
                                                        setCheck(connector.connector);
                                                        setModal1(true);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPrint} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr>
                                <td
                                    colSpan={3}
                                    className={`py-1 font-weight-bold text-[16px]`}
                                >
                                    <div className="flex justify-between">
                                        <div>Qoldiq: {searchStorage.reduce((prev, connector) => prev + (connector.payment < 0 ? 0 : connector?.payment), 0) - expenseTotal}</div>
                                        <div>
                                            Xarajat: {expenseTotal}
                                        </div>
                                    </div>
                                </td>
                                <td className="border py-1 text-[16px] text-right font-bold">
                                </td>
                                <td className="border py-1 text-[16px] text-right font-bold">
                                </td>
                                <td className="border py-1 text-[16px] text-right font-bold">
                                    {searchStorage.reduce((prev, el) => prev + (el.payment < 0 || el.isPayDebt ? 0 : el?.total), 0)}
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right">
                                    {searchStorage.reduce((prev, el) => prev + (el.payment < 0 ? 0 : el?.payment), 0)}
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right"> 
                                    {searchStorage.reduce((prev, el) => prev + el.cash, 0)}
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right">
                                    {searchStorage.reduce((prev, el) => prev + el.card, 0)}
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right">
                                    {searchStorage.reduce((prev, el) => prev + el.transfer, 0)}
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right">
                                    {searchStorage.reduce((prev, el) => prev + (el?.discount?.discount || 0), 0)}
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right">
                                    {searchStorage.reduce((prev, el) => prev + el.debt, 0)}
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right">
                                    {searchStorage.reduce((prev, el) => prev + (el?.isPayDebt ? el?.payment : 0), 0)}
                                </td>
                                <td className="border py-1 text-[16px] font-bold text-right">
                                    {searchStorage.reduce((prev, el) => prev + (el?.payment < 0 ? el?.payment : 0), 0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
