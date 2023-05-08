import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

const Print = ({ client, connector, sections, baseUrl, clinica, qr }) => {
    const location = useLocation()

    const [printSections, setPrintSections] = useState([])

    useEffect(() => {
        if (location.pathname.includes('alo24/adoption')) {
            setPrintSections([...sections])
        } else {
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
        }
    }, [sections, location])

    return (
        <div>
            <table className='report-container w-100'>
                <thead className='report-header'>
                    <tr>
                        <th className='report-header-cell'>
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
                                        <img width="100" src={qr && qr} alt="QR" />
                                    </p>
                                </div>
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
                        </th>
                    </tr>
                </thead>
                <tbody className="report-content">
                    <tr>
                        <td className='report-content-cell'>
                            <div className="pt-2 w-full text-center mr-6">
                                {printSections.length > 0 &&
                                    printSections.map((section, index) => section.services.some(s => s.tables.some(t => t.accept)) && (
                                        <table key={index} className="w-full text-center mt-4">
                                            <thead>
                                                <tr>
                                                    <th colSpan={5} className='w-full'>
                                                        <div className="w-full">
                                                            <h2 className="text-[20px] text-center font-bold">
                                                                {section?.servicetype}
                                                            </h2>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <thead>
                                                <tr>
                                                    <th className="border-[1px] border-black bg-gray-400 text-[18px] px-[12px] py-1 text-center">№</th>
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
                                                            <td className={`border-[1px] text-[16px] border-black py-1 px-1 w-[5px]`}>
                                                                {key + 1}
                                                            </td>
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
                                    ))}
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot className="report-footer">
                    <tr className='report-footer-cell'>
                        <td className="report-footer-cell">
                            <div className='row'>
                                <div className='col-4'>
                                    <div className="footer-info">
                                        <p className='text-start text-[14px] py-0 m-0'> Manzil: {clinica && clinica.address} </p>
                                        <p className='text-start text-[14px] py-0 m-0'> Tel: +998(93)310-94-22 <br />+998(79)220-13-46 </p>
                                        <p className='text-start text-[14px] py-0 m-0'> http://t.me/gemotestuz </p>
                                        <p className='text-start text-[14px] py-0 m-0'> Pochta indeksi: 210100 </p>
                                    </div>
                                </div>
                                <div className='col-3'>
                                    <p className='text-center' style={{ paddingTop: "35px" }}> Vrach: Iydiev B.T   _______________ </p>
                                    <p className='text-center fs-5 mt-4' > WWW.GEMO-TEST.UZ </p>
                                </div>
                                <div className='col-3'>
                                    <img width="150" src={baseUrl + '/api/upload/file/' + clinica?.image} />
                                </div>
                            </div>

                        </td>
                    </tr>
                </tfoot>
            </table>
            {printSections.map((section => section.services.map(service => service.files && service.files.map((file) => <div className='py-[20px]'>
                <img className='h-[38cm]' src={file} alt='file' />
            </div>))))}
        </div>
    )
}

export default Print