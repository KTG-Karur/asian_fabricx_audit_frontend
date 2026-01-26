import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IconEye from '../../components/Icon/IconEye';
import IconEdit from '../../components/Icon/IconPencil';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPlus from '../../components/Icon/IconPlus';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconDownload from '../../components/Icon/IconFile';
import IconRestore from '../../components/Icon/IconRefresh';
import Table from '../../util/Table';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const ExternalProviderAudit = () => {
    const navigate = useNavigate();
    const [audits, setAudits] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAudits, setFilteredAudits] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);

    // Enhanced dummy data with more realistic audit information
    const dummyAudits = [
        {
            id: 1,
            supplierName: 'ABC Manufacturing Ltd.',
            supplierType: 'Manufacturer',
            employeeCount: 150,
            productionCapacity: '5000 units/month',
            asianAuditorName: 'Rajesh Kumar',
            lastAuditDate: '2024-02-15',
            machineCount: 25,
            products: 'Textiles, Fabrics',
            visitDate: '2024-03-10',
            supplierRepresentative: 'Mr. Sharma',
            lastAuditScore: 85,
            currentScore: 88,
            transportAvailable: true,
            accommodationAvailable: false,
            animalsAllowed: false,
            status: 'Completed',
            auditDate: '2024-03-10',
            checklistCount: 19,
            workerInterviewCount: 5,
            isActive: 1,
            createdDate: '2024-03-10'
        },
        {
            id: 2,
            supplierName: 'XYZ Textile Mills',
            supplierType: 'Textile Producer',
            employeeCount: 200,
            productionCapacity: '8000 meters/day',
            asianAuditorName: 'Priya Sharma',
            lastAuditDate: '2024-01-20',
            machineCount: 40,
            products: 'Cotton Fabrics, Polyester',
            visitDate: '2024-03-05',
            supplierRepresentative: 'Ms. Gupta',
            lastAuditScore: 78,
            currentScore: 82,
            transportAvailable: true,
            accommodationAvailable: true,
            animalsAllowed: true,
            status: 'In Progress',
            auditDate: '2024-03-05',
            checklistCount: 19,
            workerInterviewCount: 3,
            isActive: 1,
            createdDate: '2024-03-05'
        },
        {
            id: 3,
            supplierName: 'Global Garments Inc.',
            supplierType: 'Garment Manufacturer',
            employeeCount: 300,
            productionCapacity: '10000 pieces/day',
            asianAuditorName: 'Amit Patel',
            lastAuditDate: '2024-02-28',
            machineCount: 60,
            products: 'Ready-made Garments',
            visitDate: '2024-03-12',
            supplierRepresentative: 'Mr. Singh',
            lastAuditScore: 90,
            currentScore: 92,
            transportAvailable: false,
            accommodationAvailable: true,
            animalsAllowed: false,
            status: 'Pending',
            auditDate: '2024-03-12',
            checklistCount: 19,
            workerInterviewCount: 4,
            isActive: 1,
            createdDate: '2024-03-12'
        },
        {
            id: 4,
            supplierName: 'Tech Components Corp.',
            supplierType: 'Electronic Components',
            employeeCount: 120,
            productionCapacity: '20000 units/month',
            asianAuditorName: 'Sanjay Verma',
            lastAuditDate: '2024-02-10',
            machineCount: 35,
            products: 'PCB Boards, Sensors',
            visitDate: '2024-03-15',
            supplierRepresentative: 'Dr. Reddy',
            lastAuditScore: 92,
            currentScore: 95,
            transportAvailable: true,
            accommodationAvailable: false,
            animalsAllowed: false,
            status: 'Completed',
            auditDate: '2024-03-15',
            checklistCount: 19,
            workerInterviewCount: 6,
            isActive: 1,
            createdDate: '2024-03-15'
        },
        {
            id: 5,
            supplierName: 'Food Processing Unit',
            supplierType: 'Food Manufacturer',
            employeeCount: 180,
            productionCapacity: '10000 kg/day',
            asianAuditorName: 'Meera Nair',
            lastAuditDate: '2024-02-05',
            machineCount: 45,
            products: 'Packaged Foods, Spices',
            visitDate: '2024-03-18',
            supplierRepresentative: 'Mrs. Iyer',
            lastAuditScore: 75,
            currentScore: 80,
            transportAvailable: false,
            accommodationAvailable: true,
            animalsAllowed: true,
            status: 'In Progress',
            auditDate: '2024-03-18',
            checklistCount: 19,
            workerInterviewCount: 4,
            isActive: 0,
            createdDate: '2024-03-18'
        }
    ];

    useEffect(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setAudits(dummyAudits);
            setFilteredAudits(dummyAudits);
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredAudits(audits);
        } else {
            const filtered = audits.filter(audit =>
                audit.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                audit.supplierType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                audit.products.toLowerCase().includes(searchTerm.toLowerCase()) ||
                audit.asianAuditorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                audit.supplierRepresentative.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAudits(filtered);
        }
        setCurrentPage(0);
    }, [searchTerm, audits]);

    const handleCreateNewAudit = () => {
        navigate('/audit/external-provider/form', { 
            state: { mode: 'create' }
        });
    };

    const handleViewAudit = (audit) => {
        navigate('/audit/external-provider/form', { 
            state: { 
                mode: 'view', 
                auditData: audit 
            }
        });
    };

    const handleEditAudit = (audit) => {
        navigate('/audit/external-provider/form', { 
            state: { 
                mode: 'edit', 
                auditData: audit 
            }
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
            case 'In Progress':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>;
            case 'Pending':
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pending</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const getScoreBadge = (score) => {
        if (score >= 90) return <span className="px-2 py-1 rounded text-xs font-bold bg-green-500 text-white">{score}%</span>;
        if (score >= 80) return <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500 text-white">{score}%</span>;
        if (score >= 70) return <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500 text-white">{score}%</span>;
        return <span className="px-2 py-1 rounded text-xs font-bold bg-red-500 text-white">{score}%</span>;
    };

    const handlePaginationChange = (pageIndex, newPageSize) => {
        setCurrentPage(pageIndex);
        setPageSize(newPageSize);
    };

    const getPaginatedData = () => {
        const activeAudits = filteredAudits.filter(a => a.isActive === 1);
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        return activeAudits.slice(startIndex, endIndex);
    };

    const getTotalCount = () => {
        return filteredAudits.filter(a => a.isActive === 1).length;
    };

    const handleDeleteAudit = (audit) => {
        if (window.confirm('Are you sure you want to delete this audit? This action cannot be undone.')) {
            const updatedAudits = audits.map(a => 
                a.id === audit.id ? { ...a, isActive: 0 } : a
            );
            setAudits(updatedAudits);
            setFilteredAudits(updatedAudits);
        }
    };

    const handleRestoreAudit = (audit) => {
        const updatedAudits = audits.map(a => 
            a.id === audit.id ? { ...a, isActive: 1 } : a
        );
        setAudits(updatedAudits);
        setFilteredAudits(updatedAudits);
    };

    const getAuditDetails = (audit) => {
        return `${audit.employeeCount} employees • ${audit.machineCount} machines • ${audit.workerInterviewCount} interviews`;
    };

    const columns = [
        {
            Header: 'Supplier Details',
            accessor: 'supplierName',
            sort: true,
            Cell: ({ value, row }) => {
                const audit = row.original;
                return (
                    <div>
                        <div className="font-medium text-gray-800">{value}</div>
                        <div className="text-sm text-gray-600 mt-1">{audit.supplierType}</div>
                        <div className="text-xs text-gray-500 mt-1">{audit.products}</div>
                        <div className="text-xs text-gray-500 mt-1">{getAuditDetails(audit)}</div>
                    </div>
                );
            },
        },
        {
            Header: 'Audit Info',
            accessor: 'auditInfo',
            Cell: ({ row }) => {
                const audit = row.original;
                return (
                    <div>
                        <div className="font-medium text-gray-800">{audit.asianAuditorName}</div>
                        <div className="text-sm text-gray-600 mt-1">Auditor</div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(audit.visitDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500 mt-1">{audit.supplierRepresentative}</div>
                    </div>
                );
            },
        },
        {
            Header: 'Scores',
            accessor: 'scores',
            Cell: ({ row }) => {
                const audit = row.original;
                return (
                    <div className="space-y-2">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Last Score</div>
                            <div>{getScoreBadge(audit.lastAuditScore)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Current Score</div>
                            <div>{getScoreBadge(audit.currentScore)}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value, row }) => {
                const audit = row.original;
                return (
                    <div className="space-y-2">
                        <div>{getStatusBadge(value)}</div>
                        <div className="text-xs text-gray-500">
                            {audit.checklistCount} checklist items
                        </div>
                    </div>
                );
            },
            width: 150,
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => {
                const audit = row.original;
                const isActive = audit.isActive === 1;

                return (
                    <div className="flex items-center space-x-3">
                        <Tippy content="View Full Audit">
                            <button 
                                onClick={() => handleViewAudit(audit)} 
                                className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                <IconEye className="w-4 h-4 mr-1.5" />
                                <span className="text-sm font-medium">View</span>
                            </button>
                        </Tippy>

                        {isActive ? (
                            <>
                                <Tippy content="Edit Audit">
                                    <button 
                                        onClick={() => handleEditAudit(audit)} 
                                        className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                                    >
                                        <IconEdit className="w-4 h-4 mr-1.5" />
                                        <span className="text-sm font-medium">Edit</span>
                                    </button>
                                </Tippy>
                                <Tippy content="Delete Audit">
                                    <button 
                                        onClick={() => handleDeleteAudit(audit)} 
                                        className="text-danger hover:text-danger-dark"
                                    >
                                        <IconTrashLines className="w-5 h-5" />
                                    </button>
                                </Tippy>
                            </>
                        ) : (
                            <Tippy content="Restore Audit">
                                <button 
                                    onClick={() => handleRestoreAudit(audit)} 
                                    className="flex items-center px-3 py-1.5 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors"
                                >
                                    <IconRestore className="w-4 h-4 mr-1.5" />
                                    <span className="text-sm font-medium">Restore</span>
                                </button>
                            </Tippy>
                        )}
                    </div>
                );
            },
            width: 200,
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="p-6 text-center">
                <h1 className="text-3xl font-extrabold text-gray-800">External Provider Audit Management</h1>
                <p className="text-gray-600 mt-2">Manage and track compliance audits for external suppliers and providers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="text-3xl font-bold mb-2">{audits.filter(a => a.isActive === 1).length}</div>
                    <div className="text-sm font-medium opacity-90">Active Audits</div>
                    <div className="text-xs opacity-75 mt-1">Total ongoing audits</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="text-3xl font-bold mb-2">{audits.filter(a => a.status === 'Completed' && a.isActive === 1).length}</div>
                    <div className="text-sm font-medium opacity-90">Completed</div>
                    <div className="text-xs opacity-75 mt-1">Successfully audited</div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="text-3xl font-bold mb-2">{audits.filter(a => a.status === 'In Progress' && a.isActive === 1).length}</div>
                    <div className="text-sm font-medium opacity-90">In Progress</div>
                    <div className="text-xs opacity-75 mt-1">Currently being audited</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="text-3xl font-bold mb-2">{audits.filter(a => a.status === 'Pending' && a.isActive === 1).length}</div>
                    <div className="text-sm font-medium opacity-90">Pending</div>
                    <div className="text-xs opacity-75 mt-1">Scheduled for audit</div>
                </div>
            </div>

            <div className="datatables">
                <Table
                    columns={columns}
                    Title={'External Provider Audits'}
                    toggle={handleCreateNewAudit}
                    data={getPaginatedData()}
                    pageSize={pageSize}
                    pageIndex={currentPage}
                    totalCount={getTotalCount()}
                    totalPages={Math.ceil(getTotalCount() / pageSize)}
                    onPaginationChange={handlePaginationChange}
                    pagination={true}
                    isSearchable={true}
                    isSortable={true}
                    btnName="New Audit"
                    loadings={loading}
                    customSearch={
                        <div className="flex items-center space-x-4">
                            <input
                                type="text"
                                placeholder="Search by supplier name, type, products, auditor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-input w-full max-w-md"
                            />
                            <button className="btn btn-outline-primary">
                                <IconPrinter className="w-4 h-4 mr-2" />
                                Print
                            </button>
                            <button className="btn btn-outline-secondary">
                                <IconDownload className="w-4 h-4 mr-2" />
                                Export
                            </button>
                        </div>
                    }
                />
            </div>

            {filteredAudits.filter(a => a.isActive === 0).length > 0 && (
                <div className="mt-8">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <IconRestore className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    You have {filteredAudits.filter(a => a.isActive === 0).length} deleted audits. 
                                    They can be restored from the table below.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Deleted Audits</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auditor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAudits.filter(a => a.isActive === 0).map(audit => (
                                        <tr key={audit.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{audit.supplierName}</div>
                                                <div className="text-sm text-gray-500">{audit.supplierType}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{audit.asianAuditorName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(audit.visitDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleRestoreAudit(audit)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                                >
                                                    <IconRestore className="w-3 h-3 mr-1" />
                                                    Restore
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExternalProviderAudit;