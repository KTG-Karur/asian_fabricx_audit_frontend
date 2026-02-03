import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IconPrinter from '../../../components/Icon/IconPrinter';
import IconCancel from '../../../components/Icon/IconX';
import moment from 'moment';

const AuditPrintPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [auditData, setAuditData] = useState(null);

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
            {/* Printable Area - PAPER FORM STYLE */}
            <div
                id="audit-report-to-print"
                className="bg-white mx-auto"
                style={{
                    width: '210mm',
                    minHeight: '297mm',
                    height: 'auto',
                    padding: '15mm',
                    fontFamily: '"Times New Roman", serif',
                }}
            >
                {/* HEADER - PAPER FORM STYLE */}
                <table width="100%" cellPadding="2" cellSpacing="0" style={{ border: '1px solid #000', borderCollapse: 'collapse', marginBottom: '5mm' }}>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                            <div style={{ fontSize: '14pt', fontWeight: 'bold' }}>ASIAN FABRICS PRIVATE LIMITED</div>
                            <div style={{ fontSize: '10pt', marginTop: '2px' }}>S/F No. 746/1&2. 751/1&2, Manmangalam Village,Semmadai, Karur – 639 006, Tamilnadu, India.</div>
                            <div style={{ fontSize: '9pt', marginTop: '2px' }}>Tel: 9787799935 | Email: asian@asianfab.com | Web: www.asianfab.com</div>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '4px 8px', textAlign: 'center', verticalAlign: 'middle', borderTop: 'none' }}>
                            <div style={{ fontSize: '12pt', fontWeight: 'bold', textTransform: 'uppercase' }}>SUPPLIER COMPLIANCE AUDIT REPORT</div>
                        </td>
                    </tr>
                </table>

                {/* AUDIT INFORMATION SECTION */}
                <table width="100%" cellPadding="2" cellSpacing="0" style={{ border: '1px solid #000', borderCollapse: 'collapse', marginBottom: '5mm' }}>
                    <tr>
                        <td colspan="2" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '11pt', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff' }}>
                            AUDIT INFORMATION
                        </td>
                    </tr>
                    <tr>
                        <td width="50%" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Audit ID:</td>
                        <td width="50%" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{data.auditId}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Audit Date:</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{formatDate(data.auditDate)}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Visit Date:</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{formatDate(data.visitDate)}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Audit Status:</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{data.status}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Asian Auditor:</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{data.asianAuditorName}</td>
                    </tr>
                </table>

                {/* SUPPLIER INFORMATION SECTION */}
                <table width="100%" cellPadding="2" cellSpacing="0" style={{ border: '1px solid #000', borderCollapse: 'collapse', marginBottom: '5mm' }}>
                    <tr>
                        <td colspan="4" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '11pt', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff' }}>
                            SUPPLIER INFORMATION
                        </td>
                    </tr>
                    <tr>
                        <td width="25%" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Supplier Name:</td>
                        <td width="25%" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{data.supplierName}</td>
                        <td width="25%" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Supplier Type:</td>
                        <td width="25%" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{data.supplierType}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>No. of Employees:</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{data.employeeCount}</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>No. of Machines:</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{data.machineCount}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Production Capacity:</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{data.productionCapacity}</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Products:</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{data.products}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Last Audit Date:</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{formatDate(data.lastAuditDate)}</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Supplier Representative:</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{data.supplierRepresentative}</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Last Audit Score:</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{data.lastAuditScore}%</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold' }}>Current Score:</td>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt' }}>{data.currentScore}%</td>
                    </tr>
                    <tr>
                        <td colspan="2" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', fontWeight: 'bold', textAlign: 'center' }}>Facility Features:</td>
                        <td colspan="2" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '9pt', textAlign: 'center' }}>
                            Transport: {data.transportAvailable ? 'YES' : 'NO'} | 
                            Accommodation: {data.accommodationAvailable ? 'YES' : 'NO'} | 
                            Animals: {data.animalsAllowed ? 'YES' : 'NO'}
                        </td>
                    </tr>
                </table>

                {/* AUDIT CHECKLIST TABLE */}
                <table width="100%" cellPadding="2" cellSpacing="0" style={{ border: '1px solid #000', borderCollapse: 'collapse', marginBottom: '5mm', fontSize: '8pt' }}>
                    <tr>
                        <td colspan="7" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '11pt', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff' }}>
                            AUDIT CHECKLIST RESULTS
                        </td>
                    </tr>
                    <tr>
                        <th width="5%" style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', fontSize: '9pt' }}>S.No</th>
                        <th width="45%" style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'left', fontWeight: 'bold', fontSize: '9pt' }}>Requirement / Activity</th>
                        <th width="8%" style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', fontSize: '9pt' }}>Yes</th>
                        <th width="8%" style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', fontSize: '9pt' }}>No</th>
                        <th width="8%" style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'center', fontWeight: 'bold', fontSize: '9pt' }}>N/A</th>
                        <th width="26%" style={{ border: '1px solid #000', padding: '3px 4px', textAlign: 'left', fontWeight: 'bold', fontSize: '9pt' }}>Observations</th>
                    </tr>
                    
                    {allChecklistItems.map((item, index) => {
                        const isNewChecklist = index === 0 || allChecklistItems[index - 1].checklistOrder !== item.checklistOrder;

                        return (
                            <React.Fragment key={item.id}>
                                {isNewChecklist && (
                                    <tr>
                                        <td colspan="7" style={{ border: '1px solid #000', padding: '3px 4px', fontSize: '9pt', fontWeight: 'bold', backgroundColor: '#fff' }}>
                                            {item.checklistTitle}
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center', verticalAlign: 'top' }}>{item.id.toFixed(1)}</td>
                                    <td style={{ border: '1px solid #000', padding: '2px 3px', verticalAlign: 'top' }}>{item.title}</td>
                                    <td style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center', verticalAlign: 'top' }}>{item.selectedValue === 'yes' ? '✓' : ''}</td>
                                    <td style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center', verticalAlign: 'top' }}>{item.selectedValue === 'no' ? '✓' : ''}</td>
                                    <td style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center', verticalAlign: 'top' }}>{item.selectedValue === 'na' ? '✓' : ''}</td>
                                    <td style={{ border: '1px solid #000', padding: '2px 3px', verticalAlign: 'top' }}>{item.description}</td>
                                </tr>
                            </React.Fragment>
                        );
                    })}
                    
                    {/* SUMMARY ROW */}
                    <tr>
                        <td colspan="2" style={{ border: '1px solid #000', padding: '3px 4px', fontSize: '9pt', fontWeight: 'bold', textAlign: 'right' }}>TOTAL SUMMARY:</td>
                        <td style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center', fontWeight: 'bold' }}>{scores.yesCount}</td>
                        <td style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center', fontWeight: 'bold' }}>{scores.noCount}</td>
                        <td style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center', fontWeight: 'bold' }}>{scores.naCount}</td>
                        <td style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center', fontWeight: 'bold' }}>Total: {scores.totalItems}</td>
                    </tr>
                </table>

                {/* WORKER INTERVIEWS SECTION */}
                <table width="100%" cellPadding="2" cellSpacing="0" style={{ border: '1px solid #000', borderCollapse: 'collapse', marginBottom: '5mm' }}>
                    <tr>
                        <td colspan="4" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '11pt', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff' }}>
                            WORKER INTERVIEWS
                        </td>
                    </tr>
                    
                    {data.workerInterviews.map((interview, interviewIndex) => (
                        <React.Fragment key={interview.id}>
                            {/* Interview Header */}
                            <tr>
                                <td width="15%" style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '9pt', fontWeight: 'bold' }}>Interview #{interviewIndex + 1}:</td>
                                <td width="35%" style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Name: {interview.name}</td>
                                <td width="25%" style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Designation: {interview.designation}</td>
                                <td width="25%" style={{ border: '1px solid #000', padding: '2px 4px', fontSize: '9pt' }}>Work: {interview.natureOfWork}</td>
                            </tr>
                            
                            {/* Questions Table */}
                            <tr>
                                <td colspan="4" style={{ border: '1px solid #000', padding: '0' }}>
                                    <table width="100%" cellPadding="2" cellSpacing="0" style={{ border: 'none', borderCollapse: 'collapse', fontSize: '8pt' }}>
                                        <tr>
                                            <th width="10%" style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center', fontWeight: 'bold' }}>Q.No</th>
                                            <th width="45%" style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'left', fontWeight: 'bold' }}>Question</th>
                                            <th width="45%" style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'left', fontWeight: 'bold' }}>Response</th>
                                        </tr>
                                        {interview.questions.map((question, qIndex) => (
                                            <tr key={qIndex}>
                                                <td style={{ border: '1px solid #000', padding: '2px 3px', textAlign: 'center', verticalAlign: 'top' }}>{qIndex + 1}</td>
                                                <td style={{ border: '1px solid #000', padding: '2px 3px', verticalAlign: 'top' }}>{question.question}</td>
                                                <td style={{ border: '1px solid #000', padding: '2px 3px', verticalAlign: 'top' }}>{question.response}</td>
                                            </tr>
                                        ))}
                                    </table>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </table>

                {/* AUDITOR REMARKS */}
                <table width="100%" cellPadding="2" cellSpacing="0" style={{ border: '1px solid #000', borderCollapse: 'collapse', marginBottom: '5mm' }}>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '11pt', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff' }}>
                            AUDITOR REMARKS & OBSERVATIONS
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '6px 8px', fontSize: '9pt', lineHeight: '1.3', minHeight: '30mm' }}>
                            {data.auditorRemarks}
                        </td>
                    </tr>
                </table>

                {/* EXTERNAL PROVIDER COMMENTS */}
                <table width="100%" cellPadding="2" cellSpacing="0" style={{ border: '1px solid #000', borderCollapse: 'collapse', marginBottom: '5mm' }}>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '11pt', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff' }}>
                            EXTERNAL PROVIDER COMMENTS
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '6px 8px', fontSize: '9pt', lineHeight: '1.3', minHeight: '20mm' }}>
                            {data.externalProviderComments}
                        </td>
                    </tr>
                </table>

                {/* SIGNATURE SECTION */}
                <table width="100%" cellPadding="2" cellSpacing="0" style={{ border: '1px solid #000', borderCollapse: 'collapse', marginBottom: '5mm' }}>
                    <tr>
                        <td colspan="3" style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '11pt', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff' }}>
                            AUDIT CONCLUSION & SIGNATURES
                        </td>
                    </tr>
                    <tr>
                        <td width="33%" style={{ border: '1px solid #000', padding: '10px 6px', textAlign: 'center', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '9pt', fontWeight: 'bold', marginBottom: '15px' }}>
                                {scores.compliancePercentage >= 70
                                    ? 'SATISFACTORY'
                                    : scores.compliancePercentage >= 50
                                      ? 'NEEDS IMPROVEMENT'
                                      : 'UNSATISFACTORY'}
                            </div>
                            <div style={{ borderTop: '1px solid #000', width: '80%', margin: '0 auto', paddingTop: '15px' }}>
                                <div style={{ fontSize: '9pt' }}>Audit Completion Date</div>
                                <div style={{ fontSize: '9pt', fontWeight: 'bold', marginTop: '5px' }}>{formatDate(data.auditDate)}</div>
                            </div>
                        </td>
                        <td width="34%" style={{ border: '1px solid #000', padding: '10px 6px', textAlign: 'center', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '9pt', fontWeight: 'bold', marginBottom: '5px' }}>AUDITOR SIGNATURE</div>
                            <div style={{ borderTop: '1px solid #000', width: '80%', margin: '25px auto 0', paddingTop: '15px' }}>
                                <div style={{ fontSize: '9pt' }}>{data.asianAuditorName}</div>
                                <div style={{ fontSize: '8pt', marginTop: '2px' }}>Asian Fabrics Auditor</div>
                            </div>
                        </td>
                        <td width="33%" style={{ border: '1px solid #000', padding: '10px 6px', textAlign: 'center', verticalAlign: 'top' }}>
                            <div style={{ fontSize: '9pt', fontWeight: 'bold', marginBottom: '5px' }}>SUPPLIER ACKNOWLEDGEMENT</div>
                            <div style={{ borderTop: '1px solid #000', width: '80%', margin: '25px auto 0', paddingTop: '15px' }}>
                                <div style={{ fontSize: '9pt' }}>{data.supplierRepresentative}</div>
                                <div style={{ fontSize: '8pt', marginTop: '2px' }}>Supplier Representative</div>
                            </div>
                        </td>
                    </tr>
                </table>

                {/* FOOTER */}
                <table width="100%" cellPadding="2" cellSpacing="0" style={{ border: '1px solid #000', borderCollapse: 'collapse' }}>
                    <tr>
                        <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '8pt', textAlign: 'center' }}>
                            <div>--- END OF AUDIT REPORT ---</div>
                            <div style={{ marginTop: '2px' }}>
                                Document ID: {data.auditId} | Generated on: {moment().format('DD/MM/YYYY HH:mm')} | Page 1 of 1
                            </div>
                            <div style={{ marginTop: '2px' }}>
                                Items: {scores.totalItems} | Yes: {scores.yesCount} ({Math.round((scores.yesCount / scores.totalItems) * 100)}%) | 
                                No: {scores.noCount} | N/A: {scores.naCount}
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center gap-4">
                <button 
                    onClick={handleBack}
                    style={{
                        padding: '8px 20px',
                        background: '#6b7280',
                        color: 'white',
                        border: '1px solid #4b5563',
                        borderRadius: '2px',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}
                >
                    ← Back
                </button>
                <button 
                    onClick={handlePrint}
                    style={{
                        padding: '8px 20px',
                        background: '#2563eb',
                        color: 'white',
                        border: '1px solid #1d4ed8',
                        borderRadius: '2px',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}
                >
                    <IconPrinter className="inline w-4 h-4 mr-2" />
                    Print Report
                </button>
            </div>

            {/* Print Styles - PAPER FORM OPTIMIZED */}
            <style>{`
                @media print {
                    body, html {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 210mm !important;
                        height: auto !important;
                        background: white !important;
                        font-family: "Times New Roman", serif !important;
                        font-size: 9pt !important;
                    }

                    body * {
                        visibility: hidden !important;
                    }

                    #audit-report-to-print,
                    #audit-report-to-print * {
                        visibility: visible !important;
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
                        font-family: "Times New Roman", serif !important;
                        font-size: 9pt !important;
                    }

                    /* Remove all action buttons during print */
                    .mt-6, button, .flex {
                        display: none !important;
                    }

                    /* Table styling for print */
                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        font-size: 8pt !important;
                        page-break-inside: avoid !important;
                    }

                    th, td {
                        border: 1px solid #000 !important;
                        padding: 2px 3px !important;
                        font-size: 8pt !important;
                        line-height: 1.1 !important;
                        vertical-align: top !important;
                    }

                    th {
                        font-weight: bold !important;
                        text-align: center !important;
                    }

                    /* Force white background for print */
                    tr[style*="background-color"] td,
                    td[style*="background-color"] {
                        background-color: #fff !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }

                    /* Page setup */
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

                    /* Avoid page breaks inside important sections */
                    .page-break-avoid {
                        page-break-inside: avoid !important;
                    }

                    /* Reduce spacing for print */
                    #audit-report-to-print > table {
                        margin-bottom: 3mm !important;
                    }
                }

                /* Screen styles for preview */
                @media screen {
                    #audit-report-to-print {
                        border: 1px solid #ccc;
                        border-radius: 2px;
                        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
                        background: white;
                        overflow: auto;
                        max-height: calc(100vh - 150px);
                        margin-bottom: 20px;
                    }

                    #audit-report-to-print::-webkit-scrollbar {
                        width: 6px;
                        height: 6px;
                    }

                    #audit-report-to-print::-webkit-scrollbar-track {
                        background: #f1f1f1;
                    }

                    #audit-report-to-print::-webkit-scrollbar-thumb {
                        background: #888;
                    }

                    #audit-report-to-print::-webkit-scrollbar-thumb:hover {
                        background: #555;
                    }
                }

                /* Global styles for paper form look */
                table {
                    font-family: "Times New Roman", serif;
                    font-size: 9pt;
                }

                th {
                    background: #fff !important;
                }

                td {
                    background: #fff !important;
                }
            `}</style>
        </div>
    );
};

export default AuditPrintPage;