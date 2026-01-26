// src/pages/suppliers/Index.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../util/Table';
import { WizardWithProgressbar } from '../../../util/WizardViewBox';
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
import IconSave from '../../../components/Icon/IconSave';
import IconCancel from '../../../components/Icon/IconX';

// Import supplier configuration
import { supplierTabs, optionLists, staticSuppliersData, getStatusBadge, getKycBadge, getAuditBadge } from './SupplierFormContainer';

// Import ModernFormLayout if you created it
// import ModernFormLayout from '../../../components/forms/ModernFormLayout';

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

  const pageAccessData = findArrObj(localData?.pagePermission, 'label', 'Supplier') || 
                         findArrObj(localData?.pagePermission, 'label', 'Suppliers') || 
                         [];

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
    customer_standards: [],
  });
  const [deletedItems, setDeletedItems] = useState({
    machinery_details: [],
    customer_standards: [],
  });
  const [temporarilyHidden, setTemporarilyHidden] = useState({
    machinery_details: [],
    customer_standards: [],
  });

  const [tabIndex, setTabIndex] = useState(0);
  const [tab, setTab] = useState(supplierTabs[0].name);
  const [multiStateValue, setMultiStateValue] = useState([{}]);
  const [IsEditArrVal, setIsEditArrVal] = useState(false);
  const [errors, setErrors] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

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
        supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.city.toLowerCase().includes(searchTerm.toLowerCase());

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
    setArrVal({ machinery_details: [], customer_standards: [] });
    setDeletedItems({ machinery_details: [], customer_standards: [] });
    setTemporarilyHidden({ machinery_details: [], customer_standards: [] });
    setErrors([]);
    // setValidationErrors({});
    setMultiStateValue([{}]);
    setIsEditArrVal(false);
    setTabIndex(0);
    setTab(supplierTabs[0].name);
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
    // Simulate loading data
    const supplierData = getStaticSupplierData(supplier.supplier_id);
    setState(supplierData.basicInfo || {});
    setArrVal({
      machinery_details: supplierData.machineryDetails || [],
      customer_standards: supplierData.customerStandards || [],
    });
  };

  // Get static supplier data for demo
  const getStaticSupplierData = (supplierId) => {
    const dataMap = {
      'SUP-001': {
        basicInfo: {
          supplier_name: 'Asian Fabrics Private Limited',
          category: 'Wet Processing',
          supplier_code: 'GRS123',
          address: '54, L.B.4, N23AY, KAYAY',
          city: 'Kayay',
          postal_code: '600001',
          landmark: 'Near Textile Park',
          year_of_establishment: 2005,
          contact_person_name: 'Key Blazer',
          designation: 'GMC',
          mobile_number: '7800000156',
          landline: '044-1234567',
          email: 'info@asianfabrics.com',
          factory_owner_name: 'John Doe',
          business_start_date: '2020-01-15',
          ownership_type: 'private_limited',
          annual_turnover: 50000000,
          direct_business: true,
          customer_names: 'Brand A, Brand B, Brand C',
        },
        machineryDetails: [
          { machinery_type: 'stp_processing', number_of_machines: 5, category: 'processing' },
          { machinery_type: 'dyeing', number_of_machines: 10, category: 'dyeing' },
        ],
        customerStandards: [
          { standard_name: 'IWAY Standard 6.0', acceptance_date: '2025-01-01' },
          { standard_name: 'Anti-Corruption Policy', acceptance_date: '2025-01-01' },
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
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) return;

    showConfirmationDialog(
      `Delete ${supplier.supplier_name}?`,
      'This action cannot be undone. All associated data will be permanently removed.',
      async () => {
        setIsLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
          showMessage('success', `${supplier.supplier_name} deleted successfully`);
        } catch (error) {
          showMessage('error', 'Failed to delete supplier');
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  // Handle form submit
  const handleFormSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isEditMode && selectedSupplier) {
        // Update existing supplier
        const updatedSupplier = {
          ...selectedSupplier,
          ...state,
        };

        setSuppliers((prev) => prev.map((supplier) => (supplier.id === selectedSupplier.id ? updatedSupplier : supplier)));

        showMessage('success', 'Supplier updated successfully');
      } else {
        // Create new supplier
        const newSupplier = {
          id: suppliers.length + 1,
          supplier_id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`,
          ...state,
          status: 'active',
          kyc_status: 'pending',
          last_audit_date: moment().format('YYYY-MM-DD'),
          next_audit_date: moment().add(6, 'months').format('YYYY-MM-DD'),
          branch_name: userData?.branchName || 'Main Branch',
          branch_id: userBranchId || 'BR-001',
        };

        setSuppliers((prev) => [...prev, newSupplier]);
        showMessage('success', 'Supplier created successfully');
      }

      // Reset form
      handleCancel();
    } catch (error) {
      showMessage('error', 'Failed to save supplier');
    } finally {
      setIsLoading(false);
    }
  };

  // Wizard validation functions
  const showMultiAdd = ['machinery_details', 'customer_standards'];

  const validateCurrentTab = () => {
    const currentTabName = supplierTabs[tabIndex].name;
    let errors = [];

    switch (currentTabName) {
      case 'supplierProfile':
        if (!state.supplier_name?.trim()) {
          errors.push({ field: 'supplier_name', message: 'Supplier name is required' });
        }
        if (!state.category) {
          errors.push({ field: 'category', message: 'Category is required' });
        }
        if (!state.contact_person_name?.trim()) {
          errors.push({ field: 'contact_person_name', message: 'Contact person is required' });
        }
        break;
      case 'machineryCapacity':
        const machinery = arrVal.machinery_details || [];
        if (machinery.length === 0) {
          errors.push({ field: 'general', message: 'At least one machinery detail is required' });
        }
        break;
      default:
        // Basic validation for other tabs
        break;
    }

    return errors;
  };

//   const showValidationErrors = (errors) => {
//     if (errors.length > 0) {
//       const errorMessages = errors.map((error) => error.message).join('\n• ');
//       showMessage('error', `Please fix the following errors:\n• ${errorMessages}`);
//       return true;
//     }
//     return false;
//   };

  const checkValidation = (next, condition) => {
    const currentTabName = supplierTabs[tabIndex].name;
    const currentArray = arrVal[currentTabName] || [];

    if (showMultiAdd.includes(currentTabName) && currentArray.length !== 0 && next != null) {
      return handleNextWithValidation(next);
    }

    // if (condition) {
    //   const validationErrors = validateCurrentTab();
    //   if (validationErrors.length > 0) {
    //     setValidationErrors(validationErrors);
    //     showValidationErrors(validationErrors);
    //     return;
    //   }
    //   setValidationErrors([]);
    //   handleAdd();
    //   return;
    // }

    handleNextWithValidation(null);
  };

  const handleNextWithValidation = async (next) => {
    // const validationErrors = validateCurrentTab();

    // if (validationErrors.length > 0) {
    //   setValidationErrors(validationErrors);
    //   showValidationErrors(validationErrors);
    //   return;
    // }

    // setValidationErrors([]);

    const currentTabName = supplierTabs[tabIndex].name;
    const checkMultiAdd = showMultiAdd.includes(currentTabName);
    const currentArray = arrVal[currentTabName] || [];

    if (checkMultiAdd && currentArray.length === 0) {
      showMessage('warning', `Please add at least one ${currentTabName.replace('_', ' ')} before proceeding`);
      return;
    }

    let updatedStateValue = checkMultiAdd ? currentArray : state;
    const temp_state = [...multiStateValue];
    temp_state[0] = { ...temp_state[0], [currentTabName]: updatedStateValue };
    setMultiStateValue(temp_state);

    if (tabIndex === supplierTabs.length - 1) {
      await handleFormSubmit();
    } else {
      const nextTabName = supplierTabs[tabIndex + 1].name;
      setTab(nextTabName);
      setTabIndex((prev) => prev + 1);
      setState(multiStateValue[0]?.[nextTabName] || {});

      if (showMultiAdd.includes(nextTabName)) {
        setArrVal((prev) => ({
          ...prev,
          [nextTabName]: multiStateValue[0]?.[nextTabName] || [],
        }));
        setState({});
      }

      if (next) next();
    }
  };

  const handleAdd = async () => {
    const currentTabName = supplierTabs[tabIndex].name;

    if (IsEditArrVal) {
      const data = { ...state };
      setArrVal((prev) => ({
        ...prev,
        [currentTabName]: (prev[currentTabName] || []).map((item, index) => (index === state.selectedIdx ? data : item)),
      }));
      setIsEditArrVal(false);
      setState({});
    } else {
      const data = {
        id: (arrVal[currentTabName] || []).length,
        temp_id: `temp_${uuidv4()}`,
        ...state,
      };
      setArrVal((prev) => ({
        ...prev,
        [currentTabName]: [...(prev[currentTabName] || []), data],
      }));
      setState({});
    }

    // setValidationErrors([]);
  };

  const handlePrevious = (previous) => {
    const currentTabName = supplierTabs[tabIndex].name;
    const previousTabName = supplierTabs[tabIndex - 1]?.name;

    const checkMultiAdd = showMultiAdd.includes(currentTabName);
    const currentArray = arrVal[currentTabName] || [];
    let updatedStateValue = checkMultiAdd ? currentArray : state;

    const temp_state = [...multiStateValue];
    temp_state[0] = {
      ...temp_state[0],
      [currentTabName]: updatedStateValue,
    };
    setMultiStateValue(temp_state);

    setTab(previousTabName || '');
    setTabIndex((prev) => prev - 1);
    setState(multiStateValue[0]?.[previousTabName] || {});

    if (showMultiAdd.includes(previousTabName)) {
      setArrVal((prev) => ({
        ...prev,
        [previousTabName]: multiStateValue[0]?.[previousTabName] || [],
      }));
      setState({});
    }

    if (previous) previous();
  };

  // Handle temporary delete for multi-add items
  const handleTemporaryDelete = (tabName, item) => {
    const itemNames = {
      machinery_details: 'machinery detail',
      customer_standards: 'customer standard',
    };

    showConfirmationDialog(`Are you sure you want to mark this ${itemNames[tabName]} for deletion?`, () => {
      let itemId = item.machinery_detail_id || item.standard_id || item.temp_id;

      if (!itemId) {
        itemId = `temp_${uuidv4()}`;
        setArrVal((prev) => {
          const currentArray = prev[tabName] || [];
          const updatedArray = currentArray.map((i) => (i === item || JSON.stringify(i) === JSON.stringify(item) ? { ...i, temp_id: itemId } : i));
          return { ...prev, [tabName]: updatedArray };
        });
      }

      setTemporarilyHidden((prev) => ({
        ...prev,
        [tabName]: [...(prev[tabName] || []), itemId],
      }));

      setDeletedItems((prev) => ({
        ...prev,
        [tabName]: [...(prev[tabName] || []), itemId],
      }));

      showMessage('warning', `${itemNames[tabName]} marked for deletion. Click Update to confirm.`);
    });
  };

  const handleRestoreItem = (tabName, itemId) => {
    setTemporarilyHidden((prev) => ({
      ...prev,
      [tabName]: (prev[tabName] || []).filter((id) => id !== itemId),
    }));

    setDeletedItems((prev) => ({
      ...prev,
      [tabName]: (prev[tabName] || []).filter((id) => id !== itemId),
    }));

    const itemNames = {
      machinery_details: 'Machinery detail',
      customer_standards: 'Customer standard',
    };
    showMessage('success', `${itemNames[tabName]} restored successfully`);
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
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
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
          {showFilters ? (
            <IconChevronUp className="w-4 h-4" />
          ) : (
            <IconChevronDown className="w-4 h-4" />
          )}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterChange('status', status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedStatus === status
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
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
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  );

  // Simple ModernFormLayout component (if you don't have it separately)
  const ModernFormLayout = ({ fields, state, setState, errors, isMobile }) => {
    return (
      <div className="space-y-6">
        {fields.map((field) => {
          const fieldError = errors[field.name] 
          
          return (
            <div key={field.name} className={field.classStyle}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.require && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.inputType === 'text' || field.inputType === 'number' || field.inputType === 'email' ? (
                <input
                  type={field.inputType}
                  value={state[field.name] || ''}
                  onChange={(e) => setState({ ...state, [field.name]: e.target.value })}
                  className={`w-full px-3 py-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    isMobile ? 'text-base' : 'text-sm'
                  }`}
                  placeholder={field.placeholder}
                  disabled={isEditMode ? false : false}
                />
              ) : field.inputType === 'textarea' ? (
                <textarea
                  value={state[field.name] || ''}
                  onChange={(e) => setState({ ...state, [field.name]: e.target.value })}
                  className={`w-full px-3 py-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    isMobile ? 'text-base' : 'text-sm'
                  }`}
                  placeholder={field.placeholder}
                  rows={field.rows || 3}
                  disabled={isEditMode ? false : false}
                />
              ) : field.inputType === 'select' ? (
                <select
                  value={state[field.name] || ''}
                  onChange={(e) => setState({ ...state, [field.name]: e.target.value })}
                  className={`w-full px-3 py-2 border ${fieldError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    isMobile ? 'text-base' : 'text-sm'
                  }`}
                  disabled={isEditMode ? false : false}
                >
                  <option value="">Select {field.label}</option>
                  {optionLists[field.optionList]?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}
              
              {fieldError && (
                <p className="text-red-500 text-xs mt-1">
                  {typeof fieldError === 'object' ? fieldError.message : fieldError}
                </p>
              )}
            </div>
          );
        })}
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
                <p className="text-amber-100 text-sm mt-1">
                  Verifying {selectedSupplier.supplier_name}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
            >
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
                  <label className="text-sm font-medium text-gray-600">Category:</label>
                  <div className="text-lg font-semibold text-gray-900">{selectedSupplier.category}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Person:</label>
                  <div className="text-lg font-semibold text-gray-900">{selectedSupplier.contact_person}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email:</label>
                  <div className="text-lg font-semibold text-gray-900">{selectedSupplier.email}</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
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

  // Main form render function
  const renderForm = () => {
    const currentTab = supplierTabs[tabIndex];
    
    if (isKYC) {
      return renderKYCView();
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                {currentTab.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isEditMode ? 'Edit Supplier' : 'Create New Supplier'}
                </h2>
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
                onClick={() => checkValidation(null, false)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium font-semibold"
              >
                <IconSave className="w-4 h-4" />
                {tabIndex === supplierTabs.length - 1 
                  ? (isEditMode ? 'Update Supplier' : 'Create Supplier')
                  : 'Next Step'
                }
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {supplierTabs.map((tabItem, index) => (
              <div key={tabItem.name} className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (index <= tabIndex) {
                      setTabIndex(index);
                      setTab(tabItem.name);
                    }
                  }}
                  className={`flex items-center gap-2 ${
                    index <= tabIndex ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === tabIndex 
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-500' 
                      : index < tabIndex
                      ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500'
                      : 'bg-gray-200 text-gray-500 border-2 border-gray-300'
                  }`}>
                    {index < tabIndex ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm font-medium ${
                    index === tabIndex 
                      ? 'text-blue-600' 
                      : index < tabIndex
                      ? 'text-emerald-600'
                      : 'text-gray-500'
                  }`}>
                    {tabItem.label}
                  </span>
                </button>
                
                {index < supplierTabs.length - 1 && (
                  <div className={`h-0.5 w-8 mx-2 ${
                    index < tabIndex ? 'bg-emerald-500' : 'bg-gray-300'
                  }`} />
                )}
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentTab.children?.[0]?.title || currentTab.label}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {currentTab.children?.[0]?.subtitle || 'Fill in the required information'}
                  </p>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className={`grid ${currentTab.accordianStyle} gap-6`}>
                {currentTab.children?.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-6">
                    {sectionIndex > 0 && (
                      <div className="pt-6 border-t border-gray-200">
                        <h4 className="text-md font-semibold text-gray-800 mb-4">
                          {section.title}
                        </h4>
                      </div>
                    )}
                    
                    <ModernFormLayout
                      fields={section.formFields}
                      state={state}
                      setState={setState}
                      errors={errors}
                    //   validationErrors={validationErrors}
                      isMobile={isMobile}
                    />
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
                      onClick={() => handlePrevious(null)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      <IconChevronUp className="w-4 h-4 rotate-90" />
                      Previous
                    </button>
                  )}
                  
                  {tabIndex < supplierTabs.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => checkValidation(null, false)}
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

  // Table columns configuration
  const columns = [
    {
      Header: 'S.No',
      accessor: 'id',
      Cell: ({ row }) => (
        <div className="text-center text-sm font-medium text-gray-500">
          {paginationState.pageIndex * paginationState.pageSize + row.index + 1}
        </div>
      ),
      width: 80
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
                  <span className="text-lg">🏭</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {supplier.supplier_name}
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                      {statusBadge.text}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${kycBadge.color}`}>
                      {kycBadge.text}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span>🏷️</span>
                    {supplier.supplier_id}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span>📋</span>
                    {supplier.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span>📍</span>
                    {supplier.city}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-gray-400">👤</span>
                    <span className="text-gray-600">{supplier.contact_person}</span>
                    <span className="text-gray-400">({supplier.designation})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      Header: 'Audit Info',
      accessor: 'audit_info',
      Cell: ({ row }) => {
        const supplier = row.original;
        const nextAuditDays = moment(supplier.next_audit_date).diff(moment(), 'days');
        
        return (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-500">Last Audit</span>
                <span className="text-xs font-medium text-gray-700">
                  {moment(supplier.last_audit_date).format('MMM DD, YYYY')}
                </span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Next Audit</span>
                <span className={`text-xs font-medium ${
                  nextAuditDays < 30 ? 'text-rose-600' : 
                  nextAuditDays < 90 ? 'text-amber-600' : 
                  'text-emerald-600'
                }`}>
                  {nextAuditDays > 0 ? `${nextAuditDays} days` : 'Overdue'}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {moment(supplier.next_audit_date).format('MMM DD, YYYY')}
              </div>
            </div>
          </div>
        );
      },
      width: 200
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
      width: 120
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
              <p className="text-gray-600 mt-2">
                Manage supplier profiles, audits, compliance and performance
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{suppliers.length}</div>
                <div className="text-sm text-gray-600">Total Suppliers</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="text-2xl font-bold text-emerald-600">
                  {suppliers.filter(s => s.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {renderFilters()}

        {isCreateMode || isEditMode || isKYC ? (
          renderForm()
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
                  setPaginationState(prev => ({
                    ...prev,
                    pageIndex,
                    pageSize: pageSize || prev.pageSize,
                  }));
                }}
                loading={isLoading}
                emptyMessage={
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🏭</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No suppliers found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm ? 'Try adjusting your search or filters' : 'Add your first supplier to get started'}
                    </p>
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