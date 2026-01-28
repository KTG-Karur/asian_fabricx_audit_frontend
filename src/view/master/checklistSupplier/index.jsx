// src/pages/suppliers/checklists/Index.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../util/Table';
import { findArrObj, showConfirmationDialog, showMessage } from '../../../util/AllFunction';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

// Icons
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconEye from '../../../components/Icon/IconEye';
import IconFileText from '../../../components/Icon/IconFile';
import IconCheckCircle from '../../../components/Icon/IconCircleCheck';
import IconXCircle from '../../../components/Icon/IconXCircle';
import IconClock from '../../../components/Icon/IconClock';
import IconPlus from '../../../components/Icon/IconPlus';
import IconSearch from '../../../components/Icon/IconSearch';
import IconFilter from '../../../components/Icon/IconAirplay';
import IconX from '../../../components/Icon/IconX';
import IconChevronDown from '../../../components/Icon/IconChevronDown';
import IconChevronUp from '../../../components/Icon/IconChevronUp';
import IconSave from '../../../components/Icon/IconSave';
import IconCancel from '../../../components/Icon/IconX';
import IconListCheck from '../../../components/Icon/IconListCheck';
import IconShield from '../../../components/Icon/IconShield';
import IconClipboardList from '../../../components/Icon/IconListCheck';

function SupplierChecklists() {
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // Get user permissions
    const loginInfo = localStorage.getItem('loginInfo');
    const localData = JSON.parse(loginInfo || '{}');
    const userData = localData || {};
    const isSuperAdmin = userData?.roleId === 'c1e78b85-6fd9-4cc7-a560-957c2ad28ed5' || false;
    const userBranchId = userData?.branchId || null;
    const pageAccessData = findArrObj(localData?.pagePermission, 'label', 'Supplier') || findArrObj(localData?.pagePermission, 'label', 'Suppliers') || [];
    const accessIds = pageAccessData[0]?.access ? pageAccessData[0].access.split(',').map((id) => id.trim()) : ['2', '3', '4', '6'];

    // State management
    const [checklists, setChecklists] = useState([]);
    const [selectedChecklist, setSelectedChecklist] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Checklist Form states
    const [checklistName, setChecklistName] = useState('');
    const [checklistDescription, setChecklistDescription] = useState('');
    const [checklistType, setChecklistType] = useState('customer_standards');
    const [checklistItems, setChecklistItems] = useState([]);
    const [checklistQuestions, setChecklistQuestions] = useState([]);

    // Table states for customer standards
    const [customerStandards, setCustomerStandards] = useState([
        {
            id: 1,
            standard_name: 'IWAY Standard 6.0', 
            acceptance_date: '2025-01-15',
            status: 'accepted',
           
            supplier_id: 'SUP-001',
        },
        {
            id: 2,
            standard_name: 'Anti-Corruption Policy',
            customer_name: 'Global Retailer Inc',
            acceptance_date: '2025-02-20',
            status: 'pending',
        
        },
        {
            id: 3,
            standard_name: 'Environmental Compliance',
            acceptance_date: '2025-03-10',
            status: 'accepted',
            version: '2.1',
        },
    ]);

    // Table states for self assessment
    const [selfAssessments, setSelfAssessments] = useState([
        {
            id: 1,
            particulars: 'Factory has proper fire safety equipment',
            details: 'Fire extinguishers, smoke detectors, fire alarms',
            status: 'yes',
        },
        {
            id: 2,
            particulars: 'Regular maintenance of machinery',
            details: 'Maintenance logs, service records',
            status: 'yes',
        },
        {
            id: 3,
            particulars: 'Employee training records maintained',
            details: 'Training certificates, attendance records',
            status: 'no',
        },
    ]);

    // New entry states
    const [newCustomerStandard, setNewCustomerStandard] = useState({
        standard_name: '',
        customer_name: '',
        acceptance_date: moment().format('YYYY-MM-DD'),
        status: 'pending',
     
    });

    const [newSelfAssessment, setNewSelfAssessment] = useState({
        particulars: '',
        details: '',
        status: 'yes',
    });

    // State for editing
    const [editingId, setEditingId] = useState(null);
    const [editingType, setEditingType] = useState(null);

    // Customer Standards columns
    const customerStandardsColumns = [
        {
            Header: 'S.No',
            accessor: 'id',
            Cell: ({ row }) => <div className="text-center text-sm font-medium text-gray-500">{row.index + 1}</div>,
            width: 80,
        },
        {
            Header: 'Standard Details',
            accessor: 'standard_details',
            Cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">{item.standard_name}</span>
                           
                        </div>
                        
                    </div>
                );
            },
        },
        {
            Header: 'Acceptance Date',
            accessor: 'acceptance_date',
            Cell: ({ row }) => <div className="text-sm text-gray-700">{moment(row.original.acceptance_date).format('DD MMM YYYY')}</div>,
            width: 150,
        },
        
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => {
                const canEdit = accessIds.includes('3');
                const canDelete = accessIds.includes('4');

                return (
                    <div className="flex items-center gap-2">
                        {canEdit && (
                            <Tippy content="Edit">
                                <button
                                    onClick={() => handleEditCustomerStandard(row.original)}
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                >
                                    <IconPencil className="w-4 h-4" />
                                </button>
                            </Tippy>
                        )}
                        {canDelete && (
                            <Tippy content="Delete">
                                <button
                                    onClick={() => handleDeleteCustomerStandard(row.original.id)}
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                >
                                    <IconTrashLines className="w-4 h-4" />
                                </button>
                            </Tippy>
                        )}
                    </div>
                );
            },
            width: 100,
        },
    ];

    // Self Assessment columns
    const selfAssessmentColumns = [
        {
            Header: 'S.No',
            accessor: 'id',
            Cell: ({ row }) => <div className="text-center text-sm font-medium text-gray-500">{row.index + 1}</div>,
            width: 80,
        },
        {
            Header: 'Particulars',
            accessor: 'particulars',
            Cell: ({ row }) => <div className="text-sm font-medium text-gray-900">{row.original.particulars}</div>,
        },
        {
            Header: 'Details',
            accessor: 'details',
            Cell: ({ row }) => <div className="text-sm text-gray-600">{row.original.details}</div>,
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row }) => (
                <div className="flex items-center">
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            row.original.status === 'yes' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                    >
                        {row.original.status === 'yes' ? 'Yes ✓' : 'No ✗'}
                    </span>
                </div>
            ),
            width: 100,
        },
       
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => {
                const canEdit = accessIds.includes('3');
                const canDelete = accessIds.includes('4');

                return (
                    <div className="flex items-center gap-2">
                        {canEdit && (
                            <Tippy content="Edit">
                                <button
                                    onClick={() => handleEditSelfAssessment(row.original)}
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                >
                                    <IconPencil className="w-4 h-4" />
                                </button>
                            </Tippy>
                        )}
                        {canDelete && (
                            <Tippy content="Delete">
                                <button
                                    onClick={() => handleDeleteSelfAssessment(row.original.id)}
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                >
                                    <IconTrashLines className="w-4 h-4" />
                                </button>
                            </Tippy>
                        )}
                    </div>
                );
            },
            width: 100,
        },
    ];

    // Handler functions
    const handleAddCustomerStandard = () => {
        if (!newCustomerStandard.standard_name.trim()) {
            showMessage('error', 'Standard name is required');
            return;
        }

        setIsLoading(true);
        try {
            const newItem = {
                id: customerStandards.length + 1,
                ...newCustomerStandard,
                 };

            setCustomerStandards((prev) => [...prev, newItem]);
            setNewCustomerStandard({
                standard_name: '',
                customer_name: '',
                acceptance_date: moment().format('YYYY-MM-DD'),
                status: 'pending',
  
            });
            showMessage('success', 'Customer standard added successfully');
        } catch (error) {
            showMessage('error', 'Failed to add customer standard');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSelfAssessment = () => {
        if (!newSelfAssessment.particulars.trim()) {
            showMessage('error', 'Particulars is required');
            return;
        }

        setIsLoading(true);
        try {
            const newItem = {
                id: selfAssessments.length + 1,
                ...newSelfAssessment,
            };

            setSelfAssessments((prev) => [...prev, newItem]);
            setNewSelfAssessment({
                particulars: '',
                details: '',
            });
            showMessage('success', 'Self assessment added successfully');
        } catch (error) {
            showMessage('error', 'Failed to add self assessment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditCustomerStandard = (item) => {
        setNewCustomerStandard(item);
        setEditingId(item.id);
        setEditingType('customer_standard');
    };

    const handleEditSelfAssessment = (item) => {
        setNewSelfAssessment(item);
        setEditingId(item.id);
        setEditingType('self_assessment');
    };

    const handleUpdateCustomerStandard = () => {
        if (!newCustomerStandard.standard_name.trim()) {
            showMessage('error', 'Standard name is required');
            return;
        }

        setIsLoading(true);
        try {
            setCustomerStandards((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...newCustomerStandard } : item)));

            setNewCustomerStandard({
                standard_name: '',
                customer_name: '',
                acceptance_date: moment().format('YYYY-MM-DD'),
             
               
            });
            setEditingId(null);
            setEditingType(null);
            showMessage('success', 'Customer standard updated successfully');
        } catch (error) {
            showMessage('error', 'Failed to update customer standard');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSelfAssessment = () => {
        if (!newSelfAssessment.particulars.trim()) {
            showMessage('error', 'Particulars is required');
            return;
        }

        setIsLoading(true);
        try {
            setSelfAssessments((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...newSelfAssessment } : item)));

            setNewSelfAssessment({
                particulars: '',
                details: '',
             
            });
            setEditingId(null);
            setEditingType(null);
            showMessage('success', 'Self assessment updated successfully');
        } catch (error) {
            showMessage('error', 'Failed to update self assessment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCustomerStandard = async (id) => {
        const confirmed = await showConfirmationDialog('Delete Customer Standard?', 'Are you sure you want to delete this customer standard?');

        if (confirmed) {
            setCustomerStandards((prev) => prev.filter((item) => item.id !== id));
            showMessage('success', 'Customer standard deleted successfully');
        }
    };

    const handleDeleteSelfAssessment = async (id) => {
        const confirmed = await showConfirmationDialog('Delete Self Assessment?', 'Are you sure you want to delete this self assessment item?');

        if (confirmed) {
            setSelfAssessments((prev) => prev.filter((item) => item.id !== id));
            showMessage('success', 'Self assessment deleted successfully');
        }
    };

    const handleCancelEdit = () => {
        setNewCustomerStandard({
            standard_name: '',
            customer_name: '',
            acceptance_date: moment().format('YYYY-MM-DD'),
            
            
        });
        setNewSelfAssessment({
            particulars: '',
            details: '',
           
        });
        setEditingId(null);
        setEditingType(null);
    };

    // Render search and filter
    const renderFilters = () => (
        <div className="space-y-4 mb-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    ref={searchRef}
                    type="text"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Search checklists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <IconX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>
        </div>
    );

    // Render Customer Standards form
    const renderCustomerStandardsForm = () => (
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingId && editingType === 'customer_standard' ? 'Edit Customer Standard' : 'Add New Customer Standard'}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Standard Name *</label>
                    <input
                        type="text"
                        value={newCustomerStandard.standard_name}
                        onChange={(e) => setNewCustomerStandard((prev) => ({ ...prev, standard_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="e.g., IWAY Standard 6.0"
                    />
                </div>


                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Acceptance Date *</label>
                    <input
                        type="date"
                        value={newCustomerStandard.acceptance_date}
                        onChange={(e) => setNewCustomerStandard((prev) => ({ ...prev, acceptance_date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>

             

               
            </div>

            <div className="flex justify-end gap-3 mt-6">
                {(editingId || editingType) && (
                    <button onClick={handleCancelEdit} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        Cancel
                    </button>
                )}
                <button
                    onClick={editingId && editingType === 'customer_standard' ? handleUpdateCustomerStandard : handleAddCustomerStandard}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : editingId && editingType === 'customer_standard' ? 'Update Standard' : 'Add Standard'}
                </button>
            </div>
        </div>
    );

    // Render Self Assessment form
    const renderSelfAssessmentForm = () => (
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingId && editingType === 'self_assessment' ? 'Edit Self Assessment' : 'Add New Self Assessment'}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Particulars *</label>
                    <input
                        type="text"
                        value={newSelfAssessment.particulars}
                        onChange={(e) => setNewSelfAssessment((prev) => ({ ...prev, particulars: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="e.g., Factory has proper fire safety equipment"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                    <textarea
                        value={newSelfAssessment.details}
                        onChange={(e) => setNewSelfAssessment((prev) => ({ ...prev, details: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        rows="3"
                        placeholder="Enter details or description"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="status"
                                value="yes"
                                checked={newSelfAssessment.status === 'yes'}
                                onChange={(e) => setNewSelfAssessment((prev) => ({ ...prev, status: e.target.value }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="status"
                                value="no"
                                checked={newSelfAssessment.status === 'no'}
                                onChange={(e) => setNewSelfAssessment((prev) => ({ ...prev, status: e.target.value }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">No</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                {(editingId || editingType) && (
                    <button onClick={handleCancelEdit} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        Cancel
                    </button>
                )}
                <button
                    onClick={editingId && editingType === 'self_assessment' ? handleUpdateSelfAssessment : handleAddSelfAssessment}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : editingId && editingType === 'self_assessment' ? 'Update Assessment' : 'Add Assessment'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Supplier Checklists</h1>
                            <p className="text-gray-600 mt-2">Manage customer standards and self-assessment checklists for suppliers</p>
                        </div>

                        <div className="hidden md:flex items-center gap-4">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">{customerStandards.length}</div>
                                <div className="text-sm text-gray-600">Customer Standards</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="text-2xl font-bold text-emerald-600">{selfAssessments.length}</div>
                                <div className="text-sm text-gray-600">Self Assessments</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                {renderFilters()}

                {/* Customer Standards Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <IconShield className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">List of Customer Standards Communicated</h2>
                                    <p className="text-gray-600 text-sm mt-1">Standards communicated by ASIAN and other customers</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {renderCustomerStandardsForm()}

                        <Table
                            columns={customerStandardsColumns}
                            data={customerStandards}
                            pageSize={5}
                            pageIndex={0}
                            totalCount={customerStandards.length}
                            totalPages={Math.ceil(customerStandards.length / 5)}
                            onPaginationChange={(pageIndex, pageSize) => {}}
                            loading={isLoading}
                            emptyMessage={
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <IconShield className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No customer standards found</h3>
                                    <p className="text-gray-600">Add your first customer standard above</p>
                                </div>
                            }
                        />
                    </div>
                </div>

                {/* Self Assessment Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <IconClipboardList className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Supplier General Self Assessment</h2>
                                    <p className="text-gray-600 text-sm mt-1">Self-assessment checklist for supplier compliance</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {renderSelfAssessmentForm()}

                        <Table
                            columns={selfAssessmentColumns}
                            data={selfAssessments}
                            pageSize={5}
                            pageIndex={0}
                            totalCount={selfAssessments.length}
                            totalPages={Math.ceil(selfAssessments.length / 5)}
                            onPaginationChange={(pageIndex, pageSize) => {}}
                            loading={isLoading}
                            emptyMessage={
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <IconClipboardList className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No self assessment items found</h3>
                                    <p className="text-gray-600">Add your first self assessment above</p>
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupplierChecklists;
