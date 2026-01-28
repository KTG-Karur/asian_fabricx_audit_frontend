import { useState, Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconRestore from '../../../components/Icon/IconRestore';
import IconEye from '../../../components/Icon/IconEye';
import IconPlus from '../../../components/Icon/IconPlus';
import Table from '../../../util/Table';
import Tippy from '@tippyjs/react';
import ModelViewBox from '../../../util/ModelViewBox';
import { showMessage } from '../../../util/AllFunction';
import _ from 'lodash';
import { getDesignation, createDesignation, resetDesignationStatus } from '../../../redux/designationSlice';

const dummyAuditors = [
  {
    id: 1,
    name: 'John',
    auditorId: 'AUD001',
    designation: 'Senior Auditor',
    designationId: '96af0672-2428-4a0b-8770-9e2a877415bf',
    certifications: [
      { id: 1, name: 'ISO-9001-Certificate.jpg', url: 'cert1.jpg' },
      { id: 2, name: 'Internal-Auditor-Certificate.jpg', url: 'cert2.jpg' }
    ],
    lastLogin: '2024-01-15T10:30:00',
    audits: ['Factory Audit', 'Safety Audit', 'Quality Audit'],
    username: 'john.smith',
    password: 'password123', 
    isAuthenticated: true,
    isActive: 1,
    createdDate: '2024-01-01'
  },
  {
    id: 2,
    name: 'Sarah',
    auditorId: 'AUD002',
    designation: 'Lead Auditor',
    designationId: '593ad470-64c0-4a38-ad2c-d0cee894e11d',
    certifications: [
      { id: 1, name: 'Lead-Auditor-Certificate.jpg', url: 'cert3.jpg' }
    ],
    lastLogin: '2024-01-14T14:20:00',
    audits: ['Environmental Audit', 'Compliance Audit'],
    username: 'sarah.j',
    password: 'securepass456', 
    isAuthenticated: true,
    isActive: 1,
    createdDate: '2024-01-05'
  },
  {
    id: 3,
    name: 'Michael',
    auditorId: 'AUD003',
    designation: 'Junior Auditor',
    designationId: '7ad7ec3e-6b7e-4321-8efc-9b25fdab91a7',
    certifications: [],
    lastLogin: '2024-01-10T09:15:00',
    audits: ['Preliminary Audit'],
    username: '',
    password: '',
    isAuthenticated: false,
    isActive: 1,
    createdDate: '2024-01-10'
  }
];

const Index = () => {
  const dispatch = useDispatch();
  
  const designationState = useSelector((state) => state.DesignationSlice || {});
  const {
    designationData = [],
    loading: designationLoading = false,
    createDesignationSuccess = false,
    error: designationError = null,
  } = designationState;

  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [state, setState] = useState({
    name: '',
    auditorId: '',
    designation: null,
    designationId: '',
    certifications: [],
    isAuthenticated: false,
    username: '',
    password: '',
    existingPassword: '',
  });
  const [auditors, setAuditors] = useState(dummyAuditors);
  const [errors, setErrors] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [certificationFiles, setCertificationFiles] = useState([]);
  const [viewCertModal, setViewCertModal] = useState(false);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  
  const [showAddDesignation, setShowAddDesignation] = useState(false);
  const [newDesignation, setNewDesignation] = useState('');
  const [addingDesignation, setAddingDesignation] = useState(false);
  const [designationOptions, setDesignationOptions] = useState([]);

  useEffect(() => {
    dispatch(getDesignation({}));
  }, [dispatch]);

  useEffect(() => {
    if (designationData && designationData.length > 0) {
      const options = designationData
        .filter(item => item.isActive === 1)
        .map(item => ({
          value: item.designationId,
          label: item.designationName,
          isActive: item.isActive
        }));
      
      setDesignationOptions(options);
      
      if (isEdit && selectedItem && selectedItem.designationId) {
        const selectedDesignation = options.find(d => d.value === selectedItem.designationId);
        if (selectedDesignation) {
          setState(prev => ({
            ...prev,
            designation: selectedDesignation,
            designationId: selectedDesignation.value
          }));
        }
      }
    }
  }, [designationData, isEdit, selectedItem]);

  useEffect(() => {
    if (createDesignationSuccess) {
      showMessage('success', 'Designation created successfully');
      setNewDesignation('');
      setShowAddDesignation(false);
      setAddingDesignation(false);
      
      dispatch(getDesignation({}));
      dispatch(resetDesignationStatus());
    }
    
    if (designationError) {
      showMessage('error', designationError);
      setAddingDesignation(false);
      dispatch(resetDesignationStatus());
    }
  }, [createDesignationSuccess, designationError, dispatch]);

  const generateNextAuditorId = () => {
    const existingIds = auditors
      .map(a => a.auditorId)
      .filter(id => id.startsWith('AUD'))
      .map(id => parseInt(id.replace('AUD', '')))
      .filter(id => !isNaN(id));
    
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return `AUD${String(maxId + 1).padStart(3, '0')}`;
  };

  const closeModel = () => {
    setIsEdit(false);
    onFormClear();
    setModal(false);
    setCertificationFiles([]);
    setShowAddDesignation(false);
    setNewDesignation('');
  };

  const onFormClear = () => {
    setState({
      name: '',
      auditorId: '',
      designation: null,
      designationId: '',
      certifications: [],
      isAuthenticated: false,
      username: '',
      password: '',
      existingPassword: '',
    });
    setSelectedItem(null);
    setErrors([]);
    setShowPassword(false);
    setIsPasswordChanged(false);
    setShowAddDesignation(false);
    setNewDesignation('');
  };

  const createModel = () => {
    onFormClear();
    setIsEdit(false);
    setState(prev => ({
      ...prev,
      auditorId: generateNextAuditorId()
    }));
    setModal(true);
    setErrors([]);
  };

  const onEditForm = (data) => {
    if (data.isActive !== 1) {
      showMessage('error', 'Cannot edit deleted auditor. Please restore it first.');
      return;
    }

    const selectedDesignation = designationOptions.find(d => 
      d.value === data.designationId || d.label === data.designation
    );

    const newState = {
      name: data.name || '',
      auditorId: data.auditorId || '',
      designation: selectedDesignation || null,
      designationId: selectedDesignation ? selectedDesignation.value : '',
      certifications: data.certifications || [],
      isAuthenticated: data.isAuthenticated || false,
      username: data.username || '',
      password: '',
      existingPassword: data.password || '********',
    };

    setState(newState);
    setIsEdit(true);
    setSelectedItem(data);
    setModal(true);
    setErrors([]);
    setIsPasswordChanged(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    const totalFiles = certificationFiles.length + files.length;
    if (totalFiles > 5) {
      showMessage('error', 'Maximum 5 certification files allowed');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      showMessage('error', 'Only JPG, PNG, and PDF files are allowed');
      return;
    }

    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      isNew: true
    }));

    setCertificationFiles(prev => [...prev, ...newFiles]);
    
    const allFiles = [...certificationFiles, ...newFiles];
    setState(prev => ({
      ...prev,
      certifications: allFiles.map(f => ({
        id: f.id,
        name: f.name,
        url: f.url,
        type: f.type
      }))
    }));
  };

  const removeFile = (fileId) => {
    setCertificationFiles(prev => prev.filter(f => f.id !== fileId));
    
    setState(prev => ({
      ...prev,
      certifications: prev.certifications.filter(f => f.id !== fileId)
    }));
  };

  const validateForm = () => {
    const newErrors = [];
    if (!state.name?.trim()) newErrors.push('name');
    if (!state.auditorId?.trim()) newErrors.push('auditorId');
    if (!state.designation) newErrors.push('designation');
    
    if (state.isAuthenticated) {
      if (!state.username?.trim()) newErrors.push('username');
      
      if (!isEdit && !state.password?.trim()) {
        newErrors.push('password');
      } else if (isEdit && isPasswordChanged && !state.password?.trim()) {
        newErrors.push('password');
      }
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const onFormSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      showMessage('error', 'Please fill all required fields correctly');
      return;
    }

    try {
      let finalPassword = '';
      if (isEdit) {
        finalPassword = isPasswordChanged ? state.password : state.existingPassword;
      } else {
        finalPassword = state.password;
      }

      const auditorData = {
        name: state.name.trim(),
        auditorId: state.auditorId.trim(),
        designation: state.designation ? state.designation.label : '',
        designationId: state.designation ? state.designation.value : '',
        certifications: state.certifications,
        isAuthenticated: state.isAuthenticated,
        username: state.isAuthenticated ? state.username.trim() : '',
        password: finalPassword,
        isActive: 1,
        createdDate: new Date().toISOString().split('T')[0],
        lastLogin: null
      };

      if (isEdit && selectedItem) {
        const updatedAuditors = auditors.map(aud => 
          aud.id === selectedItem.id ? { 
            ...aud, 
            ...auditorData,
          } : aud
        );
        setAuditors(updatedAuditors);
        showMessage('success', 'Auditor updated successfully');
      } else {
        const newAuditor = {
          id: auditors.length + 1,
          ...auditorData
        };
        setAuditors(prev => [...prev, newAuditor]);
        showMessage('success', 'Auditor created successfully');
      }

      closeModel();
    } catch (error) {
      showMessage('error', 'Failed to save auditor data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setState(prev => ({
      ...prev,
      [name]: newValue,
    }));

    if (isEdit && name === 'password' && value) {
      setIsPasswordChanged(true);
    }

    if (errors.includes(name)) {
      setErrors(prev => prev.filter(error => error !== name));
    }
  };

  const handleDesignationChange = (selectedOption) => {
    setState(prev => ({
      ...prev,
      designation: selectedOption,
      designationId: selectedOption ? selectedOption.value : ''
    }));

    if (errors.includes('designation')) {
      setErrors(prev => prev.filter(error => error !== 'designation'));
    }
  };

  const toggleAddDesignation = () => {
    setShowAddDesignation(prev => !prev);
    if (showAddDesignation) {
      setNewDesignation('');
    }
  };

  const handleAddDesignation = () => {
    if (!newDesignation.trim()) {
      showMessage('error', 'Please enter designation name');
      return;
    }

    const duplicate = designationOptions.find(d => 
      d.label.toLowerCase() === newDesignation.trim().toLowerCase()
    );
    
    if (duplicate) {
      showMessage('error', 'Designation already exists');
      return;
    }

    setAddingDesignation(true);
    
    const designationData = {
      designationName: newDesignation.trim(),
      status: 'Active',
    };

    dispatch(createDesignation(designationData));
  };

  const handleDeleteAuditor = (auditor) => {
    if (auditor.isActive !== 1) {
      showMessage('error', 'This auditor is already deleted.');
      return;
    }

    showMessage('warning', 'Are you sure you want to delete this auditor?', () => {
      const updatedAuditors = auditors.map(aud => 
        aud.id === auditor.id ? { ...aud, isActive: 0 } : aud
      );
      setAuditors(updatedAuditors);
      showMessage('success', 'Auditor deleted successfully');
    });
  };

  const handleRestoreAuditor = (auditor) => {
    if (auditor.isActive === 1) {
      showMessage('error', 'This auditor is already active.');
      return;
    }

    showMessage('warning', 'Are you sure you want to restore this auditor?', () => {
      const updatedAuditors = auditors.map(aud => 
        aud.id === auditor.id ? { ...aud, isActive: 1 } : aud
      );
      setAuditors(updatedAuditors);
      showMessage('success', 'Auditor restored successfully');
    });
  };

  const viewCertifications = (certifications) => {
    setSelectedCertifications(certifications);
    setViewCertModal(true);
  };

  const columns = [
    {
      Header: 'S.No',
      accessor: 'id',
      Cell: (row) => <div>{row?.row?.index + 1}</div>,
      width: 80,
    },
    {
      Header: 'Auditor ID',
      accessor: 'auditorId',
      sort: true,
      width: 120,
    },
    {
      Header: 'Name',
      accessor: 'name',
      sort: true,
    },
    {
      Header: 'Designation',
      accessor: 'designation',
      sort: true,
    },
    {
      Header: 'Certifications',
      accessor: 'certifications',
      Cell: ({ value }) => (
        <div className="flex items-center">
          <span className="mr-2">{value?.length || 0} files</span>
          {value?.length > 0 && (
            <Tippy content="View Certifications">
              <button
                onClick={() => viewCertifications(value)}
                className="text-primary hover:text-primary-dark"
              >
                <IconEye className="w-4 h-4" />
              </button>
            </Tippy>
          )}
        </div>
      ),
    },
    {
      Header: 'Authentication',
      accessor: 'isAuthenticated',
      Cell: ({ value }) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
            ${value ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg' : 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-lg'}`}
        >
          {value ? 'Authenticated' : 'Not Authenticated'}
        </span>
      ),
      sort: true,
    },
    {
      Header: 'Status',
      accessor: 'isActive',
      Cell: ({ value }) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
            ${value === 1 ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg' : 'bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg'}`}
        >
          {value === 1 ? 'Active' : 'Deleted'}
        </span>
      ),
      sort: true,
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => {
        const auditor = row.original;
        const isActive = auditor.isActive === 1;

        return (
          <div className="flex items-center space-x-2">
            {isActive ? (
              <>
                <Tippy content="Edit">
                  <span className="text-success me-2 cursor-pointer" onClick={() => onEditForm(auditor)}>
                    <IconPencil />
                  </span>
                </Tippy>
                <Tippy content="Delete">
                  <span className="text-danger me-2 cursor-pointer" onClick={() => handleDeleteAuditor(auditor)}>
                    <IconTrashLines />
                  </span>
                </Tippy>
              </>
            ) : (
              <Tippy content="Restore">
                <span className="text-warning me-2 cursor-pointer" onClick={() => handleRestoreAuditor(auditor)}>
                  <IconRestore />
                </span>
              </Tippy>
            )}
          </div>
        );
      },
      width: 120,
    },
  ];

  const handlePaginationChange = (pageIndex, newPageSize) => {
    setCurrentPage(pageIndex);
    setPageSize(newPageSize);
  };

  const getPaginatedData = () => {
    const dataArray = auditors || [];
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return dataArray.slice(startIndex, endIndex);
  };

  const getTotalCount = () => {
    return auditors.length;
  };

  const getRecordCounts = () => {
    const activeCount = auditors.filter((item) => item.isActive === 1).length;
    const deletedCount = auditors.filter((item) => item.isActive === 0).length;
    const authenticatedCount = auditors.filter((item) => item.isAuthenticated && item.isActive === 1).length;
    return { activeCount, deletedCount, authenticatedCount };
  };

  const { activeCount, deletedCount, authenticatedCount } = getRecordCounts();

  return (
    <div>
      <div className="datatables">
        <Table
          columns={columns}
          Title={'Auditor Management - All Records'}
          toggle={createModel}
          data={getPaginatedData()}
          pageSize={pageSize}
          pageIndex={currentPage}
          totalCount={getTotalCount()}
          totalPages={Math.ceil(getTotalCount() / pageSize)}
          onPaginationChange={handlePaginationChange}
          pagination={true}
          isSearchable={true}
          isSortable={true}
          btnName="Add Auditor"
          loadings={loading}
        />
      </div>

      <ModelViewBox
        key={isEdit ? `edit-${selectedItem?.id}` : 'create'}
        modal={modal}
        modelHeader={isEdit ? 'Edit Auditor' : 'Add Auditor'}
        isEdit={isEdit}
        setModel={closeModel}
        handleSubmit={onFormSubmit}
        modelSize="lg"
        submitBtnText={isEdit ? 'Update' : 'Create'}
        loadings={loading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certifications <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(Max 5 files, JPG/PNG/PDF)</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="certification-upload"
              />
              <label
                htmlFor="certification-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Certifications
              </label>
              <p className="text-sm text-gray-500 mt-2">Click to upload or drag and drop</p>
              
              {/* File List */}
              {certificationFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                  <div className="space-y-2">
                    {certificationFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center">
                          {file.type.includes('image') ? (
                            <img src={file.url} alt={file.name} className="w-10 h-10 object-cover rounded mr-3" />
                          ) : (
                            <div className="w-10 h-10 bg-red-100 flex items-center justify-center rounded mr-3">
                              <span className="text-red-600 font-bold">PDF</span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.file?.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Form Fields */}
        <div className="grid grid-cols-12 gap-4 mt-5">
          {/* Auditor ID */}
          <div className="col-span-6 mb-2">
            <label className="block mb-1 font-medium text-gray-700">
              Auditor ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="auditorId"
              value={state.auditorId}
              disabled
              className="form-input w-full bg-gray-50 cursor-not-allowed"
            />
            {errors.includes('auditorId') && <p className="text-red-600 text-sm mt-1">* Please enter Auditor ID</p>}
          </div>

          {/* Full Name */}
          <div className="col-span-6 mb-2">
            <label className="block mb-1 font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={state.name}
              onChange={handleInputChange}
              placeholder="Enter auditor full name"
              className="form-input w-full"
            />
            {errors.includes('name') && <p className="text-red-600 text-sm mt-1">* Please enter Name</p>}
          </div>

          {/* Designation with Add Button */}
          <div className="col-span-6 mb-2">
            <div className="flex items-center mb-1">
              <label className="block font-medium text-gray-700 mr-2">
                Designation <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={toggleAddDesignation}
                className="flex items-center text-green-600 hover:text-green-800"
                title={showAddDesignation ? "Hide Add Designation" : "Add New Designation"}
              >
                <IconPlus className={`w-4 h-4 transition-transform ${showAddDesignation ? 'rotate-45' : ''}`} />
              </button>
            </div>
            
            <Select
              menuPortalTarget={document.body}
              menuPosition="fixed"
              isMulti={false}
              required={true}
              onChange={handleDesignationChange}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              value={state.designation}
              className="react-select react-select-container"
              classNamePrefix="react-select"
              isSearchable
              onFocus={() => {
                if (errors.includes('designation')) {
                  setErrors(prev => prev.filter(error => error !== 'designation'));
                }
              }}
              options={designationOptions}
              isLoading={designationLoading}
              placeholder="Select designation"
              styles={{
                option: (provided, state) => ({
                  ...provided,
                  fontSize: '16px',
                  color: '#000',
                  backgroundColor: state.isSelected ? '#e6f7ff' : state.isFocused ? '#71b6f98a' : '#fff',
                  cursor: 'pointer',
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
                menu: (provided) => ({
                  ...provided,
                  fontSize: '16px',
                  color: '#000',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  fontSize: '16px',
                  color: '#000',
                }),
                control: (provided, state) => ({
                  ...provided,
                  borderColor: errors.includes('designation') ? '#ef4444' : '#d1d5db',
                  '&:hover': {
                    borderColor: errors.includes('designation') ? '#ef4444' : '#9ca3af',
                  },
                  boxShadow: state.isFocused && !errors.includes('designation') ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
                }),
                input: (provided) => ({
                  ...provided,
                  fontSize: '16px',
                  color: '#000',
                }),
              }}
            />
            {errors.includes('designation') && <p className="text-red-600 text-sm mt-1">* Please select Designation</p>}
          </div>

          {/* Enable Authentication Checkbox */}
          <div className="col-span-12 mb-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isAuthenticated"
                checked={state.isAuthenticated}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span className="ml-2">Enable Authentication</span>
            </label>
          </div>
        </div>

        {/* Add Designation Form - Collapsible */}
        {showAddDesignation && (
          <div className="border rounded-lg p-4 bg-gray-50 mt-4 mb-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Add New Designation
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowAddDesignation(false);
                  setNewDesignation('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                placeholder="Enter designation name"
                className="form-input flex-1"
                disabled={addingDesignation}
              />
              <button
                type="button"
                onClick={handleAddDesignation}
                disabled={addingDesignation}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingDesignation ? 'Adding...' : 'Add'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Designation will be available in the dropdown after creation
            </p>
          </div>
        )}

        <div className="grid grid-cols-12 gap-4 mt-4">
          {state.isAuthenticated ? (
            <>
              <div className="col-span-6">
                <label className="block">Username <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="username" 
                  value={state.username} 
                  onChange={handleInputChange} 
                  placeholder="Enter Username" 
                  className="form-input w-full" 
                />
                {errors.includes('username') && <div className="text-danger text-sm mt-1">* Please enter Username</div>}
              </div>

              <div className="col-span-6">
                <label className="block">
                  Password {isEdit ? '' : <span className="text-red-500">*</span>}
                  {isEdit && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Leave blank to keep current)
                    </span>
                  )}
                </label>
                
                {isEdit && !isPasswordChanged && (
                  <div className="mb-2">
                    <label className="block text-sm text-gray-600 mb-1">Current Password:</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={state.existingPassword}
                        readOnly
                        className="form-input w-full pr-10 bg-gray-50 cursor-not-allowed"
                      />
                      <span 
                        onClick={() => setShowPassword(prev => !prev)} 
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 text-sm"
                      >
                        {showPassword ? 'hide' : 'show'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPasswordChanged(true)}
                      className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Change Password
                    </button>
                  </div>
                )}
                
                {(isEdit && isPasswordChanged) || !isEdit ? (
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={state.password}
                      onChange={handleInputChange}
                      placeholder={isEdit ? 'Enter new password (leave blank to keep current)' : 'Enter Password'}
                      className="form-input w-full pr-10"
                    />
                    <span 
                      onClick={() => setShowPassword(prev => !prev)} 
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 text-sm"
                    >
                      {showPassword ? 'hide' : 'show'}
                    </span>
                    {isEdit && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsPasswordChanged(false);
                          setState(prev => ({ ...prev, password: '' }));
                        }}
                        className="mt-1 text-sm text-red-600 hover:text-red-800"
                      >
                        Cancel Password Change
                      </button>
                    )}
                  </div>
                ) : null}
                
                {errors.includes('password') && <div className="text-danger text-sm mt-1">* Please enter Password</div>}
                
                {state.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`h-1 flex-1 rounded ${state.password.length < 6 ? 'bg-red-500' : state.password.length < 8 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                      <div className={`h-1 flex-1 rounded ${state.password.length < 6 ? 'bg-gray-300' : state.password.length < 8 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                      <div className={`h-1 flex-1 rounded ${state.password.length < 8 ? 'bg-gray-300' : 'bg-green-500'}`}></div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {state.password.length < 6 ? 'Weak' : state.password.length < 8 ? 'Medium' : 'Strong'} password
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </ModelViewBox>

      <ModelViewBox
        modal={viewCertModal}
        modelHeader="Certifications"
        setModel={() => setViewCertModal(false)}
        modelSize="lg"
        hideFooter={true}
        saveBtn={false}
      >
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {selectedCertifications.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No certifications uploaded</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCertifications.map((cert, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  {cert.type?.includes('image') || cert.url?.includes('image') ? (
                    <img
                      src={cert.url || '/placeholder-image.jpg'}
                      alt={cert.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-red-50 flex flex-col items-center justify-center">
                      <div className="text-red-600 text-4xl mb-2">PDF</div>
                      <p className="text-sm text-gray-600">PDF Document</p>
                    </div>
                  )}
                  <div className="p-3 bg-gray-50">
                    <p className="text-sm font-medium truncate">{cert.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ModelViewBox>
    </div>
  );
};

export default Index;