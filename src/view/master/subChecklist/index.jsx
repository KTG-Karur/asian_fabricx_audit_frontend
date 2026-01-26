import { useState, Fragment, useEffect } from 'react';
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEye from '../../../components/Icon/IconEye';
import IconChevronUp from '../../../components/Icon/IconChevronUp';
import IconChevronDown from '../../../components/Icon/IconChevronDown';
import IconX from '../../../components/Icon/IconX';
import IconCheck from '../../../components/Icon/IconX';
import IconFile from '../../../components/Icon/IconFile';
import Table from '../../../util/Table';
import Tippy from '@tippyjs/react';
import ModelViewBox from '../../../util/ModelViewBox';
import FormLayout from '../../../util/formLayout';
import { showMessage } from '../../../util/AllFunction';
import _ from 'lodash';
import { FormContainer } from './formContainer';

const dummyChecklists = [
    {
        id: 1,
        title: 'Factory Safety Audit',
        order: 1,
        isActive: 1,
        createdDate: '2024-01-01',
        checkItems: [
            { 
                id: 1, 
                checklistId: 1, 
                name: 'Fire Extinguishers Checked', 
                order: 1, 
                isActive: 1,
                hasOptions: false
            },
            { 
                id: 2, 
                checklistId: 1, 
                name: 'Emergency Exits Clear', 
                order: 2, 
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: "Yes", value: "yes" },
                    { id: 2, label: "No", value: "no" },
                    { id: 3, label: "Not Applicable", value: "na" }
                ],
                hasDescription: true,
                hasImage: true
            },
            { 
                id: 3, 
                checklistId: 1, 
                name: 'Safety Signage Visible', 
                order: 3, 
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: "Yes", value: "yes" },
                    { id: 2, label: "No", value: "no" },
                    { id: 3, label: "Not Applicable", value: "na" }
                ],
                hasDescription: true,
                hasImage: false
            },
            { 
                id: 4, 
                checklistId: 1, 
                name: 'First Aid Kits Stocked', 
                order: 4, 
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: "Yes", value: "yes" },
                    { id: 2, label: "No", value: "no" },
                    { id: 3, label: "Not Applicable", value: "na" }
                ],
                hasDescription: false,
                hasImage: true
            }
        ]
    },
    {
        id: 2,
        title: 'Quality Control Checklist',
        order: 2,
        isActive: 1,
        createdDate: '2024-01-05',
        checkItems: [
            { 
                id: 5, 
                checklistId: 2, 
                name: 'Raw Material Inspection', 
                order: 1, 
                isActive: 1,
                hasOptions: false
            },
            { 
                id: 6, 
                checklistId: 2, 
                name: 'Production Line Check', 
                order: 2, 
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: "Yes", value: "yes" },
                    { id: 2, label: "No", value: "no" },
                    { id: 3, label: "Not Applicable", value: "na" }
                ],
                hasDescription: true,
                hasImage: true
            },
            { 
                id: 7, 
                checklistId: 2, 
                name: 'Finished Product Testing', 
                order: 3, 
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: "Yes", value: "yes" },
                    { id: 2, label: "No", value: "no" },
                    { id: 3, label: "Not Applicable", value: "na" }
                ],
                hasDescription: true,
                hasImage: false
            }
        ]
    },
    {
        id: 3,
        title: 'Environmental Compliance',
        order: 3,
        isActive: 1,
        createdDate: '2024-01-10',
        checkItems: [
            { 
                id: 8, 
                checklistId: 3, 
                name: 'Waste Disposal Verification', 
                order: 1, 
                isActive: 1,
                hasOptions: false
            },
            { 
                id: 9, 
                checklistId: 3, 
                name: 'Emission Control Check', 
                order: 2, 
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: "Yes", value: "yes" },
                    { id: 2, label: "No", value: "no" },
                    { id: 3, label: "Not Applicable", value: "na" }
                ],
                hasDescription: true,
                hasImage: true
            }
        ]
    }
];

const Index = () => {
    const [modal, setModal] = useState(false);
    const [itemsModal, setItemsModal] = useState(false);
    const [itemModal, setItemModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isItemEdit, setIsItemEdit] = useState(false);
    const [state, setState] = useState({
        title: '',
        order: 0
    });
    const [itemState, setItemState] = useState({
        checklistId: '',
        name: '',
        order: 0,
        hasOptions: false,
        hasDescription: false,
        hasImage: false
    });
    const [checklists, setChecklists] = useState(dummyChecklists);
    const [formContain, setFormContain] = useState(FormContainer);
    const [errors, setErrors] = useState([]);
    const [itemErrors, setItemErrors] = useState([]);
    const [selectedChecklist, setSelectedChecklist] = useState(null);
    const [selectedCheckItem, setSelectedCheckItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const closeModel = () => {
        setIsEdit(false);
        onFormClear();
        setModal(false);
    };

    const closeItemsModel = () => {
        setItemsModal(false);
        setSelectedChecklist(null);
    };

    const closeItemModel = () => {
        setIsItemEdit(false);
        onItemFormClear();
        setItemModal(false);
    };

    const onFormClear = () => {
        setState({
            title: '',
            order: 0
        });
        setSelectedChecklist(null);
        setErrors([]);
    };

    const onItemFormClear = () => {
        setItemState({
            checklistId: '',
            name: '',
            order: 0,
            hasOptions: false,
            hasDescription: false,
            hasImage: false
        });
        setSelectedCheckItem(null);
        setItemErrors([]);
    };

    const createModel = () => {
        onFormClear();
        setIsEdit(false);
        const maxOrder = checklists.length > 0 ? Math.max(...checklists.map(c => c.order)) : 0;
        setState(prev => ({
            ...prev,
            order: maxOrder + 1
        }));
        setModal(true);
        setErrors([]);
    };

    const openItemsModel = (checklistId) => {
        const checklist = checklists.find(c => c.id === checklistId);
        if (!checklist) return;
        
        setSelectedChecklist(checklist);
        setItemsModal(true);
    };

    const createItemModel = () => {
        onItemFormClear();
        setIsItemEdit(false);
        
        const maxItemOrder = selectedChecklist.checkItems.length > 0 
            ? Math.max(...selectedChecklist.checkItems.map(i => i.order)) 
            : 0;
        
        setItemState({
            checklistId: selectedChecklist.id,
            name: '',
            order: maxItemOrder + 1,
            hasOptions: false,
            hasDescription: false,
            hasImage: false
        });
        setItemModal(true);
        setItemErrors([]);
    };

    const onEditForm = (data) => {
        setState({
            title: data.title || '',
            order: data.order || 0
        });
        setIsEdit(true);
        setSelectedChecklist(data);
        setModal(true);
        setErrors([]);
    };

    const onEditItemForm = (item) => {
        setItemState({
            checklistId: selectedChecklist.id,
            name: item.name || '',
            order: item.order || 0,
            hasOptions: item.hasOptions || false,
            hasDescription: item.hasDescription || false,
            hasImage: item.hasImage || false
        });
        setIsItemEdit(true);
        setSelectedCheckItem(item);
        setItemModal(true);
        setItemErrors([]);
    };

    const validateForm = () => {
        const newErrors = [];
        if (!state.title?.trim()) newErrors.push('title');
        if (!state.order || state.order < 1) newErrors.push('order');
        
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const validateItemForm = () => {
        const newErrors = [];
        if (!itemState.name?.trim()) newErrors.push('name');
        if (!itemState.checklistId) newErrors.push('checklistId');
        if (!itemState.order || itemState.order < 1) newErrors.push('order');
        
        setItemErrors(newErrors);
        return newErrors.length === 0;
    };

    const onFormSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validateForm()) {
            showMessage('error', 'Please fill all required fields correctly');
            return;
        }

        try {
            if (isEdit && selectedChecklist) {
                const updatedChecklists = checklists.map(checklist => 
                    checklist.id === selectedChecklist.id ? { 
                        ...checklist, 
                        title: state.title.trim(),
                        order: state.order
                    } : checklist
                );
                setChecklists(updatedChecklists);
                showMessage('success', 'Checklist updated successfully');
            } else {
                const newChecklist = {
                    id: checklists.length + 1,
                    title: state.title.trim(),
                    order: state.order,
                    isActive: 1,
                    createdDate: new Date().toISOString().split('T')[0],
                    checkItems: []
                };
                setChecklists(prev => [...prev, newChecklist]);
                showMessage('success', 'Checklist created successfully');
            }

            closeModel();
        } catch (error) {
            showMessage('error', 'Failed to save checklist');
        }
    };

    const onItemFormSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validateItemForm()) {
            showMessage('error', 'Please fill all required fields correctly');
            return;
        }

        try {
            const checklistIndex = checklists.findIndex(c => c.id === itemState.checklistId);
            if (checklistIndex === -1) {
                showMessage('error', 'Checklist not found');
                return;
            }

            const updatedChecklists = [...checklists];
            
            if (isItemEdit && selectedCheckItem) {
                const updatedItem = { 
                    ...selectedCheckItem,
                    name: itemState.name.trim(),
                    order: itemState.order,
                    hasOptions: itemState.hasOptions,
                    hasDescription: itemState.hasDescription,
                    hasImage: itemState.hasImage
                };
                
                if (itemState.hasOptions) {
                    updatedItem.options = [
                        { id: 1, label: "Yes", value: "yes" },
                        { id: 2, label: "No", value: "no" },
                        { id: 3, label: "Not Applicable", value: "na" }
                    ];
                } else {
                    delete updatedItem.options;
                }
                
                updatedChecklists[checklistIndex].checkItems = updatedChecklists[checklistIndex].checkItems.map(item => 
                    item.id === selectedCheckItem.id ? updatedItem : item
                );
                showMessage('success', 'Check item updated successfully');
            } else {
                const newCheckItem = {
                    id: Date.now(),
                    checklistId: itemState.checklistId,
                    name: itemState.name.trim(),
                    order: itemState.order,
                    isActive: 1,
                    hasOptions: itemState.hasOptions,
                    hasDescription: itemState.hasDescription,
                    hasImage: itemState.hasImage
                };
                
                if (itemState.hasOptions) {
                    newCheckItem.options = [
                        { id: 1, label: "Yes", value: "yes" },
                        { id: 2, label: "No", value: "no" },
                        { id: 3, label: "Not Applicable", value: "na" }
                    ];
                }
                
                updatedChecklists[checklistIndex].checkItems = [...updatedChecklists[checklistIndex].checkItems, newCheckItem];
                showMessage('success', 'Check item created successfully');
            }

            updatedChecklists[checklistIndex].checkItems.sort((a, b) => a.order - b.order);
            setChecklists(updatedChecklists);
            closeItemModel();
        } catch (error) {
            showMessage('error', 'Failed to save check item');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setState(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors.includes(name)) {
            setErrors(prev => prev.filter(error => error !== name));
        }
    };

    const handleItemInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setItemState(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (itemErrors.includes(name)) {
            setItemErrors(prev => prev.filter(error => error !== name));
        }
    };

    const handleDeleteChecklist = (checklist) => {
        showMessage('warning', 'Are you sure you want to delete this checklist?', () => {
            const updatedChecklists = checklists.map(c => 
                c.id === checklist.id ? { ...c, isActive: 0 } : c
            );
            setChecklists(updatedChecklists);
            showMessage('success', 'Checklist deleted successfully');
        });
    };

    const handleDeleteCheckItem = (item) => {
        showMessage('warning', 'Are you sure you want to delete this check item?', () => {
            const checklistIndex = checklists.findIndex(c => c.id === selectedChecklist.id);
            if (checklistIndex === -1) return;

            const updatedChecklists = [...checklists];
            updatedChecklists[checklistIndex].checkItems = updatedChecklists[checklistIndex].checkItems
                .filter(i => i.id !== item.id)
                .map((item, index) => ({ ...item, order: index + 1 }));

            setChecklists(updatedChecklists);
            showMessage('success', 'Check item deleted successfully');
        });
    };

    const handleRestoreChecklist = (checklist) => {
        const updatedChecklists = checklists.map(c => 
            c.id === checklist.id ? { ...c, isActive: 1 } : c
        );
        setChecklists(updatedChecklists);
        showMessage('success', 'Checklist restored successfully');
    };

    const moveChecklistUp = (checklistId) => {
        const index = checklists.findIndex(c => c.id === checklistId);
        if (index <= 0) return;

        const updatedChecklists = [...checklists];
        const temp = updatedChecklists[index];
        updatedChecklists[index] = updatedChecklists[index - 1];
        updatedChecklists[index - 1] = temp;

        updatedChecklists.forEach((checklist, idx) => {
            checklist.order = idx + 1;
        });

        setChecklists(updatedChecklists);
    };

    const moveChecklistDown = (checklistId) => {
        const index = checklists.findIndex(c => c.id === checklistId);
        if (index >= checklists.length - 1) return;

        const updatedChecklists = [...checklists];
        const temp = updatedChecklists[index];
        updatedChecklists[index] = updatedChecklists[index + 1];
        updatedChecklists[index + 1] = temp;

        updatedChecklists.forEach((checklist, idx) => {
            checklist.order = idx + 1;
        });

        setChecklists(updatedChecklists);
    };

    const moveItemUp = (itemId) => {
        const checklistIndex = checklists.findIndex(c => c.id === selectedChecklist.id);
        if (checklistIndex === -1) return;

        const itemIndex = checklists[checklistIndex].checkItems.findIndex(i => i.id === itemId);
        if (itemIndex <= 0) return;

        const updatedChecklists = [...checklists];
        const items = [...updatedChecklists[checklistIndex].checkItems];
        const temp = items[itemIndex];
        items[itemIndex] = items[itemIndex - 1];
        items[itemIndex - 1] = temp;

        items.forEach((item, idx) => {
            item.order = idx + 1;
        });

        updatedChecklists[checklistIndex].checkItems = items;
        setChecklists(updatedChecklists);
    };

    const moveItemDown = (itemId) => {
        const checklistIndex = checklists.findIndex(c => c.id === selectedChecklist.id);
        if (checklistIndex === -1) return;

        const itemIndex = checklists[checklistIndex].checkItems.findIndex(i => i.id === itemId);
        if (itemIndex >= checklists[checklistIndex].checkItems.length - 1) return;

        const updatedChecklists = [...checklists];
        const items = [...updatedChecklists[checklistIndex].checkItems];
        const temp = items[itemIndex];
        items[itemIndex] = items[itemIndex + 1];
        items[itemIndex + 1] = temp;

        items.forEach((item, idx) => {
            item.order = idx + 1;
        });

        updatedChecklists[checklistIndex].checkItems = items;
        setChecklists(updatedChecklists);
    };

    const handlePaginationChange = (pageIndex, newPageSize) => {
        setCurrentPage(pageIndex);
        setPageSize(newPageSize);
    };

    const getPaginatedData = () => {
        const dataArray = checklists.filter(c => c.isActive === 1) || [];
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        return dataArray.slice(startIndex, endIndex);
    };

    const getTotalCount = () => {
        return checklists.filter(c => c.isActive === 1).length;
    };

    const sortedChecklists = [...checklists].sort((a, b) => a.order - b.order);

    const renderItemIndicators = (item) => {
        const indicators = [];
        
        if (item.hasOptions) {
            indicators.push(
                <Tippy key="options" content="Has Yes/No/NA options">
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        <IconCheck className="w-3 h-3" />
                        <span>Options</span>
                    </div>
                </Tippy>
            );
        }
        
        if (item.hasDescription) {
            indicators.push(
                <Tippy key="desc" content="Requires description">
                    <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        <IconFile className="w-3 h-3" />
                        <span>Desc</span>
                    </div>
                </Tippy>
            );
        }
        
        if (item.hasImage) {
            indicators.push(
                <Tippy key="image" content="Requires image upload">
                    <div className="flex items-center space-x-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        <IconPlus className="w-3 h-3" />
                        <span>Image</span>
                    </div>
                </Tippy>
            );
        }
        
        return (
            <div className="flex items-center space-x-1">
                {indicators}
            </div>
        );
    };

    return (
        <div>
            <div className="datatables">
                <Table
                    columns={[
                        {
                            Header: 'Order',
                            accessor: 'order',
                            width: 100,
                            Cell: ({ row }) => {
                                const checklist = row.original;
                                const isFirstItem = checklist.order === 1;
                                const isLastItem = checklist.order === checklists.filter(c => c.isActive === 1).length;
                                
                                return (
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold">{checklist.order}</span>
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() => moveChecklistUp(checklist.id)}
                                                className={`text-gray-500 hover:text-blue-600 ${isFirstItem ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                disabled={isFirstItem}
                                            >
                                                <IconChevronUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => moveChecklistDown(checklist.id)}
                                                className={`text-gray-500 hover:text-blue-600 ${isLastItem ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                disabled={isLastItem}
                                            >
                                                <IconChevronDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            }
                        },
                        {
                            Header: 'Title',
                            accessor: 'title',
                            sort: true,
                        },
                        {
                            Header: 'Items Count',
                            accessor: 'checkItems',
                            Cell: ({ value }) => (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {value?.length || 0} items
                                </span>
                            ),
                            width: 100,
                        },
                        {
                            Header: 'Created Date',
                            accessor: 'createdDate',
                            Cell: ({ value }) => new Date(value).toLocaleDateString(),
                            sort: true,
                            width: 120,
                        },
                        {
                            Header: 'Actions',
                            accessor: 'actions',
                            Cell: ({ row }) => {
                                const checklist = row.original;
                                const isActive = checklist.isActive === 1;

                                return (
                                    <div className="flex items-center space-x-2">
                                        <Tippy content="View Checklist Items">
                                            <button
                                                onClick={() => openItemsModel(checklist.id)}
                                                className="text-primary hover:text-primary-dark"
                                            >
                                                <IconEye className="w-4 h-4" />
                                            </button>
                                        </Tippy>
                                        
                                        {isActive ? (
                                            <>
                                                <Tippy content="Edit">
                                                    <span className="text-success cursor-pointer" onClick={() => onEditForm(checklist)}>
                                                        <IconPencil className="w-4 h-4" />
                                                    </span>
                                                </Tippy>
                                                <Tippy content="Delete">
                                                    <span className="text-danger cursor-pointer" onClick={() => handleDeleteChecklist(checklist)}>
                                                        <IconTrashLines className="w-4 h-4" />
                                                    </span>
                                                </Tippy>
                                            </>
                                        ) : (
                                            <Tippy content="Restore">
                                                <span className="text-warning cursor-pointer" onClick={() => handleRestoreChecklist(checklist)}>
                                                    ↶
                                                </span>
                                            </Tippy>
                                        )}
                                    </div>
                                );
                            },
                            width: 120,
                        },
                    ]}
                    Title={'Checklist Management'}
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
                    btnName="Add Checklist"
                    loadings={loading}
                />
            </div>

            <ModelViewBox
                key={isEdit ? `edit-${selectedChecklist?.id}` : 'create'}
                modal={modal}
                modelHeader={isEdit ? 'Edit Checklist' : 'Add Checklist'}
                isEdit={isEdit}
                setModel={closeModel}
                handleSubmit={onFormSubmit}
                modelSize="md"
                submitBtnText={isEdit ? 'Update' : 'Create'}
                loadings={loading}
            >
                <FormLayout
                    dynamicForm={formContain}
                    handleSubmit={onFormSubmit}
                    setState={setState}
                    state={state}
                    onChangeCallBack={{
                        handleInputChange: handleInputChange,
                    }}
                    errors={errors}
                    setErrors={setErrors}
                    loadings={loading}
                />

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Number <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-2">(Determines display sequence)</span>
                    </label>
                    <input 
                        type="number" 
                        name="order" 
                        value={state.order} 
                        onChange={handleInputChange} 
                        min="1"
                        className="form-input w-full" 
                    />
                    {errors.includes('order') && <div className="text-danger text-sm mt-1">* Please enter a valid order number</div>}
                </div>
            </ModelViewBox>

            {selectedChecklist && (
                <ModelViewBox
                    key={`items-${selectedChecklist.id}`}
                    modal={itemsModal}
                    modelHeader={`${selectedChecklist.order}. ${selectedChecklist.title} - Check Items`}
                    isEdit={false}
                    setModel={closeItemsModel}
                    modelSize="lg"
                    submitBtnText="Close"
                    loadings={loading}
                    showSubmit={false}
                >
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Check Items ({selectedChecklist.checkItems.length})
                            </h3>
                            <button
                                onClick={createItemModel}
                                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                            >
                                <IconPlus className="w-4 h-4 mr-2" />
                                Add Check Item
                            </button>
                        </div>

                        {selectedChecklist.checkItems.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                                No check items yet. Click "Add Check Item" to add items to this checklist.
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {selectedChecklist.checkItems
                                    .sort((a, b) => a.order - b.order)
                                    .map((item, index, array) => {
                                        const isFirstItem = item.order === 1;
                                        const isLastItem = item.order === array.length;
                                        
                                        return (
                                            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                                                <div className="flex items-start space-x-4 flex-1">
                                                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full font-bold">
                                                        {item.order}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800 mb-1">{item.name}</p>
                                                        <div className="flex items-center space-x-2">
                                                            {renderItemIndicators(item)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => moveItemUp(item.id)}
                                                        className={`text-gray-500 hover:text-blue-600 p-1 ${isFirstItem ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                        disabled={isFirstItem}
                                                    >
                                                        <IconChevronUp className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => moveItemDown(item.id)}
                                                        className={`text-gray-500 hover:text-blue-600 p-1 ${isLastItem ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                        disabled={isLastItem}
                                                    >
                                                        <IconChevronDown className="w-4 h-4" />
                                                    </button>
                                                    <Tippy content="Edit">
                                                        <button
                                                            onClick={() => onEditItemForm(item)}
                                                            className="text-success hover:text-success-dark p-1"
                                                        >
                                                            <IconPencil className="w-4 h-4" />
                                                        </button>
                                                    </Tippy>
                                                    <Tippy content="Delete">
                                                        <button
                                                            onClick={() => handleDeleteCheckItem(item)}
                                                            className="text-danger hover:text-danger-dark p-1"
                                                        >
                                                            <IconTrashLines className="w-4 h-4" />
                                                        </button>
                                                    </Tippy>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </ModelViewBox>
            )}

            <ModelViewBox
                key={isItemEdit ? `edit-item-${selectedCheckItem?.id}` : 'create-item'}
                modal={itemModal}
                modelHeader={isItemEdit ? 'Edit Check Item' : 'Add Check Item'}
                isEdit={isItemEdit}
                setModel={closeItemModel}
                handleSubmit={onItemFormSubmit}
                modelSize="md"
                submitBtnText={isItemEdit ? 'Update' : 'Create'}
                loadings={loading}
            >
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Checklist
                        </label>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200">
                            <p className="font-medium">{selectedChecklist?.order}. {selectedChecklist?.title}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Check Item Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={itemState.name} 
                            onChange={handleItemInputChange} 
                            placeholder="Enter check item name"
                            className="form-input w-full" 
                        />
                        {itemErrors.includes('name') && <div className="text-danger text-sm mt-1">* Please enter check item name</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order Number <span className="text-red-500">*</span>
                            <span className="text-xs text-gray-500 ml-2">(Determines display sequence within checklist)</span>
                        </label>
                        <input 
                            type="number" 
                            name="order" 
                            value={itemState.order} 
                            onChange={handleItemInputChange} 
                            min="1"
                            className="form-input w-full" 
                        />
                        {itemErrors.includes('order') && <div className="text-danger text-sm mt-1">* Please enter a valid order number</div>}
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="text-md font-semibold text-gray-700 mb-3">Check Item Configuration</h4>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div>
                                    <label className="block font-medium text-gray-700 mb-1">
                                        Include Yes/No/Not Applicable Options
                                    </label>
                                    <p className="text-sm text-gray-500">
                                        When checked, users must select one of these options
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="hasOptions"
                                        checked={itemState.hasOptions}
                                        onChange={handleItemInputChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div>
                                    <label className="block font-medium text-gray-700 mb-1">
                                        Require Description Field
                                    </label>
                                    <p className="text-sm text-gray-500">
                                        When checked, users must enter a description when filling the form
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="hasDescription"
                                        checked={itemState.hasDescription}
                                        onChange={handleItemInputChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div>
                                    <label className="block font-medium text-gray-700 mb-1">
                                        Require Image Upload
                                    </label>
                                    <p className="text-sm text-gray-500">
                                        When checked, users must upload an image when selecting "Yes"
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="hasImage"
                                        checked={itemState.hasImage}
                                        onChange={handleItemInputChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            {itemState.hasOptions && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h5 className="font-medium text-blue-800 mb-2">Preview of Options:</h5>
                                    <div className="flex space-x-3">
                                        <div className="flex items-center space-x-1">
                                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                            <span className="text-sm text-gray-700">Yes</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                            <span className="text-sm text-gray-700">No</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                                            <span className="text-sm text-gray-700">Not Applicable</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-blue-600 mt-2">
                                        Users will be required to select one of these options in the form
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ModelViewBox>
        </div>
    );
};

export default Index;