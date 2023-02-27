import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import Print from "../components/Print";
import { TableClients } from "./clientComponents/TableClients";

export const DoctorClients = () => {
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
          `/api/labaratory/clients/get`,
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
        const currentData = data[0].services.length > 0 ? data : []
        setDoctorClients(currentData);
        setSearchStorage(currentData);
        setCurrentDoctorClients(
          currentData.slice(indexFirstConnector, indexLastConnector)
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

  const getDoctorClientsByClientBorn = async (e) => {
    try {
      const data = await request(
        `/api/labaratory/clients/get`,
        "POST",
        {
          clinica: auth && auth.clinica._id,
          department: auth?.user?.specialty,
          clientborn: new Date(new Date(e))
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      const currentData = data[0].services.length > 0 ? data : []
      setDoctorClients(currentData);
      setSearchStorage(currentData);
      setCurrentDoctorClients(
        currentData.slice(indexFirstConnector, indexLastConnector)
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
      setDoctorClients(searching);
      setCurrentDoctorClients(searching.slice(0, countPage));
    },
    [searchStorage, countPage]
  );

  //===================================================================
  //===================================================================

  const setPageSize = useCallback(
    (e) => {
      setCurrentPage(0);
      setCountPage(e.target.value);
      setCurrentDoctorClients(doctorClients.slice(0, countPage));
    },
    [countPage, doctorClients]
  );

  //====================================================================
  //====================================================================
  // ChangeDate

  const changeStart = (e) => {
    setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
    getDoctorClients(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
  };

  const changeEnd = (e) => {
    const date = new Date(
      new Date(new Date().setDate(new Date(e).getDate() + 1)).setUTCHours(
        0,
        0,
        0,
        0
      )
    );

    setEndDay(date);
    getDoctorClients(beginDay, date);
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
  // useEffect

  const [t, setT] = useState(0);

  useEffect(() => {
    if (auth.clinica && !t) {
      setT(1);
      getDoctorClients(beginDay, endDay);
      getBaseUrl()
    }
  }, [auth, beginDay, t, endDay, getDoctorClients, getBaseUrl]);

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

  return (
    <>
      <div className="d-none">
        <div
          ref={componentRef}
          className="container p-4"
          style={{ fontFamily: "times" }}
        >
          <Print
            baseUrl={baseUrl}
            doctor={auth.doctor}
            connector={printBody.connector}
            client={printBody.client}
            sections={printBody.services}
            clinica={auth && auth.clinica}
          />
        </div>
      </div>
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
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
              getDoctorClientsByClientBorn={getDoctorClientsByClientBorn}
            />
          </div>
        </div>
      </div>
    </>
  );
};
