import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

const AuditReportPDF = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [auditData, setAuditData] = useState([]);
    const [filters, setFilters] = useState({});
    const [companyInfo, setCompanyInfo] = useState({});
    const [summaryStats, setSummaryStats] = useState({});
    const [selectedAudit, setSelectedAudit] = useState(null);

    useEffect(() => {
        if (location.state?.auditData) {
            // If single audit is passed
            setSelectedAudit(location.state.auditData);
            setAuditData([location.state.auditData]);
        } else if (location.state?.allAudits) {
            // If multiple audits are passed (from export all)
            setAuditData(location.state.allAudits);
        } else if (location.state?.filteredData) {
            // If filtered data is passed
            setAuditData(location.state.filteredData);
        }

        if (location.state?.filters) {
            setFilters(location.state.filters);
        }
    }, [location.state]);

    useEffect(() => {
        // Set company info (you might want to fetch this from your API)
        setCompanyInfo({
            companyName: 'ASIAN FABRIC X',
            companyAddress: '123 Textile Street, Mumbai, India - 400001',
            companyGstNo: 'GSTIN123456789',
            companyEmail: 'info@asianfabricx.com',
            companyPhone: '+91 9876543210',
        });

        // Calculate summary statistics
        if (auditData.length > 0) {
            const stats = {
                totalAudits: auditData.length,
                avgScore: Math.round(auditData.reduce((sum, audit) => sum + audit.currentScore, 0) / auditData.length),
                completed: auditData.filter(a => a.status === 'Completed').length,
                inProgress: auditData.filter(a => a.status === 'In Progress').length,
                pendingReview: auditData.filter(a => a.status === 'Pending Review').length,
                mainSuppliers: auditData.filter(a => a.supplierType === 'Main Supplier').length,
                subSuppliers: auditData.filter(a => a.supplierType === 'Sub Supplier').length,
                totalImages: auditData.reduce((sum, audit) => sum + (audit.images ? audit.images.length : 0), 0),
            };
            setSummaryStats(stats);
        }
    }, [auditData]);

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-700';
        if (score >= 80) return 'text-blue-700';
        if (score >= 70) return 'text-yellow-700';
        if (score >= 60) return 'text-orange-700';
        return 'text-red-700';
    };

    const getScoreBgColor = (score) => {
        if (score >= 90) return 'bg-green-100';
        if (score >= 80) return 'bg-blue-100';
        if (score >= 70) return 'bg-yellow-100';
        if (score >= 60) return 'bg-orange-100';
        return 'bg-red-100';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'text-green-700 bg-green-100';
            case 'In Progress':
                return 'text-blue-700 bg-blue-100';
            case 'Pending Review':
                return 'text-yellow-700 bg-yellow-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
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

    const renderProgressBar = (score, width = '100%', height = '6px') => {
        const color = score >= 90 ? '#10b981' : 
                     score >= 80 ? '#3b82f6' : 
                     score >= 70 ? '#f59e0b' : 
                     score >= 60 ? '#f97316' : '#ef4444';
        
        return (
            <div style={{ 
                width: width, 
                backgroundColor: '#e5e7eb', 
                borderRadius: '4px', 
                height: height,
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${score}%`,
                    backgroundColor: color,
                    height: '100%',
                    borderRadius: '4px'
                }}></div>
            </div>
        );
    };

    const getTableData = () => {
        const tableData = [];
        auditData.forEach((audit, index) => {
            tableData.push({
                sno: index + 1,
                auditId: audit.auditId,
                supplierName: audit.supplierName,
                supplierType: audit.supplierType,
                auditDate: moment(audit.auditDate).format('DD/MM/YYYY'),
                auditorName: audit.auditorName,
                lastScore: audit.lastAuditScore,
                currentScore: audit.currentScore,
                status: audit.status,
                improvement: audit.currentScore - audit.lastAuditScore,
                childLabour: audit.childLabourScore,
                forcedLabour: audit.forcedLabourScore,
                freedomAssoc: audit.freedomOfAssociationScore,
                discrimination: audit.discriminationScore,
                mgmtSystem: audit.mgmtSystemScore,
                businessEthics: audit.businessEthicsScore,
                envMgmt: audit.envMgmtScore,
                healthSafety: audit.healthSafetyScore,
                imagesCount: audit.images ? audit.images.length : 0,
            });
        });
        return tableData;
    };

    const tableData = getTableData();

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div id="audit-report-to-print" className="bg-white mx-auto" style={{ 
                width: '277mm',
                minHeight: '190mm',
                height: 'auto'
            }}>
                {/* Header Section */}
                <div className="pb-2 mb-2" style={{ padding: '0', borderBottom: '2px solid #e5e7eb' }}>
                    <div className="flex justify-between items-start" style={{ width: '100%' }}>
                        <div>
                            <h1 className="font-bold text-gray-800" style={{ fontSize: '18pt', lineHeight: '1.1' }}>
                                {companyInfo.companyName}
                            </h1>
                            <p className="text-gray-600" style={{ fontSize: '10pt', lineHeight: '1.1' }}>
                                {companyInfo.companyAddress}
                            </p>
                            <p className="text-gray-500" style={{ fontSize: '9pt', lineHeight: '1.1' }}>
                                GST: {companyInfo.companyGstNo} • {companyInfo.companyEmail} • {formatMobileNumber(companyInfo.companyPhone)}
                            </p>
                        </div>
                        <div className="text-right">
                            <h2 className="font-bold text-blue-800 uppercase" style={{ fontSize: '14pt', lineHeight: '1.1' }}>
                                SUPPLIER AUDIT REPORT
                            </h2>
                            <p className="text-gray-600" style={{ fontSize: '10pt', lineHeight: '1.1' }}>
                                {filters.startDate && filters.toDate 
                                    ? `${moment(filters.startDate).format('DD MMM YY')} to ${moment(filters.toDate).format('DD MMM YY')}`
                                    : 'All Audits'
                                }
                            </p>
                            <p className="text-gray-500" style={{ fontSize: '9pt', lineHeight: '1.1' }}>
                                Generated: {moment().format('DD/MM/YYYY HH:mm')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Statistics */}
                <div className="mb-4" style={{ padding: '4px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <div className="grid grid-cols-3 gap-2" style={{ fontSize: '9pt' }}>
                        <div className="text-center">
                            <div className="font-bold text-blue-700" style={{ fontSize: '11pt' }}>
                                {summaryStats.totalAudits || 0}
                            </div>
                            <div className="text-gray-600">Total Audits</div>
                        </div>
                        <div className="text-center">
                            <div className={`font-bold ${getScoreColor(summaryStats.avgScore || 0)}`} style={{ fontSize: '11pt' }}>
                                {summaryStats.avgScore || 0}%
                            </div>
                            <div className="text-gray-600">Average Score</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-indigo-700" style={{ fontSize: '11pt' }}>
                                {summaryStats.totalImages || 0}
                            </div>
                            <div className="text-gray-600">Total Images</div>
                        </div>
                    </div>
                </div>

                {/* Main Audit Table */}
                <div style={{ width: '100%', marginBottom: '10px' }}>
                    <table className="border-collapse border border-gray-300" style={{ 
                        width: '100%',
                        tableLayout: 'fixed',
                        fontSize: '8.5pt',
                        lineHeight: '1.2'
                    }}>
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 font-semibold text-gray-700 text-center p-1" style={{ width: '3%' }}>S.No</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-left p-1" style={{ width: '8%' }}>Audit ID</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-left p-1" style={{ width: '15%' }}>Supplier Details</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-left p-1" style={{ width: '7%' }}>Auditor</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-center p-1" style={{ width: '5%' }}>Scores</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-center p-1" style={{ width: '5%' }}>Status</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-left p-1" style={{ width: '7%' }}>Date</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-center p-1" style={{ width: '8%' }}>Key Checklist Scores</th>
                                <th className="border border-gray-300 font-semibold text-gray-700 text-center p-1" style={{ width: '4%' }}>Images</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 align-top p-1 text-center" style={{ wordWrap: 'break-word' }}>
                                        {row.sno}
                                    </td>
                                    <td className="border border-gray-300 align-top p-1" style={{ wordWrap: 'break-word' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '9pt' }}>{row.auditId}</div>
                                    </td>
                                    <td className="border border-gray-300 align-top p-1" style={{ wordWrap: 'break-word' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '9pt' }}>{row.supplierName}</div>
                                        <div style={{ fontSize: '8pt', color: '#666' }}>
                                            {row.supplierType}
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 align-top p-1" style={{ wordWrap: 'break-word' }}>
                                        {row.auditorName}
                                    </td>
                                    <td className="border border-gray-300 align-top p-1" style={{ wordWrap: 'break-word' }}>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span style={{ fontSize: '7.5pt' }}>Last:</span>
                                                <span style={{ 
                                                    fontSize: '8pt', 
                                                    fontWeight: 'bold',
                                                    padding: '1px 4px',
                                                    borderRadius: '4px',
                                                    backgroundColor: getScoreBgColor(row.lastScore).replace('bg-', '')
                                                }} className={getScoreColor(row.lastScore)}>
                                                    {row.lastScore}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span style={{ fontSize: '7.5pt' }}>Current:</span>
                                                <span style={{ 
                                                    fontSize: '8pt', 
                                                    fontWeight: 'bold',
                                                    padding: '1px 4px',
                                                    borderRadius: '4px',
                                                    backgroundColor: getScoreBgColor(row.currentScore).replace('bg-', '')
                                                }} className={getScoreColor(row.currentScore)}>
                                                    {row.currentScore}%
                                                </span>
                                            </div>
                                            <div className={`text-center ${row.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`} style={{ fontSize: '7pt' }}>
                                                {row.improvement >= 0 ? '▲' : '▼'} {Math.abs(row.improvement)}%
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 align-top p-1 text-center" style={{ wordWrap: 'break-word' }}>
                                        <span style={{ 
                                            padding: '2px 6px',
                                            borderRadius: '12px',
                                            fontSize: '7.5pt',
                                            fontWeight: 'bold',
                                            display: 'inline-block',
                                            backgroundColor: getStatusColor(row.status).split(' ')[1].replace('bg-', ''),
                                            color: getStatusColor(row.status).split(' ')[0].replace('text-', '')
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 align-top p-1" style={{ wordWrap: 'break-word', fontSize: '8pt' }}>
                                        {row.auditDate}
                                    </td>
                                    <td className="border border-gray-300 align-top p-1" style={{ wordWrap: 'break-word' }}>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span style={{ fontSize: '7pt' }}>Child Labour:</span>
                                                <span style={{ 
                                                    fontSize: '7.5pt', 
                                                    fontWeight: 'bold',
                                                    color: row.childLabour === 100 ? '#059669' : '#dc2626'
                                                }}>
                                                    {row.childLabour}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span style={{ fontSize: '7pt' }}>Health & Safety:</span>
                                                <span style={{ 
                                                    fontSize: '7.5pt', 
                                                    fontWeight: 'bold',
                                                    color: row.healthSafety >= 70 ? '#059669' : '#dc2626'
                                                }}>
                                                    {row.healthSafety}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span style={{ fontSize: '7pt' }}>Env Mgmt:</span>
                                                <span style={{ 
                                                    fontSize: '7.5pt', 
                                                    fontWeight: 'bold',
                                                    color: row.envMgmt >= 70 ? '#059669' : '#dc2626'
                                                }}>
                                                    {row.envMgmt}%
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 align-top p-1 text-center" style={{ wordWrap: 'break-word' }}>
                                        <div style={{ 
                                            width: '20px', 
                                            height: '20px', 
                                            borderRadius: '50%',
                                            backgroundColor: row.imagesCount > 0 ? '#4f46e5' : '#d1d5db',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                            fontSize: '7.5pt',
                                            fontWeight: 'bold'
                                        }}>
                                            {row.imagesCount}
                                        </div>
                                        <div style={{ fontSize: '7pt', color: '#666', marginTop: '2px' }}>
                                            Images
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Detailed Score Breakdown for Selected Audit */}
                {selectedAudit && (
                    <div className="mt-6" style={{ pageBreakBefore: 'always' }}>
                        <div className="mb-3 pb-1 border-b border-gray-300">
                            <h3 className="font-bold text-blue-700" style={{ fontSize: '12pt' }}>
                                DETAILED AUDIT REPORT - {selectedAudit.auditId}
                            </h3>
                            <p className="text-gray-600" style={{ fontSize: '9pt' }}>
                                Supplier: {selectedAudit.supplierName} • Type: {selectedAudit.supplierType} • 
                                Auditor: {selectedAudit.auditorName} • Date: {moment(selectedAudit.auditDate).format('DD/MM/YYYY')}
                            </p>
                        </div>
                        
                        {/* Score Summary */}
                        <div className="mb-4">
                            <div className="grid grid-cols-4 gap-2" style={{ fontSize: '9pt' }}>
                                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                                    <div className="font-bold text-gray-700">Last Score</div>
                                    <div className={`text-2xl font-bold ${getScoreColor(selectedAudit.lastAuditScore)}`}>
                                        {selectedAudit.lastAuditScore}%
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-2 rounded border border-blue-200 text-center">
                                    <div className="font-bold text-blue-700">Current Score</div>
                                    <div className={`text-2xl font-bold ${getScoreColor(selectedAudit.currentScore)}`}>
                                        {selectedAudit.currentScore}%
                                    </div>
                                </div>
                                <div className={`p-2 rounded border ${selectedAudit.currentScore >= selectedAudit.lastAuditScore ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} text-center`}>
                                    <div className={`font-bold ${selectedAudit.currentScore >= selectedAudit.lastAuditScore ? 'text-green-700' : 'text-red-700'}`}>
                                        Improvement
                                    </div>
                                    <div className={`text-2xl font-bold ${selectedAudit.currentScore >= selectedAudit.lastAuditScore ? 'text-green-600' : 'text-red-600'}`}>
                                        {selectedAudit.currentScore >= selectedAudit.lastAuditScore ? '+' : ''}
                                        {selectedAudit.currentScore - selectedAudit.lastAuditScore}%
                                    </div>
                                </div>
                                <div className="bg-indigo-50 p-2 rounded border border-indigo-200 text-center">
                                    <div className="font-bold text-indigo-700">Status</div>
                                    <div className="text-lg font-bold" style={{ 
                                        color: getStatusColor(selectedAudit.status).split(' ')[0].replace('text-', '')
                                    }}>
                                        {selectedAudit.status}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checklist Scores Grid */}
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2" style={{ fontSize: '10pt' }}>
                                Checklist Scores Breakdown
                            </h4>
                            <div className="grid grid-cols-3 gap-2" style={{ fontSize: '8.5pt' }}>
                                {[
                                    { label: '1. Child Labour', score: selectedAudit.childLabourScore },
                                    { label: '2. Forced Labour', score: selectedAudit.forcedLabourScore },
                                    { label: '3. Freedom of Association', score: selectedAudit.freedomOfAssociationScore },
                                    { label: '4. Discrimination', score: selectedAudit.discriminationScore },
                                    { label: '5. Management System', score: selectedAudit.mgmtSystemScore },
                                    { label: '6. Business Ethics', score: selectedAudit.businessEthicsScore },
                                    { label: '7. Environmental Management', score: selectedAudit.envMgmtScore },
                                    { label: '8. Health & Safety', score: selectedAudit.healthSafetyScore },
                                    { label: '9. Working Hours', score: selectedAudit.workingHoursScore },
                                    { label: '10. Accident Insurance', score: selectedAudit.accidentInsuranceScore },
                                    { label: '11. Licenses & Permits', score: selectedAudit.licensesPermitsScore },
                                    { label: '12. Housekeeping', score: selectedAudit.housekeepingScore },
                                    { label: '13. Recruitment', score: selectedAudit.recruitmentScore },
                                    { label: '14. Accommodation', score: selectedAudit.accommodationScore },
                                    { label: '15. Transport', score: selectedAudit.transportScore },
                                ].map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded p-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-gray-700">{item.label}</span>
                                            <span style={{ 
                                                fontSize: '8pt', 
                                                fontWeight: 'bold',
                                                padding: '1px 6px',
                                                borderRadius: '4px',
                                                backgroundColor: getScoreBgColor(item.score).replace('bg-', ''),
                                                color: getScoreColor(item.score).replace('text-', '')
                                            }}>
                                                {item.score}%
                                            </span>
                                        </div>
                                        {renderProgressBar(item.score, '100%', '4px')}
                                        <div className="text-center mt-1" style={{ 
                                            fontSize: '7pt',
                                            color: item.score === 100 ? '#059669' : 
                                                   item.score >= 70 ? '#3b82f6' : '#dc2626'
                                        }}>
                                            {item.score === 100 ? 'Fully Compliant' : 
                                             item.score >= 70 ? 'Partially Compliant' : 
                                             'Needs Improvement'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Images Section if available */}
                        {selectedAudit.images && selectedAudit.images.length > 0 && (
                            <div className="mt-4">
                                <div className="mb-2 pb-1 border-b border-gray-300">
                                    <h4 className="font-bold text-blue-700" style={{ fontSize: '10pt' }}>
                                        AUDIT EVIDENCE IMAGES ({selectedAudit.images.length})
                                    </h4>
                                </div>
                                
                                <div className="space-y-3">
                                    {selectedAudit.images.map((image, index) => (
                                        <div key={image.id} className="border border-gray-200 rounded p-2" style={{ 
                                            backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white'
                                        }}>
                                            <div className="flex">
                                                <div style={{ width: '80mm', marginRight: '4mm' }}>
                                                    <div className="font-bold text-gray-800 mb-1" style={{ fontSize: '9pt' }}>
                                                        {index + 1}. {image.title}
                                                    </div>
                                                    <div className="text-gray-700 mb-2" style={{ fontSize: '8pt' }}>
                                                        {image.description}
                                                    </div>
                                                    <div className="text-gray-600" style={{ fontSize: '7.5pt' }}>
                                                        Checklist: {image.checklistId} • Item: {image.itemId} • 
                                                        Uploaded: {moment(image.uploadDate).format('DD/MM/YYYY')}
                                                    </div>
                                                </div>
                                                <div style={{ width: '50mm' }}>
                                                    <div style={{ 
                                                        width: '50mm', 
                                                        height: '30mm',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '2px',
                                                        backgroundColor: '#f3f4f6',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <div style={{ 
                                                            textAlign: 'center',
                                                            color: '#6b7280',
                                                            fontSize: '8pt'
                                                        }}>
                                                            [Image: {image.title}]
                                                            <br />
                                                            <span style={{ fontSize: '7pt' }}>URL: {image.url.substring(0, 30)}...</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 text-center text-gray-600" style={{ fontSize: '7pt' }}>
                                                        Evidence Image
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-6 pt-2 border-t border-gray-300 text-center">
                    <div className="flex justify-between text-gray-600 mb-1" style={{ fontSize: '9pt' }}>
                        <div>Total Audits: {summaryStats.totalAudits}</div>
                        <div>Completed: {summaryStats.completed} • In Progress: {summaryStats.inProgress} • Pending: {summaryStats.pendingReview}</div>
                        <div>Main Suppliers: {summaryStats.mainSuppliers} • Sub Suppliers: {summaryStats.subSuppliers}</div>
                    </div>
                    <p className="text-gray-500" style={{ fontSize: '8pt' }}>
                        Computer generated audit report • {moment().format('DD/MM/YYYY HH:mm')} • 
                        Total Records: {tableData.length} • 
                        {summaryStats.totalImages > 0 && ` Evidence Images: ${summaryStats.totalImages}`}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="d-print-none mt-6 flex justify-center gap-4">
                <button onClick={handleBack} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                    ← Back
                </button>
                <button onClick={handlePrint} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
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

                    #audit-report-to-print,
                    #audit-report-to-print * {
                        visibility: visible;
                    }

                    #audit-report-to-print {
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
                        font-size: 8.5pt !important;
                        line-height: 1.2 !important;
                    }

                    th, td {
                        padding: 2px 3px !important;
                        border: 0.5px solid #000 !important;
                        font-size: 8.5pt !important;
                        line-height: 1.2 !important;
                        vertical-align: top !important;
                        margin: 0 !important;
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

                    /* Allow page breaks */
                    #audit-report-to-print {
                        page-break-inside: auto;
                    }

                    table {
                        page-break-inside: auto;
                    }

                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }

                    /* Detailed report should start on new page */
                    #audit-report-to-print > div:nth-child(4) {
                        page-break-before: always !important;
                    }

                    /* Ensure proper text wrapping */
                    th, td {
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                        hyphens: auto !important;
                    }

                    /* Colors for score cells */
                    .text-green-700 { color: #047857 !important; }
                    .text-blue-700 { color: #1d4ed8 !important; }
                    .text-yellow-700 { color: #a16207 !important; }
                    .text-orange-700 { color: #c2410c !important; }
                    .text-red-700 { color: #b91c1c !important; }
                    
                    .bg-green-100 { background-color: #dcfce7 !important; }
                    .bg-blue-100 { background-color: #dbeafe !important; }
                    .bg-yellow-100 { background-color: #fef3c7 !important; }
                    .bg-orange-100 { background-color: #ffedd5 !important; }
                    .bg-red-100 { background-color: #fee2e2 !important; }

                    /* Status colors */
                    .text-green-700.bg-green-100 { 
                        color: #047857 !important; 
                        background-color: #dcfce7 !important; 
                    }
                    .text-blue-700.bg-blue-100 { 
                        color: #1d4ed8 !important; 
                        background-color: #dbeafe !important; 
                    }
                    .text-yellow-700.bg-yellow-100 { 
                        color: #a16207 !important; 
                        background-color: #fef3c7 !important; 
                    }
                }

                /* Screen styles */
                @media screen {
                    #audit-report-to-print {
                        padding: 15px;
                        border-radius: 4px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        background: white;
                        overflow: auto;
                        max-height: calc(100vh - 150px);
                    }

                    /* Table styling for screen */
                    table {
                        font-size: 8.5pt;
                    }

                    th, td {
                        padding: 3px 4px;
                    }

                    /* Images section for screen */
                    #audit-report-to-print > div:nth-child(4) {
                        margin-top: 20px;
                    }

                    /* Progress bars for screen */
                    .progress-bar {
                        transition: width 0.3s ease;
                    }
                }

                /* Ensure proper text wrapping */
                .align-top {
                    vertical-align: top;
                }

                td {
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }

                /* Force table to use all available space */
                table {
                    border-spacing: 0;
                }

                /* Custom scrollbar for screen */
                @media screen {
                    #audit-report-to-print::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }

                    #audit-report-to-print::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 4px;
                    }

                    #audit-report-to-print::-webkit-scrollbar-thumb {
                        background: #888;
                        border-radius: 4px;
                    }

                    #audit-report-to-print::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                }
            `}</style>
        </div>
    );
};

export default AuditReportPDF;