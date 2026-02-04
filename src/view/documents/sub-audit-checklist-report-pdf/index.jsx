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
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 100);
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
        <div className="p-4 bg-white min-h-screen d-print-none">
            <div id="audit-report-to-print" className="bg-white mx-auto" style={{ 
                width: '210mm',
                minHeight: '297mm',
                padding: '15mm',
                fontFamily: 'Times New Roman, serif',
                fontSize: '11px',
                lineHeight: '1.2'
            }}>
                {/* Header */}
                <div className="text-center mb-4 border-b border-black pb-3">
                    <h1 className="text-lg font-bold mb-3" style={{ fontSize: '18px' }}>
                        ASIAN FABRICX - SUB SUPPLIER AUDIT REPORT
                    </h1>
                    <div className="flex justify-between text-xs mb-2">
                        <div className="text-left">
                            <div><strong>Supplier Name:</strong> {auditData?.supplierName || 'N/A'}</div>
                            <div><strong>Supplier Type:</strong> {auditData?.supplierType || 'N/A'}</div>
                            <div><strong>Location:</strong> {auditData?.location || 'N/A'}</div>
                        </div>
                        <div className="text-right">
                            <div><strong>Audit Date:</strong> {auditData ? moment(auditData.auditDate).format('DD/MM/YYYY') : 'N/A'}</div>
                            <div><strong>Auditor:</strong> {auditData?.auditorName || 'N/A'}</div>
                            <div><strong>Report ID:</strong> {auditData?.auditId || 'AUD-REPORT'}</div>
                            <div><strong>Generated On:</strong> {moment().format('DD/MM/YYYY HH:mm')}</div>
                        </div>
                    </div>
                    
                    {/* Highlighted Total Applicable Requirements */}
                    <div className="mt-2 py-1 px-3 inline-block ">
                        <strong>Total Applicable Requirements: <span style={{ backgroundColor: 'yellow' }}>{summary.totalApplicable}</span></strong>
                    </div>
                </div>

                {/* Main Audit Table */}
                <table className="w-full border-collapse border border-black mb-4 text-xs">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-black p-1 text-center font-bold" style={{ width: '5%' }}>S.No</th>
                            <th className="border border-black p-1 text-left font-bold" style={{ width: '45%' }}>Requirements</th>
                            <th className="border border-black p-1 text-center font-bold" style={{ width: '25%' }} colSpan="3">
                                Basic
                                <div className="font-normal" style={{ fontSize: '10px', marginTop: '2px' }}>
                                    OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Not OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; N/A
                                </div>
                            </th>
                            <th className="border border-black p-1 text-center font-bold" style={{ width: '8%' }}>Total</th>
                            <th className="border border-black p-1 text-center font-bold" style={{ width: '8%' }}>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryData.map((item) => (
                            <tr key={item.sNo}>
                                <td className="border border-black p-1 text-center">{item.sNo}</td>
                                <td className="border border-black p-1">{item.requirement}</td>
                                <td className="border border-black p-1 text-center">{item.ok}</td>
                                <td className="border border-black p-1 text-center">{item.notOk}</td>
                                <td className="border border-black p-1 text-center">{item.na}</td>
                                <td className="border border-black p-1 text-center">{item.total}</td>
                                <td className="border border-black p-1 text-center">{item.percentage}%</td>
                            </tr>
                        ))}
                        
                        {/* Summary Row */}
                        <tr className="font-bold">
                            <td className="border border-black p-1 text-center" colSpan="2">TOTAL</td>
                            <td className="border border-black p-1 text-center">{summary.totalOk}</td>
                            <td className="border border-black p-1 text-center">{summary.totalNotOk}</td>
                            <td className="border border-black p-1 text-center">{summary.totalNA}</td>
                            <td className="border border-black p-1 text-center">{summary.totalItems}</td>
                            <td className="border border-black p-1 text-center">{summary.overallPercentage}%</td>
                        </tr>
                    </tbody>
                </table>

                {/* Compliance Summary Table */}
                <table className="w-full border-collapse border border-black mb-4 text-xs">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-black p-1 text-center font-bold" colSpan="6">COMPLIANCE SUMMARY</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 text-left"><strong>Total OK Items:</strong></td>
                            <td className="border border-black p-1 text-center">{summary.totalOk}</td>
                            <td className="border border-black p-1 text-left"><strong>Total Not OK Items:</strong></td>
                            <td className="border border-black p-1 text-center">{summary.totalNotOk}</td>
                            <td className="border border-black p-1 text-left"><strong>Total N/A Items:</strong></td>
                            <td className="border border-black p-1 text-center">{summary.totalNA}</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-1 text-left"><strong>Total Items Checked:</strong></td>
                            <td className="border border-black p-1 text-center">{summary.totalItems}</td>
                            <td className="border border-black p-1 text-left"><strong>Total Applicable Requirements:</strong></td>
                            <td className="border border-black p-1 text-center">{summary.totalApplicable}</td>
                            <td className="border border-black p-1 text-left"><strong>Overall Compliance Rate:</strong></td>
                            <td className="border border-black p-1 text-center">{summary.overallPercentage}%</td>
                        </tr>
                    </tbody>
                </table>

                {/* Footer */}
                <div className="mt-6 pt-2 border-t border-black text-center text-xs">
                    <p><strong>ASIAN FABRICX QUALITY ASSURANCE DEPARTMENT</strong></p>
                    <p>Factory Audit Checklist - Form No: AFX-QA-003 Rev. 2.1</p>
                    <p className="mt-1">Page 1 of 1 • This document shall not be reproduced without authorization</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="d-print-none mt-6 flex justify-center gap-4">
                <button onClick={handleBack} className="px-6 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors font-medium"
                        style={{ fontFamily: 'Arial, sans-serif', borderRadius: '0' }}>
                    ← Back
                </button>
                <button onClick={handlePrint} className="px-6 py-2 bg-gray-800 text-white hover:bg-black transition-colors font-medium"
                        style={{ fontFamily: 'Arial, sans-serif', borderRadius: '0' }}>
                    🖨️ Print Report
                </button>
            </div>

            <style jsx global>{`
                @media print {
                    body, html {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        font-family: 'Times New Roman', serif !important;
                        font-size: 11px !important;
                    }

                    body * {
                        visibility: hidden !important;
                    }

                    #audit-report-to-print {
                        visibility: visible !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 210mm !important;
                        min-height: 297mm !important;
                        margin: 0 !important;
                        padding: 15mm !important;
                        background: white !important;
                        box-shadow: none !important;
                        border: none !important;
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }

                    #audit-report-to-print * {
                        visibility: visible !important;
                    }

                    .d-print-none {
                        display: none !important;
                    }

                    @page {
                        size: A4 portrait;
                        margin: 15mm;
                    }
                }
            `}</style>
        </div>
    );
};

export default AuditReportPaper;