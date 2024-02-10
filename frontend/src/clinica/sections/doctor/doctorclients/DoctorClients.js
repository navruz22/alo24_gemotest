import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import AdoptionTemplate from "../components/AdoptionTemplate";
import Print from "../components/Print";
import { TableClients } from "./clientComponents/TableClients";
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { checkClientData, checkProductsData, checkServicesData } from "../../reseption/offlineclients/checkData/checkData";
import { Modal } from "../../reseption/components/Modal";

const animatedComponents = makeAnimated()

export const DoctorClients = () => {
  const [beginDay, setBeginDay] = useState(
    new Date(new Date().setUTCHours(0, 0, 0, 0))
  );
  const [endDay, setEndDay] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  //====================================================================
  //====================================================================


  //====================================================================
  //====================================================================

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

  //====================================================================
  //====================================================================

  const [clientsType, setClientsType] = useState('offline')

  //====================================================================
  //====================================================================
  // getConnectors
  const [doctorClients, setDoctorClients] = useState([]);
  const [searchStorage, setSearchStorage] = useState([]);
  const [currentDoctorClients, setCurrentDoctorClients] = useState([]);

  const getDoctorClients = useCallback(
    async (beginDay, endDay) => {
      try {
        const data = await request(
          `/api/doctor/clients/getclients`,
          "POST",
          {
            clinica: auth && auth.clinica._id,
            beginDay,
            endDay,
            department: auth?.user?.specialty,
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        setDoctorClients(data);
        setSearchStorage(data);
        setCurrentDoctorClients(
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


  const getStatsionarClients = useCallback(
    async (beginDay, endDay) => {
      try {
        const data = await request(
          `/api/doctor/clients/statsionarclients/get`,
          "POST",
          {
            clinica: auth && auth.clinica._id,
            beginDay,
            endDay,
            department: auth?.user?.specialty,
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        // setDoctorClients([...data].filter(item => item.connector.room.endday === null));
        // setSearchStorage([...data].filter(item => item.connector.room.endday === null));
        // setCurrentDoctorClients(
        //   [...data].filter(item => item.connector.room.endday === null).slice(indexFirstConnector, indexLastConnector)
        // );
        setDoctorClients(data);
        setSearchStorage(data);
        setCurrentDoctorClients(
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

  //===================================================================
  //===================================================================

  //===================================================================
  //===================================================================
  //Get by born date

  const getDoctorClientsByBorn = async (e) => {
    try {
      const data = await request(
        `/api/doctor/clients/getclients`,
        "POST",
        {
          clientborn: new Date(new Date(e)),
          department: auth?.user?.specialty,
          clinica: auth && auth.clinica._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDoctorClients(data);
      setSearchStorage(data);
      setCurrentDoctorClients(
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


  const getStatsionarClientsByBorn = async (e) => {
    try {
      const data = await request(
        `/api/doctor/clients/statsionarclients/get`,
        "POST",
        {
          clientborn: new Date(new Date(e)),
          department: auth?.user?.specialty,
          clinica: auth && auth.clinica._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDoctorClients(data);
      setSearchStorage(data);
      setCurrentDoctorClients(
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

  const getClientsByBorn = (e) => {
    if (clientsType === 'offline') {
      getDoctorClientsByBorn(e)
    } else {
      getStatsionarClientsByBorn(e)
    }
  }

  //===================================================================
  //===================================================================

  //===================================================================
  //===================================================================

  const [modal, setModal] = useState(false);

  const checkData = () => {
    if (checkServicesData(newservices && newservices)) {
      return notify(checkServicesData(newservices));
    }

    if (checkProductsData(newproducts)) {
      return notify(checkProductsData(newproducts));
    }
    setModal(true);
  };

  //===================================================================
  //===================================================================

  const [client, setClient] = useState({})
  const [connector, setConnector] = useState({})


  const handleAdd = () => {
    if (clientsType === 'offline') {
      addServices()
    } else {
      addServiceStatsionar()
    }
  }

  const addServices = async () => {
    try {
      const data = await request(
        `/api/doctor/clients/service/add`,
        "POST",
        {
          client: { ...client, clinica: auth.clinica._id },
          connector: { ...connector, clinica: auth.clinica._id },
          services: [...newservices],
          products: [...newproducts],
          clinica: auth && auth.clinica._id
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: data.message,
        description: "",
        status: "success",
      });
      setSelectedServices(null);
      setConnector({})
      setClient({})
      setModal(false);
      getDoctorClients(beginDay, endDay)
      setNewProducts([])
      setNewServices([])
      setVisible(false);
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }

  const addServiceStatsionar = async () => {
    try {
      const data = await request(
        `/api/doctor/clients/statsionar/service/add`,
        "POST",
        {
          client: { ...client, clinica: auth.clinica._id },
          connector: { ...connector, clinica: auth.clinica._id },
          services: [...newservices],
          products: [...newproducts],
          clinica: auth && auth.clinica._id
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: data.message,
        description: "",
        status: "success",
      });
      setSelectedServices(null);
      setConnector({})
      setClient({})
      setModal(false);
      getStatsionarClients(beginDay, endDay)
      setNewProducts([])
      setNewServices([])
      setVisible(false);
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }

  //===================================================================
  //===================================================================

  const [clientId, setClientId] = useState('')

  const getClientsById = async () => {
    try {
      const data = await request(
        `/api/doctor/clients/getclients`,
        "POST",
        {
          clientId,
          department: auth?.user?.specialty,
          clinica: auth && auth.clinica._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDoctorClients(data);
      setSearchStorage(data);
      setCurrentDoctorClients(
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

  //===================================================================
  //===================================================================

  const [name, setName] = useState('')

  const getClientsByName = async () => {
    try {
      const data = await request(
        `/api/doctor/clients/getclients`,
        "POST",
        {
          name,
          department: auth?.user?.specialty,
          clinica: auth && auth.clinica._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setDoctorClients(data);
      setSearchStorage(data);
      setCurrentDoctorClients(
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

  //===================================================================
  //===================================================================
  // Searching

  const searchFullname = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.client.fullname
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      );
      setName(e.target.value)
      setDoctorClients(searching);
      setCurrentDoctorClients(searching.slice(0, countPage));
    },
    [searchStorage, countPage]
  );

  const searchId = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.client.id.toString().includes(e.target.value)
      );
      setClientId(e.target.value)
      setDoctorClients(searching);
      setCurrentDoctorClients(searching.slice(0, countPage));
    },
    [searchStorage, countPage]
  );

  //===================================================================
  //===================================================================

  const setPageSize =
    (e) => {
      setCurrentPage(0);
      setCountPage(e.target.value);
      setCurrentDoctorClients(searchStorage.slice(0, e.target.value));
    }

  //====================================================================
  //====================================================================
  // ChangeDate

  const changeStart = (e) => {
    setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
    if (clientsType === 'offline') {
      getDoctorClients(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay)
    } else {
      getStatsionarClients(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay)
    }
  };

  const changeEnd = (e) => {
    const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

    setEndDay(date);
    if (clientsType === 'offline') {
      getDoctorClients(beginDay, date)
    } else {
      getStatsionarClients(beginDay, date)
    }
  };

  //====================================================================
  //====================================================================

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
  // useEffect

  const [t, setT] = useState(0);

  useEffect(() => {
    if (auth.clinica && !t) {
      setT(1);
      getDoctorClients(beginDay, endDay);
      getDepartments()
      getBaseUrl()
      getProducts()
    }
  }, [auth, beginDay, t, endDay, getDoctorClients, getDepartments, getProducts]);


  const componentRef = useRef()
  const print = useReactToPrint({
    content: () => componentRef.current,
  })

  const [printBody, setPrintBody] = useState({
    connector: {},
    client: {},
    services: []
  })
  const handlePrint = (connector) => {
    setPrintBody(connector)
    setTimeout(() => {
      print()
    }, 1000)
  }

  //=====================================================================
  //=====================================================================

  const [newservices, setNewServices] = useState([]);
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
    setNewServices(s);
    setSelectedServices(services);
  };

  //=================================================================
  //=================================================================
  const [services, setServices] = useState([])

  const getServices = useCallback(
    (e) => {
      var s = []
      if (e === 'all') {
        departments.map((department) => {
          return department.services.map((service) => {
            return s.push({
              label: service.name,
              value: service._id,
              service: service,
              department: department,
            })
          })
        })
      } else {
        departments.map((department) => {
          if (e === department._id) {
            department.services.map((service) => {
              s.push({
                label: service.name,
                value: service._id,
                service: service,
                department: department,
              })
              return ''
            })
          }
          return ''
        })
      }
      setServices(s)
    },
    [departments],
  )

  const changeClientsType = (e) => {
    if (e.target.value === 'offline') {
      getDoctorClients(beginDay, endDay)
    }
    if (e.target.value === 'statsionar') {
      getStatsionarClients(beginDay, endDay)
    }
    setClientsType(e.target.value)
  }

  useEffect(() => {
    if (departments) {
      getServices('all')
    }
  }, [departments, getServices])

  //=====================================================================
  //=====================================================================

  return (
    <>
      <div className="d-none">
        <div
          ref={componentRef}
          className="container p-4"
          style={{ fontFamily: "times" }}
        >
          <Print
            doctor={auth.user}
            connector={printBody.connector}
            client={printBody.client}
            sections={printBody.services}
            clinica={auth && auth.clinica}
            baseUrl={baseUrl}
          />
        </div>
      </div>
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="row">
              <div className="col-12 text-end">
                <button
                  className={`btn bg-alotrade text-white mb-2 w-100`}
                  onClick={() => setVisible(!visible)}
                >
                  Malumot
                </button>
              </div>
            </div>
            <div className={` ${visible ? "bg-white" : "d-none"}`}>
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Xizmatlar bilan ishlash</div>
                  </div>
                  <div className="card-body">
                    <div className="row gutters">
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="fullName">Bo'limlar</label>
                          <select
                            className="form-control form-control-sm selectpicker"
                            placeholder="Reklamalarni tanlash"
                            onChange={(event) => getServices(event.target.value)}
                          >
                            <option value="all"> Barcha bo'limlar</option>
                            {departments.map((department, index) => {
                              return (
                                <option key={index} value={department._id}>
                                  {department.name}
                                </option>
                              )
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="inputEmail">Xizmatlar</label>
                          <Select
                            value={selectedServices}
                            onChange={changeService}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            options={services}
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 0,
                              padding: 0,
                              height: 0,
                            })}
                            isMulti
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="inputEmail">Mahsulotlar</label>
                          <Select
                            value={selectedProducts}
                            onChange={changeProduct}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            options={products}
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 0,
                              padding: 0,
                              height: 0,
                            })}
                            isMulti
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="border bg-alotrade py-1">№</th>
                              <th className="border bg-alotrade py-1">Nomi</th>
                              <th className="border bg-alotrade py-1">Narxi</th>
                              <th className="border bg-alotrade py-1">Soni</th>
                            </tr>
                          </thead>
                          <tbody>
                            {newservices &&
                              newservices.map((service, index) => {
                                return (
                                  <tr key={index}>
                                    <td className="py-1">{index + 1}</td>
                                    <td className="py-1">{service.service.name}</td>
                                    <td className="text-right py-1">
                                      {service.service.price * service.pieces}
                                    </td>
                                    <td className="text-right py-1">
                                      <input
                                        onChange={(e) =>
                                          setNewServices(
                                            Object.values({
                                              ...newservices,
                                              [index]: {
                                                ...newservices[index],
                                                pieces: e.target.value,
                                              },
                                            }),
                                          )
                                        }
                                        className="text-right outline-none"
                                        style={{ maxWidth: '50px', outline: 'none' }}
                                        defaultValue={service.pieces}
                                        type="number"
                                      />
                                    </td>
                                  </tr>
                                )
                              })}
                            <tr className="border"></tr>
                            {newproducts &&
                              newproducts.map((product, index) => {
                                return (
                                  <tr key={index}>
                                    <td className="py-1">{index + 1}</td>
                                    <td className="py-1">{product.product.name}</td>
                                    <td className="text-right py-1">
                                      {product.product.price * product.pieces}
                                    </td>
                                    <td className="text-right py-1">
                                      <input
                                        onChange={(e) =>
                                          setNewProducts(
                                            Object.values({
                                              ...newproducts,
                                              [index]: {
                                                ...newproducts[index],
                                                pieces: e.target.value,
                                              },
                                            }),
                                          )
                                        }
                                        className="text-right outline-none"
                                        style={{ maxWidth: '50px', outline: 'none' }}
                                        defaultValue={product.pieces}
                                        type="number"
                                      />
                                    </td>
                                  </tr>
                                )
                              })}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th className="text-right" colSpan={2}>
                                Jami:
                              </th>
                              <th colSpan={2}>
                                {newservices.reduce((summa, service) => {
                                  return (
                                    summa +
                                    service.service.price * parseInt(service.pieces)
                                  )
                                }, 0) +
                                  newproducts.reduce((summa, product) => {
                                    return (
                                      summa +
                                      product.product.price * parseInt(product.pieces)
                                    )
                                  }, 0)}
                              </th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="text-right">
                          {loading ? (
                            <button className="bg-alotrade rounded text-white py-2 px-3" disabled>
                              <span className="spinner-border spinner-border-sm"></span>
                              Loading...
                            </button>
                          ) : (
                            <button onClick={checkData} className="bg-alotrade rounded text-white py-2 px-3">
                              Saqlash
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <TableClients
              changeStart={changeStart}
              changeEnd={changeEnd}
              searchId={searchId}
              searchFullname={searchFullname}
              doctorClients={doctorClients}
              setCurrentPage={setCurrentPage}
              countPage={countPage}
              currentDoctorClients={currentDoctorClients}
              setCurrentDoctorClients={setCurrentDoctorClients}
              currentPage={currentPage}
              setPageSize={setPageSize}
              loading={loading}
              handlePrint={handlePrint}
              setClient={setClient}
              setConnector={setConnector}
              setVisible={setVisible}
              clientsType={clientsType}
              changeClientsType={changeClientsType}
              getClientsByBorn={getClientsByBorn}
              getClientsById={getClientsById}
              getClientsByName={getClientsByName}
            />
          </div>
        </div>
      </div>
      <Modal
        modal={modal}
        text={"ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?"}
        setModal={setModal}
        handler={handleAdd}
        basic={client.lastname + " " + client.firstname}
      />
    </>
  );
};
