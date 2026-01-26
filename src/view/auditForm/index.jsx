import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconSave from '../../components/Icon/IconSave';
import IconCancel from '../../components/Icon/IconX';
import IconEye from '../../components/Icon/IconEye';
import IconPrinter from '../../components/Icon/IconPrinter';
import IconDownload from '../../components/Icon/IconFile';
import IconPlus from '../../components/Icon/IconPlus';
import IconTrash from '../../components/Icon/IconTrashLines';
import IconImage from '../../components/Icon/IconTrashLines';
import IconChevronDown from '../../components/Icon/IconChevronDown';
import IconChevronUp from '../../components/Icon/IconChevronUp';
import IconPencil from '../../components/Icon/IconPencil';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { showMessage } from '../../util/AllFunction';

const ExternalProviderAuditForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { mode = 'create', auditData = null } = location.state || {};
    
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isCreateMode = mode === 'create';
    
    // Main state
    const [formData, setFormData] = useState({
        // Provider Information
        supplierName: '',
        supplierType: '',
        employeeCount: '',
        productionCapacity: '',
        asianAuditorName: '',
        lastAuditDate: '',
        machineCount: '',
        products: '',
        visitDate: new Date().toISOString().split('T')[0],
        supplierRepresentative: '',
        lastAuditScore: '',
        currentScore: '',
        transportAvailable: false,
        accommodationAvailable: false,
        animalsAllowed: false,
        
        // Audit Details
        auditId: Math.random().toString(36).substr(2, 9).toUpperCase(),
        auditDate: new Date().toISOString().split('T')[0],
        status: isCreateMode ? 'Pending' : 'In Progress',
        
        // Checklists
        checklists: [],
        
        // Worker Interviews
        workerInterviews: [],
        
        // Auditor Remarks
        auditorRemarks: '',
        
        // External Provider Comments
        externalProviderComments: '',
        
        // Overall Score Calculation
        totalScore: 0,
        maxPossibleScore: 100,
        calculatedScore: 0,
    });
    
    // Expanded sections state
    const [expandedSections, setExpandedSections] = useState({
        providerInfo: true,
        checklist: false,
        workerInterviews: false,
        auditorRemarks: false,
        providerComments: false
    });
    
    // File upload states
    const [uploadedImages, setUploadedImages] = useState({});
    
    // Dummy checklist data
    const dummyChecklists = [
        {
            id: 1,
            title: 'Health & Safety Compliance',
            order: 1,
            items: [
                {
                    id: 1.1,
                    title: 'Are fire extinguishers available and regularly checked?',
                    type: 'radio',
                    options: [
                        { id: 'yes_1', label: 'Yes', value: 'yes', score: 10 },
                        { id: 'no_1', label: 'No', value: 'no', score: 0 },
                        { id: 'na_1', label: 'Not Applicable', value: 'na', score: 5 }
                    ],
                    selectedValue: '',
                    description: '',
                    image: null,
                    maxScore: 10
                },
                {
                    id: 1.2,
                    title: 'Are emergency exits clearly marked and unobstructed?',
                    type: 'radio',
                    options: [
                        { id: 'yes_2', label: 'Yes', value: 'yes', score: 10 },
                        { id: 'no_2', label: 'No', value: 'no', score: 0 },
                        { id: 'na_2', label: 'Not Applicable', value: 'na', score: 5 }
                    ],
                    selectedValue: '',
                    description: '',
                    image: null,
                    maxScore: 10
                },
                {
                    id: 1.3,
                    title: 'First aid kits available and accessible?',
                    type: 'radio',
                    options: [
                        { id: 'yes_3', label: 'Yes', value: 'yes', score: 10 },
                        { id: 'no_3', label: 'No', value: 'no', score: 0 },
                        { id: 'na_3', label: 'Not Applicable', value: 'na', score: 5 }
                    ],
                    selectedValue: '',
                    description: '',
                    image: null,
                    maxScore: 10
                }
            ]
        },
        {
            id: 2,
            title: 'Quality Control & Production',
            order: 2,
            items: [
                {
                    id: 2.1,
                    title: 'Is there a documented quality control process?',
                    type: 'radio',
                    options: [
                        { id: 'yes_4', label: 'Yes', value: 'yes', score: 15 },
                        { id: 'no_4', label: 'No', value: 'no', score: 0 },
                        { id: 'na_4', label: 'Not Applicable', value: 'na', score: 7 }
                    ],
                    selectedValue: '',
                    description: '',
                    image: null,
                    maxScore: 15
                },
                {
                    id: 2.2,
                    title: 'Are production machines regularly maintained?',
                    type: 'radio',
                    options: [
                        { id: 'yes_5', label: 'Yes', value: 'yes', score: 15 },
                        { id: 'no_5', label: 'No', value: 'no', score: 0 },
                        { id: 'na_5', label: 'Not Applicable', value: 'na', score: 8 }
                    ],
                    selectedValue: '',
                    description: '',
                    image: null,
                    maxScore: 15
                }
            ]
        },
        {
            id: 3,
            title: 'Environmental Compliance',
            order: 3,
            items: [
                {
                    id: 3.1,
                    title: 'Proper waste disposal system in place?',
                    type: 'radio',
                    options: [
                        { id: 'yes_6', label: 'Yes', value: 'yes', score: 10 },
                        { id: 'no_6', label: 'No', value: 'no', score: 0 },
                        { id: 'na_6', label: 'Not Applicable', value: 'na', score: 5 }
                    ],
                    selectedValue: '',
                    description: '',
                    image: null,
                    maxScore: 10
                },
                {
                    id: 3.2,
                    title: 'Energy conservation measures implemented?',
                    type: 'radio',
                    options: [
                        { id: 'yes_7', label: 'Yes', value: 'yes', score: 10 },
                        { id: 'no_7', label: 'No', value: 'no', score: 0 },
                        { id: 'na_7', label: 'Not Applicable', value: 'na', score: 5 }
                    ],
                    selectedValue: '',
                    description: '',
                    image: null,
                    maxScore: 10
                }
            ]
        }
    ];
    
    // Initialize with dummy data
    useEffect(() => {
        if (auditData) {
            // If editing/viewing existing audit
            setFormData(prev => ({
                ...prev,
                ...auditData,
                checklists: auditData.checklists || dummyChecklists
            }));
        } else {
            // If creating new audit
            setFormData(prev => ({
                ...prev,
                checklists: dummyChecklists
            }));
        }
    }, [auditData]);
    
    // Calculate scores whenever checklists change
    useEffect(() => {
        calculateScores();
    }, [formData.checklists]);
    
    const calculateScores = () => {
        let totalScore = 0;
        let maxPossibleScore = 0;
        
        formData.checklists.forEach(checklist => {
            checklist.items.forEach(item => {
                maxPossibleScore += item.maxScore;
                if (item.selectedValue) {
                    const selectedOption = item.options.find(opt => opt.value === item.selectedValue);
                    if (selectedOption) {
                        totalScore += selectedOption.score;
                    }
                }
            });
        });
        
        const calculatedScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
        
        setFormData(prev => ({
            ...prev,
            totalScore,
            maxPossibleScore,
            calculatedScore,
            currentScore: calculatedScore
        }));
    };
    
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleChecklistChange = (checklistId, itemId, field, value) => {
        setFormData(prev => {
            const updatedChecklists = prev.checklists.map(checklist => {
                if (checklist.id === checklistId) {
                    const updatedItems = checklist.items.map(item => {
                        if (item.id === itemId) {
                            return { ...item, [field]: value };
                        }
                        return item;
                    });
                    return { ...checklist, items: updatedItems };
                }
                return checklist;
            });
            
            return { ...prev, checklists: updatedChecklists };
        });
    };
    
    const handleImageUpload = (checklistId, itemId, e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showMessage('error', 'Please upload an image file');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                showMessage('error', 'Image size should be less than 5MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = e.target.result;
                setUploadedImages(prev => ({
                    ...prev,
                    [`${checklistId}_${itemId}`]: imageData
                }));
                
                handleChecklistChange(checklistId, itemId, 'image', imageData);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const removeImage = (checklistId, itemId) => {
        const key = `${checklistId}_${itemId}`;
        setUploadedImages(prev => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
        });
        
        handleChecklistChange(checklistId, itemId, 'image', null);
    };
    
    // Worker Interview Functions
    const [newInterview, setNewInterview] = useState({
        name: '',
        designation: '',
        natureOfWork: '',
        questions: [{ question: '', response: '' }]
    });
    
    const addQuestion = () => {
        setNewInterview(prev => ({
            ...prev,
            questions: [...prev.questions, { question: '', response: '' }]
        }));
    };
    
    const removeQuestion = (index) => {
        if (newInterview.questions.length > 1) {
            setNewInterview(prev => ({
                ...prev,
                questions: prev.questions.filter((_, i) => i !== index)
            }));
        }
    };
    
    const updateQuestion = (index, field, value) => {
        const updatedQuestions = [...newInterview.questions];
        updatedQuestions[index][field] = value;
        setNewInterview(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };
    
    const addInterview = () => {
        if (!newInterview.name || !newInterview.designation) {
            showMessage('error', 'Name and designation are required');
            return;
        }
        
        setFormData(prev => ({
            ...prev,
            workerInterviews: [...prev.workerInterviews, { ...newInterview, id: Date.now() }]
        }));
        
        setNewInterview({
            name: '',
            designation: '',
            natureOfWork: '',
            questions: [{ question: '', response: '' }]
        });
        
        showMessage('success', 'Worker interview added successfully');
    };
    
    const removeInterview = (index) => {
        setFormData(prev => ({
            ...prev,
            workerInterviews: prev.workerInterviews.filter((_, i) => i !== index)
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.supplierName || !formData.supplierType || !formData.asianAuditorName) {
            showMessage('error', 'Please fill all required fields');
            return;
        }
        
        // In a real application, this would save to backend
        const successMessage = isEditMode ? 'Audit updated successfully!' : 'Audit created successfully!';
        
        showMessage('success', successMessage);
        setTimeout(() => {
            navigate(-1);
        }, 1500);
    };
    
    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            navigate(-1);
        }
    };
    
    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600 bg-green-100';
        if (score >= 80) return 'text-blue-600 bg-blue-100';
        if (score >= 70) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };
    
    const getScoreText = (score) => {
        if (score >= 90) return 'Excellent';
        if (score >= 80) return 'Good';
        if (score >= 70) return 'Fair';
        if (score >= 60) return 'Needs Improvement';
        return 'Poor';
    };
    
    const printAudit = () => {
        window.print();
    };
    
    const exportAudit = () => {
        // In a real application, this would export to PDF/Excel
        showMessage('success', 'Audit exported successfully!');
    };
    
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isViewMode ? 'View Audit' : isEditMode ? 'Edit Audit' : 'Create New Audit'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Audit ID: <span className="font-mono font-semibold">{formData.auditId}</span>
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={printAudit}
                        className="btn btn-outline-primary"
                        disabled={isViewMode}
                    >
                        <IconPrinter className="w-4 h-4 mr-2" />
                        Print
                    </button>
                    <button
                        onClick={exportAudit}
                        className="btn btn-outline-secondary"
                    >
                        <IconDownload className="w-4 h-4 mr-2" />
                        Export
                    </button>
                </div>
            </div>
            
            {/* Score Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Audit Score Summary</h3>
                        <p className="text-gray-600 mt-1">Current audit performance</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-6">
                        <div className="text-center">
                            <div className={`text-4xl font-bold ${getScoreColor(formData.calculatedScore)} px-4 py-2 rounded-lg`}>
                                {formData.calculatedScore}%
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{getScoreText(formData.calculatedScore)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-800">
                                {formData.totalScore}/{formData.maxPossibleScore}
                            </div>
                            <div className="text-sm text-gray-600">Points</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-gray-800">
                                {formData.checklists.reduce((acc, cl) => acc + cl.items.filter(i => i.selectedValue).length, 0)}/
                                {formData.checklists.reduce((acc, cl) => acc + cl.items.length, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Items Completed</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Provider Information Accordion */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSection('providerInfo')}
                            className="flex items-center justify-between w-full p-6 text-left"
                        >
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                                    <span className="text-blue-600 font-bold">1</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Provider Information</h3>
                                    <p className="text-gray-600 text-sm mt-1">Basic details about the external provider/supplier</p>
                                </div>
                            </div>
                            {expandedSections.providerInfo ? (
                                <IconChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                                <IconChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                    
                    {expandedSections.providerInfo && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Supplier Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name of Supplier/External Provider *
                                    </label>
                                    <input
                                        type="text"
                                        name="supplierName"
                                        value={formData.supplierName}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Enter supplier name"
                                        required
                                        disabled={isViewMode}
                                    />
                                </div>
                                
                                {/* Supplier Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type of Supplier *
                                    </label>
                                    <select
                                        name="supplierType"
                                        value={formData.supplierType}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                        disabled={isViewMode}
                                    >
                                        <option value="">Select type</option>
                                        <option value="Manufacturer">Manufacturer</option>
                                        <option value="Distributor">Distributor</option>
                                        <option value="Service Provider">Service Provider</option>
                                        <option value="Raw Material Supplier">Raw Material Supplier</option>
                                        <option value="Contractor">Contractor</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                
                                {/* Number of Employees */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        No. of Employees
                                    </label>
                                    <input
                                        type="number"
                                        name="employeeCount"
                                        value={formData.employeeCount}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Enter number of employees"
                                        disabled={isViewMode}
                                    />
                                </div>
                                
                                {/* Production Capacity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Production Capacity
                                    </label>
                                    <input
                                        type="text"
                                        name="productionCapacity"
                                        value={formData.productionCapacity}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="e.g., 5000 units/month"
                                        disabled={isViewMode}
                                    />
                                </div>
                                
                                {/* Asian Auditor Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Asian Auditor Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="asianAuditorName"
                                        value={formData.asianAuditorName}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Enter auditor name"
                                        required
                                        disabled={isViewMode}
                                    />
                                </div>
                                
                                {/* Last Audit Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Audit Date
                                    </label>
                                    <input
                                        type="date"
                                        name="lastAuditDate"
                                        value={formData.lastAuditDate}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        disabled={isViewMode}
                                    />
                                </div>
                                
                                {/* Number of Machines */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        No. of Machines
                                    </label>
                                    <input
                                        type="number"
                                        name="machineCount"
                                        value={formData.machineCount}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Enter number of machines"
                                        disabled={isViewMode}
                                    />
                                </div>
                                
                                {/* Products */}
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name of Products
                                    </label>
                                    <input
                                        type="text"
                                        name="products"
                                        value={formData.products}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Enter product names"
                                        disabled={isViewMode}
                                    />
                                </div>
                                
                                {/* Visit Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Visit
                                    </label>
                                    <input
                                        type="date"
                                        name="visitDate"
                                        value={formData.visitDate}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                        disabled={isViewMode}
                                    />
                                </div>
                                
                                {/* Supplier Representative */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Supplier Representative
                                    </label>
                                    <input
                                        type="text"
                                        name="supplierRepresentative"
                                        value={formData.supplierRepresentative}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Enter representative name"
                                        disabled={isViewMode}
                                    />
                                </div>
                                
                                {/* Last Audit Score */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Audit Score
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="lastAuditScore"
                                            value={formData.lastAuditScore}
                                            onChange={handleInputChange}
                                            className="form-input pr-10"
                                            placeholder="Score"
                                            min="0"
                                            max="100"
                                            disabled={isViewMode}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-500">%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Current Score (Auto-calculated) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Score
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="currentScore"
                                            value={formData.calculatedScore}
                                            readOnly
                                            className="form-input pr-10 bg-gray-50"
                                            placeholder="Auto-calculated"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-gray-500">%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Toggle Fields */}
                                <div className="lg:col-span-3 space-y-4">
                                    <div className="flex items-center space-x-6">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="transportAvailable"
                                                checked={formData.transportAvailable}
                                                onChange={handleInputChange}
                                                className="form-checkbox h-5 w-5 text-blue-600"
                                                disabled={isViewMode}
                                            />
                                            <span className="ml-2 text-gray-700">Transport Available</span>
                                        </label>
                                        
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="accommodationAvailable"
                                                checked={formData.accommodationAvailable}
                                                onChange={handleInputChange}
                                                className="form-checkbox h-5 w-5 text-blue-600"
                                                disabled={isViewMode}
                                            />
                                            <span className="ml-2 text-gray-700">Accommodation Available</span>
                                        </label>
                                        
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="animalsAllowed"
                                                checked={formData.animalsAllowed}
                                                onChange={handleInputChange}
                                                className="form-checkbox h-5 w-5 text-blue-600"
                                                disabled={isViewMode}
                                            />
                                            <span className="ml-2 text-gray-700">Animals Allowed</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Checklist Accordion */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSection('checklist')}
                            className="flex items-center justify-between w-full p-6 text-left"
                        >
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                                    <span className="text-green-600 font-bold">2</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Audit Checklist</h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Complete the audit checklist with Yes/No/Not Applicable options
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                    {formData.checklists.reduce((acc, cl) => acc + cl.items.filter(i => i.selectedValue).length, 0)}/
                                    {formData.checklists.reduce((acc, cl) => acc + cl.items.length, 0)} completed
                                </span>
                                {expandedSections.checklist ? (
                                    <IconChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <IconChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                        </button>
                    </div>
                    
                    {expandedSections.checklist && (
                        <div className="p-6">
                            <div className="space-y-8">
                                {formData.checklists.map((checklist, checklistIndex) => (
                                    <div key={checklist.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                {checklist.order}. {checklist.title}
                                            </h4>
                                        </div>
                                        
                                        <div className="divide-y divide-gray-200">
                                            {checklist.items.map((item, itemIndex) => {
                                                const imageKey = `${checklist.id}_${item.id}`;
                                                const hasImage = uploadedImages[imageKey] || item.image;
                                                
                                                return (
                                                    <div key={item.id} className="p-6 hover:bg-gray-50">
                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                            {/* Question */}
                                                            <div className="lg:col-span-2">
                                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                                    {checklist.order}.{itemIndex + 1}. {item.title}
                                                                </label>
                                                                
                                                                {/* Radio Options */}
                                                                <div className="flex items-center space-x-6 mb-4">
                                                                    {item.options.map(option => (
                                                                        <label key={option.id} className="flex items-center">
                                                                            <input
                                                                                type="radio"
                                                                                name={`item_${item.id}`}
                                                                                value={option.value}
                                                                                checked={item.selectedValue === option.value}
                                                                                onChange={(e) => handleChecklistChange(checklist.id, item.id, 'selectedValue', e.target.value)}
                                                                                className="form-radio h-4 w-4"
                                                                                disabled={isViewMode}
                                                                            />
                                                                            <span className="ml-2 text-gray-700">
                                                                                {option.label} ({option.score} points)
                                                                            </span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                                
                                                                {/* Description */}
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        Description/Comments
                                                                    </label>
                                                                    <textarea
                                                                        value={item.description}
                                                                        onChange={(e) => handleChecklistChange(checklist.id, item.id, 'description', e.target.value)}
                                                                        className="form-textarea min-h-[100px]"
                                                                        placeholder="Add comments or observations..."
                                                                        disabled={isViewMode}
                                                                    />
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Image Upload */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Upload Image (Optional)
                                                                </label>
                                                                
                                                                {hasImage ? (
                                                                    <div className="space-y-3">
                                                                        <div className="relative">
                                                                            <img
                                                                                src={hasImage}
                                                                                alt="Checklist evidence"
                                                                                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                                                                            />
                                                                            {!isViewMode && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeImage(checklist.id, item.id)}
                                                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                                                >
                                                                                    <IconTrash className="w-4 h-4" />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 text-center">
                                                                            Click image to enlarge
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                                                        {!isViewMode ? (
                                                                            <>
                                                                                <IconImage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                                                <label className="cursor-pointer">
                                                                                    <input
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        onChange={(e) => handleImageUpload(checklist.id, item.id, e)}
                                                                                        className="hidden"
                                                                                        disabled={isViewMode}
                                                                                    />
                                                                                    <span className="btn btn-outline-primary">
                                                                                        Upload Image
                                                                                    </span>
                                                                                </label>
                                                                                <p className="text-xs text-gray-500 mt-2">
                                                                                    PNG, JPG up to 5MB
                                                                                </p>
                                                                            </>
                                                                        ) : (
                                                                            <p className="text-gray-500">No image uploaded</p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Worker Interviews Accordion */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSection('workerInterviews')}
                            className="flex items-center justify-between w-full p-6 text-left"
                        >
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                                    <span className="text-purple-600 font-bold">3</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Worker Interviews</h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Record interviews with workers (Name, Designation, Questions & Responses)
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                    {formData.workerInterviews.length} interviews recorded
                                </span>
                                {expandedSections.workerInterviews ? (
                                    <IconChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <IconChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                        </button>
                    </div>
                    
                    {expandedSections.workerInterviews && (
                        <div className="p-6">
                            {/* Add New Interview Form */}
                            {!isViewMode && (
                                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Interview</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Worker Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={newInterview.name}
                                                onChange={(e) => setNewInterview(prev => ({ ...prev, name: e.target.value }))}
                                                className="form-input"
                                                placeholder="Enter worker name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Designation *
                                            </label>
                                            <input
                                                type="text"
                                                value={newInterview.designation}
                                                onChange={(e) => setNewInterview(prev => ({ ...prev, designation: e.target.value }))}
                                                className="form-input"
                                                placeholder="Enter designation"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nature of Work
                                            </label>
                                            <input
                                                type="text"
                                                value={newInterview.natureOfWork}
                                                onChange={(e) => setNewInterview(prev => ({ ...prev, natureOfWork: e.target.value }))}
                                                className="form-input"
                                                placeholder="Describe work nature"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Questions Section */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <h5 className="text-md font-medium text-gray-700">Questions & Responses</h5>
                                            <button
                                                type="button"
                                                onClick={addQuestion}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                <IconPlus className="w-4 h-4 mr-1" />
                                                Add Question
                                            </button>
                                        </div>
                                        
                                        {newInterview.questions.map((q, index) => (
                                            <div key={index} className="flex items-start space-x-4">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Question {index + 1}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={q.question}
                                                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                                        className="form-input mb-2"
                                                        placeholder="Enter question"
                                                    />
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Response
                                                    </label>
                                                    <textarea
                                                        value={q.response}
                                                        onChange={(e) => updateQuestion(index, 'response', e.target.value)}
                                                        className="form-textarea"
                                                        placeholder="Enter response"
                                                        rows="2"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(index)}
                                                    className="mt-6 text-red-600 hover:text-red-800"
                                                    disabled={newInterview.questions.length === 1}
                                                >
                                                    <IconTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button
                                        type="button"
                                        onClick={addInterview}
                                        className="btn btn-primary"
                                    >
                                        <IconPlus className="w-4 h-4 mr-2" />
                                        Add Interview
                                    </button>
                                </div>
                            )}
                            
                            {/* Interviews Table */}
                            {formData.workerInterviews.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    S.No
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Designation
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nature of Work
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Questions
                                                </th>
                                                {!isViewMode && (
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {formData.workerInterviews.map((interview, index) => (
                                                <tr key={interview.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {index + 1}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {interview.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {interview.designation}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {interview.natureOfWork}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            {interview.questions.map((q, qIndex) => (
                                                                <div key={qIndex} className="text-sm">
                                                                    <div className="font-medium text-gray-700">
                                                                        Q{qIndex + 1}: {q.question}
                                                                    </div>
                                                                    <div className="text-gray-600 ml-4">
                                                                        A: {q.response || 'No response'}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    {!isViewMode && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeInterview(index)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-500">No worker interviews recorded yet.</p>
                                    {!isViewMode && (
                                        <p className="text-sm text-gray-400 mt-2">
                                            Use the form above to add interviews
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Auditor Remarks Accordion */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSection('auditorRemarks')}
                            className="flex items-center justify-between w-full p-6 text-left"
                        >
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mr-4">
                                    <span className="text-orange-600 font-bold">4</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Auditor Remarks / Observations</h3>
                                    <p className="text-gray-600 text-sm mt-1">Overall observations and recommendations</p>
                                </div>
                            </div>
                            {expandedSections.auditorRemarks ? (
                                <IconChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                                <IconChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                    
                    {expandedSections.auditorRemarks && (
                        <div className="p-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Overall Audit Observations
                                </label>
                                <textarea
                                    name="auditorRemarks"
                                    value={formData.auditorRemarks}
                                    onChange={handleInputChange}
                                    className="form-textarea min-h-[200px]"
                                    placeholder="Enter your overall observations, findings, and recommendations..."
                                    disabled={isViewMode}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Include strengths, areas for improvement, and any critical observations from the audit.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* External Provider Comments Accordion */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => toggleSection('providerComments')}
                            className="flex items-center justify-between w-full p-6 text-left"
                        >
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center mr-4">
                                    <span className="text-teal-600 font-bold">5</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">External Provider Comments / Suggestions</h3>
                                    <p className="text-gray-600 text-sm mt-1">Feedback from the external provider about the audit</p>
                                </div>
                            </div>
                            {expandedSections.providerComments ? (
                                <IconChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                                <IconChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                    
                    {expandedSections.providerComments && (
                        <div className="p-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Provider Feedback
                                </label>
                                <textarea
                                    name="externalProviderComments"
                                    value={formData.externalProviderComments}
                                    onChange={handleInputChange}
                                    className="form-textarea min-h-[150px]"
                                    placeholder="Enter provider's comments, suggestions, or feedback about the audit process..."
                                    disabled={isViewMode}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    This section is for the external provider to provide feedback about the audit process.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Action Buttons */}
                {!isViewMode && (
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-outline-danger"
                        >
                            <IconCancel className="w-4 h-4 mr-2" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            <IconSave className="w-4 h-4 mr-2" />
                            {isEditMode ? 'Update Audit' : 'Save Audit'}
                        </button>
                    </div>
                )}
                
                {isViewMode && (
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn btn-outline-primary"
                        >
                            Back to List
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/audit/external-provider/form', {
                                state: { mode: 'edit', auditData: formData }
                            })}
                            className="btn btn-primary"
                        >
                            <IconPencil className="w-4 h-4 mr-2" />
                            Edit Audit
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ExternalProviderAuditForm;