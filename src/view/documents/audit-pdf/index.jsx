import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IconPrinter from '../../../components/Icon/IconPrinter';
import IconCancel from '../../../components/Icon/IconX';
import moment from 'moment';

const AuditPrintPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [auditData, setAuditData] = useState(null);
    const [companyInfo] = useState({
        companyName: 'Asian Fabrics Private Limited',
        companyAddress: 'S/F No. 746/1&2. 751/1&2, Manmangalam Village,Semmadai, Karur – 639 006, Tamilnadu, India.',
        companyPhone: '9787799935',
        companyEmail: 'asian@asianfab.com',
        companyWebsite: 'www.asianfab.com',
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
                    {
                        id: 1.1,
                        title: '1.1 Management System Requirement 1 - Quality Policy documented and communicated',
                        selectedValue: 'yes',
                        description: 'Quality policy clearly displayed in production area',
                    },
                    {
                        id: 1.2,
                        title: '1.2 Management System Requirement 2 - Management review conducted quarterly',
                        selectedValue: 'yes',
                        description: 'Management review records available for last 4 quarters',
                    },
                    { id: 1.3, title: '1.3 Management System Requirement 3 - Document control system implemented', selectedValue: 'yes', description: 'Electronic document control system in place' },
                    { id: 1.4, title: '1.4 Management System Requirement 4 - Records maintained for 3 years minimum', selectedValue: 'no', description: 'Some records available only for 2 years' },
                    { id: 1.5, title: '1.5 Management System Requirement 5 - Internal audit program established', selectedValue: 'yes', description: 'Internal audit schedule followed regularly' },
                ],
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
                    { id: 2.5, title: '2.5 Safety Requirement 5 - Emergency exits clearly marked', selectedValue: 'yes', description: 'All exits properly marked and unobstructed' },
                ],
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
                    { id: 3.5, title: '3.5 Environmental Compliance 5 - Pollution control equipment maintained', selectedValue: 'yes', description: 'Dust collectors functioning properly' },
                ],
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
                    { id: 4.5, title: '4.5 Quality Standard 5 - Non-conforming product control', selectedValue: 'yes', description: 'Separate area for rejected materials' },
                ],
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
                    { id: 5.5, title: '5.5 Facility Requirement 5 - Equipment layout optimized', selectedValue: 'yes', description: 'Material flow smooth and efficient' },
                ],
            },
            {
                id: 6,
                title: '6. WORKER WELFARE',
                order: 6,
                items: [
                    { id: 6.1, title: '6.1 Worker Welfare 1 - Clean drinking water available', selectedValue: 'yes', description: 'RO water purifiers installed' },
                    { id: 6.2, title: '6.2 Worker Welfare 2 - Sanitary facilities maintained', selectedValue: 'yes', description: 'Clean washrooms available' },
                    { id: 6.3, title: '6.3 Worker Welfare 3 - Rest area provided', selectedValue: 'yes', description: 'Dedicated rest area with seating' },
                    { id: 6.4, title: '6.4 Worker Welfare 4 - First aid training provided', selectedValue: 'no', description: 'No first aid training conducted' },
                    { id: 6.5, title: '6.5 Worker Welfare 5 - Working hours compliance', selectedValue: 'yes', description: '8-hour shifts maintained' },
                ],
            },
            {
                id: 7,
                title: '7. DOCUMENTATION & RECORDS',
                order: 7,
                items: [
                    { id: 7.1, title: '7.1 Documentation 1 - SOPs available for all processes', selectedValue: 'yes', description: 'All SOPs documented and accessible' },
                    { id: 7.2, title: '7.2 Documentation 2 - Training records maintained', selectedValue: 'yes', description: 'Training files organized properly' },
                    { id: 7.3, title: '7.3 Documentation 3 - Maintenance records updated', selectedValue: 'no', description: 'Some maintenance records missing' },
                    { id: 7.4, title: '7.4 Documentation 4 - Quality records traceable', selectedValue: 'yes', description: 'Batch traceability maintained' },
                    { id: 7.5, title: '7.5 Documentation 5 - Customer complaints recorded', selectedValue: 'yes', description: 'Complaint register maintained' },
                ],
            },
        ],

        workerInterviews: [
            {
                id: 1,
                name: 'Ramesh Patel',
                designation: 'CNC Operator',
                natureOfWork: 'Machine operation and maintenance',
                questions: [
                    { question: 'Are you provided with proper safety equipment?', response: 'Yes, we get all required PPE' },
                    { question: 'Is training provided for new machines?', response: 'Yes, supervisor provides training' },
                    { question: 'Are working hours comfortable?', response: 'Yes, 8 hours with proper breaks' },
                ],
            },
            {
                id: 2,
                name: 'Sunita Desai',
                designation: 'Quality Inspector',
                natureOfWork: 'Final quality checking and documentation',
                questions: [
                    { question: 'Are quality standards clearly defined?', response: 'Yes, we have checklists for each product' },
                    { question: 'How are quality issues reported?', response: 'We fill non-conformance reports' },
                    { question: 'Is management supportive of quality initiatives?', response: 'Yes, they encourage quality improvements' },
                ],
            },
            {
                id: 3,
                name: 'Vikram Singh',
                designation: 'Production Supervisor',
                natureOfWork: 'Production planning and supervision',
                questions: [
                    { question: 'Are production targets realistic?', response: 'Yes, achievable with current resources' },
                    { question: 'Is there adequate maintenance support?', response: 'Mostly yes, but sometimes delays' },
                    { question: 'How is communication with management?', response: 'Regular meetings held every week' },
                ],
            },
        ],

        auditorRemarks:
            'Overall, the supplier shows good compliance with most requirements. Major non-conformities were found in fire safety equipment maintenance and instrument calibration. The supplier has shown willingness to address these issues. Production facilities are well-maintained and quality systems are effectively implemented. Worker welfare facilities are adequate. Documentation system needs improvement in maintenance records.',

        externalProviderComments:
            'The audit process was professional and thorough. We appreciate the constructive feedback. We will implement corrective actions for the non-conformities within 30 days. The audit helped us identify areas for improvement. We are committed to maintaining high standards. Thank you for the opportunity to improve our systems.',
    };

    useEffect(() => {
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

        data.checklists?.forEach((checklist) => {
            checklist.items?.forEach((item) => {
                totalItems++;
                if (item.selectedValue === 'yes') yesCount++;
                else if (item.selectedValue === 'no') noCount++;
                else if (item.selectedValue === 'na') naCount++;
            });
        });

        const completionPercentage = totalItems > 0 ? Math.round(((yesCount + noCount + naCount) / totalItems) * 100) : 0;
        const compliancePercentage = totalItems > 0 ? Math.round((yesCount / totalItems) * 100) : 0;

        return {
            totalItems,
            yesCount,
            noCount,
            naCount,
            completionPercentage,
            compliancePercentage,
        };
    };

    const scores = calculateScores();
    const data = auditData || staticAuditData;

    // Flatten all checklist items for single table
    const allChecklistItems = [];
    data.checklists?.forEach((checklist) => {
        checklist.items?.forEach((item) => {
            allChecklistItems.push({
                ...item,
                checklistTitle: checklist.title,
                checklistOrder: checklist.order,
            });
        });
    });

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            {/* Printable Area */}
            <div
                id="audit-report-to-print"
                className="bg-white mx-auto"
                style={{
                    width: '210mm',
                    minHeight: '297mm',
                    height: 'auto',
                    padding: '15mm',
                }}
            >
                {/* Header */}
                <div className="mb-6 pb-4 border-b border-gray-300">
                    <table width="100%" cellPadding="0" cellSpacing="0">
                        <tr>
                            <td width="60%" valign="top">
                                <div style={{ fontSize: '20pt', fontWeight: 'bold', color: '#1e40af' }}>{companyInfo.companyName}</div>
                                <div style={{ fontSize: '9pt', color: '#4b5563', marginTop: '2px' }}>{companyInfo.companyAddress}</div>
                                <div style={{ fontSize: '9pt', color: '#4b5563' }}>
                                    Tel: {companyInfo.companyPhone} | Email: {companyInfo.companyEmail} | Web: {companyInfo.companyWebsite}
                                </div>
                            </td>
                            <td width="40%" valign="top" align="right">
                                <div style={{ fontSize: '16pt', fontWeight: 'bold', color: '#1f2937' }}>SUPPLIER COMPLIANCE AUDIT REPORT</div>
                                <div style={{ fontSize: '10pt', color: '#6b7280', marginTop: '4px' }}>
                                    Audit ID: <span style={{ fontWeight: 'bold' }}>{data.auditId}</span>
                                </div>
                                <div style={{ fontSize: '10pt', color: '#6b7280' }}>Date: {formatDate(data.auditDate)}</div>
                            </td>
                        </tr>
                    </table>
                </div>

                {/* Supplier Information - Single Table */}
                <div className="mb-6">
                    <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', borderBottom: '2px solid #3b82f6', paddingBottom: '4px' }}>SUPPLIER INFORMATION</div>

                    <table width="100%" cellPadding="4" cellSpacing="0" border="1" style={{ borderColor: '#d1d5db', fontSize: '10pt', borderCollapse: 'collapse' }}>
                        <tbody>
                            {/* Row 1: Full width for supplier name */}
                            <tr>
                                <td width="40%" style={{ fontWeight: 'bold', color: '#4b5563', padding: '8px', border: '1px solid #d1d5db' }}>
                                    Name of Supplier/External Provider:
                                </td>
                                <td width="60%" style={{ padding: '8px', border: '1px solid #d1d5db' }}>
                                    {data.supplierName}
                                </td>
                            </tr>

                            {/* Combined Left and Right Columns in one row */}
                            <tr>
                                <td colspan="2" style={{ padding: '0', border: '1px solid #d1d5db' }}>
                                    {/* Using a single table with 4 columns */}
                                    <table width="100%" cellPadding="8" cellSpacing="0" border="0" style={{ borderCollapse: 'collapse' }}>
                                        <tbody>
                                            {/* Row 1: Type of Supplier | Value | No. of Machines | Value */}
                                            <tr>
                                                {/* Left side - Type of Supplier */}
                                                <td width="20%" style={{ fontWeight: 'bold', color: '#4b5563', borderRight: '1px solid #d1d5db' }}>
                                                    Type of Supplier:
                                                </td>
                                                <td width="30%" style={{ borderRight: '1px solid #d1d5db' }}>
                                                    {data.supplierType}
                                                </td>

                                                {/* Right side - No. of Machines */}
                                                <td width="20%" style={{ fontWeight: 'bold', color: '#4b5563', borderRight: '1px solid #d1d5db' }}>
                                                    No. of Machines:
                                                </td>
                                                <td width="30%">{data.machineCount}</td>
                                            </tr>

                                            {/* Row 2: No. of Employees | Value | Name of Products | Value */}
                                            <tr>
                                                <td style={{ fontWeight: 'bold', color: '#4b5563', borderRight: '1px solid #d1d5db', borderTop: '1px solid #e5e7eb' }}>No. of Employees:</td>
                                                <td style={{ borderRight: '1px solid #d1d5db', borderTop: '1px solid #e5e7eb' }}>{data.employeeCount}</td>

                                                <td style={{ fontWeight: 'bold', color: '#4b5563', borderRight: '1px solid #d1d5db', borderTop: '1px solid #e5e7eb' }}>Name of Products:</td>
                                                <td style={{ borderTop: '1px solid #e5e7eb' }}>{data.products}</td>
                                            </tr>

                                            {/* Row 3: Production Capacity | Value | Date of Visit | Value */}
                                            <tr>
                                                <td style={{ fontWeight: 'bold', color: '#4b5563', borderRight: '1px solid #d1d5db', borderTop: '1px solid #e5e7eb' }}>Production Capacity:</td>
                                                <td style={{ borderRight: '1px solid #d1d5db', borderTop: '1px solid #e5e7eb' }}>{data.productionCapacity}</td>

                                                <td style={{ fontWeight: 'bold', color: '#4b5563', borderRight: '1px solid #d1d5db', borderTop: '1px solid #e5e7eb' }}>Date of Visit:</td>
                                                <td style={{ borderTop: '1px solid #e5e7eb' }}>{formatDate(data.visitDate)}</td>
                                            </tr>

                                            {/* Row 4: Asian Auditor Name | Value | Supplier Representative | Value */}
                                            <tr>
                                                <td style={{ fontWeight: 'bold', color: '#4b5563', borderRight: '1px solid #d1d5db', borderTop: '1px solid #e5e7eb' }}>Asian Auditor Name:</td>
                                                <td style={{ borderRight: '1px solid #d1d5db', borderTop: '1px solid #e5e7eb' }}>{data.asianAuditorName}</td>

                                                <td style={{ fontWeight: 'bold', color: '#4b5563', borderRight: '1px solid #d1d5db', borderTop: '1px solid #e5e7eb' }}>Supplier Representative:</td>
                                                <td style={{ borderTop: '1px solid #e5e7eb' }}>{data.supplierRepresentative}</td>
                                            </tr>

                                            {/* Row 5: Last Audit Date | Value | Audit Scores | Value */}
                                            <tr>
                                                <td style={{ fontWeight: 'bold', color: '#4b5563', borderRight: '1px solid #d1d5db', borderTop: '1px solid #e5e7eb' }}>Last Audit Date:</td>
                                                <td style={{ borderRight: '1px solid #d1d5db', borderTop: '1px solid #e5e7eb' }}>{formatDate(data.lastAuditDate)}</td>

                                                <td style={{ fontWeight: 'bold', color: '#4b5563', borderRight: '1px solid #d1d5db', borderTop: '1px solid #e5e7eb' }}>Audit Scores:</td>
                                                <td style={{ borderTop: '1px solid #e5e7eb' }}>
                                                    <span style={{ marginRight: '15px' }}>
                                                        <span style={{ fontWeight: 'bold', color: '#4b5563', fontSize: '9pt' }}>Last: </span>
                                                        {data.lastAuditScore}%
                                                    </span>
                                                    <span>
                                                        <span style={{ fontWeight: 'bold', color: '#4b5563', fontSize: '9pt' }}>Current: </span>
                                                        {data.currentScore}%
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                            {/* Row 3: Facility Features - All in single line */}
                            <tr>
                                <td colSpan="2" style={{ padding: '12px', border: '1px solid #d1d5db', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontWeight: 'bold', color: '#4b5563' }}>Transportation</span>
                                            <span style={{ fontSize: '11pt', fontWeight: 'bold' }}>{data.transportAvailable ? 'YES' : 'NO'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontWeight: 'bold', color: '#4b5563' }}>Accommodation</span>
                                            <span style={{ fontSize: '11pt', fontWeight: 'bold' }}>{data.accommodationAvailable ? 'YES' : 'NO'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontWeight: 'bold', color: '#4b5563' }}>Animals Allowed</span>
                                            <span style={{ fontSize: '11pt', fontWeight: 'bold' }}>{data.animalsAllowed ? 'YES' : 'NO'}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Audit Checklist Results - Single Table */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '14pt', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', borderBottom: '2px solid #ef4444', paddingBottom: '4px' }}>AUDIT CHECKLIST RESULTS</div>

                    <table width="100%" cellPadding="3" cellSpacing="0" border="1" style={{ borderColor: '#d1d5db', fontSize: '9pt', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f3f4f6' }}>
                                <th width="5%" style={{ padding: '6px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #9ca3af' }}>
                                    S.No
                                </th>
                                <th width="50%" style={{ padding: '6px', textAlign: 'left', fontWeight: 'bold', border: '1px solid #9ca3af' }}>
                                    Activity / Requirement
                                </th>
                                <th width="5%" style={{ padding: '6px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #9ca3af' }}>
                                    Yes
                                </th>
                                <th width="5%" style={{ padding: '6px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #9ca3af' }}>
                                    No
                                </th>
                                <th width="5%" style={{ padding: '6px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #9ca3af' }}>
                                    N/A
                                </th>
                                <th width="30%" style={{ padding: '6px', textAlign: 'left', fontWeight: 'bold', border: '1px solid #9ca3af' }}>
                                    Details / Observations
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {allChecklistItems.map((item, index) => {
                                const isNewChecklist = index === 0 || allChecklistItems[index - 1].checklistOrder !== item.checklistOrder;

                                return (
                                    <React.Fragment key={item.id}>
                                        {/* Checklist Title Row */}
                                        {isNewChecklist && (
                                            <tr style={{ backgroundColor: '#e5e7eb', pageBreakInside: 'avoid' }}>
                                                <td colSpan="6" style={{ padding: '8px', fontWeight: 'bold', fontSize: '11pt', border: '1px solid #9ca3af' }}>
                                                    {item.checklistTitle}
                                                </td>
                                            </tr>
                                        )}

                                        {/* Item Row */}
                                        <tr>
                                            <td style={{ padding: '5px', textAlign: 'center', verticalAlign: 'top', border: '1px solid #d1d5db' }}>{item.id.toFixed(1)}</td>
                                            <td style={{ padding: '5px', verticalAlign: 'top', border: '1px solid #d1d5db' }}>{item.title}</td>
                                            <td style={{ padding: '5px', textAlign: 'center', verticalAlign: 'top', border: '1px solid #d1d5db' }}>{item.selectedValue === 'yes' ? '✓' : ''}</td>
                                            <td style={{ padding: '5px', textAlign: 'center', verticalAlign: 'top', border: '1px solid #d1d5db' }}>{item.selectedValue === 'no' ? '✓' : ''}</td>
                                            <td style={{ padding: '5px', textAlign: 'center', verticalAlign: 'top', border: '1px solid #d1d5db' }}>{item.selectedValue === 'na' ? '✓' : ''}</td>
                                            <td style={{ padding: '5px', verticalAlign: 'top', border: '1px solid #d1d5db', fontSize: '8.5pt' }}>{item.description}</td>
                                        </tr>
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Worker Interviews - Table Format */}
                <div style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
                    <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', borderBottom: '2px solid #8b5cf6', paddingBottom: '3px' }}>WORKER INTERVIEWS</div>

                    {data.workerInterviews.map((interview, interviewIndex) => (
                        <div key={interview.id} style={{ marginBottom: '15px', border: '1px solid #e5e7eb', padding: '10px', borderRadius: '4px' }}>
                            <table width="100%" cellPadding="5" cellSpacing="0" style={{ fontSize: '10pt', marginBottom: '10px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                                <tr>
                                    <td width="25%" style={{ fontWeight: 'bold', color: '#4b5563' }}>
                                        Interview No:
                                    </td>
                                    <td width="25%" style={{ fontWeight: 'bold' }}>
                                        {interviewIndex + 1}
                                    </td>
                                    <td width="25%" style={{ fontWeight: 'bold', color: '#4b5563' }}>
                                        Name:
                                    </td>
                                    <td width="25%" style={{ fontWeight: 'bold' }}>
                                        {interview.name}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: 'bold', color: '#4b5563' }}>Designation:</td>
                                    <td>{interview.designation}</td>
                                    <td style={{ fontWeight: 'bold', color: '#4b5563' }}>Nature of Work:</td>
                                    <td>{interview.natureOfWork}</td>
                                </tr>
                            </table>

                            {/* Questions & Answers Table */}
                            <table width="100%" cellPadding="4" cellSpacing="0" border="1" style={{ borderColor: '#d1d5db', fontSize: '9pt', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                                        <th width="10%" style={{ padding: '5px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #9ca3af' }}>
                                            Q.No
                                        </th>
                                        <th width="45%" style={{ padding: '5px', textAlign: 'left', fontWeight: 'bold', border: '1px solid #9ca3af' }}>
                                            Question
                                        </th>
                                        <th width="45%" style={{ padding: '5px', textAlign: 'left', fontWeight: 'bold', border: '1px solid #9ca3af' }}>
                                            Response
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {interview.questions.map((question, qIndex) => (
                                        <tr key={qIndex}>
                                            <td style={{ padding: '5px', textAlign: 'center', verticalAlign: 'top', border: '1px solid #d1d5db' }}>{qIndex + 1}</td>
                                            <td style={{ padding: '5px', verticalAlign: 'top', border: '1px solid #d1d5db' }}>{question.question}</td>
                                            <td style={{ padding: '5px', verticalAlign: 'top', border: '1px solid #d1d5db' }}>{question.response}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>

                {/* Auditor Remarks - No background color */}
                <div style={{ marginBottom: '15px', pageBreakInside: 'avoid' }}>
                    <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', borderBottom: '2px solid #10b981', paddingBottom: '3px' }}>
                        AUDITOR REMARKS & OBSERVATIONS
                    </div>

                    <div style={{ padding: '12px' }}>
                        <div style={{ fontSize: '10pt', color: '#1f2937', lineHeight: '1.5', textAlign: 'justify' }}>{data.auditorRemarks}</div>
                    </div>
                </div>

                {/* External Provider Comments - No background color */}
                <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
                    <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px', borderBottom: '2px solid #3b82f6', paddingBottom: '3px' }}>
                        EXTERNAL PROVIDER COMMENTS
                    </div>

                    <div style={{ padding: '12px' }}>
                        <div style={{ fontSize: '10pt', color: '#1f2937', lineHeight: '1.5', textAlign: 'justify' }}>{data.externalProviderComments}</div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ borderTop: '2px solid #1e40af', paddingTop: '10px', marginTop: '20px' }}>
                    <table width="100%" cellPadding="4" cellSpacing="0" style={{ fontSize: '9pt' }}>
                        <tr>
                            <td width="33%" valign="top">
                                <div style={{ fontWeight: 'bold', color: '#1e40af' }}>AUDIT CONCLUSION</div>
                                <div style={{ fontWeight: 'bold', fontSize: '10pt', marginTop: '4px' }}>
                                    {scores.compliancePercentage >= 70
                                        ? 'SATISFACTORY - Supplier meets compliance requirements'
                                        : scores.compliancePercentage >= 50
                                          ? 'NEEDS IMPROVEMENT - Some areas require attention'
                                          : 'UNSATISFACTORY - Major improvements needed'}
                                </div>
                            </td>
                            <td width="34%" valign="top" align="center">
                                <div style={{ fontWeight: 'bold', color: '#1e40af' }}>AUDITOR SIGNATURE</div>
                                <div style={{ marginTop: '20px', borderTop: '1px solid #000', width: '60%', margin: '20px auto 0' }}>
                                    <div style={{ textAlign: 'center', fontSize: '9pt', paddingTop: '4px' }}>{data.asianAuditorName}</div>
                                </div>
                            </td>
                            <td width="33%" valign="top" align="right">
                                <div style={{ fontWeight: 'bold', color: '#1e40af' }}>SUPPLIER ACKNOWLEDGEMENT</div>
                                <div style={{ marginTop: '20px', borderTop: '1px solid #000', width: '60%', marginLeft: 'auto' }}>
                                    <div style={{ textAlign: 'center', fontSize: '9pt', paddingTop: '4px' }}>{data.supplierRepresentative}</div>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '8pt', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
                        <div>Computer Generated Audit Report • Document No: AUD-{data.auditId} • Version: 1.0</div>
                        <div>Generated on: {moment().format('DD/MM/YYYY HH:mm:ss')} • Page 1 of 1</div>
                        <div>
                            Total Checklist Items: {scores.totalItems} • Yes: {scores.yesCount} • No: {scores.noCount} • N/A: {scores.naCount}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="d-print-none mt-6 flex justify-center gap-4">
                <button onClick={handleBack} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                    ← Back
                </button>
                <button onClick={handlePrint} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <IconPrinter className="inline w-4 h-4 mr-2" />
                    Print Report
                </button>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    body,
                    html {
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

                    th,
                    td {
                        padding: 3px 4px !important;
                        border: 0.5px solid #000 !important;
                        font-size: 9pt !important;
                        line-height: 1.2 !important;
                        vertical-align: top !important;
                    }

                    /* Force only table headers to have background color */
                    tr[style*='background-color: #f3f4f6'] {
                        background-color: #f3f4f6 !important;
                    }

                    tr[style*='background-color: #e5e7eb'] {
                        background-color: #e5e7eb !important;
                    }

                    /* Remove all other background colors */
                    td[style*='background-color'] {
                        background-color: transparent !important;
                    }

                    div[style*='background-color'] {
                        background-color: transparent !important;
                    }

                    #audit-report-to-print > div {
                        margin-bottom: 8mm !important;
                    }

                    #audit-report-to-print > div:last-child {
                        position: relative !important;
                        bottom: 0 !important;
                        margin-top: 10mm !important;
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
