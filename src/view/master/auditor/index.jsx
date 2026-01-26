import { useState, Fragment, useEffect } from 'react';
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconRestore from '../../../components/Icon/IconRestore';
import IconEye from '../../../components/Icon/IconEye';
import Table from '../../../util/Table';
import Tippy from '@tippyjs/react';
import ModelViewBox from '../../../util/ModelViewBox';
import FormLayout from '../../../util/formLayout';
import { showMessage } from '../../../util/AllFunction';
import _ from 'lodash';
import { FormContainer } from './formContainer';

const dummyAuditors = [
  {
    id: 1,
    name: 'John Smith',
    auditorId: 'AUD001',
    designation: 'Senior Auditor',
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
    name: 'Sarah Johnson',
    auditorId: 'AUD002',
    designation: 'Lead Auditor',
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
    name: 'Michael Chen',
    auditorId: 'AUD003',
    designation: 'Junior Auditor',
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

const designationOptions = [
  { value: 'junior_auditor', label: 'Junior Auditor' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'senior_auditor', label: 'Senior Auditor' },
  { value: 'lead_auditor', label: 'Lead Auditor' },
  { value: 'principal_auditor', label: 'Principal Auditor' }
];

const auditTypeOptions = [
  { value: 'factory_audit', label: 'Factory Audit' },
  { value: 'quality_audit', label: 'Quality Audit' },
  { value: 'safety_audit', label: 'Safety Audit' },
  { value: 'environmental_audit', label: 'Environmental Audit' },
  { value: 'compliance_audit', label: 'Compliance Audit' },
  { value: 'preliminary_audit', label: 'Preliminary Audit' },
  { value: 'follow_up_audit', label: 'Follow-up Audit' }
];

const Index = () => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [state, setState] = useState({
    name: '',
    auditorId: '',
    designation: '',
    certifications: [],
    audits: [],
    isAuthenticated: false,
    username: '',
    password: '',
    existingPassword: '', 
  });
  const [auditors, setAuditors] = useState(dummyAuditors);
  const [formContain, setFormContain] = useState(FormContainer);
  const [errors, setErrors] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [certificationFiles, setCertificationFiles] = useState([]);
  const [viewCertModal, setViewCertModal] = useState(false);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

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
  };

  const onFormClear = () => {
    setState({
      name: '',
      auditorId: '',
      designation: '',
      certifications: [],
      audits: [],
      isAuthenticated: false,
      username: '',
      password: '',
      existingPassword: '',
    });
    setSelectedItem(null);
    setErrors([]);
    setShowPassword(false);
    setIsPasswordChanged(false);
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

    const selectedAudits = auditTypeOptions.filter(audit => 
      data.audits.includes(audit.label)
    );

    const newState = {
      name: data.name || '',
      auditorId: data.auditorId || '',
      designation: designationOptions.find(d => d.label === data.designation) || '',
      certifications: data.certifications || [],
      audits: selectedAudits,
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
    if (!state.audits?.length) newErrors.push('audits');
    
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
        designation: typeof state.designation === 'object' ? state.designation.label : state.designation,
        certifications: state.certifications,
        audits: Array.isArray(state.audits) ? state.audits.map(audit => 
          typeof audit === 'object' ? audit.label : audit
        ) : [],
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

  const handleSelectChange = (selectedOption, name) => {
    setState(prev => ({ ...prev, [name]: selectedOption }));

    if (errors.includes(name)) {
      setErrors(prev => prev.filter(error => error !== name));
    }
  };

  const handleMultiSelectChange = (selectedOptions, name) => {
    setState(prev => ({ ...prev, [name]: selectedOptions }));

    if (errors.includes(name)) {
      setErrors(prev => prev.filter(error => error !== name));
    }
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
      Header: 'Audits Assigned',
      accessor: 'audits',
      Cell: ({ value }) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 2).map((audit, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              {audit}
            </span>
          ))}
          {value?.length > 2 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              +{value.length - 2} more
            </span>
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

        <FormLayout
          dynamicForm={formContain}
          handleSubmit={onFormSubmit}
          setState={setState}
          state={state}
          onChangeCallBack={{
            handleInputChange: handleInputChange,
            handleSelectChange: handleSelectChange,
            handleMultiSelectChange: handleMultiSelectChange,
          }}
          errors={errors}
          setErrors={setErrors}
          loadings={loading}
          optionListState={{
            designationList: designationOptions,
            auditList: auditTypeOptions
          }}
        />

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

      {viewCertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Certifications</h3>
              <button
                onClick={() => setViewCertModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
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
            <div className="px-6 py-3 border-t bg-gray-50">
              <button
                onClick={() => setViewCertModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition float-right"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;