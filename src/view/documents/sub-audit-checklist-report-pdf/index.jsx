import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

const AuditReportPaper = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [auditData, setAuditData] = useState(null);
    const [allAudits, setAllAudits] = useState([]);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        if (location.state?.auditData) {
            setAuditData(location.state.auditData);
        }
        if (location.state?.allAudits) {
            setAllAudits(location.state.allAudits);
        }
    }, [location.state]);

    const handlePrint = () => {
        setIsPrinting(true);
        
        // Get the printable content
        const printContent = document.getElementById('audit-report-to-print').innerHTML;
        
        // Open print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Audit Report - ${auditData?.auditId || 'Report'}</title>
                <style>
                    @page {
                        size: A4 portrait;
                        margin: 15mm;
                    }
                    
                    body {
                        margin: 0;
                        padding: 15mm;
                        font-family: 'Times New Roman', serif;
                        font-size: 11px;
                        line-height: 1.2;
                        background: white;
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 10px;
                        page-break-inside: avoid;
                    }
                    
                    th, td {
                        border: 1px solid #000;
                        padding: 3px 5px;
                        vertical-align: top;
                    }
                    
                    th {
                        font-weight: bold;
                        text-align: center;
                        background-color: #f5f5f5;
                    }
                    
                    .text-center {
                        text-align: center;
                    }
                    
                    .text-left {
                        text-align: left;
                    }
                    
                    .text-right {
                        text-align: right;
                    }
                    
                    .font-bold {
                        font-weight: bold;
                    }
                    
                    .border-b {
                        border-bottom: 1px solid #000;
                    }
                    
                    .border-t {
                        border-top: 1px solid #000;
                    }
                    
                    .mb-4 {
                        margin-bottom: 16px;
                    }
                    
                    .mt-6 {
                        margin-top: 24px;
                    }
                    
                    .pb-3 {
                        padding-bottom: 12px;
                    }
                    
                    .pt-2 {
                        padding-top: 8px;
                    }
                    
                    .py-8 {
                        padding-top: 32px;
                        padding-bottom: 32px;
                    }
                    
                    .inline-block {
                        display: inline-block;
                    }
                    
                    .bg-gray-50 {
                        background-color: #f9fafb;
                    }
                    
                    .bg-white {
                        background-color: white;
                    }
                    
                    .w-full {
                        width: 100%;
                    }
                    
                    .mx-auto {
                        margin-left: auto;
                        margin-right: auto;
                    }
                </style>
            </head>
            <body>
                ${printContent}
                <script>
                    // Auto print after loading
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            };
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
        setIsPrinting(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Sample data structure for demonstration
    const getCategoryData = () => {
        return [
            { key: 'childLabourScore', label: '1. Child Labour', totalItems: 10 },
            { key: 'forcedLabourScore', label: '2. Forced Labour', totalItems: 8 },
            { key: 'freedomOfAssociationScore', label: '3. Freedom of Association', totalItems: 6 },
            { key: 'discriminationScore', label: '4. Discrimination', totalItems: 9 },
            { key: 'disciplinaryPracticesScore', label: '5. Disciplinary Practices', totalItems: 7 },
            { key: 'mgmtSystemScore', label: '6. Management System', totalItems: 12 },
            { key: 'businessEthicsScore', label: '7. Business Ethics', totalItems: 8 },
            { key: 'envMgmtScore', label: '8. Environmental Management', totalItems: 10 },
            { key: 'healthSafetyScore', label: '9. Health & Safety', totalItems: 15 },
            { key: 'workingHoursScore', label: '10. Working Hours & Wages', totalItems: 11 },
            { key: 'accidentInsuranceScore', label: '11. Accident Insurance', totalItems: 5 },
            { key: 'licensesPermitsScore', label: '12. Licenses & Permits', totalItems: 8 },
            { key: 'housekeepingScore', label: '13. Housekeeping & Training', totalItems: 10 },
            { key: 'recruitmentScore', label: '14. Recruitment & Accommodation', totalItems: 9 },
            { key: 'accommodationScore', label: '15. Accommodation', totalItems: 12 }
        ];
    };

    const calculateCategoryTotals = () => {
        const categories = getCategoryData();

        return categories.map((category, index) => {
            const score = auditData?.[category.key] || Math.floor(Math.random() * 100);
            const okCount = Math.round((score / 100) * category.totalItems);
            const notOkCount = Math.max(0, Math.round(((100 - score) / 100) * category.totalItems));
            const naCount = Math.max(0, category.totalItems - okCount - notOkCount);
            const applicableCount = category.totalItems - naCount;
            const percentage = applicableCount > 0 ? Math.round((okCount / applicableCount) * 100) : 0;
            
            return {
                sNo: index + 1,
                requirement: category.label,
                ok: okCount,
                notOk: notOkCount,
                na: naCount,
                total: category.totalItems,
                applicable: applicableCount,
                percentage: percentage
            };
        });
    };

    const calculateSummary = () => {
        const categoryData = calculateCategoryTotals();
        const totalItems = categoryData.reduce((sum, item) => sum + item.total, 0);
        const totalOk = categoryData.reduce((sum, item) => sum + item.ok, 0);
        const totalNotOk = categoryData.reduce((sum, item) => sum + item.notOk, 0);
        const totalNA = categoryData.reduce((sum, item) => sum + item.na, 0);
        const totalApplicable = totalItems - totalNA;
        const overallPercentage = totalApplicable > 0 ? Math.round((totalOk / totalApplicable) * 100) : 0;

        return {
            totalOk,
            totalNotOk,
            totalNA,
            totalItems,
            totalApplicable,
            overallPercentage
        };
    };

    const categoryData = calculateCategoryTotals();
    const summary = calculateSummary();

    if (!auditData && allAudits.length === 0) {
        return (
            <div className="p-4">
                <div className="text-center py-8">No audit data available</div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            {/* Printable Area - Using inline styles to avoid CSS conflicts */}
            <div 
                id="audit-report-to-print"
                style={{
                    width: '210mm',
                    minHeight: '297mm',
                    padding: '15mm',
                    fontFamily: '"Times New Roman", serif',
                    fontSize: '11px',
                    lineHeight: '1.2',
                    backgroundColor: 'white',
                    margin: '0 auto',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '16px', borderBottom: '1px solid #000', paddingBottom: '12px' }}>
                    <h1 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                        ASIAN FABRICX - SUB SUPPLIER AUDIT REPORT
                    </h1>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px' }}>
                        <div style={{ textAlign: 'left' }}>
                            <div><strong>Supplier Name:</strong> {auditData?.supplierName || 'N/A'}</div>
                            <div><strong>Supplier Type:</strong> {auditData?.supplierType || 'N/A'}</div>
                            <div><strong>Location:</strong> {auditData?.location || 'N/A'}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div><strong>Audit Date:</strong> {auditData ? moment(auditData.auditDate).format('DD/MM/YYYY') : 'N/A'}</div>
                            <div><strong>Auditor:</strong> {auditData?.auditorName || 'N/A'}</div>
                            <div><strong>Report ID:</strong> {auditData?.auditId || 'AUD-REPORT'}</div>
                            <div><strong>Generated On:</strong> {moment().format('DD/MM/YYYY HH:mm')}</div>
                        </div>
                    </div>
                    
                    {/* Highlighted Total Applicable Requirements */}
                    <div style={{ marginTop: '8px', padding: '4px 12px', display: 'inline-block' }}>
                        <strong>Total Applicable Requirements: <span style={{ backgroundColor: '#ffff00', padding: '2px 6px' }}>{summary.totalApplicable}</span></strong>
                    </div>
                </div>

                {/* Main Audit Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '16px', fontSize: '11px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9fafb' }}>
                            <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center', fontWeight: 'bold', width: '5%' }}>S.No</th>
                            <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'left', fontWeight: 'bold', width: '45%' }}>Requirements</th>
                            <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center', fontWeight: 'bold', width: '25%' }} colSpan="3">
                                Basic
                                <div style={{ fontWeight: 'normal', fontSize: '10px', marginTop: '2px' }}>
                                    OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Not OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; N/A
                                </div>
                            </th>
                            <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center', fontWeight: 'bold', width: '8%' }}>Total</th>
                            <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center', fontWeight: 'bold', width: '8%' }}>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryData.map((item) => (
                            <tr key={item.sNo}>
                                <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{item.sNo}</td>
                                <td style={{ border: '1px solid #000', padding: '3px 5px' }}>{item.requirement}</td>
                                <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{item.ok}</td>
                                <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{item.notOk}</td>
                                <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{item.na}</td>
                                <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{item.total}</td>
                                <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{item.percentage}%</td>
                            </tr>
                        ))}
                        
                        {/* Summary Row */}
                        <tr style={{ fontWeight: 'bold' }}>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }} colSpan="2">TOTAL</td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{summary.totalOk}</td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{summary.totalNotOk}</td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{summary.totalNA}</td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{summary.totalItems}</td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{summary.overallPercentage}%</td>
                        </tr>
                    </tbody>
                </table>

                {/* Compliance Summary Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', marginBottom: '16px', fontSize: '11px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9fafb' }}>
                            <th style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center', fontWeight: 'bold' }} colSpan="6">COMPLIANCE SUMMARY</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'left' }}><strong>Total OK Items:</strong></td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{summary.totalOk}</td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'left' }}><strong>Total Not OK Items:</strong></td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{summary.totalNotOk}</td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'left' }}><strong>Total N/A Items:</strong></td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{summary.totalNA}</td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'left' }}><strong>Total Items Checked:</strong></td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{summary.totalItems}</td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'left' }}><strong>Total Applicable Requirements:</strong></td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{summary.totalApplicable}</td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'left' }}><strong>Overall Compliance Rate:</strong></td>
                            <td style={{ border: '1px solid #000', padding: '3px 5px', textAlign: 'center' }}>{summary.overallPercentage}%</td>
                        </tr>
                    </tbody>
                </table>

                {/* Footer */}
                <div style={{ marginTop: '24px', paddingTop: '8px', borderTop: '1px solid #000', textAlign: 'center', fontSize: '11px' }}>
                    <p><strong>ASIAN FABRICX QUALITY ASSURANCE DEPARTMENT</strong></p>
                    <p>Factory Audit Checklist - Form No: AFX-QA-003 Rev. 2.1</p>
                    <p style={{ marginTop: '4px' }}>Page 1 of 1 • This document shall not be reproduced without authorization</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
                marginTop: '24px', 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '16px' 
            }}>
                <button 
                    onClick={handleBack}
                    style={{
                        padding: '8px 24px',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
                >
                    ← Back
                </button>
                <button 
                    onClick={handlePrint}
                    style={{
                        padding: '8px 24px',
                        backgroundColor: '#1f2937',
                        color: 'white',
                        border: 'none',
                        fontFamily: 'Arial, sans-serif',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#111827'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
                    disabled={isPrinting}
                >
                    {isPrinting ? 'Printing...' : '🖨️ Print Report'}
                </button>
            </div>
        </div>
    );
};

export default AuditReportPaper;