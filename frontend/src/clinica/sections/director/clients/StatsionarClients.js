import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Modal, Modal as Modal2 } from "../../reseption/components/Modal";
import { CheckModalStatsionar } from "../../reseption/components/ModalCheckStatsionar";
import { useLocation } from "react-router-dom";
import { useHttp } from "../../../hooks/http.hook";
import { AuthContext } from "../../../context/AuthContext";
import StatsionarClientsTable from "./components/StatsionarClientsTable";

const StatsionarClients = () => {
    const [beginDay, setBeginDay] = useState(
        new Date(
            new Date().setMonth(new Date().getMonth() - 3)
        )
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );

    //====================================================================
    //====================================================================
    // MODAL
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    //====================================================================
    //====================================================================

    const [check, setCheck] = useState({});

    //====================================================================
    //====================================================================
    // RegisterPage
    const [visible, setVisible] = useState(false);

    const changeVisible = () => setVisible(!visible);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [countPage, setCountPage] = useState(10);

    const indexLastConnector = (currentPage + 1) * countPage;
    const indexFirstConnector = indexLastConnector - countPage;
    const [currentConnectors, setCurrentConnectors] = useState([]);

    //====================================================================
    //====================================================================

    const state = useLocation().state

    //====================================================================
    //====================================================================
    const toast = useToast();

    const notify = useCallback(
        (data) => {
            toast({
                title: data.title && data.title,
                description: data.description && data.description,
                status: data.status && data.status,
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        },
        [toast]
    );
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // getConnectors
    const [connectors, setConnectors] = useState([]);
    const [searchStorage, setSearchStrorage] = useState([]);

    const getConnectors = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/statsionarclient/client/getallreseption`,
                    "POST",
                    { clinica: auth && auth.clinica._id, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setConnectors([...data]);
                setSearchStrorage([...data]);
                setCurrentConnectors([...data].slice(indexFirstConnector, indexLastConnector));
            } catch (error) {
                notify({
                    title: error,
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify, indexFirstConnector, indexLastConnector]
    );
    //====================================================================
    //====================================================================+

    //====================================================================
    //====================================================================
    // SEARCH
    const searchFullname = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.fullname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchId = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.id
                    .toLowerCase()
                    .toString()
                    .includes(e.target.value.toLowerCase())
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchProbirka = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.probirka.toString().includes(e.target.value)
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchPhone = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.phone.toString().includes(e.target.value)
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchBornDay = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) => {
                return new Date(item.client.born)
                    .toLocaleDateString()
                    .includes(e.target.value);
            });
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchFinished = (e) => {
        if (e.target.value === "done") {
            const searching = [...searchStorage].filter((item) => item?.room?.endday);
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        }
        if (e.target.value === "begin") {
            const searching = [...searchStorage].filter(
                (item) => item?.room?.endday === null
            );
            console.log(searching);
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        }
        if (e.target.value === "all") {
            setConnectors(searchStorage);
            setCurrentConnectors(searchStorage);
        }
    }

    const searchDoctor = useCallback(
        (e) => {
            const searching = [...searchStorage].filter(
                (item) =>
                    item.doctor.lastname.includes(e.target.value) ||
                    item.doctor.firstname.includes(e.target.value)
            );
            setConnectors(searching);
            setCurrentConnectors(searching);
        },
        [searchStorage]
    );

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const setPageSize = (e) => {
        if (e.target.value === 'all') {
            setCurrentPage(0);
            setCountPage(connectors.length);
            setCurrentConnectors(connectors);
        } else {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCurrentConnectors(connectors.slice(0, e.target.value));
        }
    }
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // BASEURL
    const [baseUrl, setBaseurl] = useState();

    const getBaseUrl = useCallback(async () => {
        try {
            const data = await request(`/api/baseurl`, "GET", null);
            setBaseurl(data.baseUrl);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, notify]);

    //====================================================================
    //====================================================================

    // ===================================================================
    // ===================================================================

    const [clientDate, setClientDate] = useState(new Date().toISOString().slice(0, 10))

    const changeClientBorn = (e) => {
        setClientDate(e.target.value);
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // ChangeDate

    const changeStart = (e) => {
        setBeginDay(e);
        getConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    };

    const changeEnd = (e) => {
        const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))
        setEndDay(date);
        getConnectors(beginDay, date);
    };
    //====================================================================
    //====================================================================
    // useEffect

    const [t, setT] = useState(0);

    useEffect(() => {
        if (auth.clinica && !t) {
            setT(1);
            getConnectors(beginDay, endDay);
            getBaseUrl()
        }
    }, [
        getConnectors,
        getBaseUrl,
        auth,
        t,
        beginDay,
        endDay,
    ]);

    //=================================================================
    //=================================================================

    //=================================================================
    //=================================================================
    return (
        <div>
            <div className="content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <StatsionarClientsTable
                            setVisible={setVisible}
                            setCheck={setCheck}
                            changeStart={changeStart}
                            changeEnd={changeEnd}
                            searchPhone={searchPhone}
                            searchFullname={searchFullname}
                            searchId={searchId}
                            connectors={connectors}
                            searchProbirka={searchProbirka}
                            // setModal={setModal}
                            setConnectors={setConnectors}
                            // setConnector={setConnector}
                            setCurrentPage={setCurrentPage}
                            countPage={countPage}
                            setCountPage={setCountPage}
                            currentConnectors={currentConnectors}
                            setCurrentConnectors={setCurrentConnectors}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            setModal1={setModal1}
                            // setModal2={setModal2}
                            loading={loading}
                            setModal2={setModal2}
                            searchBornDay={searchBornDay}
                            searchFinished={searchFinished}
                            searchDoctor={searchDoctor}
                            baseUrl={baseUrl}
                            clinica={auth?.clinica}
                            user={auth?.user}
                        />
                    </div>
                </div>
            </div>

            <CheckModalStatsionar
                baseUrl={baseUrl}
                connector={check}
                modal={modal1}
                setModal={setModal1}
            />
        </div>
    );
};

export default StatsionarClients;
