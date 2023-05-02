import { faAngleDown, faAngleUp, faPenAlt, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useHistory } from 'react-router-dom';
import { Pagination } from '../../../reseption/components/Pagination';
import { DatePickers } from '../../../reseption/statsionarclients/clientComponents/DatePickers';
import { Sort } from '../../../reseption/statsionarclients/clientComponents/Sort';

const StatsionarClientsTable = ({
    setModal1,
    setCheck,
    changeStart,
    changeEnd,
    searchPhone,
    searchId,
    searchFullname,
    connectors,
    setCurrentPage,
    countPage,
    currentConnectors,
    setCurrentConnectors,
    currentPage,
    setPageSize,
    loading,
    searchBornDay,
    searchFinished,
    searchDoctor,
    clinica,
    user,
    baseUrl
}) => {

    const history = useHistory()

    return (
        <div className="border-0 shadow-lg table-container">
            <div className="border-0 table-container">
                <div className="table-responsive">
                    <table className="table m-0">
                        <thead className="bg-white">
                            <tr>
                                <th>
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
                                </th>
                                <th>
                                    <input
                                        onChange={searchFullname}
                                        style={{ maxWidth: "100px", minWidth: "100px" }}
                                        type="search"
                                        className="w-100 form-control form-control-sm selectpicker"
                                        placeholder="F.I.O"
                                    />
                                </th>
                                <th>
                                    <input
                                        onChange={searchBornDay}
                                        style={{ maxWidth: "100px", minWidth: "100px" }}
                                        type="search"
                                        className="w-100 form-control form-control-sm selectpicker"
                                        placeholder="Tug'ilgan yili"
                                    />
                                </th>
                                <th>
                                    <input
                                        onChange={searchPhone}
                                        style={{ maxWidth: "100px", minWidth: "100px" }}
                                        type="search"
                                        className="w-100 form-control form-control-sm selectpicker"
                                        placeholder="Tel"
                                    />
                                </th>
                                <th>
                                    <input
                                        onChange={searchId}
                                        style={{ maxWidth: "60px" }}
                                        type="search"
                                        className="form-control form-control-sm selectpicker"
                                        placeholder="ID"
                                    />
                                </th>
                                <th>
                                    <input
                                        onChange={searchDoctor}
                                        style={{ maxWidth: "100px" }}
                                        type="search"
                                        className="form-control form-control-sm selectpicker"
                                        placeholder="Shifokor"
                                    />
                                </th>
                                <th className="text-center">
                                    <Pagination
                                        setCurrentDatas={setCurrentConnectors}
                                        datas={connectors}
                                        setCurrentPage={setCurrentPage}
                                        countPage={countPage}
                                        totalDatas={connectors.length}
                                    />
                                </th>
                                <th
                                    className="text-center"
                                    style={{ maxWidth: "120px", overflow: "hidden" }}
                                >
                                    <DatePickers changeDate={changeStart} />
                                </th>
                                <th
                                    className="text-center"
                                    style={{ maxWidth: "120px", overflow: "hidden" }}
                                >
                                    <DatePickers changeDate={changeEnd} />
                                </th>
                                <th colSpan={2} className="text-center" style={{ maxWidth: "120px" }}>
                                    <select
                                        className="form-control form-control-sm selectpicker"
                                        placeholder="Doctors"
                                        onChange={searchFinished}
                                    >
                                        <option value={"all"}>Hammasi</option>
                                        <option value={"done"}>Yakunlangan</option>
                                        <option value={"begin"}>Davolanishda</option>
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <thead>
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
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Tug'ilgan yili
                                    <div className="btn-group-vertical ml-2">
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        a.client.born.toLocaleDateString() >
                                                            b.client.toLocaleDateString()
                                                            ? 1
                                                            : -1
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
                                                        b.client.born.toLocaleDateString() >
                                                            a.client.born.toLocaleDateString()
                                                            ? 1
                                                            : -1
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Tel
                                    <div className="btn-group-vertical ml-2">
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        a.client.phone > b.client.phone ? 1 : -1
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
                                                        b.client.phone > a.client.phone ? 1 : -1
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Manzil
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
                                    Shikokor
                                    <div className="btn-group-vertical ml-2">
                                        <FontAwesomeIcon
                                            onClick={() =>
                                                setCurrentConnectors(
                                                    [...currentConnectors].sort((a, b) =>
                                                        a.doctor.fullname > b.doctor.fullname ? 1 : -1
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
                                                        b.doctor.fullname > a.doctor.fullname ? 1 : -1
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Kelgan vaqti
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Ketgan vaqti
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    Kuni
                                    <Sort
                                        data={currentConnectors}
                                        setData={setCurrentConnectors}
                                        property={"createdAt"}
                                    />
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px] text-center">Chek</th>
                                <th className="border py-1 bg-alotrade text-[16px] text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentConnectors.map((connector, key) => {
                                return (
                                    <tr key={key}>
                                        <td
                                            className="border py-1 font-weight-bold text-right text-[16px]"
                                            style={{ maxWidth: "30px !important" }}
                                        >
                                            {currentPage * countPage + key + 1}
                                        </td>
                                        <td className="border py-1 font-weight-bold text-[16px]">
                                            {connector.client.fullname}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            {new Date(connector.client.born).toLocaleDateString()}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            +998{connector.client.phone}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            {connector?.client?.address}
                                        </td>
                                        <td className="border py-1 text-[16px]">
                                            {connector.doctor.lastname +
                                                " " +
                                                connector.doctor.firstname}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            {connector?.room?.beginday && new Date(connector.room.beginday).toLocaleDateString()}{" "}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            {connector?.room?.endday && new Date(connector.room.endday).toLocaleDateString()}{" "}
                                        </td>
                                        <td className="border py-1 text-right text-[16px]">
                                            {connector?.room?.endday && (Math.round(
                                                Math.abs(
                                                    (new Date(connector?.room?.beginday).getTime()
                                                        -
                                                        new Date(connector?.room?.endday).getTime())
                                                    /
                                                    (24 * 60 * 60 * 1000)
                                                )
                                            ))}
                                        </td>
                                        <td className="border py-1 text-center text-[16px]">
                                            {loading ? (
                                                <button className="btn btn-primary" disabled>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Loading...
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary py-0"
                                                    onClick={() => {
                                                        setCheck(connector);
                                                        setModal1(true);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPrint} />
                                                </button>
                                            )}
                                        </td>
                                        <td className="border py-1 text-center text-[16px]">
                                            {loading ? (
                                                <button className="btn btn-success" disabled>
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                    Loading...
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        history.push("/alo24/statsionarclient_history", { connector, clinica, user, baseUrl })
                                                    }
                                                    className="btn btn-primary py-0"
                                                >
                                                    <FontAwesomeIcon icon={faPenAlt} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default StatsionarClientsTable