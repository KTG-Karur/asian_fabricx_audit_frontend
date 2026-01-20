import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCompany, resetCompanyStatus } from '../../../redux/companySlice';
import { baseURL } from '../../../api/ApiConfig';
import moment from 'moment';

const Index = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [enquiryData, setEnquiryData] = useState([]);
    const [companyInfo, setCompanyInfo] = useState({});
    const [filters, setFilters] = useState({});
    const [enquiriesWithCards, setEnquiriesWithCards] = useState([]);

    const { getCompanySuccess, companyData, getCompanyFailed, errorMessage } = useSelector((state) => ({
        getCompanySuccess: state.ComapnySlice.getCompanySuccess,
        companyData: state.ComapnySlice.companyData,
        getCompanyFailed: state.ComapnySlice.getCompanyFailed,
        errorMessage: state.ComapnySlice.errorMessage,
    }));

    // Helper function to format price type (remove underscores and capitalize)
    const formatPriceType = (priceType) => {
        if (!priceType || priceType === 'N/A') return '';
        
        // Remove underscores and capitalize each word
        return priceType
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    };

    useEffect(() => {
        if (location.state?.filteredData) {
            const data = location.state.filteredData;
            setEnquiryData(data);
            const enquiriesWithVisitingCards = data.filter(enquiry => 
                enquiry.visitingCard && enquiry.visitingCard.length > 0
            );
            setEnquiriesWithCards(enquiriesWithVisitingCards);
        }
        if (location.state?.filters) {
            setFilters(location.state.filters);
        }
    }, [location.state]);

    useEffect(() => {
        dispatch(getCompany());
    }, [dispatch]);

    useEffect(() => {
        if (getCompanySuccess && companyData?.data?.[0]) {
            const companyDataItem = companyData.data[0];
            setCompanyInfo({
                companyName: companyDataItem?.companyName || 'Enquiry Management System',
                companyMobile: companyDataItem?.companyMobile || '',
                companyAltMobile: companyDataItem?.companyAltMobile || '',
                companyMail: companyDataItem?.companyMail || '',
                companyAddressOne: companyDataItem?.companyAddressOne || '',
                companyGstNo: companyDataItem?.companyGstNo || '',
                companyAddressTwo: companyDataItem?.companyAddressTwo || '',
                logoPreview: companyDataItem?.companyLogo ? `${baseURL}${companyDataItem?.companyLogo}` : '',
            });
            dispatch(resetCompanyStatus());
        }
    }, [getCompanySuccess, companyData, dispatch]);

    // Calculate statistics
    const totalEnquiries = enquiryData.length;
    const totalProducts = enquiryData.reduce((sum, enquiry) => sum + enquiry.products.length, 0);
    const totalSamples = enquiryData.reduce((sum, enquiry) => sum + enquiry.totalSampleQty, 0);

    const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY');
    };

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        navigate(-1);
    };

    const formatMobileNumber = (number) => {
        if (!number) return '';
        const cleanNumber = number.toString().replace(/\D/g, '');
        
        if (cleanNumber.length > 12) {
            return (
                <div style={{ lineHeight: '1', fontSize: '8pt' }}>
                    <div>{cleanNumber.substring(0, 10)}</div>
                    <div>{cleanNumber.substring(10)}</div>
                </div>
            );
        }
        
        if (cleanNumber.length === 10) {
            return `${cleanNumber.substring(0, 5)} ${cleanNumber.substring(5)}`;
        }
        
        return cleanNumber;
    };

    const getTableData = () => {
        const tableData = [];
        enquiryData.forEach((enquiry, index) => {
            if (enquiry.products.length > 0) {
                enquiry.products.forEach((product, productIndex) => {
                    tableData.push({
                        sno: tableData.length + 1,
                        expoName: enquiry.expoName,
                        customerName: enquiry.name,
                        companyName: enquiry.companyName,
                        mobileNumber: enquiry.mobileNumber,
                        email: enquiry.email,
                        city: enquiry.city,
                        country: enquiry.country,
                        productCode: product.productCode,
                        productName: product.productName,
                        price: product.price,
                        priceType: product.priceType,
                        sampleRequiredQty: product.sampleRequiredQty,
                        natureOfEnquiry: enquiry.natureOfEnquiry,
                        remarks: enquiry.remarks,
                        enquiryDate: formatDate(enquiry.enquiryDate),
                        enquiryId: enquiry.id,
                    });
                });
            } else {
                tableData.push({
                    sno: index + 1,
                    expoName: enquiry.expoName,
                    customerName: enquiry.name,
                    companyName: enquiry.companyName,
                    mobileNumber: enquiry.mobileNumber,
                    email: enquiry.email,
                    city: enquiry.city,
                    country: enquiry.country,
                    productCode: 'N/A',
                    productName: 'N/A',
                    price: 'N/A',
                    priceType: '',
                    sampleRequiredQty: 0,
                    natureOfEnquiry: enquiry.natureOfEnquiry,
                    remarks: enquiry.remarks,
                    enquiryDate: formatDate(enquiry.enquiryDate),
                    enquiryId: enquiry.id,
                });
            }
        });
        return tableData;
    };

    const tableData = getTableData();

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div id="enquiry-report-to-print" className="bg-white mx-auto" style={{ 
                width: '277mm',
                minHeight: '190mm',
                height: 'auto'
            }}>
                {/* Header Section - Compact */}
                <div className="pb-1 mb-1" style={{ padding: '0' }}>
                    <div className="flex justify-between items-start" style={{ width: '100%' }}>
                        <div className="flex items-center">
                            {companyInfo.logoPreview && (
                                <img
                                    src={companyInfo.logoPreview}
                                    alt="Company Logo"
                                    crossOrigin="anonymous"
                                    style={{
                                        maxHeight: '35px',
                                        marginRight: '10px',
                                    }}
                                />
                            )}
                            <div>
                                <h1 className="font-bold text-gray-800" style={{ fontSize: '14pt', lineHeight: '1.1' }}>{companyInfo.companyName}</h1>
                                <p className="text-gray-600" style={{ fontSize: '9pt', lineHeight: '1.1' }}>
                                    {companyInfo.companyAddressOne}
                                    {companyInfo.companyAddressTwo && `, ${companyInfo.companyAddressTwo}`}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="font-bold text-blue-800 uppercase" style={{ fontSize: '12pt', lineHeight: '1.1' }}>ENQUIRY REPORT</h2>
                            <p className="text-gray-600" style={{ fontSize: '9pt', lineHeight: '1.1' }}>
                                {filters.startDate && filters.toDate 
                                    ? `${moment(filters.startDate).format('DD MMM YY')} to ${moment(filters.toDate).format('DD MMM YY')}`
                                    : 'All Time'
                                }
                            </p>
                            <p className="text-gray-500" style={{ fontSize: '8pt', lineHeight: '1.1' }}>Generated: {moment().format('DD/MM/YY HH:mm')}</p>
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%' }}> 
                    <table className="border-collapse border border-gray-300" style={{ 
                        width: '100%',
                        tableLayout: 'fixed',
                        fontSize: '9pt',
                        lineHeight: '1.2',
                        margin: '0',
                        padding: '0'
                    }}>
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 font-semibold text-gray-700 text-center p-1" style={{ width: '5%' }}>S.No</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-left p-1" style={{ width: '10%' }}>Expo</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-left p-1" style={{ width: '15%' }}>Customer & Company</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-left p-1" style={{ width: '9%' }}>Mobile</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-left p-1" style={{ width: '13%' }}>Email</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-left p-1" style={{ width: '11%' }}>City & Country</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-left p-1" style={{ width: '18%' }}>Product, Qty & Price Type</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-left p-1" style={{ width: '10%' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 align-top p-1 text-center" style={{ wordWrap: 'break-word' }}>{row.sno}</td>
                                    <td className="border border-gray-300 align-top p-1" style={{ wordWrap: 'break-word' }}>{row.expoName}</td>
                                    <td className="border border-gray-300 align-top p-1" style={{ wordWrap: 'break-word' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '9pt' }}>{row.customerName}</div>
                                        <div style={{ fontSize: '8pt', color: '#666' }}>{row.companyName}</div>
                                    </td>
                                    <td className="border border-gray-300 align-top p-1" style={{ 
                                        fontFamily: 'monospace',
                                        letterSpacing: '-0.5px',
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        lineHeight: '1.2'
                                    }}>
                                        {formatMobileNumber(row.mobileNumber)}
                                    </td>
                                    <td className="border border-gray-300 align-top p-1" style={{ 
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        lineHeight: '1.2'
                                    }}>{row.email}</td>
                                    <td className="border border-gray-300 align-top p-1" style={{ wordWrap: 'break-word' }}>
                                        <div style={{ fontSize: '9pt' }}>{row.city}</div>
                                        <div style={{ fontSize: '8pt', color: '#666' }}>{row.country}</div>
                                    </td>
                                    <td className="border border-gray-300 align-top p-1" style={{ wordWrap: 'break-word' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '9pt' }}>
                                            {row.productCode} - {row.productName}
                                        </div>
                                        {row.price && row.price !== 'N/A' && (
                                            <div style={{ fontSize: '8pt', color: '#059669', fontWeight: 'bold' }}>
                                                Price: ${row.price}
                                            </div>
                                        )}
                                        <div className="font-semibold" style={{ fontSize: '8pt', color: '#dc2626' }}>
                                            Qty: {row.sampleRequiredQty}
                                            {row.priceType && row.priceType !== 'N/A' && (
                                                <span style={{ color: '#7c3aed', fontSize: '7.5pt' }}>
                                                    {' '}- {formatPriceType(row.priceType)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 align-top p-1" style={{ wordWrap: 'break-word' ,fontSize: '9pt' }}>{row.enquiryDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Visiting Cards Section - Below the table */}
                {enquiriesWithCards.length > 0 && (
                    <div className="mt-6">
                        <div className="mb-3 pb-1 border-b border-gray-300">
                            <h3 className="font-bold text-blue-700" style={{ fontSize: '11pt' }}>
                                VISITING CARDS
                            </h3>
                            <p className="text-gray-600" style={{ fontSize: '9pt' }}>
                                Total: {enquiriesWithCards.length} enquiry(s) with visiting cards
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            {enquiriesWithCards.map((enquiry, index) => (
                                <div key={enquiry.id} className="border border-gray-200 rounded p-2" style={{ 
                                    backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white',
                                    breakInside: 'avoid'
                                }}>
                                    <div className="mb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-gray-800" style={{ fontSize: '10pt' }}>
                                                    {index + 1}. {enquiry.name || 'N/A'}
                                                </div>
                                                <div className="text-gray-700" style={{ fontSize: '9pt' }}>
                                                    {enquiry.companyName || 'N/A'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-gray-800" style={{ fontSize: '9pt' }}>
                                                    {enquiry.expoName}
                                                </div>
                                                <div className="text-gray-700" style={{ fontSize: '9pt' }}>
                                                    {formatMobileNumber(enquiry.mobileNumber)}
                                                </div>
                                                <div className="text-gray-600" style={{ fontSize: '8pt' }}>
                                                    {formatDate(enquiry.enquiryDate)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-1 text-gray-600" style={{ fontSize: '9pt' }}>
                                            {enquiry.city && `${enquiry.city}, `}{enquiry.country}
                                            {enquiry.email && enquiry.email !== 'N/A' && ` • ${enquiry.email}`}
                                        </div>
                                        {/* Products summary for the enquiry */}
                                        {enquiry.products && enquiry.products.length > 0 && (
                                            <div className="mt-1" style={{ fontSize: '8pt', color: '#4b5563' }}>
                                                Products: {enquiry.products.length} • 
                                                Total Qty: {enquiry.totalSampleQty} • 
                                                {enquiry.products.map((product, idx) => (
                                                    product.priceType && product.priceType !== 'N/A' && (
                                                        <span key={idx} style={{ marginLeft: '4px' }}>
                                                            {formatPriceType(product.priceType)}
                                                            {idx < enquiry.products.length - 1 ? ', ' : ''}
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Images container - exactly 5 per row */}
                                    <div className="flex flex-wrap justify-between" style={{ gap: '3mm' }}>
                                        {enquiry.visitingCard.map((card, cardIndex) => (
                                            <div key={cardIndex} className="text-center" style={{ 
                                                flex: '0 0 auto',
                                                width: '50mm'
                                            }}>
                                                <img
                                                    src={`${baseURL}${card}`}
                                                    alt={`Visiting Card ${cardIndex + 1}`}
                                                    crossOrigin="anonymous"
                                                    className="border border-gray-300 rounded"
                                                    style={{
                                                        width: '50mm',
                                                        height: '30mm',
                                                        objectFit: 'contain',
                                                        backgroundColor: '#ffffff'
                                                    }}
                                                />
                                                <div className="mt-1 text-gray-600" style={{ fontSize: '8pt' }}>
                                                    Card {cardIndex + 1}
                                                </div>
                                            </div>
                                        ))}
                                        {/* Fill empty spaces if less than 5 cards */}
                                        {enquiry.visitingCard.length < 5 && 
                                            Array.from({ length: 5 - enquiry.visitingCard.length }).map((_, idx) => (
                                                <div key={`empty-${idx}`} style={{ 
                                                    width: '50mm',
                                                    height: '30mm',
                                                    visibility: 'hidden'
                                                }}></div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer - Compact */}
                <div className="mt-4 pt-2 border-t border-gray-300 text-center">
                    <div className="flex justify-between text-gray-600 mb-1" style={{ fontSize: '9pt' }}>
                        <div>Total Enquiries: {totalEnquiries}</div>
                        <div>Total Products: {totalProducts}</div>
                        <div>Total Samples: {totalSamples}</div>
                    </div>
                    <p className="text-gray-500" style={{ fontSize: '8pt' }}>
                        Computer generated report • {moment().format('DD/MM/YY HH:mm')} • Total Records: {tableData.length}
                        {enquiriesWithCards.length > 0 && ` • Visiting Cards: ${enquiriesWithCards.length}`}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="d-print-none mt-6 flex justify-center gap-4">
                <button onClick={handleBack} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                    ← Back
                </button>
                <button onClick={handlePrint} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:blue-700 transition-colors font-medium">
                    🖨️ Print
                </button>
            </div>

            <style jsx>{`
                @media print {
                    /* Reset all margins and padding */
                    body, html {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        width: 100% !important;
                        height: auto !important;
                        overflow: visible !important;
                    }

                    /* Hide everything except the print content */
                    body * {
                        visibility: hidden;
                        margin: 0 !important;
                        padding: 0 !important;
                    }

                    #enquiry-report-to-print,
                    #enquiry-report-to-print * {
                        visibility: visible;
                    }

                    #enquiry-report-to-print {
                        position: relative !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 277mm !important;
                        min-height: 190mm !important;
                        height: auto !important;
                        margin: 0 auto !important;
                        padding: 5mm !important;
                        background: white !important;
                        box-shadow: none !important;
                        border: none !important;
                        overflow: visible !important;
                        page-break-after: always;
                    }

                    /* Hide navigation and other elements */
                    .d-print-none,
                    header,
                    nav,
                    .navbar,
                    .sidebar,
                    .action-buttons {
                        display: none !important;
                    }

                    /* Ensure table fits properly */
                    table {
                        width: 100% !important;
                        table-layout: fixed !important;
                        border-collapse: collapse !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        font-size: 9pt !important;
                        line-height: 1.2 !important;
                    }

                    th, td {
                        padding: 2px 3px !important;
                        border: 0.5px solid #000 !important;
                        font-size: 9pt !important;
                        line-height: 1.2 !important;
                        vertical-align: top !important;
                        margin: 0 !important;
                    }

                    /* Mobile number specific styling for print */
                    td:nth-child(4) {
                        font-family: 'Courier New', monospace !important;
                        letter-spacing: -0.5px !important;
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                        line-height: 1.2 !important;
                        font-size: 8.5pt !important;
                    }

                    /* Email specific styling for print */
                    td:nth-child(5) {
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                        line-height: 1.2 !important;
                        font-size: 8.5pt !important;
                    }

                    /* Product, Qty & Price Type column styling */
                    td:nth-child(7) {
                        font-size: 8.5pt !important;
                    }
                    
                    td:nth-child(7) > div:first-child {
                        font-weight: bold !important;
                        font-size: 9pt !important;
                    }
                    
                    td:nth-child(7) > div:nth-child(2) {
                        color: #059669 !important;
                        font-weight: bold !important;
                        margin-top: 1px !important;
                    }
                    
                    td:nth-child(7) > div:nth-child(3) {
                        color: #dc2626 !important;
                        font-weight: bold !important;
                        margin-top: 1px !important;
                    }
                    
                    td:nth-child(7) > div:nth-child(3) > span {
                        color: #7c3aed !important;
                        font-size: 7.5pt !important;
                        font-weight: normal !important;
                    }

                    /* Visiting cards section styling for print */
                    #enquiry-report-to-print > div:nth-child(3) {
                        margin-top: 5mm !important;
                    }
                    
                    #enquiry-report-to-print > div:nth-child(3) > div:first-child {
                        border-bottom: 0.5px solid #000 !important;
                        margin-bottom: 3mm !important;
                        padding-bottom: 1mm !important;
                    }
                    
                    #enquiry-report-to-print > div:nth-child(3) > div:first-child h3 {
                        font-weight: bold !important;
                        color: #1e40af !important;
                        font-size: 11pt !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    
                    #enquiry-report-to-print > div:nth-child(3) > div:first-child p {
                        color: #4b5563 !important;
                        font-size: 9pt !important;
                        margin: 1mm 0 0 0 !important;
                        padding: 0 !important;
                    }
                    
                    /* Enquiry card container */
                    #enquiry-report-to-print > div:nth-child(3) > div:nth-child(2) > div {
                        border: 0.5px solid #d1d5db !important;
                        border-radius: 1mm !important;
                        padding: 2mm !important;
                        margin-bottom: 2mm !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    
                    /* Products summary styling */
                    #enquiry-report-to-print > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) {
                        margin-top: 1mm !important;
                        color: #4b5563 !important;
                        font-size: 8pt !important;
                    }
                    
                    /* Images layout - exactly 5 per row */
                    #enquiry-report-to-print > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) {
                        display: flex !important;
                        flex-wrap: nowrap !important;
                        justify-content: space-between !important;
                        gap: 3mm !important;
                        width: 100% !important;
                    }
                    
                    /* Individual image container */
                    #enquiry-report-to-print > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > div {
                        flex: 0 0 auto !important;
                        width: 50mm !important;
                    }
                    
                    /* Image styling */
                    #enquiry-report-to-print > div:nth-child(3) img {
                        width: 50mm !important;
                        height: 30mm !important;
                        object-fit: contain !important;
                        border: 0.5px solid #d1d5db !important;
                        border-radius: 0.5mm !important;
                        background-color: #ffffff !important;
                    }
                    
                    /* Even row background for better readability */
                    #enquiry-report-to-print > div:nth-child(3) > div:nth-child(2) > div:nth-child(even) {
                        background-color: #f9fafb !important;
                    }
                    
                    /* Empty placeholder for consistent layout */
                    #enquiry-report-to-print > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > div[style*="visibility: hidden"] {
                        visibility: hidden !important;
                    }

                    /* Page setup for A4 landscape */
                    @page {
                        size: A4 landscape;
                        margin: 5mm;
                    }

                    /* Force colors to print */
                    @media print and (color) {
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            color-adjust: exact !important;
                        }
                    }

                    /* Allow page breaks inside table rows if needed */
                    tr {
                        page-break-inside: auto !important;
                        break-inside: auto !important;
                    }

                    thead {
                        display: table-header-group !important;
                    }

                    tbody {
                        display: table-row-group !important;
                    }

                    /* Ensure proper text wrapping */
                    th, td {
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                        hyphens: auto !important;
                    }

                    /* Allow multiple pages */
                    #enquiry-report-to-print {
                        page-break-inside: auto;
                    }

                    table {
                        page-break-inside: auto;
                    }

                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                    
                    /* Visiting card sections should stay together */
                    #enquiry-report-to-print > div:nth-child(3) > div:nth-child(2) > div {
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }
                }

                /* Screen styles */
                @media screen {
                    #enquiry-report-to-print {
                        padding: 15px;
                        border-radius: 4px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        background: white;
                        overflow: auto;
                        max-height: calc(100vh - 150px);
                    }

                    /* Better spacing for screen view */
                    #enquiry-report-to-print > div:first-child {
                        margin-bottom: 10px;
                    }

                    /* Table styling for screen */
                    table {
                        font-size: 9pt;
                    }

                    th, td {
                        padding: 3px 4px;
                        font-size: 9pt;
                    }

                    /* Mobile number styling for screen */
                    td:nth-child(4) {
                        font-family: 'Courier New', monospace;
                        letter-spacing: -0.5px;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        line-height: 1.2;
                        font-size: 8.5pt;
                    }

                    /* Email styling for screen */
                    td:nth-child(5) {
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        line-height: 1.2;
                        font-size: 8.5pt;
                    }

                    /* Product, Qty & Price Type column styling for screen */
                    td:nth-child(7) {
                        font-size: 8.5pt;
                    }
                    
                    td:nth-child(7) > div:first-child {
                        font-weight: bold;
                        font-size: 9pt;
                    }
                    
                    td:nth-child(7) > div:nth-child(2) {
                        color: #059669;
                        font-weight: bold;
                        margin-top: 2px;
                    }
                    
                    td:nth-child(7) > div:nth-child(3) {
                        color: #dc2626;
                        font-weight: bold;
                        margin-top: 2px;
                    }
                    
                    td:nth-child(7) > div:nth-child(3) > span {
                        color: #7c3aed;
                        font-size: 7.5pt;
                        font-weight: normal;
                    }

                    /* Visiting cards section styling for screen */
                    #enquiry-report-to-print > div:nth-child(3) {
                        margin-top: 16px;
                    }
                    
                    /* Images layout for screen */
                    #enquiry-report-to-print > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) {
                        display: flex;
                        flex-wrap: nowrap;
                        justify-content: space-between;
                        gap: 12px;
                        width: 100%;
                    }
                    
                    /* Individual image container for screen */
                    #enquiry-report-to-print > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > div {
                        width: calc((100% - 48px) / 5);
                    }
                    
                    /* Image styling for screen */
                    #enquiry-report-to-print > div:nth-child(3) img {
                        width: 100%;
                        height: 60px;
                        object-fit: contain;
                        border: 1px solid #d1d5db;
                        border-radius: 2px;
                        background-color: #ffffff;
                        transition: transform 0.2s;
                    }
                    
                    #enquiry-report-to-print > div:nth-child(3) img:hover {
                        transform: scale(1.8);
                        z-index: 10;
                        position: relative;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    }
                }

                /* Ensure proper text wrapping in table cells */
                .align-top {
                    vertical-align: top;
                }

                /* Better table cell text handling */
                td {
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }

                /* Force table to use all available space */
                table {
                    border-spacing: 0;
                }
            `}</style>
        </div>
    );
};

export default Index;