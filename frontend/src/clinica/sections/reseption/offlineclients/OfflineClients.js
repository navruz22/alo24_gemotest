import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Modal } from "../components/Modal";
import { RegisterClient } from "./clientComponents/RegisterClient";
import { TableClients } from "./clientComponents/TableClients";
import { checkClientData, checkProductsData, checkServicesData, } from "./checkData/checkData";
import { CheckModal } from "../components/ModalCheck";
import { useReactToPrint } from "react-to-print";
import DoctorResult from "../../doctor/conclusion/components/DoctorResult";
import AllServices from "../components/AllServices";

export const OfflineClients = () => {
    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );
    //====================================================================
    //====================================================================
    // MODAL
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // RegisterPage
    const [visible, setVisible] = useState(false);

    const changeVisible = () => setVisible(!visible);

    //====================================================================
    //====================================================================
    const [printBody, setPrintBody] = useState(null)

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

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
    const [isActive, setIsActive] = useState(true)
    //====================================================================
    //====================================================================
    // getConnectors
    const [connectors, setConnectors] = useState([]);
    const [searchStorage, setSearchStrorage] = useState([]);

    const getConnectors = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/offlineclient/client/getallreseption`,
                    "POST",
                    { clinica: auth && auth.clinica._id, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setConnectors(data);
                setSearchStrorage(data);
                setCurrentConnectors(
                    data.slice(indexFirstConnector, indexLastConnector)
                );
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
    //====================================================================

    const getConnectorsByClientBorn = async (e) => {
        try {
            const data = await request(
                `/api/offlineclient/client/getallreseption`,
                "POST",
                { clinica: auth && auth.clinica._id, clientborn: new Date(e) },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setConnectors(data);
            setSearchStrorage(data);
            setCurrentConnectors(
                data.slice(indexFirstConnector, indexLastConnector)
            );
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }

    //====================================================================
    //====================================================================

    const [clientId, setClientId] = useState('')

    const getClientsById = async () => {
        try {
            const data = await request(
                `/api/offlineclient/client/getallreseption`,
                "POST",
                { clinica: auth && auth.clinica._id, clientId },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setConnectors(data);
            setSearchStrorage(data);
            setCurrentConnectors(
                data.slice(indexFirstConnector, indexLastConnector)
            );
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }

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
                item.client.id.toString().includes(e.target.value)
            );
            setClientId(e.target.value);
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
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCurrentConnectors(connectors.slice(0, e.target.value));
        },
        [connectors]
    );
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // DEPARTMENTS
    const [departments, setDepartments] = useState([]);

    const getDepartments = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/department/reseption`,
                "POST",
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDepartments(data);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [connector, setConnector] = useState({
        clinica: auth.clinica && auth.clinica._id,
        probirka: 0,
    });

    const [check, setCheck] = useState({});

    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    const changeService = (services) => {
        let s = [];
        services.map((service) => {
            if (service.department.probirka) {
                setConnector({ ...connector, probirka: 1, clinica: auth.clinica._id });
            }
            return s.push({
                clinica: auth.clinica._id,
                reseption: auth.user._id,
                serviceid: service.service._id,
                service: service.service,
                department: service.department._id,
                pieces: 1,
            });
        });
        setServices(s);
        setSelectedServices(services);
    };

    //====================================================================
    //====================================================================

    const [isAddConnector, setIsAddConnector] = useState(false);

    //====================================================================
    //====================================================================
    // COUNTERDOCTORS
    const [counterdoctors, setCounterDoctors] = useState([]);

    const getCounterDoctors = useCallback(async () => {
        try {
            const data = await request(
                `/api/offlineclient/client/counter_doctors/get`,
                "POST",
                { clinica: auth.clinica._id, },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setCounterDoctors([...data].map(item => ({
                value: item._id,
                label: item.firstname + ' ' + item.lastname,
            })));
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [counterdoctor, setCounterDoctor] = useState(null);
    const [isCounterDoctor, setIsCounterDoctor] = useState(false)

    const changeCounterDoctor = (e) => {
        if (e.value === "delete") {
            setCounterDoctor(null)

        } else {
            setIsCounterDoctor(false);
            setCounterDoctor(e.value);
        }
    };
    //====================================================================
    //====================================================================

    const [serviceTypes, setServiceTypes] = useState([])

    const getServiceTypes = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/servicetype/getall`,
                "POST",
                { clinica: auth.clinica._id, },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setServiceTypes(data);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify])

    //====================================================================
    //====================================================================
    // ADVERS
    const [advers, setAdvers] = useState([]);

    const getAdvers = useCallback(async () => {
        try {
            const data = await request(
                `/api/adver/adver/getall`,
                "POST",
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setAdvers(data);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [adver, setAdver] = useState({
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user && auth.user._id,
    });

    const changeAdver = (e) => {
        if (e.target.value === "delete") {
            let s = { ...adver };
            delete s.adver;
            setAdver(s);
        } else {
            setAdver({
                ...adver,
                adver: e.target.value,
            });
        }
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // PRODUCTS
    const [products, setProducts] = useState([]);

    const getProducts = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/product/getallreseption`,
                "POST",
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );

            let s = [];
            data.map((product) => {
                return s.push({
                    label: product.name,
                    value: product._id,
                    product: product,
                });
            });
            setProducts(s);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [newproducts, setNewProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const changeProduct = (newproducts) => {
        let s = [];
        newproducts.map((product) => {
            return s.push({
                clinica: auth.clinica._id,
                reseption: auth.user._id,
                productid: product.product._id,
                product: product.product,
                pieces: 1,
            });
        });
        setNewProducts(s);
        setSelectedProducts(newproducts);
    };

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

    //====================================================================
    //====================================================================
    // CLIENT

    const [clientDate, setClientDate] = useState(new Date().toISOString().slice(0, 10))

    const [client, setClient] = useState({
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user && auth.user._id,
        born: new Date()
    });

    const changeClientData = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };



    const changeClientBorn = (e) => {
        setClientDate(e.target.value);
        setClient({ ...client, born: new Date(e.target.value) });
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // CLEAR

    const clearDatas = useCallback(() => {
        setClient({
            clinica: auth.clinica && auth.clinica._id,
            reseption: auth.user && auth.user._id,
        });
        setConnector({
            clinica: auth.clinica && auth.clinica._id,
            probirka: 0,
        });
        setAdver({
            clinica: auth.clinica && auth.clinica._id,
            reseption: auth.user && auth.user._id,
        });
        setCounterDoctor(null);
        setNewProducts([]);
        setServices([]);
        setSelectedProducts([]);
        setSelectedServices([]);
        setClientDate(new Date().toISOString().slice(0, 10))
        setIsAddConnector(false);
        setIsCounterDoctor(false)
    }, [auth]);

    const checkData = () => {
        if (checkClientData(client)) {
            return notify(checkClientData(client));
        }

        if (checkServicesData(services && services)) {
            return notify(checkServicesData(services));
        }

        if (checkProductsData(newproducts)) {
            return notify(checkProductsData(newproducts));
        }
        if (!counterdoctor && !isCounterDoctor) {
            return notify(
                {
                    title: 'Diqqat! Yullanma shifokor kiritilmagan.',
                    description: 'Iltimos Yullanma shifokor ismini kiriting.',
                    status: 'error',
                }
            )
        }
        setModal(true);
    };
    //====================================================================
    //====================================================================
    console.log(isCounterDoctor);
    //====================================================================
    //====================================================================
    // CreateHandler

    const createHandler = useCallback(async () => {
        setIsActive(false)
        try {
            const data = await request(
                `/api/offlineclient/client/register`,
                "POST",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    services: [...services],
                    products: [...newproducts],
                    counterdoctor: counterdoctor,
                    adver: { ...adver, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: "Mijoz muvaffaqqiyatli yaratildi.",
                description: "",
                status: "success",
            });
            const s = [data, ...connectors];
            setConnectors(s);
            setSearchStrorage(s);
            setCurrentConnectors(s.slice(indexFirstConnector, indexLastConnector));
            setModal(false);
            clearDatas();
            setVisible(false);
            setTimeout(() => {
                setIsActive(true)
            }, 1000)
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
            setIsActive(true)
        }
    }, [
        auth,
        client,
        connector,
        notify,
        services,
        newproducts,
        request,
        indexLastConnector,
        indexFirstConnector,
        connectors,
        clearDatas,
        adver,
        counterdoctor,
    ]);

    const updateHandler = useCallback(async () => {
        if (checkClientData(client)) {
            return notify(checkClientData(client));
        }
        try {
            const data = await request(
                `/api/offlineclient/client/update`,
                "PUT",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    counterdoctor: counterdoctor,
                    adver: { ...adver, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            getConnectors(beginDay, endDay);
            notify({
                title: `${data.lastname + " " + data.firstname
                    }  ismli mijoz ma'lumotlari muvaffaqqiyatl yangilandi.`,
                description: "",
                status: "success",
            });
            clearDatas();
            setVisible(false);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        client,
        adver,
        counterdoctor,
        connector,
        notify,
        request,
        clearDatas,
        getConnectors,
        beginDay,
        endDay,
    ]);

    const addHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/offlineclient/client/add`,
                "POST",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    services: [...services],
                    products: [...newproducts],
                    counterdoctor: counterdoctor,
                    adver: { ...adver, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            localStorage.setItem("data", data);
            getConnectors(beginDay, endDay);
            notify({
                title: `${client.lastname + " " + client.firstname
                    }  ismli mijozga xizmatlar muvaffaqqiyatli qo'shildi.`,
                description: "",
                status: "success",
            });
            clearDatas();
            setModal(false);
            setVisible(false);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        client,
        services,
        newproducts,
        connector,
        adver,
        counterdoctor,
        beginDay,
        endDay,
        notify,
        request,
        clearDatas,
        getConnectors,
    ]);

    const addConnectorHandler = async () => {
        try {
            const data = await request(
                `/api/offlineclient/client/connector/add`,
                "POST",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    services: [...services],
                    products: [...newproducts],
                    counterdoctor: counterdoctor,
                    adver: { ...adver, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            getConnectors(beginDay, endDay);
            clearDatas()
            setModal(false);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }

    //====================================================================
    //====================================================================


    //====================================================================
    //====================================================================
    // ChangeDate

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    };

    const changeEnd = (e) => {
        const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

        setEndDay(date);
        getConnectors(beginDay, date);
    }

    //====================================================================
    //====================================================================
    // useEffect

    const [t, setT] = useState(0);

    useEffect(() => {
        if (auth.clinica && !t) {
            setT(1);
            getConnectors(beginDay, endDay);
            getServiceTypes();
            getCounterDoctors();
            getAdvers();
            getProducts();
            getBaseUrl();
        }
    }, [
        auth,
        getConnectors,
        getAdvers,
        t,
        getProducts,
        getCounterDoctors,
        getServiceTypes,
        getBaseUrl,
        beginDay,
        endDay,
    ]);


    //====================================================================
    //====================================================================
    return (
        <div className="min-h-full">
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="row">
                            <div className="col-12 text-end">
                                <button
                                    className={`btn bg-alotrade text-white mb-2 w-100 ${visible ? "d-none" : ""
                                        }`}
                                    onClick={changeVisible}
                                >
                                    Registratsiya
                                </button>
                                <button
                                    className={`btn bg-alotrade text-white mb-2 w-100 ${visible ? "" : "d-none"
                                        }`}
                                    onClick={changeVisible}
                                >
                                    Registratsiya
                                </button>
                            </div>
                        </div>
                        <div className={` ${visible ? "" : "d-none"}`}>
                            <RegisterClient
                                selectedServices={selectedServices}
                                selectedProducts={selectedProducts}
                                updateData={updateHandler}
                                checkData={checkData}
                                setNewProducts={setNewProducts}
                                setNewServices={setServices}
                                newservices={services}
                                newproducts={newproducts}
                                changeProduct={changeProduct}
                                changeService={changeService}
                                changeAdver={changeAdver}
                                changeCounterDoctor={changeCounterDoctor}
                                client={client}
                                setClient={setClient}
                                changeClientData={changeClientData}
                                changeClientBorn={changeClientBorn}
                                departments={departments}
                                counterdoctors={counterdoctors}
                                advers={advers}
                                products={products}
                                loading={loading}
                                clientDate={clientDate}
                                setClientDate={setClientDate}
                                setIsAddConnector={setIsAddConnector}
                                servicetypes={serviceTypes}
                                isCounterDoctor={isCounterDoctor}
                                setIsCounterDoctor={setIsCounterDoctor}
                            />
                        </div>
                        <TableClients
                            setVisible={setVisible}
                            modal1={modal1}
                            setModal1={setModal1}
                            setCheck={setCheck}
                            getConnectorsByClientBorn={getConnectorsByClientBorn}
                            changeStart={changeStart}
                            changeEnd={changeEnd}
                            searchPhone={searchPhone}
                            setClient={setClient}
                            setConnector={setConnector}
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
                            // setModal2={setModal2}
                            loading={loading}
                            setClientDate={setClientDate}
                            setIsAddConnector={setIsAddConnector}
                            getClientsById={getClientsById}
                            setPrintBody={setPrintBody}
                            handlePrint={handlePrint}
                        />
                    </div>
                </div>
            </div>

            <CheckModal
                clinica={auth && auth.clinica}
                baseUrl={baseUrl}
                connector={check}
                modal={modal1}
                setModal={setModal1}
            />

            <div className="d-none">
                <div className="container p-4 bg-white text-center" ref={componentRef}>
                    {printBody && <AllServices
                        baseUrl={baseUrl}
                        clinica={auth?.clinica}
                        connector={printBody}
                    />}
                </div> 
            </div>

            <Modal
                modal={modal}
                text={"ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?"}
                setModal={setModal}
                handler={client._id && !isAddConnector ? addHandler : client._id && isAddConnector ? addConnectorHandler : isActive && createHandler}
                basic={client.lastname + " " + client.firstname}
            />
        </div>
    );
};
