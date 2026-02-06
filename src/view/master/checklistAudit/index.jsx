import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconPlus from '../../../components/Icon/IconPlus';
import IconEye from '../../../components/Icon/IconEye';
import IconChevronUp from '../../../components/Icon/IconChevronUp';
import IconChevronDown from '../../../components/Icon/IconChevronDown';
import Table from '../../../util/Table';
import Tippy from '@tippyjs/react';
import ModelViewBox from '../../../util/ModelViewBox';
import FormLayout from '../../../util/formLayout';
import { showMessage } from '../../../util/AllFunction';
import { FormContainer } from './formContainer';

const dummyChecklists = [
    {
        id: 1,
        title: 'CHILD LABOUR',
        order: 1,
        isActive: 1,
        createdDate: '2024-01-01',
        checkItems: [
            {
                id: 1,
                checklistId: 1,
                name: 'Is there any child labour found?',
                order: 1,
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: 'Yes', value: 'yes' },
                    { id: 2, label: 'No', value: 'no' },
                    { id: 3, label: 'Not Applicable', value: 'na' },
                ],
                hasDescription: true,
                hasImage: true,
            },
            {
                id: 2,
                checklistId: 1,
                name: 'Is Form. V available for all young workers?',
                order: 2,
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: 'Yes', value: 'yes' },
                    { id: 2, label: 'No', value: 'no' },
                    { id: 3, label: 'Not Applicable', value: 'na' },
                ],
                hasDescription: true,
                hasImage: true,
            },
        ],
    },
    {
        id: 2,
        title: 'BONDED / FORCED LABOUR',
        order: 2,
        isActive: 1,
        createdDate: '2024-01-05',
        checkItems: [
            {
                id: 3,
                checklistId: 2,
                name: 'Is there any bonded or forced (or) prision labour?',
                order: 1,
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: 'Yes', value: 'yes' },
                    { id: 2, label: 'No', value: 'no' },
                    { id: 3, label: 'Not Applicable', value: 'na' },
                ],
                hasDescription: true,
                hasImage: true,
            },
        ],
    },
    {
        id: 3,
        title: 'FREEDOM OF ASSOCIATION AND COLLECTIVE BARGAINING',
        order: 3,
        isActive: 1,
        createdDate: '2024-01-10',
        checkItems: [
            {
                id: 4,
                checklistId: 4,
                name: 'Dous all the employees hava the right to join the trade union',
                order: 2,
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: 'Yes', value: 'yes' },
                    { id: 2, label: 'No', value: 'no' },
                    { id: 3, label: 'Not Applicable', value: 'na' },
                ],
                hasDescription: true,
                hasImage: true,
            },
            {
                id: 5,
                checklistId: 4,
                name: 'Dous the organization permit to elect their own representative in case where there is no union',
                order: 3,
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: 'Yes', value: 'yes' },
                    { id: 2, label: 'No', value: 'no' },
                    { id: 3, label: 'Not Applicable', value: 'na' },
                ],
                hasDescription: true,
                hasImage: true,
            },
        ],
    },
    {
        id: 4,
        title: 'DISCRIMINATION',
        order: 4,
        isActive: 1,
        createdDate: '2024-01-15',
        checkItems: [
            {
                id: 6,
                checklistId: 4,
                name: 'Dous te company engage in any kind of test for employment',
                order: 1,
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: 'Yes', value: 'yes' },
                    { id: 2, label: 'No', value: 'no' },
                    { id: 3, label: 'Not Applicable', value: 'na' },
                ],
                hasDescription: true,
                hasImage: true,
            },
        ],
    },
    {
        id: 5,
        title: 'DISCIPLINARY PRACTICES',
        order: 5,
        isActive: 1,
        createdDate: '2024-01-25',
        checkItems: [
            {
                id: 7,
                checklistId: 5,
                name: 'Are the employees been given corporal punnishments',
                order: 1,
                isActive: 1,
                hasOptions: true,
                options: [
                    { id: 1, label: 'Yes', value: 'yes' },
                    { id: 2, label: 'No', value: 'no' },
                    { id: 3, label: 'Not Applicable', value: 'na' },
                ],
                hasDescription: true,
                hasImage: true,
            },
        ],
    },
];

const ChecklistAudit = () => {
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [state, setState] = useState({
        title: '',
        order: 0,
    });
    const [checklists, setChecklists] = useState(dummyChecklists);
    const [formContain] = useState(FormContainer);
    const [errors, setErrors] = useState([]);
    const [selectedChecklist, setSelectedChecklist] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const column = [
        {
            Header: 'Order',
            accessor: 'order',
            width: 100,
            Cell: ({ row }) => {
                const checklist = row.original;
                const activeChecklists = checklists.filter((c) => c.isActive === 1);
                const isFirstItem = checklist.order === 1;
                const isLastItem = checklist.order === activeChecklists.length;

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
            },
        },
        {
            Header: 'Title',
            accessor: 'title',
            sort: true,
            Cell: ({ value, row }) => (
                <div>
                    <div className="font-medium text-gray-800">{value}</div>
                    <div className="text-xs text-gray-500 mt-1">{getItemCountText(row.original)}</div>
                </div>
            ),
        },
        {
            Header: 'Status',
            accessor: 'isActive',
            Cell: ({ value }) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value === 1 ? 'Active' : 'Inactive'}</span>
            ),
            width: 100,
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }) => {
                const checklist = row.original;
                const isActive = checklist.isActive === 1;

                return (
                    <div className="flex items-center space-x-3">
                        <Tippy content="View Checklist Items">
                            <button onClick={() => handleViewSubChecklist(checklist)} className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors">
                                <IconEye className="w-4 h-4 mr-1.5" />
                                <span className="text-sm font-medium">Manage Items</span>
                            </button>
                        </Tippy>

                        {isActive ? (
                            <>
                                <Tippy content="Edit Checklist">
                                    <button onClick={() => onEditForm(checklist)} className="text-success hover:text-success-dark">
                                        <IconPencil className="w-4 h-4" />
                                    </button>
                                </Tippy>
                                <Tippy content="Delete Checklist">
                                    <button onClick={() => handleDeleteChecklist(checklist)} className="text-danger hover:text-danger-dark">
                                        <IconTrashLines className="w-4 h-4" />
                                    </button>
                                </Tippy>
                            </>
                        ) : (
                            <Tippy content="Restore Checklist">
                                <button onClick={() => handleRestoreChecklist(checklist)} className="text-warning hover:text-warning-dark font-bold">
                                    ↶
                                </button>
                            </Tippy>
                        )}
                    </div>
                );
            },
            width: 180,
        },
    ];
    const closeModel = () => {
        setIsEdit(false);
        onFormClear();
        setModal(false);
    };

    const onFormClear = () => {
        setState({
            title: '',
            order: 0,
        });
        setSelectedChecklist(null);
        setErrors([]);
    };

    const createModel = () => {
        onFormClear();
        setIsEdit(false);
        const maxOrder = checklists.length > 0 ? Math.max(...checklists.map((c) => c.order)) : 0;
        setState((prev) => ({
            ...prev,
            order: maxOrder + 1,
        }));
        setModal(true);
        setErrors([]);
    };

    const handleViewSubChecklist = (checklist) => {
        // Navigate to sub-checklist page with checklist data in state
        navigate('/master/sub-checklist-audit', {
            state: {
                checklist: checklist,
                checklists: checklists,
            },
        });
    };

    const onEditForm = (data) => {
        setState({
            title: data.title || '',
            order: data.order || 0,
        });
        setIsEdit(true);
        setSelectedChecklist(data);
        setModal(true);
        setErrors([]);
    };

    const validateForm = () => {
        const newErrors = [];
        if (!state.title?.trim()) newErrors.push('title');

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
            if (isEdit && selectedChecklist) {
                const updatedChecklists = checklists.map((checklist) =>
                    checklist.id === selectedChecklist.id
                        ? {
                              ...checklist,
                              title: state.title.trim(),
                              order: state.order,
                          }
                        : checklist,
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
                    checkItems: [],
                };
                setChecklists((prev) => [...prev, newChecklist]);
                showMessage('success', 'Checklist created successfully');
            }

            closeModel();
        } catch (error) {
            showMessage('error', 'Failed to save checklist');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setState((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors.includes(name)) {
            setErrors((prev) => prev.filter((error) => error !== name));
        }
    };

    const handleDeleteChecklist = (checklist) => {
        showMessage('warning', 'Are you sure you want to delete this checklist?', () => {
            const updatedChecklists = checklists.map((c) => (c.id === checklist.id ? { ...c, isActive: 0 } : c));
            setChecklists(updatedChecklists);
            showMessage('success', 'Checklist deleted successfully');
        });
    };

    const handleRestoreChecklist = (checklist) => {
        const updatedChecklists = checklists.map((c) => (c.id === checklist.id ? { ...c, isActive: 1 } : c));
        setChecklists(updatedChecklists);
        showMessage('success', 'Checklist restored successfully');
    };

    const moveChecklistUp = (checklistId) => {
        const index = checklists.findIndex((c) => c.id === checklistId);
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
        const index = checklists.findIndex((c) => c.id === checklistId);
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

    const handlePaginationChange = (pageIndex, newPageSize) => {
        setCurrentPage(pageIndex);
        setPageSize(newPageSize);
    };

    const getPaginatedData = () => {
        const dataArray = checklists.filter((c) => c.isActive === 1) || [];
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        return dataArray.slice(startIndex, endIndex);
    };

    const getTotalCount = () => {
        return checklists.filter((c) => c.isActive === 1).length;
    };

    const getItemCountText = (checklist) => {
        const count = checklist.checkItems?.length || 0;
        if (count === 0) return 'No items';
        if (count === 1) return '1 item';
        return `${count} items`;
    };

    return (
        <div className="p-6">
            <div className="p-6 text-center">
                <h1 className="text-3xl font-extrabold text-gray-800">Audit Checklist Management</h1>
            </div>

            <div className="datatables">
                <Table
                    columns={column}
                    Title={'Audit Checklist Management'}
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

                {/* Order field removed - only arrow buttons control order */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order Control</label>
                            <p className="text-xs text-gray-500">Use arrow buttons in the table to change order</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-center">
                                <div className="font-bold text-blue-600">{state.order}</div>
                                <div className="text-xs text-gray-500">Current</div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModelViewBox>
        </div>
    );
};

export default ChecklistAudit;
