// src/pages/suppliers/Index.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../util/Table';
import FormLayout from '../../../util/formLayout';
import { findArrObj, showConfirmationDialog, showMessage, formatDate } from '../../../util/AllFunction';
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
import IconDownload from '../../../components/Icon/IconDownload';
import IconUpload from '../../../components/Icon/IconCloudDownload';
import IconRefresh from '../../../components/Icon/IconRefresh';
import IconUser from '../../../components/Icon/IconUser';
import IconPrinter from '../../../components/Icon/IconPrinter';
import IconPlus from '../../../components/Icon/IconPlus';
import IconSearch from '../../../components/Icon/IconSearch';
import IconFilter from '../../../components/Icon/IconAirplay';
import IconX from '../../../components/Icon/IconX';
import IconChevronDown from '../../../components/Icon/IconChevronDown';
import IconChevronUp from '../../../components/Icon/IconChevronUp';
import IconChevronLeft from '../../../components/Icon/IconChevronLeft';
import IconSave from '../../../components/Icon/IconSave';
import IconCancel from '../../../components/Icon/IconX';
import IconBank from '../../../components/Icon/IconCreditCard';
import IconFactory from '../../../components/Icon/IconBuilding';
import IconTools from '../../../components/Icon/IconCpuBolt';
import IconClockIcon from '../../../components/Icon/IconClock';
import IconLicense from '../../../components/Icon/IconFile';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconShield from '../../../components/Icon/IconShield';
import IconClipboardList from '../../../components/Icon/IconChartBar';
import IconCheck from '../../../components/Icon/IconCheck';

// Import supplier configuration
import { supplierTabs, optionLists, masterStandards, masterAssessmentItems, staticSuppliersData, getStatusBadge, getKycBadge, getAuditBadge } from './SupplierFormContainer';

function Suppliers() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
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
    const [suppliers, setSuppliers] = useState(staticSuppliersData);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [isKYC, setIsKYC] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Form states
    const [state, setState] = useState({});
    const [arrVal, setArrVal] = useState({
        machinery_details: [],
        manpower_details: [],
        customer_standards: [],
        self_assessment: [],
    });
    const [deletedItems, setDeletedItems] = useState({
        machinery_details: [],
        manpower_details: [],
        customer_standards: [],
        self_assessment: [],
    });
    const [temporarilyHidden, setTemporarilyHidden] = useState({
        machinery_details: [],
        manpower_details: [],
        customer_standards: [],
        self_assessment: [],
    });
    const [tabIndex, setTabIndex] = useState(0);
    const [errors, setErrors] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [activeMultiAddTab, setActiveMultiAddTab] = useState(null);

    // Selection states for standards and assessments
    const [selectedStandardIds, setSelectedStandardIds] = useState([]);
    const [selectedAssessmentIds, setSelectedAssessmentIds] = useState([]);
    const [isSelectingStandards, setIsSelectingStandards] = useState(false);
    const [isSelectingAssessments, setIsSelectingAssessments] = useState(false);

    // Pagination
    const [paginationState, setPaginationState] = useState({
        pageIndex: 0,
        pageSize: 10,
        searchTerm: '',
    });

    // Check mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Filter suppliers
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((supplier) => {
            const matchesSearch =
                !searchTerm ||
                supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supplier.supplier_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supplier.responsible_person_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supplier.district?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = selectedStatus === 'all' || supplier.status === selectedStatus;
            const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [suppliers, searchTerm, selectedStatus, selectedCategory]);

    // Get unique categories
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(suppliers.map((s) => s.category))];
        return ['all', ...uniqueCategories];
    }, [suppliers]);

    // Status options
    const statusOptions = ['all', 'active', 'inactive', 'pending'];

    // ========== ALL REQUIRED HANDLER FUNCTIONS ==========

    // Reset form
    const resetForm = () => {
        setState({});
        setArrVal({
            machinery_details: [],
            manpower_details: [],
            customer_standards: [],
            self_assessment: [],
        });
        setDeletedItems({
            machinery_details: [],
            manpower_details: [],
            customer_standards: [],
            self_assessment: [],
        });
        setTemporarilyHidden({
            machinery_details: [],
            manpower_details: [],
            customer_standards: [],
            self_assessment: [],
        });
        setErrors([]);
        setValidationErrors({});
        setTabIndex(0);
        setActiveMultiAddTab(null);
        setSelectedStandardIds([]);
        setSelectedAssessmentIds([]);
        setIsSelectingStandards(false);
        setIsSelectingAssessments(false);
    };

    // Handle cancel
    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            setIsCreateMode(false);
            setIsEditMode(false);
            setIsKYC(false);
            setSelectedSupplier(null);
            resetForm();
            showMessage('info', 'Changes discarded');
        }
    };

    // Handle create new supplier
    const handleCreateSupplier = () => {
        setIsCreateMode(true);
        setIsEditMode(false);
        setIsKYC(false);
        setSelectedSupplier(null);
        resetForm();
        showMessage('info', 'Creating new supplier...');
    };

    // Handle edit supplier
    const handleEditSupplier = (supplier) => {
        setIsEditMode(true);
        setIsCreateMode(false);
        setIsKYC(false);
        setSelectedSupplier(supplier);
        loadSupplierData(supplier);
        showMessage('info', `Editing ${supplier.supplier_name}...`);
    };

    // Load supplier data for form
    const loadSupplierData = (supplier) => {
        const supplierData = getStaticSupplierData(supplier.supplier_id);
        setState(supplierData.basicInfo || {});
        setArrVal({
            machinery_details: supplierData.machineryDetails || [],
            manpower_details: supplierData.manpowerDetails || [],
            customer_standards: supplierData.customerStandards || [],
            self_assessment: supplierData.selfAssessment || [],
        });

        // Set selected IDs for standards and assessments
        if (supplierData.customerStandards) {
            setSelectedStandardIds(supplierData.customerStandards.map((item) => item.standard_id));
        }
        if (supplierData.selfAssessment) {
            setSelectedAssessmentIds(supplierData.selfAssessment.map((item) => item.item_id));
        }
    };

    // Get static supplier data for demo
    const getStaticSupplierData = (supplierId) => {
        const dataMap = {
            'SUP-001': {
                basicInfo: {
                    supplier_name: 'Asian Fabrics Private Limited',
                    factory_address: '54, L.B.4, N23AY, KAYAY',
                    panchayat: 'Kayay Panchayat',
                    post_office: 'Kayay PO',
                    police_station: 'Kayay Police Station',
                    district: 'Tirupur',
                    state_province: 'Tamil Nadu',
                    region: 'South India',
                    postal_code: '600001',
                    phone: '7800000156',
                    landmark: 'Near Textile Park',
                    email: 'info@asianfabrics.com',
                    website: 'www.asianfabrics.com',
                    year_of_establishment: 2005,
                    gps_latitude: '12.9716',
                    gps_longitude: '77.5946',

                    // Responsible Person
                    responsible_person_name: 'Key Blazer',
                    designation: 'General Manager',
                    father_name: 'John Blazer',
                    mobile_number: '7800000156',
                    landline: '044-1234567',

                    // Accounts Details
                    account_name: 'Asian Fabrics Pvt Ltd',
                    bank_and_place: 'State Bank of India, Kayay Branch',
                    account_number: '123456789012',
                    ifsc_micr: 'SBIN0001234',
                    gstin_number: '33AAECA1234A1Z5',
                    cin_number: 'U17110TN2005PTC056789',
                    pan_number: 'AAECA1234A',
                    tan_number: 'CHNA12345A',
                    annual_turnover: 50000000,
                    business_start_date: '2020-01-15',
                    factory_owner_name: 'John Doe',
                    ownership_type: 'private_limited',
                    joint_venture_name: '',
                    direct_business: true,
                    customer_names: 'Brand A, Brand B, Brand C',

                    // Machinery Categories
                    machine_categories: ['power_loom', 'dyeing'],
                    other_machinery: '',

                    // Production Capacity
                    capacity_unit: 'meters',
                    total_per_day_article1: 1000,
                    total_per_day_article2: 800,
                    total_per_day_article3: 600,
                    total_per_day_article4: 400,
                    total_per_day_article5: 200,
                    share_percent_article1: 60,
                    share_percent_article2: 50,
                    share_percent_article3: 40,
                    share_percent_article4: 30,
                    share_percent_article5: 20,

                    // Man Power
                    average_wages_per_month: 25000,
                    accident_insurance_number: 'INS123456789',
                    insurance_validity_date: '2026-12-31',

                    // Working Hours
                    number_of_shifts: 2,
                    shift_1_start: '07:00',
                    shift_1_end: '15:00',
                    shift_2_start: '15:00',
                    shift_2_end: '23:00',
                    general_shift_start: '09:00',
                    general_shift_end: '18:00',
                    week_off_day: 'Sunday',
                    max_ot_hours_per_week: 12,

                    // License Details
                    factory_license_number: 'FACT/1234/2020',
                    factory_license_validity: '2027-03-31',
                    pf_number: 'TN/TPR/1234567890',
                    last_pf_challan_paid: '2025-12-01',
                    esi_number: 'ESI123456789',
                    last_esi_challan_paid: '2025-12-01',
                    tnpcb_air_consent: 'TNPCB/AIR/123/2020',
                    tnpcb_air_validity: '2026-12-31',
                    tnpcb_water_consent: 'TNPCB/WATER/456/2020',
                    tnpcb_water_validity: '2026-12-31',
                },
                machineryDetails: [
                    { id: 1, si_no: 1, machine_type: 'Power Loom', no_of_machines: 50 },
                    { id: 2, si_no: 2, machine_type: 'Dyeing Machine', no_of_machines: 10 },
                    { id: 3, si_no: 3, machine_type: 'Finishing Machine', no_of_machines: 5 },
                ],
                manpowerDetails: [
                    { id: 1, category: 'Production', male_count: 100, female_count: 50, total_numbers: 150 },
                    { id: 2, category: 'Quality Check', male_count: 10, female_count: 15, total_numbers: 25 },
                    { id: 3, category: 'Supervision', male_count: 5, female_count: 2, total_numbers: 7 },
                ],
                customerStandards: [
                    { id: 1, standard_id: 1, standard_name: 'IWAY Standard 6.0', customer_type: 'ASIAN', acceptance_date: '2024-01-15', status: 'accepted', version: '6.0' },
                    {
                        id: 2,
                        standard_id: 2,
                        standard_name: 'BSCI Code of Conduct',
                        customer_type: 'Other',
                        customer_name: 'Brand X',
                        acceptance_date: '2024-02-20',
                        status: 'pending',
                        version: '2.0',
                    },
                ],
                selfAssessment: [
                    { id: 1, item_id: 1, particulars: 'Factory has proper fire safety equipment', details: 'All fire extinguishers are checked monthly', status: 'yes' },
                    { id: 2, item_id: 2, particulars: 'Emergency exits are clearly marked and accessible', details: 'Exits marked with glow signs', status: 'yes' },
                    { id: 3, item_id: 8, particulars: 'No child labor employed', details: 'All employees above 18 years', status: 'yes' },
                ],
            },
        };
        return dataMap[supplierId] || {};
    };

    // Handle filter change
    const handleFilterChange = (filterType, value) => {
        if (filterType === 'status') {
            setSelectedStatus(value);
        } else if (filterType === 'category') {
            setSelectedCategory(value);
        }
        setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
    };

    // Handle KYC view
    const handleKycView = (supplier) => {
        setSelectedSupplier(supplier);
        setIsKYC(true);
        setIsEditMode(false);
        setIsCreateMode(false);
        showMessage('info', `Viewing KYC for ${supplier.supplier_name}`);
    };

    // Handle delete supplier
    const handleDeleteSupplier = async (id) => {
        const supplier = suppliers.find((s) => s.id === id);
        if (!supplier) return;

        const confirmed = await showConfirmationDialog(`Delete ${supplier.supplier_name}?`, 'This action cannot be undone. All associated data will be permanently removed.');

        if (confirmed) {
            setIsLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 800));
                setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
                showMessage('success', `${supplier.supplier_name} deleted successfully`);
            } catch (error) {
                showMessage('error', 'Failed to delete supplier');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle form submit
    const handleFormSubmit = async () => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Calculate manpower totals
            const manpowerData = arrVal.manpower_details || [];
            const totalMale = manpowerData.reduce((sum, item) => sum + (parseInt(item.male_count) || 0), 0);
            const totalFemale = manpowerData.reduce((sum, item) => sum + (parseInt(item.female_count) || 0), 0);
            const totalEmployees = totalMale + totalFemale;

            if (isEditMode && selectedSupplier) {
                // Update existing supplier
                const updatedSupplier = {
                    ...selectedSupplier,
                    ...state,
                    total_male_count: totalMale,
                    total_female_count: totalFemale,
                    total_employees: totalEmployees,
                    customer_standards: arrVal.customer_standards,
                    self_assessment: arrVal.self_assessment,
                    last_updated: moment().format('YYYY-MM-DD HH:mm:ss'),
                };
                setSuppliers((prev) => prev.map((supplier) => (supplier.id === selectedSupplier.id ? updatedSupplier : supplier)));
                showMessage('success', 'Supplier updated successfully');
            } else {
                // Create new supplier
                const newSupplier = {
                    id: suppliers.length + 1,
                    supplier_id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
                    ...state,
                    total_male_count: totalMale,
                    total_female_count: totalFemale,
                    total_employees: totalEmployees,
                    customer_standards: arrVal.customer_standards,
                    self_assessment: arrVal.self_assessment,
                    status: 'active',
                    kyc_status: 'pending',
                    created_date: moment().format('YYYY-MM-DD'),
                    last_updated: moment().format('YYYY-MM-DD HH:mm:ss'),
                    last_audit_date: moment().format('YYYY-MM-DD'),
                    next_audit_date: moment().add(6, 'months').format('YYYY-MM-DD'),
                    branch_name: userData?.branchName || 'Main Branch',
                    branch_id: userBranchId || 'BR-001',
                    machinery_details: arrVal.machinery_details || [],
                    manpower_details: arrVal.manpower_details || [],
                };
                setSuppliers((prev) => [...prev, newSupplier]);
                showMessage('success', 'Supplier created successfully');
            }

            // Reset form
            handleCancel();
        } catch (error) {
            console.error('Save error:', error);
            showMessage('error', 'Failed to save supplier');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle multi-add operations
    const handleMultiAdd = (tabName, data) => {
        setArrVal((prev) => ({
            ...prev,
            [tabName]: [...(prev[tabName] || []), { id: uuidv4(), ...data }],
        }));
        setState({});
        setActiveMultiAddTab(null);
    };

    const handleMultiEdit = (tabName, id, data) => {
        setArrVal((prev) => ({
            ...prev,
            [tabName]: (prev[tabName] || []).map((item) => (item.id === id ? { ...item, ...data } : item)),
        }));
        setState({});
        setActiveMultiAddTab(null);
    };

    const handleMultiDelete = (tabName, id) => {
        setArrVal((prev) => ({
            ...prev,
            [tabName]: (prev[tabName] || []).filter((item) => item.id !== id),
        }));
    };

    // Handle temporary delete
    const handleTemporaryDelete = (tabName, id) => {
        setTemporarilyHidden((prev) => ({
            ...prev,
            [tabName]: [...(prev[tabName] || []), id],
        }));
        setDeletedItems((prev) => ({
            ...prev,
            [tabName]: [...(prev[tabName] || []), id],
        }));
        showMessage('warning', 'Item marked for deletion. Click Save to confirm.');
    };

    const handleRestoreItem = (tabName, id) => {
        setTemporarilyHidden((prev) => ({
            ...prev,
            [tabName]: (prev[tabName] || []).filter((itemId) => itemId !== id),
        }));
        setDeletedItems((prev) => ({
            ...prev,
            [tabName]: (prev[tabName] || []).filter((itemId) => itemId !== id),
        }));
        showMessage('success', 'Item restored successfully');
    };

    // Standards Selection Functions
    const handleSelectStandards = () => {
        setIsSelectingStandards(true);
    };

    const handleSaveSelectedStandards = () => {
        const selectedStandards = masterStandards.filter((standard) => selectedStandardIds.includes(standard.id));

        // Filter out already added standards
        const existingStandardIds = arrVal.customer_standards.map((item) => item.standard_id);
        const newStandards = selectedStandards
            .filter((standard) => !existingStandardIds.includes(standard.id))
            .map((standard) => ({
                id: uuidv4(),
                standard_id: standard.id,
                standard_name: standard.name,
                version: standard.version,
                customer_type: '',
                customer_name: '',
                acceptance_date: '',
                status: 'pending',
                details: '',
            }));

        setArrVal((prev) => ({
            ...prev,
            customer_standards: [...prev.customer_standards, ...newStandards],
        }));

        setIsSelectingStandards(false);
        setSelectedStandardIds([]);
        showMessage('success', `${newStandards.length} standards added successfully`);
    };

    const handleUpdateStandard = (id, updates) => {
        setArrVal((prev) => ({
            ...prev,
            customer_standards: prev.customer_standards.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        }));
    };

    const handleDeleteStandard = (id) => {
        setArrVal((prev) => ({
            ...prev,
            customer_standards: prev.customer_standards.filter((item) => item.id !== id),
        }));
    };

    // Assessment Selection Functions
    const handleSelectAssessments = () => {
        setIsSelectingAssessments(true);
    };

    const handleSaveSelectedAssessments = () => {
        const selectedAssessments = masterAssessmentItems.filter((item) => selectedAssessmentIds.includes(item.id));

        // Filter out already added assessments
        const existingItemIds = arrVal.self_assessment.map((item) => item.item_id);
        const newAssessments = selectedAssessments
            .filter((item) => !existingItemIds.includes(item.id))
            .map((item) => ({
                id: uuidv4(),
                item_id: item.id,
                particulars: item.particulars,
                category: item.category,
                details: '',
                status: '',
            }));

        setArrVal((prev) => ({
            ...prev,
            self_assessment: [...prev.self_assessment, ...newAssessments],
        }));

        setIsSelectingAssessments(false);
        setSelectedAssessmentIds([]);
        showMessage('success', `${newAssessments.length} assessment items added successfully`);
    };

    const handleUpdateAssessment = (id, updates) => {
        setArrVal((prev) => ({
            ...prev,
            self_assessment: prev.self_assessment.map((item) => (item.id === id ? { ...item, ...updates } : item)),
        }));
    };

    const handleDeleteAssessment = (id) => {
        setArrVal((prev) => ({
            ...prev,
            self_assessment: prev.self_assessment.filter((item) => item.id !== id),
        }));
    };

    // Wizard navigation
    const handleNext = () => {
        if (tabIndex < supplierTabs.length - 1) {
            setTabIndex((prev) => prev + 1);
        } else {
            handleFormSubmit();
        }
    };

    const handlePrevious = () => {
        if (tabIndex > 0) {
            setTabIndex((prev) => prev - 1);
        }
    };

    // Validate current tab
    const validateCurrentTab = () => {
        const currentTab = supplierTabs[tabIndex];
        const errors = {};

        if (!currentTab.children) return errors;

        currentTab.children.forEach((section) => {
            section.formFields.forEach((field) => {
                if (field.require && !state[field.name]) {
                    errors[field.name] = `${field.label} is required`;
                }
            });
        });

        return errors;
    };

    // ========== RENDER FUNCTIONS ==========

    // Enhanced search and filter controls
    const renderFilters = () => (
        <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IconSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    ref={searchRef}
                    type="text"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Search suppliers by name, ID, or contact..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
                    }}
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <IconX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>

            {/* Filters Toggle */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                    <IconFilter className="w-4 h-4" />
                    Filters
                    {showFilters ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
                </button>

                {accessIds.includes('2') && !isCreateMode && !isEditMode && (
                    <button
                        onClick={handleCreateSupplier}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow text-sm font-medium"
                    >
                        <IconPlus className="w-4 h-4" />
                        Add Supplier
                    </button>
                )}
            </div>

            {/* Filter Controls */}
            {showFilters && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleFilterChange('status', status)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            selectedStatus === status ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredSuppliers.length}</span> suppliers
                </p>
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Clear search
                    </button>
                )}
            </div>
        </div>
    );

    // Customer Standards Component
    const CustomerStandardsComponent = () => {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Customer Standards</h3>
                                <p className="text-sm text-gray-600">Select standards from master and fill supplier-specific details</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleSelectStandards}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <IconPlus className="w-4 h-4" />
                                Select Standards
                            </button>
                        </div>
                    </div>

                    {arrVal.customer_standards.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acceptance Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {arrVal.customer_standards.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.standard_name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{item.version}</td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={item.customer_type}
                                                    onChange={(e) => handleUpdateStandard(item.id, { customer_type: e.target.value })}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="ASIAN">ASIAN</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={item.customer_name || ''}
                                                    onChange={(e) => handleUpdateStandard(item.id, { customer_name: e.target.value })}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                    placeholder={item.customer_type === 'Other' ? 'Enter customer name' : 'ASIAN'}
                                                    disabled={item.customer_type !== 'Other'}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="date"
                                                    value={item.acceptance_date || ''}
                                                    onChange={(e) => handleUpdateStandard(item.id, { acceptance_date: e.target.value })}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleUpdateStandard(item.id, { status: e.target.value })}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="accepted">Accepted</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button type="button" onClick={() => handleDeleteStandard(item.id)} className="text-rose-600 hover:text-rose-900" title="Delete">
                                                    <IconTrashLines className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="text-gray-400 mb-2">
                                <IconShield className="w-12 h-12 mx-auto opacity-50" />
                            </div>
                            <p className="text-gray-500 text-sm">No customer standards added yet</p>
                            <p className="text-gray-400 text-xs mt-1">Click "Select Standards" to add from master list</p>
                        </div>
                    )}
                </div>

                {/* Standards Selection Modal */}
                {isSelectingStandards && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Select Customer Standards</h3>
                                        <p className="text-sm text-gray-600">Choose standards from master list</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsSelectingStandards(false);
                                            setSelectedStandardIds([]);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <IconX className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {masterStandards.map((standard) => (
                                            <div key={standard.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`standard-${standard.id}`}
                                                                checked={selectedStandardIds.includes(standard.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedStandardIds((prev) => [...prev, standard.id]);
                                                                    } else {
                                                                        setSelectedStandardIds((prev) => prev.filter((id) => id !== standard.id));
                                                                    }
                                                                }}
                                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                            />
                                                            <label htmlFor={`standard-${standard.id}`} className="text-sm font-medium text-gray-900">
                                                                {standard.name}
                                                            </label>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mb-1">Version: {standard.version}</div>
                                                        <p className="text-xs text-gray-600">{standard.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-600">{selectedStandardIds.length} standard(s) selected</div>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsSelectingStandards(false);
                                                    setSelectedStandardIds([]);
                                                }}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSaveSelectedStandards}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                            >
                                                Add Selected Standards
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const MultiAddTable = ({ tabName, fields, data }) => {
        const currentData = arrVal[tabName] || [];
        const hiddenItems = temporarilyHidden[tabName] || [];

        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">{tabName === 'machinery_details' ? 'Machinery Details' : 'Manpower Details'}</h3>
                        <button
                            type="button"
                            onClick={() => setActiveMultiAddTab(tabName)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <IconPlus className="w-4 h-4" />
                            Add New
                        </button>
                    </div>
                </div>

                {currentData.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    {fields.map((field, idx) => (
                                        <th key={idx} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {field.label}
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentData
                                    .filter((item) => !hiddenItems.includes(item.id))
                                    .map((item, idx) => (
                                        <tr key={item.id || idx} className="hover:bg-gray-50">
                                            {fields.map((field, fieldIdx) => (
                                                <td key={fieldIdx} className="px-4 py-3 text-sm text-gray-900">
                                                    {field.calculate ? field.calculate(item) : item[field.name]}
                                                </td>
                                            ))}
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setState(item);
                                                            setActiveMultiAddTab(tabName);
                                                        }}
                                                        className="text-emerald-600 hover:text-emerald-900"
                                                        title="Edit"
                                                    >
                                                        <IconPencil className="w-4 h-4" />
                                                    </button>
                                                    <button type="button" onClick={() => handleTemporaryDelete(tabName, item.id)} className="text-rose-600 hover:text-rose-900" title="Delete">
                                                        <IconTrashLines className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="text-gray-400 mb-2">{tabName === 'machinery_details' ? '⚙️' : '👥'}</div>
                        <p className="text-gray-500 text-sm">No {tabName === 'machinery_details' ? 'machinery' : 'manpower'} details added yet</p>
                    </div>
                )}

                {/* Temporarily hidden items */}
                {hiddenItems.length > 0 && (
                    <div className="p-4 bg-amber-50 border-t border-amber-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-amber-600 text-sm">{hiddenItems.length} item(s) marked for deletion</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    hiddenItems.forEach((id) => handleRestoreItem(tabName, id));
                                }}
                                className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                            >
                                Restore All
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };
    // Multi-add form modal
    const MultiAddForm = ({ tabName, fields }) => {
        const handleSubmit = (e) => {
            e.preventDefault();
            const data = {};
            fields.forEach((field) => {
                data[field.name] = state[field.name] || '';
            });

            if (state.id) {
                handleMultiEdit(tabName, state.id, data);
            } else {
                handleMultiAdd(tabName, data);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {state.id ? 'Edit' : 'Add'} {tabName === 'machinery_details' ? 'Machinery' : 'Manpower'} Detail
                            </h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setState({});
                                    setActiveMultiAddTab(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <IconX className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {fields.map((field, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {field.label}
                                        {field.require && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    {field.inputType === 'select' ? (
                                        <select
                                            value={state[field.name] || ''}
                                            onChange={(e) => setState((prev) => ({ ...prev, [field.name]: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            required={field.require}
                                        >
                                            <option value="">Select {field.label}</option>
                                            {field.options?.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.inputType === 'number' ? 'number' : 'text'}
                                            value={state[field.name] || ''}
                                            onChange={(e) => setState((prev) => ({ ...prev, [field.name]: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder={field.placeholder}
                                            required={field.require}
                                            min={field.min}
                                            readOnly={field.readOnly}
                                            disabled={field.readOnly}
                                        />
                                    )}
                                </div>
                            ))}

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setState({});
                                        setActiveMultiAddTab(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                    {state.id ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    // Self Assessment Component
    const SelfAssessmentComponent = () => {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Self Assessment Checklist</h3>
                                <p className="text-sm text-gray-600">Select items from master and fill supplier-specific details</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleSelectAssessments}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                            >
                                <IconPlus className="w-4 h-4" />
                                Select Assessment Items
                            </button>
                        </div>
                    </div>

                    {arrVal.self_assessment.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Particulars</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {arrVal.self_assessment.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.particulars}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">{item.category}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <textarea
                                                    value={item.details || ''}
                                                    onChange={(e) => handleUpdateAssessment(item.id, { details: e.target.value })}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                    placeholder="Enter details..."
                                                    rows={2}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={`status-${item.id}`}
                                                            value="yes"
                                                            checked={item.status === 'yes'}
                                                            onChange={(e) => handleUpdateAssessment(item.id, { status: e.target.value })}
                                                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                                                    </label>
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={`status-${item.id}`}
                                                            value="no"
                                                            checked={item.status === 'no'}
                                                            onChange={(e) => handleUpdateAssessment(item.id, { status: e.target.value })}
                                                            className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">No</span>
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button type="button" onClick={() => handleDeleteAssessment(item.id)} className="text-rose-600 hover:text-rose-900" title="Delete">
                                                    <IconTrashLines className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="text-gray-400 mb-2">
                                <IconClipboardList className="w-12 h-12 mx-auto opacity-50" />
                            </div>
                            <p className="text-gray-500 text-sm">No assessment items added yet</p>
                            <p className="text-gray-400 text-xs mt-1">Click "Select Assessment Items" to add from master list</p>
                        </div>
                    )}
                </div>

                {/* Assessment Selection Modal */}
                {isSelectingAssessments && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Select Self Assessment Items</h3>
                                        <p className="text-sm text-gray-600">Choose assessment items from master list</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsSelectingAssessments(false);
                                            setSelectedAssessmentIds([]);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <IconX className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        {masterAssessmentItems.map((item) => (
                                            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`assessment-${item.id}`}
                                                                checked={selectedAssessmentIds.includes(item.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedAssessmentIds((prev) => [...prev, item.id]);
                                                                    } else {
                                                                        setSelectedAssessmentIds((prev) => prev.filter((id) => id !== item.id));
                                                                    }
                                                                }}
                                                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                                            />
                                                            <label htmlFor={`assessment-${item.id}`} className="text-sm font-medium text-gray-900">
                                                                {item.particulars}
                                                            </label>
                                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">{item.category}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-600">{selectedAssessmentIds.length} item(s) selected</div>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsSelectingAssessments(false);
                                                    setSelectedAssessmentIds([]);
                                                }}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSaveSelectedAssessments}
                                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                                            >
                                                Add Selected Items
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Production capacity table component
    const ProductionCapacityTable = () => {
        const articles = [
            { name: 'article1', label: 'Article 1' },
            { name: 'article2', label: 'Article 2' },
            { name: 'article3', label: 'Article 3' },
            { name: 'article4', label: 'Article 4' },
            { name: 'article5', label: 'Article 5' },
        ];

        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">Article-wise Production Capacity</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity Type</th>
                                {articles.map((article) => (
                                    <th key={article.name} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {article.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Per Day in KG./Mtrs/Pcs</td>
                                {articles.map((article) => (
                                    <td key={article.name} className="px-4 py-3">
                                        <input
                                            type="number"
                                            value={state[`total_per_day_${article.name}`] || ''}
                                            onChange={(e) => setState((prev) => ({ ...prev, [`total_per_day_${article.name}`]: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">% Share for ASIAN Article</td>
                                {articles.map((article) => (
                                    <td key={article.name} className="px-4 py-3">
                                        <input
                                            type="number"
                                            value={state[`share_percent_${article.name}`] || ''}
                                            onChange={(e) => setState((prev) => ({ ...prev, [`share_percent_${article.name}`]: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder="0"
                                            min="0"
                                            max="100"
                                        />
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity Unit</label>
                            <select
                                value={state.capacity_unit || ''}
                                onChange={(e) => setState((prev) => ({ ...prev, capacity_unit: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="">Select Unit</option>
                                {optionLists.capacityUnits?.map((unit) => (
                                    <option key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    // Checkbox group component
    const CheckboxGroup = ({ name, label, options, require }) => {
        const currentValues = state[name] || [];

        const handleChange = (value, checked) => {
            if (checked) {
                setState((prev) => ({ ...prev, [name]: [...currentValues, value] }));
            } else {
                setState((prev) => ({ ...prev, [name]: currentValues.filter((v) => v !== value) }));
            }
        };

        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {require && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {options.map((option) => (
                        <div key={option.value} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`${name}_${option.value}`}
                                checked={currentValues.includes(option.value)}
                                onChange={(e) => handleChange(option.value, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`${name}_${option.value}`} className="ml-2 text-sm text-gray-700">
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Main form render function
    const renderForm = () => {
        const currentTab = supplierTabs[tabIndex];
        const validationErrors = validateCurrentTab();

        if (isKYC) {
            return renderKYCView();
        }

        return (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">{currentTab.icon}</div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{isEditMode ? 'Edit Supplier' : 'Create New Supplier'}</h2>
                                <p className="text-blue-100 text-sm mt-1">
                                    {currentTab.label} • Step {tabIndex + 1} of {supplierTabs.length}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                                <IconCancel className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium font-semibold"
                            >
                                <IconSave className="w-4 h-4" />
                                {tabIndex === supplierTabs.length - 1 ? (isEditMode ? 'Update Supplier' : 'Create Supplier') : 'Next Step'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between overflow-x-auto">
                        {supplierTabs.map((tabItem, index) => (
                            <div key={tabItem.name} className="flex items-center flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (index <= tabIndex) {
                                            setTabIndex(index);
                                        }
                                    }}
                                    className={`flex items-center gap-2 ${index <= tabIndex ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            index === tabIndex
                                                ? 'bg-blue-100 text-blue-600 border-2 border-blue-500'
                                                : index < tabIndex
                                                  ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500'
                                                  : 'bg-gray-200 text-gray-500 border-2 border-gray-300'
                                        }`}
                                    >
                                        {index < tabIndex ? '✓' : index + 1}
                                    </div>
                                    <span className={`text-sm font-medium ${index === tabIndex ? 'text-blue-600' : index < tabIndex ? 'text-emerald-600' : 'text-gray-500'}`}>{tabItem.label}</span>
                                </button>
                                {index < supplierTabs.length - 1 && <div className={`h-0.5 w-8 mx-2 ${index < tabIndex ? 'bg-emerald-500' : 'bg-gray-300'}`} />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600">Loading supplier form...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Current Section Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{currentTab.children?.[0]?.title || currentTab.label}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{currentTab.children?.[0]?.subtitle || 'Fill in the required information'}</p>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6">
                                {currentTab.children?.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="space-y-6">
                                        {sectionIndex > 0 && (
                                            <div className="pt-6 border-t border-gray-200">
                                                <h4 className="text-md font-semibold text-gray-800 mb-4">{section.title}</h4>
                                            </div>
                                        )}

                                        {currentTab.name === 'machineryDetails' ? (
                                            <>
                                                <MultiAddTable
                                                    tabName="machinery_details"
                                                    fields={[
                                                        { name: 'si_no', label: 'SI No', inputType: 'number' },
                                                        { name: 'machine_type', label: 'Type of Machine', inputType: 'text' },
                                                        { name: 'no_of_machines', label: 'No of Machines', inputType: 'number' },
                                                    ]}
                                                    data={arrVal.machinery_details}
                                                />
                                                <CheckboxGroup
                                                    name="machine_categories"
                                                    label="Category of Machinery"
                                                    options={[
                                                        { value: 'hand_loom', label: 'Hand Loom' },
                                                        { value: 'power_loom', label: 'Power Loom' },
                                                        { value: 'auto_loom', label: 'Auto Loom' },
                                                        { value: 'dyeing', label: 'Dyeing' },
                                                        { value: 'printing', label: 'Printing' },
                                                        { value: 'others', label: 'Others' },
                                                    ]}
                                                    require={true}
                                                />
                                                {state.machine_categories?.includes('others') && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Specify Others</label>
                                                        <input
                                                            type="text"
                                                            value={state.other_machinery || ''}
                                                            onChange={(e) => setState((prev) => ({ ...prev, other_machinery: e.target.value }))}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                            placeholder="Specify other machinery types"
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        ) : currentTab.name === 'productionCapacity' ? (
                                            <ProductionCapacityTable />
                                        ) : currentTab.name === 'manPower' ? (
                                            <>
                                                <MultiAddTable
                                                    tabName="manpower_details"
                                                    fields={[
                                                        { name: 'category', label: 'Category', inputType: 'text' },
                                                        { name: 'male_count', label: 'Male', inputType: 'number' },
                                                        { name: 'female_count', label: 'Female', inputType: 'number' },
                                                        {
                                                            name: 'total_numbers',
                                                            label: 'Total Number',
                                                            inputType: 'number',
                                                            readOnly: true,
                                                            calculate: (item) => {
                                                                const male = parseInt(item.male_count) || 0;
                                                                const female = parseInt(item.female_count) || 0;
                                                                return male + female;
                                                            },
                                                        },
                                                    ]}
                                                    data={arrVal.manpower_details}
                                                />
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Average Wages Paid Per Month (₹)
                                                            <span className="text-red-500 ml-1">*</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={state.average_wages_per_month || ''}
                                                            onChange={(e) => setState((prev) => ({ ...prev, average_wages_per_month: e.target.value }))}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                            placeholder="0"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Accident Insurance Number
                                                            <span className="text-red-500 ml-1">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={state.accident_insurance_number || ''}
                                                            onChange={(e) => setState((prev) => ({ ...prev, accident_insurance_number: e.target.value }))}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                            placeholder="Insurance policy number"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Validity Upto Date
                                                            <span className="text-red-500 ml-1">*</span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={state.insurance_validity_date || ''}
                                                            onChange={(e) => setState((prev) => ({ ...prev, insurance_validity_date: e.target.value }))}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : currentTab.name === 'customerStandards' ? (
                                            <CustomerStandardsComponent />
                                        ) : currentTab.name === 'selfAssessment' ? (
                                            <SelfAssessmentComponent />
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {section.formFields.map((field, fieldIndex) => {
                                                    if (field.condition && !field.condition(state)) return null;

                                                    return (
                                                        <div key={fieldIndex} className={field.classStyle}>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                {field.label}
                                                                {field.require && <span className="text-red-500 ml-1">*</span>}
                                                            </label>

                                                            {field.inputType === 'select' ? (
                                                                <select
                                                                    value={state[field.name] || ''}
                                                                    onChange={(e) => setState((prev) => ({ ...prev, [field.name]: e.target.value }))}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                                    required={field.require}
                                                                >
                                                                    <option value="">Select {field.label}</option>
                                                                    {optionLists[field.optionList]?.map((option) => (
                                                                        <option key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            ) : field.inputType === 'textarea' ? (
                                                                <textarea
                                                                    value={state[field.name] || ''}
                                                                    onChange={(e) => setState((prev) => ({ ...prev, [field.name]: e.target.value }))}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                                    rows={field.rows || 3}
                                                                    placeholder={field.placeholder}
                                                                    required={field.require}
                                                                />
                                                            ) : field.inputType === 'date' ? (
                                                                <input
                                                                    type="date"
                                                                    value={state[field.name] || ''}
                                                                    onChange={(e) => setState((prev) => ({ ...prev, [field.name]: e.target.value }))}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                                    required={field.require}
                                                                />
                                                            ) : field.inputType === 'time' ? (
                                                                <input
                                                                    type="time"
                                                                    value={state[field.name] || ''}
                                                                    onChange={(e) => setState((prev) => ({ ...prev, [field.name]: e.target.value }))}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                                    required={field.require}
                                                                />
                                                            ) : field.inputType === 'checkbox' ? (
                                                                <div className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={field.name}
                                                                        checked={state[field.name] || false}
                                                                        onChange={(e) => setState((prev) => ({ ...prev, [field.name]: e.target.checked }))}
                                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                    />
                                                                    <label htmlFor={field.name} className="ml-2 text-sm text-gray-700">
                                                                        {field.label}
                                                                    </label>
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    type={field.inputType === 'number' ? 'number' : 'text'}
                                                                    value={state[field.name] || ''}
                                                                    onChange={(e) => setState((prev) => ({ ...prev, [field.name]: e.target.value }))}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                                    placeholder={field.placeholder}
                                                                    required={field.require}
                                                                    min={field.min}
                                                                />
                                                            )}

                                                            {validationErrors[field.name] && <p className="text-red-500 text-xs mt-1">{validationErrors[field.name]}</p>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                    {Object.keys(state).length > 0 ? (
                                        <span className="flex items-center gap-1 text-emerald-600">
                                            <IconCheckCircle className="w-4 h-4" />
                                            Section has data
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-amber-600">
                                            <IconClock className="w-4 h-4" />
                                            Fill required fields
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    {tabIndex > 0 && (
                                        <button
                                            type="button"
                                            onClick={handlePrevious}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <IconChevronLeft className="w-4 h-4" />
                                            Previous
                                        </button>
                                    )}
                                    {tabIndex < supplierTabs.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                                        >
                                            Next Step
                                            <IconChevronDown className="w-4 h-4 -rotate-90" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleFormSubmit}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow"
                                        >
                                            <IconSave className="w-4 h-4" />
                                            {isEditMode ? 'Update Supplier' : 'Create Supplier'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // KYC View component
    const renderKYCView = () => {
        if (!selectedSupplier) return null;

        return (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <IconUser className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">KYC Verification</h2>
                                <p className="text-amber-100 text-sm mt-1">Verifying {selectedSupplier.supplier_name}</p>
                            </div>
                        </div>
                        <button onClick={handleCancel} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium">
                            <IconCancel className="w-4 h-4" />
                            Close
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                            <h3 className="text-lg font-semibold text-amber-800 mb-4">Supplier KYC Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Supplier Name:</label>
                                    <div className="text-lg font-semibold text-gray-900">{selectedSupplier.supplier_name}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Factory Address:</label>
                                    <div className="text-lg font-semibold text-gray-900">{selectedSupplier.factory_address}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">District:</label>
                                    <div className="text-lg font-semibold text-gray-900">{selectedSupplier.district}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">State/Province:</label>
                                    <div className="text-lg font-semibold text-gray-900">{selectedSupplier.state_province}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Contact Person:</label>
                                    <div className="text-lg font-semibold text-gray-900">{selectedSupplier.responsible_person_name}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Mobile:</label>
                                    <div className="text-lg font-semibold text-gray-900">{selectedSupplier.mobile_number}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    showMessage('success', 'KYC verification completed');
                                    handleCancel();
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                            >
                                Verify KYC
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Table columns configuration
    const columns = [
        {
            Header: 'S.No',
            accessor: 'id',
            Cell: ({ row }) => <div className="text-center text-sm font-medium text-gray-500">{paginationState.pageIndex * paginationState.pageSize + row.index + 1}</div>,
            width: 80,
        },
        {
            Header: 'Supplier Details',
            accessor: 'supplier_details',
            Cell: ({ row }) => {
                const supplier = row.original;
                const statusBadge = getStatusBadge(supplier.status);
                const kycBadge = getKycBadge(supplier.kyc_status);

                return (
                    <div className="space-y-2">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                    <IconFactory className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-semibold text-gray-900 truncate">{supplier.supplier_name}</h4>
                                    <div className="flex items-center gap-1">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>{statusBadge.text}</span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${kycBadge.color}`}>{kycBadge.text}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="text-gray-400">ID:</span>
                                        {supplier.supplier_id}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <span className="text-gray-400">📍</span>
                                        {supplier.district}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <span className="text-gray-400">🏛️</span>
                                        {supplier.state_province}
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-xs">
                                        <IconUser className="w-3 h-3 text-gray-400" />
                                        <span className="text-gray-600">{supplier.responsible_person_name}</span>
                                        <span className="text-gray-400">({supplier.designation})</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs">
                                        <IconClock className="w-3 h-3 text-gray-400" />
                                        <span className="text-gray-600">{supplier.mobile_number}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            Header: 'Factory Info',
            accessor: 'factory_info',
            Cell: ({ row }) => {
                const supplier = row.original;
                const employees = supplier.total_employees || 0;

                return (
                    <div className="space-y-3">
                        <div>
                            <div className="text-xs text-gray-700 line-clamp-2">{supplier.factory_address}</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500">Total Employees</span>
                                <span className="text-xs font-medium text-emerald-600">{employees}</span>
                            </div>
                            <div className="text-xs text-gray-600">
                                {supplier.total_male_count || 0} Male • {supplier.total_female_count || 0} Female
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500">Established</span>
                                <span className="text-xs font-medium text-gray-700">{supplier.year_of_establishment}</span>
                            </div>
                        </div>
                    </div>
                );
            },
            width: 200,
        },
        {
            Header: 'Financial Info',
            accessor: 'financial_info',
            Cell: ({ row }) => {
                const supplier = row.original;
                const turnover = supplier.annual_turnover ? `₹${(supplier.annual_turnover / 100000).toFixed(1)}L` : 'N/A';

                return (
                    <div className="space-y-3">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-gray-500">Annual Turnover</span>
                                <span className="text-xs font-bold text-emerald-700">{turnover}</span>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500">GSTIN</span>
                                <span className="text-xs font-medium text-gray-700 truncate">{supplier.gstin_number}</span>
                            </div>
                            <div className="text-xs text-gray-600 truncate">{supplier.pan_number}</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500">Business Start</span>
                                <span className="text-xs font-medium text-gray-700">{supplier.business_start_date ? moment(supplier.business_start_date).format('MMM YYYY') : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                );
            },
            width: 180,
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => {
                const supplier = row.original;
                const canEdit = accessIds.includes('3') && (isSuperAdmin || supplier.branch_id === userBranchId);
                const canDelete = accessIds.includes('4') && (isSuperAdmin || supplier.branch_id === userBranchId);
                const canViewKYC = accessIds.includes('6');

                return (
                    <div className="flex items-center gap-2">
                        {/* View Button */}
                        <Tippy content="View Details">
                            <button
                                onClick={() => navigate(`/master/suppliers/detail/${supplier.supplier_id}`)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                                <IconEye className="w-4 h-4" />
                            </button>
                        </Tippy>

                        {/* Edit Button */}
                        {canEdit && (
                            <Tippy content="Edit">
                                <button
                                    onClick={() => handleEditSupplier(supplier)}
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                >
                                    <IconPencil className="w-4 h-4" />
                                </button>
                            </Tippy>
                        )}

                        {/* Delete Button */}
                        {canDelete && (
                            <Tippy content="Delete">
                                <button
                                    onClick={() => handleDeleteSupplier(supplier.id)}
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                >
                                    <IconTrashLines className="w-4 h-4" />
                                </button>
                            </Tippy>
                        )}

                        {/* KYC Button */}
                        {canViewKYC && (
                            <Tippy content="KYC Verification">
                                <button
                                    onClick={() => handleKycView(supplier)}
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                >
                                    <IconUser className="w-4 h-4" />
                                </button>
                            </Tippy>
                        )}
                    </div>
                );
            },
            width: 120,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            {/* Main Container */}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
                            <p className="text-gray-600 mt-2">Manage supplier profiles, factory details, compliance and performance</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="hidden md:flex items-center gap-4">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">{suppliers.length}</div>
                                <div className="text-sm text-gray-600">Total Suppliers</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="text-2xl font-bold text-emerald-600">{suppliers.filter((s) => s.status === 'active').length}</div>
                                <div className="text-sm text-gray-600">Active</div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                                <div className="text-2xl font-bold text-amber-600">{suppliers.filter((s) => s.status === 'pending').length}</div>
                                <div className="text-sm text-gray-600">Pending</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {renderFilters()}

                {isCreateMode || isEditMode || isKYC ? (
                    <>
                        {renderForm()}
                        {activeMultiAddTab && (
                            <MultiAddForm
                                tabName={activeMultiAddTab}
                                fields={
                                    activeMultiAddTab === 'machinery_details'
                                        ? [
                                              { name: 'si_no', label: 'SI No', inputType: 'number', require: true, min: 1 },
                                              { name: 'machine_type', label: 'Type of Machine', inputType: 'text', require: true },
                                              { name: 'no_of_machines', label: 'No of Machines', inputType: 'number', require: true, min: 1 },
                                          ]
                                        : [
                                              { name: 'category', label: 'Category', inputType: 'text', require: true },
                                              { name: 'male_count', label: 'Male Count', inputType: 'number', require: true, min: 0 },
                                              { name: 'female_count', label: 'Female Count', inputType: 'number', require: true, min: 0 },
                                          ]
                                }
                            />
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Supplier Directory</h2>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">
                                        Page {paginationState.pageIndex + 1} of {Math.ceil(filteredSuppliers.length / paginationState.pageSize)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table
                                columns={columns}
                                data={filteredSuppliers}
                                pageSize={paginationState.pageSize}
                                pageIndex={paginationState.pageIndex}
                                totalCount={filteredSuppliers.length}
                                totalPages={Math.ceil(filteredSuppliers.length / paginationState.pageSize)}
                                onPaginationChange={(pageIndex, pageSize) => {
                                    setPaginationState((prev) => ({
                                        ...prev,
                                        pageIndex,
                                        pageSize: pageSize || prev.pageSize,
                                    }));
                                }}
                                loading={isLoading}
                                emptyMessage={
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <IconFactory className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No suppliers found</h3>
                                        <p className="text-gray-600 mb-6">{searchTerm ? 'Try adjusting your search or filters' : 'Add your first supplier to get started'}</p>
                                        {accessIds.includes('2') && !searchTerm && (
                                            <button
                                                onClick={handleCreateSupplier}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <IconPlus className="w-4 h-4" />
                                                Add New Supplier
                                            </button>
                                        )}
                                    </div>
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Suppliers;
