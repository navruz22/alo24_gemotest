import { useToast } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";


const Print = ({ client, connector, sections, baseUrl, clinica }) => {

    const [printSections, setPrintSections] = useState([])

    useEffect(() => {
        const servicetypesAll = sections.reduce((prev, el) => {
            if (!prev.includes(el.serviceid.servicetype.name)) {
                prev.push(el.serviceid.servicetype.name)
            }
            return prev;
        }, [])

        let servicetypes = []
        for (const type of servicetypesAll) {
            sections.map((service) => {
                if (service.column && service.tables.length > 0) {
                    if (service.serviceid.servicetype.name === type && service.tables.length <= 2) {
                        const cols = Object.keys(service.column).filter(c => c.includes('col') && service.column[c]).length;
                        const isExist = servicetypes.findIndex(i => i.servicetype === type && i.cols === cols)
                        if (isExist >= 0) {
                            servicetypes[isExist].services.push(service);
                        } else {
                            servicetypes.push({
                                column: service.column,
                                servicetype: type,
                                services: [service],
                                cols: cols
                            })
                        }
                    }
                }
                return service;
            })
        }

        const servicesmore = [...servicetypesAll].reduce((prev, el) => {
            sections.map((service) => {
                if (service.serviceid.servicetype.name === el && service.tables.length > 2) {
                    prev.push({
                        column: service.column,
                        servicetype: service.service.name,
                        services: [service]
                    })
                }
                return service;
            })
            return prev;
        }, [])

        setPrintSections([...servicetypes, ...servicesmore])

    }, [sections])

    return (
        <div className="px-2 pt-4 bg-white">
            <div>
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
                    {/* <div className="" style={{ textAlign: "center" }}>
                        <p className="text-end m-0">
                            <img width="100" src={QRcode} alt="QR" />
                        </p>
                    </div> */}
                </div>
                <div className="">
                    <div className="" style={{ padding: "0" }}>
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
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Mijozning F.I.SH
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    <h4 className='text-[20px]'>
                                        {client && client.lastname + " " + client.firstname}
                                    </h4>
                                </td>
                                <td rowSpan="2" colSpan={2} style={{ width: "33%" }}>
                                    <p className="fw-bold fs-5 m-0">
                                        TAHLIL <br /> NATIJALARI
                                    </p>
                                </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Tug'ilgan yili
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {client && new Date(client.born).toLocaleDateString()}
                                </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Kelgan sanasi
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector &&
                                        new Date(connector.createdAt).toLocaleDateString()}
                                </td>
                                <td
                                    className="p-0 fw-bold"
                                    style={{
                                        width: "100px",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Namuna
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
                                    {connector && connector.probirka}
                                </td>
                            </tr>

                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    Manzil
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {client && client.address}
                                </td>
                                <td
                                    className="p-0 fw-bold"
                                    style={{
                                        width: "200px",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    ID
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "200px",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {client && client.id}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="mt-2 px-2 py-1 bg-gray-400 flex justify-between items-center">
                    <span className="text-[14px] font-bold">{clinica?.organitionName}</span>
                    <span className="text-[14px] font-bold">{clinica?.license}</span>
                </div>
            </div>
            <div className="pt-2 w-full text-center mr-6">
                {printSections.length > 0 &&
                    printSections.map((section, index) => section.services.some(s => s.tables.some(t => t.accept)) && (
                        <div key={index} className={"w-full text-center mb-1"}>
                            <div className="w-full flex justify-center items-center mb-1">
                                <h2 className="block text-[20px] font-bold">
                                    {section?.servicetype}
                                </h2>
                            </div>
                            <table className="w-full text-center">
                                <thead>
                                    <tr>
                                        <th className="border-[1px] border-black bg-gray-400 text-[18px] px-[12px] py-1 text-center">{section?.column?.col1}</th>
                                        {section?.column?.col2 && <th className="text-[18px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col2}</th>}
                                        {section?.column?.col3 && <th className="text-[18px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col3}</th>}
                                        {section?.column?.col4 && <th className="text-[18px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col4}</th>}
                                        {section?.column?.col5 && <th className="text-[18px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col5}</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {section?.services && section?.services.map((service, ind) => {
                                        return service.tables.map((table, key) => table.accept && (
                                            <tr key={key} >
                                                <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}> <pre
                                                    style={{ fontFamily: "sans-serif" }}
                                                    className="border-none outline-none text-left"
                                                >
                                                    {table?.col1}
                                                </pre> </td>
                                                <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                    <pre
                                                        style={{ fontFamily: "sans-serif" }}
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col2}
                                                    </pre>
                                                </td>
                                                <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                    <pre
                                                        style={{ fontFamily: "sans-serif" }}
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col3}
                                                    </pre>
                                                </td>
                                                {section?.column?.col4 && <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                    <pre
                                                        style={{ fontFamily: "sans-serif" }}
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col4}
                                                    </pre></td>}
                                                {section?.column?.col5 && <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                    <pre
                                                        style={{ fontFamily: "sans-serif" }}
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col5}
                                                    </pre></td>}
                                            </tr>
                                        ))
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ))}
                {printSections.map((section => <div className='py-[20px]'>
                    <div className="">
                        {section.services.map(service => service.files && service.files.map((file) => <div className="">
                            <img className='h-[39cm]' src={file} alt='file' />
                        </div>))}
                    </div>
                </div>))}
            </div>
        </div>
    )
}

const ClientHistory = () => {

    const { id } = useParams();
    console.log(id);

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const { request } = useHttp();
    const auth = useContext(AuthContext);

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

    const [connector, setConnector] = useState({})
    const [client, setClient] = useState({})
    const [services, setServices] = useState([])
    console.log(services);
    const getClientHistory = useCallback(
        async (id) => {
            try {
                const data = await request(
                    `/api/labaratory/client/history/get`,
                    "POST",
                    {
                        id: id
                    }
                );
                setConnector({ ...data })
                setClient({ ...data.client })
                setServices([...data.services])
            } catch (error) {
                notify({
                    title: error,
                    description: "",
                    status: "error",
                });
            }
        },
        [request, notify]
    );



    const [baseUrl, setBaseUrl] = useState()

    const getBaseUrl = useCallback(async () => {
        try {
            const data = await request('/api/baseurl', 'GET', null)
            setBaseUrl(data.baseUrl)
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }, [request, notify])

    useEffect(() => {
        getClientHistory(id)
    }, [getClientHistory]);

    useEffect(() => {
        getBaseUrl()
    }, [getBaseUrl]);


    return <>
        <div className="container p-4 bg-white text-center" style={{ fontFamily: "times" }}>
            <div className="row">
                <div className="col-12 text-center my-4">
                    <button className="btn btn-info px-5" onClick={handlePrint} >Chop etish</button>
                </div>
            </div>
        </div>
        {services.length > 0 && <div className="d-none">
            <div
                ref={componentRef}
                className="container p-4"
            >
                <Print
                    baseUrl={baseUrl}
                    clinica={auth?.clinica}
                    connector={connector}
                    client={client}
                    sections={services}
                />
            </div>
        </div>}
    </>
}

export default ClientHistory;