import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconCancel from '../../components/Icon/IconX';
import moment from 'moment';

const AuditPrintPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [auditData, setAuditData] = useState(null);
    const [companyInfo] = useState({
        companyName: 'ASIAN ELEVATORS PRIVATE LIMITED',
        companyAddress: 'Plot No. 77, MIDC, Additional Ambernath, Ambernath (East), Thane - 421506, Maharashtra, India',
        companyPhone: '+91 222 268 9000',
        companyEmail: 'info@asian.com',
        companyWebsite: 'www.asian.com'
    });

    // Static audit data for demonstration
    const staticAuditData = {
        auditId: 'AUD-2024-001',
        auditDate: '2024-01-15',
        visitDate: '2024-01-15',
        status: 'Completed',
        supplierName: 'Precision Engineering Works',
        supplierType: 'Machining & Fabrication',
        employeeCount: '85',
        productionCapacity: '5000 units/month',
        asianAuditorName: 'Rajesh Kumar',
        lastAuditDate: '2023-07-20',
        machineCount: '45',
        products: 'Elevator components, Metal brackets, CNC machined parts',
        supplierRepresentative: 'Mr. Sanjay Sharma',
        lastAuditScore: '78',
        currentScore: '85',
        transportAvailable: true,
        accommodationAvailable: false,
        animalsAllowed: false,
        
        checklists: [
            {
                id: 1,
                title: '1. MANAGEMENT SYSTEM & COMPLIANCE',
                order: 1,
                items: [
                    { id: 1.1, title: '1.1 Management System Requirement 1 - Quality Policy documented and communicated', selectedValue: 'yes', description: 'Quality policy clearly displayed in production area' },
                    { id: 1.2, title: '1.2 Management System Requirement 2 - Management review conducted quarterly', selectedValue: 'yes', description: 'Management review records available for last 4 quarters' },
                    { id: 1.3, title: '1.3 Management System Requirement 3 - Document control system implemented', selectedValue: 'yes', description: 'Electronic document control system in place' },
                    { id: 1.4, title: '1.4 Management System Requirement 4 - Records maintained for 3 years minimum', selectedValue: 'no', description: 'Some records available only for 2 years' },
                    { id: 1.5, title: '1.5 Management System Requirement 5 - Internal audit program established', selectedValue: 'yes', description: 'Internal audit schedule followed regularly' }
                ]
            },
            {
                id: 2,
                title: '2. HEALTH & SAFETY',
                order: 2,
                items: [
                    { id: 2.1, title: '2.1 Safety Requirement 1 - PPE provided to all workers', selectedValue: 'yes', description: 'Helmets, safety shoes, gloves provided' },
                    { id: 2.2, title: '2.2 Safety Requirement 2 - First aid kits available and maintained', selectedValue: 'yes', description: '4 first aid kits strategically placed' },
                    { id: 2.3, title: '2.3 Safety Requirement 3 - Fire extinguishers checked monthly', selectedValue: 'no', description: 'Last check was 45 days ago' },
                    { id: 2.4, title: '2.4 Safety Requirement 4 - Safety training conducted annually', selectedValue: 'yes', description: 'Last training conducted on 15-Dec-2023' },
                    { id: 2.5, title: '2.5 Safety Requirement 5 - Emergency exits clearly marked', selectedValue: 'yes', description: 'All exits properly marked and unobstructed' }
                ]
            },
            {
                id: 3,
                title: '3. ENVIRONMENTAL MANAGEMENT',
                order: 3,
                items: [
                    { id: 3.1, title: '3.1 Environmental Compliance 1 - Waste management system in place', selectedValue: 'yes', description: 'Segregation bins for recyclable waste' },
                    { id: 3.2, title: '3.2 Environmental Compliance 2 - Hazardous waste disposed properly', selectedValue: 'yes', description: 'Authorized agency collects hazardous waste' },
                    { id: 3.3, title: '3.3 Environmental Compliance 3 - Energy conservation measures', selectedValue: 'na', description: 'Not applicable for small facility' },
                    { id: 3.4, title: '3.4 Environmental Compliance 4 - Water conservation practices', selectedValue: 'yes', description: 'Water recycling system installed' },
                    { id: 3.5, title: '3.5 Environmental Compliance 5 - Pollution control equipment maintained', selectedValue: 'yes', description: 'Dust collectors functioning properly' }
                ]
            },
            {
                id: 4,
                title: '4. QUALITY CONTROL',
                order: 4,
                items: [
                    { id: 4.1, title: '4.1 Quality Standard 1 - Incoming material inspection', selectedValue: 'yes', description: 'All raw materials checked before use' },
                    { id: 4.2, title: '4.2 Quality Standard 2 - In-process quality checks', selectedValue: 'yes', description: 'Checkpoints at each production stage' },
                    { id: 4.3, title: '4.3 Quality Standard 3 - Final inspection before dispatch', selectedValue: 'yes', description: '100% inspection for critical components' },
                    { id: 4.4, title: '4.4 Quality Standard 4 - Calibration of measuring instruments', selectedValue: 'no', description: '3 instruments overdue for calibration' },
                    { id: 4.5, title: '4.5 Quality Standard 5 - Non-conforming product control', selectedValue: 'yes', description: 'Separate area for rejected materials' }
                ]
            },
            {
                id: 5,
                title: '5. PRODUCTION FACILITIES',
                order: 5,
                items: [
                    { id: 5.1, title: '5.1 Facility Requirement 1 - Adequate space for operations', selectedValue: 'yes', description: 'Production area well organized' },
                    { id: 5.2, title: '5.2 Facility Requirement 2 - Proper lighting in work areas', selectedValue: 'yes', description: 'LED lighting installed throughout' },
                    { id: 5.3, title: '5.3 Facility Requirement 3 - Ventilation system adequate', selectedValue: 'no', description: 'Poor ventilation in grinding section' },
                    { id: 5.4, title: '5.4 Facility Requirement 4 - Housekeeping standards maintained', selectedValue: 'yes', description: '5S implementation visible' },
                    { id: 5.5, title: '5.5 Facility Requirement 5 - Equipment layout optimized', selectedValue: 'yes', description: 'Material flow smooth and efficient' }
                ]
            }
        ],
        
        workerInterviews: [
            {
                id: 1,
                name: 'Ramesh Patel',
                designation: 'CNC Operator',
                natureOfWork: 'Machine operation and maintenance',
                questions: [
                    { question: 'Are you provided with proper safety equipment?', response: 'Yes, we get all required PPE' },
                    { question: 'Is training provided for new machines?', response: 'Yes, supervisor provides training' }
                ]
            },
            {
                id: 2,
                name: 'Sunita Desai',
                designation: 'Quality Inspector',
                natureOfWork: 'Final quality checking',
                questions: [
                    { question: 'Are quality standards clearly defined?', response: 'Yes, we have checklists for each product' },
                    { question: 'How are quality issues reported?', response: 'We fill non-conformance reports' }
                ]
            }
        ],
        
        auditorRemarks: 'Overall, the supplier shows good compliance with most requirements. Major non-conformities were found in fire safety equipment maintenance and instrument calibration. The supplier has shown willingness to address these issues. Production facilities are well-maintained and quality systems are effectively implemented.',
        
        externalProviderComments: 'The audit process was professional and thorough. We appreciate the constructive feedback. We will implement corrective actions for the non-conformities within 30 days. Thank you for the opportunity to improve our systems.'
    };

    useEffect(() => {
        // Use either passed data or static data
        if (location.state?.auditData) {
            setAuditData(location.state.auditData);
        } else {
            setAuditData(staticAuditData);
        }
    }, [location.state]);

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        navigate(-1);
    };

    const formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY');
    };

    // Calculate scores
    const calculateScores = () => {
        const data = auditData || staticAuditData;
        let totalItems = 0;
        let yesCount = 0;
        let noCount = 0;
        let naCount = 0;
        
        data.checklists?.forEach(checklist => {
            checklist.items?.forEach(item => {
                totalItems++;
                if (item.selectedValue === 'yes') yesCount++;
                else if (item.selectedValue === 'no') noCount++;
                else if (item.selectedValue === 'na') naCount++;
            });
        });
        
        const completionPercentage = totalItems > 0 ? Math.round((yesCount + noCount + naCount) / totalItems * 100) : 0;
        const compliancePercentage = totalItems > 0 ? Math.round(yesCount / totalItems * 100) : 0;
        
        return {
            totalItems,
            yesCount,
            noCount,
            naCount,
            completionPercentage,
            compliancePercentage
        };
    };

    const scores = calculateScores();
    const data = auditData || staticAuditData;

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            {/* Printable Area */}
            <div id="audit-report-to-print" className="bg-white mx-auto" style={{ 
                width: '210mm',
                minHeight: '297mm',
                height: 'auto',
                padding: '15mm'
            }}>
                {/* Header */}
                <div className="mb-6 pb-4 border-b border-gray-300">
                    <table width="100%" cellPadding="0" cellSpacing="0">
                        <tr>
                            <td width="60%" valign="top">
                                <div style={{ fontSize: '20pt', fontWeight: 'bold', color: '#1e40af' }}>
                                    ASIAN ELEVATORS
                                </div>
                                <div style={{ fontSize: '9pt', color: '#4b5563', marginTop: '2px' }}>
                                    {companyInfo.companyAddress}
                                </div>
                                <div style={{ fontSize: '9pt', color: '#4b5563' }}>
                                    Tel: {companyInfo.companyPhone} | Email: {companyInfo.companyEmail} | Web: {companyInfo.companyWebsite}
                                </div>
                            </td>
                            <td width="40%" valign="top" align="right">
                                <div style={{ fontSize: '16pt', fontWeight: 'bold', color: '#1f2937' }}>
                                    SUPPLIER COMPLIANCE AUDIT REPORT
                                </div>
                                <div style={{ fontSize: '10pt', color: '#6b7280', marginTop: '4px' }}>
                                    Audit ID: <span style={{ fontWeight: 'bold' }}>{data.auditId}</span>
                                </div>
                                <div style={{ fontSize: '10pt', color: '#6b7280' }}>
                                    Date: {formatDate(data.auditDate)}
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                {/* Supplier Information */}
                <div className="mb-6">
                    <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', borderBottom: '2px solid #3b82f6', paddingBottom: '3px' }}>
                        SUPPLIER INFORMATION
                    </div>
                    
                    <table width="100%" cellPadding="4" cellSpacing="0" style={{ fontSize: '10pt' }}>
                        <tr>
                            <td width="25%" style={{ fontWeight: 'bold', color: '#4b5563' }}>Supplier Name:</td>
                            <td width="25%" style={{ borderBottom: '1px dotted #d1d5db' }}>{data.supplierName}</td>
                            <td width="25%" style={{ fontWeight: 'bold', color: '#4b5563' }}>Supplier Type:</td>
                            <td width="25%" style={{ borderBottom: '1px dotted #d1d5db' }}>{data.supplierType}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold', color: '#4b5563' }}>Contact Person:</td>
                            <td style={{ borderBottom: '1px dotted #d1d5db' }}>{data.supplierRepresentative}</td>
                            <td style={{ fontWeight: 'bold', color: '#4b5563' }}>Number of Employees:</td>
                            <td style={{ borderBottom: '1px dotted #d1d5db' }}>{data.employeeCount}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold', color: '#4b5563' }}>Production Capacity:</td>
                            <td style={{ borderBottom: '1px dotted #d1d5db' }}>{data.productionCapacity}</td>
                            <td style={{ fontWeight: 'bold', color: '#4b5563' }}>Number of Machines:</td>
                            <td style={{ borderBottom: '1px dotted #d1d5db' }}>{data.machineCount}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold', color: '#4b5563' }}>Products/Services:</td>
                            <td colSpan="3" style={{ borderBottom: '1px dotted #d1d5db' }}>{data.products}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold', color: '#4b5563' }}>Audit Date:</td>
                            <td style={{ borderBottom: '1px dotted #d1d5db' }}>{formatDate(data.visitDate)}</td>
                            <td style={{ fontWeight: 'bold', color: '#4b5563' }}>Last Audit Date:</td>
                            <td style={{ borderBottom: '1px dotted #d1d5db' }}>{formatDate(data.lastAuditDate)}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold', color: '#4b5563' }}>Auditor Name:</td>
                            <td style={{ borderBottom: '1px dotted #d1d5db' }}>{data.asianAuditorName}</td>
                            <td style={{ fontWeight: 'bold', color: '#4b5563' }}>Audit Status:</td>
                            <td style={{ borderBottom: '1px dotted #d1d5db' }}>{data.status}</td>
                        </tr>
                    </table>
                </div>

                {/* Audit Summary Statistics */}
                <div className="mb-8" style={{ border: '1px solid #e5e7eb', padding: '12px', borderRadius: '4px', backgroundColor: '#f9fafb' }}>
                    <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                        AUDIT SUMMARY
                    </div>
                    
                    <table width="100%" cellPadding="8" cellSpacing="0">
                        <tr>
                            <td width="20%" align="center" valign="middle">
                                <div style={{ fontSize: '20pt', fontWeight: 'bold', color: '#059669' }}>{scores.compliancePercentage}%</div>
                                <div style={{ fontSize: '9pt', color: '#4b5563' }}>Compliance Score</div>
                            </td>
                            <td width="20%" align="center" valign="middle">
                                <div style={{ fontSize: '20pt', fontWeight: 'bold', color: '#3b82f6' }}>{scores.completionPercentage}%</div>
                                <div style={{ fontSize: '9pt', color: '#4b5563' }}>Completion Rate</div>
                            </td>
                            <td width="20%" align="center" valign="middle">
                                <div style={{ fontSize: '20pt', fontWeight: 'bold', color: '#1f2937' }}>{scores.totalItems}</div>
                                <div style={{ fontSize: '9pt', color: '#4b5563' }}>Total Items</div>
                            </td>
                            <td width="20%" align="center" valign="middle">
                                <div style={{ fontSize: '20pt', fontWeight: 'bold', color: '#10b981' }}>{scores.yesCount}</div>
                                <div style={{ fontSize: '9pt', color: '#4b5563' }}>Yes</div>
                            </td>
                            <td width="20%" align="center" valign="middle">
                                <div style={{ fontSize: '20pt', fontWeight: 'bold', color: '#ef4444' }}>{scores.noCount}</div>
                                <div style={{ fontSize: '9pt', color: '#4b5563' }}>No</div>
                            </td>
                        </tr>
                    </table>
                    
                    <div style={{ marginTop: '10px', fontSize: '9pt', color: '#6b7280', textAlign: 'center' }}>
                        Last Audit Score: {data.lastAuditScore}% | Current Score: {data.currentScore}% | Improvement: {parseInt(data.currentScore) - parseInt(data.lastAuditScore)}%
                    </div>
                </div>

                {/* Audit Checklist Results */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '14pt', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', borderBottom: '2px solid #ef4444', paddingBottom: '4px' }}>
                        AUDIT CHECKLIST RESULTS
                    </div>
                    
                    {/* Checklist 1 */}
                    <div style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
                        <div style={{ backgroundColor: '#1e40af', color: 'white', padding: '6px 10px', fontSize: '11pt', fontWeight: 'bold', marginBottom: '5px' }}>
                            1. MANAGEMENT SYSTEM & COMPLIANCE
                        </div>
                        
                        <table width="100%" cellPadding="3" cellSpacing="0" border="1" style={{ borderColor: '#d1d5db', fontSize: '9pt', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f3f4f6' }}>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>S.No</th>
                                    <th width="50%" style={{ padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Activity / Requirement</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>Yes</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>No</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>N/A</th>
                                    <th width="30%" style={{ padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Details / Observations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.checklists[0].items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{item.id.toFixed(1)}</td>
                                        <td style={{ padding: '4px', verticalAlign: 'top' }}>{item.title}</td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'yes' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'no' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'na' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', verticalAlign: 'top', fontSize: '8.5pt' }}>{item.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Checklist 2 */}
                    <div style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
                        <div style={{ backgroundColor: '#059669', color: 'white', padding: '6px 10px', fontSize: '11pt', fontWeight: 'bold', marginBottom: '5px' }}>
                            2. HEALTH & SAFETY
                        </div>
                        
                        <table width="100%" cellPadding="3" cellSpacing="0" border="1" style={{ borderColor: '#d1d5db', fontSize: '9pt', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f3f4f6' }}>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>S.No</th>
                                    <th width="50%" style={{ padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Activity / Requirement</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>Yes</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>No</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>N/A</th>
                                    <th width="30%" style={{ padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Details / Observations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.checklists[1].items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{item.id.toFixed(1)}</td>
                                        <td style={{ padding: '4px', verticalAlign: 'top' }}>{item.title}</td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'yes' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'no' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'na' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', verticalAlign: 'top', fontSize: '8.5pt' }}>{item.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Checklist 3 */}
                    <div style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
                        <div style={{ backgroundColor: '#7c3aed', color: 'white', padding: '6px 10px', fontSize: '11pt', fontWeight: 'bold', marginBottom: '5px' }}>
                            3. ENVIRONMENTAL MANAGEMENT
                        </div>
                        
                        <table width="100%" cellPadding="3" cellSpacing="0" border="1" style={{ borderColor: '#d1d5db', fontSize: '9pt', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f3f4f6' }}>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>S.No</th>
                                    <th width="50%" style={{ padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Activity / Requirement</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>Yes</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>No</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>N/A</th>
                                    <th width="30%" style={{ padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Details / Observations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.checklists[2].items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{item.id.toFixed(1)}</td>
                                        <td style={{ padding: '4px', verticalAlign: 'top' }}>{item.title}</td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'yes' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'no' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'na' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', verticalAlign: 'top', fontSize: '8.5pt' }}>{item.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Checklist 4 */}
                    <div style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
                        <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '6px 10px', fontSize: '11pt', fontWeight: 'bold', marginBottom: '5px' }}>
                            4. QUALITY CONTROL
                        </div>
                        
                        <table width="100%" cellPadding="3" cellSpacing="0" border="1" style={{ borderColor: '#d1d5db', fontSize: '9pt', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f3f4f6' }}>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>S.No</th>
                                    <th width="50%" style={{ padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Activity / Requirement</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>Yes</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>No</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>N/A</th>
                                    <th width="30%" style={{ padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Details / Observations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.checklists[3].items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{item.id.toFixed(1)}</td>
                                        <td style={{ padding: '4px', verticalAlign: 'top' }}>{item.title}</td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'yes' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'no' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'na' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', verticalAlign: 'top', fontSize: '8.5pt' }}>{item.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Checklist 5 */}
                    <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
                        <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '6px 10px', fontSize: '11pt', fontWeight: 'bold', marginBottom: '5px' }}>
                            5. PRODUCTION FACILITIES
                        </div>
                        
                        <table width="100%" cellPadding="3" cellSpacing="0" border="1" style={{ borderColor: '#d1d5db', fontSize: '9pt', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f3f4f6' }}>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>S.No</th>
                                    <th width="50%" style={{ padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Activity / Requirement</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>Yes</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>No</th>
                                    <th width="5%" style={{ padding: '4px', textAlign: 'center', fontWeight: 'bold' }}>N/A</th>
                                    <th width="30%" style={{ padding: '4px', textAlign: 'left', fontWeight: 'bold' }}>Details / Observations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.checklists[4].items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>{item.id.toFixed(1)}</td>
                                        <td style={{ padding: '4px', verticalAlign: 'top' }}>{item.title}</td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'yes' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'no' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', textAlign: 'center', verticalAlign: 'top' }}>
                                            {item.selectedValue === 'na' ? '✓' : ''}
                                        </td>
                                        <td style={{ padding: '4px', verticalAlign: 'top', fontSize: '8.5pt' }}>{item.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Worker Interviews */}
                <div style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
                    <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', borderBottom: '2px solid #8b5cf6', paddingBottom: '3px' }}>
                        WORKER INTERVIEWS
                    </div>
                    
                    {data.workerInterviews.map((interview, index) => (
                        <div key={interview.id} style={{ marginBottom: '10px', border: '1px solid #e5e7eb', padding: '8px', borderRadius: '4px', backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white' }}>
                            <div style={{ fontSize: '10pt', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
                                Interview {index + 1}: {interview.name} - {interview.designation}
                            </div>
                            <div style={{ fontSize: '9pt', color: '#4b5563', marginBottom: '6px' }}>
                                Nature of Work: {interview.natureOfWork}
                            </div>
                            <div style={{ marginLeft: '10px' }}>
                                {interview.questions.map((question, qIndex) => (
                                    <div key={qIndex} style={{ marginBottom: '4px' }}>
                                        <div style={{ fontSize: '9pt', fontWeight: '500', color: '#374151' }}>
                                            Q{qIndex + 1}: {question.question}
                                        </div>
                                        <div style={{ fontSize: '9pt', color: '#6b7280', marginLeft: '15px' }}>
                                            A: {question.response}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Auditor Remarks */}
                <div style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
                    <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', borderBottom: '2px solid #10b981', paddingBottom: '3px' }}>
                        AUDITOR REMARKS & OBSERVATIONS
                    </div>
                    
                    <div style={{ border: '1px solid #d1fae5', backgroundColor: '#ecfdf5', padding: '10px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '10pt', color: '#065f46', lineHeight: '1.5' }}>
                            {data.auditorRemarks}
                        </div>
                    </div>
                </div>

                {/* External Provider Comments */}
                <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
                    <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', borderBottom: '2px solid #3b82f6', paddingBottom: '3px' }}>
                        EXTERNAL PROVIDER COMMENTS
                    </div>
                    
                    <div style={{ border: '1px solid #dbeafe', backgroundColor: '#eff6ff', padding: '10px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '10pt', color: '#1e40af', lineHeight: '1.5' }}>
                            {data.externalProviderComments}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ borderTop: '2px solid #1e40af', paddingTop: '10px', marginTop: '20px' }}>
                    <table width="100%" cellPadding="4" cellSpacing="0" style={{ fontSize: '9pt' }}>
                        <tr>
                            <td width="33%" valign="top">
                                <div style={{ fontWeight: 'bold', color: '#1e40af' }}>AUDIT CONCLUSION</div>
                                <div style={{ color: '#059669', fontWeight: 'bold', fontSize: '10pt', marginTop: '4px' }}>
                                    {scores.compliancePercentage >= 70 ? 'SATISFACTORY - Supplier meets compliance requirements' : 
                                     scores.compliancePercentage >= 50 ? 'NEEDS IMPROVEMENT - Some areas require attention' : 
                                     'UNSATISFACTORY - Major improvements needed'}
                                </div>
                            </td>
                            <td width="34%" valign="top" align="center">
                                <div style={{ fontWeight: 'bold', color: '#1e40af' }}>AUDITOR SIGNATURE</div>
                                <div style={{ marginTop: '20px', borderTop: '1px solid #000', width: '60%', margin: '20px auto 0' }}>
                                    <div style={{ textAlign: 'center', fontSize: '9pt', paddingTop: '4px' }}>
                                        {data.asianAuditorName}
                                    </div>
                                </div>
                            </td>
                            <td width="33%" valign="top" align="right">
                                <div style={{ fontWeight: 'bold', color: '#1e40af' }}>SUPPLIER ACKNOWLEDGEMENT</div>
                                <div style={{ marginTop: '20px', borderTop: '1px solid #000', width: '60%', marginLeft: 'auto' }}>
                                    <div style={{ textAlign: 'center', fontSize: '9pt', paddingTop: '4px' }}>
                                        {data.supplierRepresentative}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                    
                    <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '8pt', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
                        <div>Computer Generated Audit Report • Document No: AUD-{data.auditId} • Version: 1.0</div>
                        <div>Generated on: {moment().format('DD/MM/YYYY HH:mm:ss')} • Page 1 of 1</div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="d-print-none mt-6 flex justify-center gap-4">
                <button 
                    onClick={handleBack}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                    ← Back
                </button>
                <button 
                    onClick={handlePrint}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <IconPrinter className="inline w-4 h-4 mr-2" />
                    Print Report
                </button>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    body, html {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        width: 210mm !important;
                        height: auto !important;
                    }

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
                    }

                    .d-print-none,
                    header,
                    nav,
                    .navbar,
                    .sidebar,
                    .action-buttons {
                        display: none !important;
                    }

                    @page {
                        size: A4 portrait;
                        margin: 15mm;
                    }

                    @media print and (color) {
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            color-adjust: exact !important;
                        }
                    }

                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        font-size: 9pt !important;
                        line-height: 1.2 !important;
                    }

                    th, td {
                        padding: 3px 4px !important;
                        border: 0.5px solid #000 !important;
                        font-size: 9pt !important;
                        line-height: 1.2 !important;
                        vertical-align: top !important;
                    }

                    #audit-report-to-print > div {
                        margin-bottom: 8mm !important;
                    }

                    #audit-report-to-print > div:last-child {
                        position: relative !important;
                        bottom: 0 !important;
                        margin-top: 10mm !important;
                    }

                    /* Table header colors */
                    div[style*="background-color: #1e40af"] {
                        background-color: #1e40af !important;
                        color: white !important;
                    }
                    
                    div[style*="background-color: #059669"] {
                        background-color: #059669 !important;
                        color: white !important;
                    }
                    
                    div[style*="background-color: #7c3aed"] {
                        background-color: #7c3aed !important;
                        color: white !important;
                    }
                    
                    div[style*="background-color: #dc2626"] {
                        background-color: #dc2626 !important;
                        color: white !important;
                    }
                    
                    div[style*="background-color: #f59e0b"] {
                        background-color: #f59e0b !important;
                        color: white !important;
                    }

                    /* Background colors */
                    tr[style*="background-color: #f3f4f6"] {
                        background-color: #f3f4f6 !important;
                    }
                    
                    div[style*="background-color: #f9fafb"] {
                        background-color: #f9fafb !important;
                    }
                    
                    div[style*="background-color: #f8fafc"] {
                        background-color: #f8fafc !important;
                    }
                    
                    div[style*="background-color: #ecfdf5"] {
                        background-color: #ecfdf5 !important;
                    }
                    
                    div[style*="background-color: #eff6ff"] {
                        background-color: #eff6ff !important;
                    }

                    /* Border colors */
                    div[style*="border: 1px solid #d1fae5"] {
                        border: 1px solid #d1fae5 !important;
                    }
                    
                    div[style*="border: 1px solid #dbeafe"] {
                        border: 1px solid #dbeafe !important;
                    }

                    /* Text colors */
                    div[style*="color: #065f46"] {
                        color: #065f46 !important;
                    }
                    
                    div[style*="color: #1e40af"] {
                        color: #1e40af !important;
                    }
                    
                    div[style*="color: #059669"] {
                        color: #059669 !important;
                    }
                }

                /* Screen styles */
                @media screen {
                    #audit-report-to-print {
                        border-radius: 4px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        background: white;
                        overflow: auto;
                        max-height: calc(100vh - 150px);
                        margin-bottom: 20px;
                    }

                    #audit-report-to-print::-webkit-scrollbar {
                        width: 8px;
                    }

                    #audit-report-to-print::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 4px;
                    }

                    #audit-report-to-print::-webkit-scrollbar-thumb {
                        background: #c1c1c1;
                        border-radius: 4px;
                    }

                    #audit-report-to-print::-webkit-scrollbar-thumb:hover {
                        background: #a1a1a1;
                    }
                }
            `}</style>
        </div>
    );
};

export default AuditPrintPage;