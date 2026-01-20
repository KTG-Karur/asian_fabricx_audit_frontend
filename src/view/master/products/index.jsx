import { useState, useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../../util/Table';
import ModelViewBox from '../../../util/ModelViewBox';
import { findArrObj, showMessage } from '../../../util/AllFunction';
import ProductFormContainer from './formContainer';
import IconPencil from '../../../components/Icon/IconPencil';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconSearch from '../../../components/Icon/IconSearch';
import IconPlus from '../../../components/Icon/IconPlus';
import IconShoppingCart from '../../../components/Icon/IconShoppingCart';
import IconRefresh from '../../../components/Icon/IconRefresh';
import IconUpload from '../../../components/Icon/IconArchive';
import IconDownload from '../../../components/Icon/IconDownload';
import IconFileSpreadsheet from '../../../components/Icon/IconFile';
import Tippy from '@tippyjs/react';
import _ from 'lodash';
import { getProducts, createProduct, updateProduct, deleteProduct, resetProductStatus, bulkUploadProducts, downloadTemplate } from '../../../redux/productSlice';
import { createUplode, resetUplodeStatus } from '../../../redux/uplodeSlice';
import { baseURL } from '../../../api/ApiConfig';

const Products = () => {
    const loginInfo = localStorage.getItem('loginInfo');
    const localData = JSON.parse(loginInfo);
    const pageAccessData = findArrObj(localData?.pagePermission, 'label', 'Products');
    const accessIds = (pageAccessData[0]?.access || '').split(',').map((id) => id.trim());

    const dispatch = useDispatch();

    // Redux selectors
    const {
        productData,
        loading,
        error,
        getProductsSuccess,
        createProductSuccess,
        updateProductSuccess,
        deleteProductSuccess,
        bulkUploadLoading,
        bulkUploadSuccess,
        bulkUploadFailed,
        bulkUploadError,
        downloadTemplateLoading,
    } = useSelector((state) => state.ProductSlice);

    const [modal, setModal] = useState(false);
    const [excelModal, setExcelModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Excel upload state
    const [excelFile, setExcelFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [uploadResults, setUploadResults] = useState(null);

    // Form state
    const [state, setState] = useState({
        productNo: '',
        productName: '',
        productComposition: '',
        size: '',
        fabricName: '',
        washingDetails: '',
        fillingMaterial: '',
        lowQuantityPrice: '',
        mediumQuantityPrice: '',
        highQuantityPrice: '',
        moq: '',
        packaging: '',
        productImageFile: null,
        productImage: '',
    });

    const [errors, setErrors] = useState({});
    const dataToProcessRef = useRef(null);
    const formRef = useRef();
    const fileInputRef = useRef(null);

    const stats = useMemo(() => {
        const totalProducts = productData?.length || 0;
        const activeProducts = productData?.filter((p) => p.isActive).length || 0;

        return { totalProducts, activeProducts };
    }, [productData]);

    const { uplodeErrors, uplodes, uplodeLoading, createUplodeSuccess, createUplodeFailed } = useSelector((state) => ({
        uplodeErrors: state.UplodeSlice.error,
        uplodes: state.UplodeSlice.uplodes,
        uplodeLoading: state.UplodeSlice.loading,
        createUplodeSuccess: state.UplodeSlice.createUplodeSuccess,
        createUplodeFailed: state.UplodeSlice.createUplodeFailed,
    }));

    const columns = useMemo(
        () => [
            {
                Header: 'PRODUCT',
                accessor: 'productNo',
                sort: true,
                Cell: ({ value, row }) => (
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-shrink-0">
                            {row.original.productImage ? (
                                <img
                                    src={baseURL + row.original.productImage}
                                    alt="Product"
                                    crossOrigin="anonymous"
                                    className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/56x56?text=No+Image';
                                    }}
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-xl border-2 border-white shadow-sm bg-gray-100 flex items-center justify-center">
                                    <IconShoppingCart className="w-6 h-6 text-gray-400" />
                                </div>
                            )}
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${row.original.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <button onClick={() => onEditForm(row.original)} className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors text-left block">
                                {value || 'N/A'}
                            </button>
                            <p className="text-sm text-gray-600 truncate">{row.original.productName || 'Unnamed Product'}</p>
                        </div>
                    </div>
                ),
            },
            {
                Header: 'COMPOSITION',
                accessor: 'productComposition',
                sort: true,
                Cell: ({ value }) => (
                    <div className="max-w-[200px]">
                        <span className="text-sm text-gray-700 line-clamp-2">{value || 'N/A'}</span>
                    </div>
                ),
            },
            {
                Header: 'SIZE & FABRIC',
                accessor: 'size',
                sort: true,
                Cell: ({ row }) => (
                    <div className="space-y-1">
                        <span className="text-sm font-medium text-gray-900 block">{row.original.size || 'N/A'}</span>
                        <span className="text-xs text-gray-500 block">{row.original.fabricName || 'N/A'}</span>
                    </div>
                ),
            },
            {
                Header: 'PRICE RANGE',
                accessor: 'lowQuantityPrice',
                sort: true,
                Cell: ({ row }) => (
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Low: ${row.original.lowQuantityPrice || '0.00'}</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Med: ${row.original.mediumQuantityPrice || '0.00'}</span>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">High: ${row.original.highQuantityPrice || '0.00'}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            MOQ: <span className="font-medium">{row.original.moq || 'N/A'}</span>
                        </div>
                    </div>
                ),
            },
            {
                Header: 'PACKAGING',
                accessor: 'packaging',
                sort: true,
                Cell: ({ value }) => (
                    <div className="max-w-[200px]">
                        <span className="text-sm text-gray-700 line-clamp-2">{value || 'N/A'}</span>
                    </div>
                ),
            },
            {
                Header: 'STATUS',
                accessor: 'isActive',
                sort: true,
                Cell: ({ value }) => (
                    <div className="flex items-center">
                        <button
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                                value ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg' : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg'
                            }`}
                        >
                            {value ? 'Active' : 'Inactive'}
                        </button>
                    </div>
                ),
            },
            {
                Header: 'ACTIONS',
                accessor: 'actions',
                Cell: ({ row }) => (
                    <div className="flex items-center space-x-2">
                        {row.original.isActive ? (
                            <>
                                {_.includes(accessIds, '3') && (
                                    <Tippy content="Edit Product">
                                        <span className="text-success me-2 cursor-pointer" onClick={() => onEditForm(row.original)}>
                                            <IconPencil />
                                        </span>
                                    </Tippy>
                                )}
                                {_.includes(accessIds, '4') && (
                                    <Tippy content="Deactivate Product">
                                        <span className="text-danger me-2 cursor-pointer" onClick={() => handleDeactivate(row.original)}>
                                            <IconTrashLines />
                                        </span>
                                    </Tippy>
                                )}
                            </>
                        ) : (
                            <>
                                {_.includes(accessIds, '6') && (
                                    <Tippy content="Activate Product">
                                        <span className="text-success me-2 cursor-pointer" onClick={() => handleActivate(row.original)}>
                                            <IconRefresh />
                                        </span>
                                    </Tippy>
                                )}
                            </>
                        )}
                    </div>
                ),
                width: 120,
            },
        ],
        [accessIds]
    );

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return productData || [];

        const searchLower = searchTerm.toLowerCase();
        return (productData || []).filter(
            (product) =>
                (product.productNo || '').toLowerCase().includes(searchLower) ||
                (product.productName || '').toLowerCase().includes(searchLower) ||
                (product.fabricName || '').toLowerCase().includes(searchLower) ||
                (product.productComposition || '').toLowerCase().includes(searchLower) ||
                (product.moq || '').toLowerCase().includes(searchLower) ||
                (product.packaging || '').toLowerCase().includes(searchLower)
        );
    }, [productData, searchTerm]);

    const getPaginatedData = () => {
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredProducts.slice(startIndex, endIndex);
    };

    useEffect(() => {
        dispatch(getProducts({}));
    }, [dispatch]);

    useEffect(() => {
        if (getProductsSuccess) {
            dispatch(resetProductStatus());
        }
    }, [getProductsSuccess, dispatch]);

    useEffect(() => {
        if (createUplodeSuccess) {
            showMessage('success', 'Product image uploaded successfully');
            dispatch(resetUplodeStatus());
            dispatch(getProducts({}));
            closeModel();
        }
    }, [createUplodeSuccess, dispatch]);

    useEffect(() => {
        if (createUplodeFailed) {
            showMessage('error', `Image upload failed: ${uplodeErrors || 'Unknown error'}`);
            dispatch(resetUplodeStatus());
        }
    }, [createUplodeFailed, uplodeErrors, dispatch]);

    useEffect(() => {
        if (createProductSuccess && dataToProcessRef.current) {
            const currentData = dataToProcessRef.current;

            // Check if we have a new image file to upload
            const hasNewImage = currentData.productImageFile instanceof File;

            if (hasNewImage) {
                const uploadFormData = new FormData();
                uploadFormData.append('product', currentData.productImageFile);

                const newlyCreatedProduct = productData[0];
                const newProductId = newlyCreatedProduct?.productId;

                if (newProductId) {
                    dispatch(createUplode({ request: uploadFormData, id: newProductId }));
                } else {
                    showMessage('warning', 'Product created but cannot upload image: Missing product ID');
                    showMessage('success', 'Product created successfully (image upload failed)');
                    dispatch(getProducts({}));
                    closeModel();
                    dispatch(resetProductStatus());
                }
            } else {
                showMessage('success', 'Product created successfully');
                dispatch(getProducts({}));
                closeModel();
                dispatch(resetProductStatus());
            }
        }
    }, [createProductSuccess, productData, dispatch]);

    useEffect(() => {
        if (updateProductSuccess && dataToProcessRef.current) {
            const currentData = dataToProcessRef.current;

            // Check if we have a new image file to upload
            const hasNewImage = currentData.productImageFile instanceof File;

            if (hasNewImage && selectedProduct) {
                const uploadFormData = new FormData();
                uploadFormData.append('product', currentData.productImageFile);

                if (selectedProduct.productId) {
                    dispatch(createUplode({ request: uploadFormData, id: selectedProduct.productId }));
                } else {
                    showMessage('warning', 'Product updated but cannot upload image: Missing product ID');
                    dispatch(getProducts({}));
                    closeModel();
                    dispatch(resetProductStatus());
                }
            } else {
                showMessage('success', 'Product updated successfully');
                dispatch(getProducts({}));
                closeModel();
                dispatch(resetProductStatus());
            }
        }
    }, [updateProductSuccess, dispatch, selectedProduct]);

    useEffect(() => {
        if (deleteProductSuccess) {
            showMessage('success', 'Product deactivated successfully');
            dispatch(resetProductStatus());
        }
    }, [deleteProductSuccess, dispatch]);

    useEffect(() => {
        if (error) {
            showMessage('error', error);
            dispatch(resetProductStatus());
        }
    }, [error, dispatch]);

    // Excel upload effects
    useEffect(() => {
        if (bulkUploadSuccess) {
            showMessage('success', 'Excel uploaded successfully');
            dispatch(resetProductStatus());
        }
    }, [bulkUploadSuccess, dispatch]);

    useEffect(() => {
        if (bulkUploadFailed && bulkUploadError) {
            showMessage('error', bulkUploadError);
            dispatch(resetProductStatus());
        }
    }, [bulkUploadFailed, bulkUploadError, dispatch]);

    // Modal handlers
    const closeModel = () => {
        setIsEdit(false);
        setModal(false);
        onFormClear();
    };

    const onFormClear = () => {
        setState({
            productNo: '',
            productName: '',
            productComposition: '',
            size: '',
            fabricName: '',
            washingDetails: '',
            fillingMaterial: '',
            lowQuantityPrice: '',
            mediumQuantityPrice: '',
            highQuantityPrice: '',
            moq: '',
            packaging: '',
            productImageFile: null,
            productImage: '',
        });
        setSelectedProduct(null);
        setErrors({});
        dataToProcessRef.current = null;
    };

    const createModel = () => {
        onFormClear();
        setIsEdit(false);
        setModal(true);
        setErrors({});
    };

    const onEditForm = (product) => {
        if (!product.isActive) {
            showMessage('warning', 'Cannot edit inactive products. Please activate the product first.');
            return;
        }

        setState({
            productNo: product.productNo || '',
            productName: product.productName || '',
            productComposition: product.productComposition || '',
            size: product.size || '',
            fabricName: product.fabricName || '',
            washingDetails: product.washingDetails || '',
            fillingMaterial: product.fillingMaterial || '',
            lowQuantityPrice: product.lowQuantityPrice || '',
            mediumQuantityPrice: product.mediumQuantityPrice || '',
            highQuantityPrice: product.highQuantityPrice || '',
            moq: product.moq || '',
            packaging: product.packaging || '',
            productImageFile: null,
            productImage: product.productImage || '',
        });
        setIsEdit(true);
        setSelectedProduct(product);
        setErrors({});
        setModal(true);
    };

    const handleActivate = (product) => {
        showMessage('warning', 'Are you sure you want to activate this product?', () => {
            dispatch(
                updateProduct({
                    request: { isActive: true },
                    productId: product.productId,
                })
            );
        });
    };

    const handleDeactivate = (product) => {
        showMessage('warning', 'Are you sure you want to deactivate this product?', () => {
            dispatch(
                updateProduct({
                    request: { isActive: false },
                    productId: product.productId,
                })
            );
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Basic required fields
        if (!state.productNo) newErrors.productNo = 'Product number is required';
        if (!state.productName) newErrors.productName = 'Product name is required';
        if (!state.productComposition) newErrors.productComposition = 'Product composition is required';
        if (!state.size) newErrors.size = 'Size is required';
        if (!state.fabricName) newErrors.fabricName = 'Fabric name is required';
        if (!state.washingDetails) newErrors.washingDetails = 'Washing details are required';

        // Price validations - changed to string validation
        if (!state.lowQuantityPrice || state.lowQuantityPrice.trim() === '') {
            newErrors.lowQuantityPrice = 'Low quantity price is required';
        } else if (isNaN(parseFloat(state.lowQuantityPrice))) {
            newErrors.lowQuantityPrice = 'Low quantity price must be a valid number';
        } else if (parseFloat(state.lowQuantityPrice) <= 0) {
            newErrors.lowQuantityPrice = 'Low quantity price must be greater than 0';
        }

        if (!state.mediumQuantityPrice || state.mediumQuantityPrice.trim() === '') {
            newErrors.mediumQuantityPrice = 'Medium quantity price is required';
        } else if (isNaN(parseFloat(state.mediumQuantityPrice))) {
            newErrors.mediumQuantityPrice = 'Medium quantity price must be a valid number';
        } else if (parseFloat(state.mediumQuantityPrice) <= 0) {
            newErrors.mediumQuantityPrice = 'Medium quantity price must be greater than 0';
        }

        if (!state.highQuantityPrice || state.highQuantityPrice.trim() === '') {
            newErrors.highQuantityPrice = 'High quantity price is required';
        } else if (isNaN(parseFloat(state.highQuantityPrice))) {
            newErrors.highQuantityPrice = 'High quantity price must be a valid number';
        } else if (parseFloat(state.highQuantityPrice) <= 0) {
            newErrors.highQuantityPrice = 'High quantity price must be greater than 0';
        }

        // Image validation removed - product image is now optional
        // if (!isEdit && !state.productImageFile) {
        //     newErrors.productImage = 'Product image is required for new products';
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Excel upload handlers
    const handleExcelFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

            const fileType = file.type;
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (!excelModal) return;

            if (!validTypes.includes(fileType) && !['xlsx', 'xls'].includes(fileExtension)) {
                showMessage('error', 'Please select a valid Excel file (.xlsx or .xls)');
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                showMessage('error', 'File size should be less than 10MB');
                return;
            }

            setExcelFile(file);
            setUploadStatus(null);
            setUploadResults(null);
        }
    };

    const handleExcelUpload = async () => {
        if (!excelModal) return;

        if (!excelFile) {
            showMessage('error', 'Please select an Excel file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', excelFile);

        // Simulate upload progress
        setUploadProgress(0);
        setUploadStatus('uploading');

        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return prev;
                }
                return prev + 10;
            });
        }, 200);

        try {
            const result = await dispatch(bulkUploadProducts(formData)).unwrap();

            clearInterval(progressInterval);
            setUploadProgress(100);
            setUploadStatus('success');
            setUploadResults(result.data);

            // Refresh products after successful upload
            setTimeout(() => {
                dispatch(getProducts({}));
            }, 1500);

            // Auto-close modal after 3 seconds
            setTimeout(() => {
                closeExcelModal();
            }, 3000);
        } catch (error) {
            clearInterval(progressInterval);
            setUploadStatus('error');
            setUploadProgress(0);
            showMessage('error', error || 'Upload failed');
        }
    };

    const resetExcelUpload = () => {
        setExcelFile(null);
        setUploadProgress(0);
        setUploadStatus(null);
        setUploadResults(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const closeExcelModal = () => {
        setExcelModal(false);
        resetExcelUpload();
    };

    const handleDownloadTemplate = () => {
        // Create sample data based on the provided Excel structure
        const sampleData = [
            {
                'Product No': 'PROD001',
                'Product Name': 'Cushion Cover',
                Composition: '100% Cotton',
                Size: '50 x 50 cms',
                Fabric: 'Yarn Dyed Dobby',
                Washing: 'Senter softener + 0-0',
                'Low Price': '2.01',
                'Medium Price': '2.51',
                'High Price': '3.01',
                Filling: 'N/A',
                MOQ: '2000',
                Packaging: 'Label+Hangtag',
                Active: 'Yes',
            },
            {
                'Product No': 'PROD002',
                'Product Name': 'Cushion Cover',
                Composition: '100% Cotton',
                Size: '50 x 50 cms',
                Fabric: 'Yarn Dyed Dobby',
                Washing: 'Senter softener + 0-0',
                'Low Price': '2.01',
                'Medium Price': '2.51',
                'High Price': '3.01',
                Filling: 'N/A',
                MOQ: '2000',
                Packaging: 'Label+Hangtag',
                Active: 'Yes',
            },
            {
                'Product No': 'PROD003',
                'Product Name': 'Cushion Cover',
                Composition: '100% Cotton',
                Size: '50 x 50 cms',
                Fabric: 'Yarn Dyed Jacquard',
                Washing: 'Softflow wash relax dry',
                'Low Price': '3.31',
                'Medium Price': '3.81',
                'High Price': '4.31',
                Filling: 'N/A',
                MOQ: '2000',
                Packaging: 'Label+Hangtag',
                Active: 'Yes',
            },
        ];

        // Convert to CSV
        const headers = Object.keys(sampleData[0]);
        const csvRows = [];

        // Add headers
        csvRows.push(headers.join(','));

        // Add data rows
        sampleData.forEach((row) => {
            const values = headers.map((header) => {
                const escaped = ('' + row[header]).replace(/"/g, '\\"');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\n');

        // Create and download the file
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Sample_Product_Template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showMessage('success', 'Template downloaded successfully');
    };

    const onFormSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!modal) return;
        // First validate the form
        if (!validateForm()) {
            showMessage('error', 'Please fill in all required fields correctly');
            return;
        }

        // Then validate via ProductFormContainer if ref exists
        if (formRef.current) {
            const isValid = await formRef.current.validateAndSubmit();
            if (!isValid) {
                showMessage('error', 'Please fix the form errors');
                return;
            }
        }

        // Prepare data - prices as strings
        const formattedData = {
            productNo: state.productNo || '',
            productName: state.productName || '',
            productComposition: state.productComposition || '',
            size: state.size || '',
            fabricName: state.fabricName || '',
            washingDetails: state.washingDetails || '',
            fillingMaterial: state.fillingMaterial || '',
            moq: state.moq || '',
            packaging: state.packaging || '',
            isActive: true,
            lowQuantityPrice: state.lowQuantityPrice || '',
            mediumQuantityPrice: state.mediumQuantityPrice || '',
            highQuantityPrice: state.highQuantityPrice || '',
        };

        dataToProcessRef.current = {
            ...state,
            formattedData,
            productImageFile: state.productImageFile,
        };

        try {
            if (isEdit && selectedProduct) {
                await dispatch(
                    updateProduct({
                        request: formattedData,
                        productId: selectedProduct.productId,
                    })
                );
            } else {
                await dispatch(createProduct(formattedData));
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('error', 'Failed to save product data');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setState((prev) => ({
                ...prev,
                productImageFile: files[0],
                productImage: files[0] ? URL.createObjectURL(files[0]) : prev.productImage,
            }));
        } else {
            setState((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(0);
    };

    const handlePaginationChange = (pageIndex, newPageSize) => {
        setCurrentPage(pageIndex);
        setPageSize(newPageSize);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-24 translate-y-24"></div>

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <IconShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold">Product Catalog</h1>
                        </div>
                        <p className="text-blue-100 opacity-90 text-lg max-w-2xl">Manage your textile products, inventory, and product information in one place</p>

                        {/* Stats */}
                        <div className="flex items-center space-x-6 mt-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span className="text-blue-100">
                                    <span className="font-bold">{stats.activeProducts}</span> Active Products
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                <span className="text-blue-100">
                                    <span className="font-bold">{stats.totalProducts}</span> Total Products
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Excel Upload Button */}
                        {_.includes(accessIds, '2') && (
                            <button
                                onClick={() => setExcelModal(true)}
                                disabled={bulkUploadLoading}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-3 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <IconUpload className="w-5 h-5" />
                                <span>Upload Excel</span>
                            </button>
                        )}

                        {/* Add New Product Button */}
                        {_.includes(accessIds, '2') && (
                            <button
                                onClick={createModel}
                                disabled={loading}
                                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold flex items-center space-x-3 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <IconPlus className="w-5 h-5" />
                                <span>Add New Product</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 max-w-2xl">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <IconSearch className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search products by name, number, fabric, composition, MOQ, or packaging..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-3 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/80 focus:bg-white shadow-sm hover:shadow-md"
                            />
                            {searchTerm && (
                                <button onClick={() => handleSearch('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18-6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                        </span>
                    </div>
                </div>
            </div>

            {/* Enhanced Products Table */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <Table
                    columns={columns}
                    data={getPaginatedData()}
                    Title=""
                    isSearchable={false}
                    isSortable={true}
                    pagination={true}
                    pageSize={pageSize}
                    pageIndex={currentPage}
                    totalCount={filteredProducts.length}
                    totalPages={Math.ceil(filteredProducts.length / pageSize)}
                    onPaginationChange={handlePaginationChange}
                    classStyle="rounded-2xl"
                    hover={true}
                    compact={false}
                    loading={loading}
                />
            </div>

            {/* Excel Upload Modal */}
            <ModelViewBox
                modal={excelModal}
                setModel={closeExcelModal}
                modelHeader="Upload Products via Excel"
                modelSize="lg"
                handleSubmit={handleExcelUpload}
                isEdit={false}
                saveBtn={true}
                btnName={bulkUploadLoading ? 'Uploading...' : 'Upload Excel'}
                loading={bulkUploadLoading}
                saveDisabled={!excelFile || bulkUploadLoading}
                additionalButtons={
                    <button
                        type="button"
                        onClick={handleDownloadTemplate}
                        disabled={downloadTemplateLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <IconDownload className="w-4 h-4" />
                        <span>Download Template</span>
                    </button>
                }
            >
                <div className="space-y-6">
                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                            <IconFileSpreadsheet className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-semibold text-blue-800 mb-1">Excel Upload Instructions</h4>
                                <ul className="text-xs text-blue-700 space-y-1">
                                    <li>• Fill in your product data following the template format</li>
                                    <li>• Required columns: Product No, Product Name, Composition, Size, Fabric, Washing</li>
                                    <li>• Save your file and upload it here</li>
                                    <li>• Max file size: 10MB</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Template Download Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <IconDownload className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-semibold text-blue-800">Need a Template?</h5>
                                    <p className="text-xs text-blue-700">Download the sample Excel template to get started</p>
                                </div>
                            </div>
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDownloadTemplate();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleDownloadTemplate();
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 cursor-pointer select-none"
                            >
                                <IconDownload className="w-4 h-4" />
                                <span>Download Template</span>
                            </div>
                        </div>
                    </div>

                    {/* File Selection */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Select Excel File *</label>

                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                                {excelFile ? (
                                    <div className="space-y-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto">
                                            <IconFileSpreadsheet className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{excelFile.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{(excelFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button type="button" onClick={resetExcelUpload} className="text-red-600 text-sm font-medium hover:text-red-700 transition-colors">
                                            Remove File
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                                            <IconUpload className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-1">Drag & drop your Excel file here</p>
                                            <p className="text-xs text-gray-500">or click to browse</p>
                                        </div>
                                        <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleExcelFileSelect} className="hidden" id="excel-file-input" />
                                        <label
                                            htmlFor="excel-file-input"
                                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors"
                                        >
                                            Browse Files
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Upload Progress */}
                    {uploadStatus === 'uploading' && (
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Upload Progress</label>
                            <div className="space-y-3">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Upload Results */}
                    {uploadStatus === 'success' && uploadResults && (
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Upload Results</label>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-green-700">{uploadResults.successCount || 0}</div>
                                        <div className="text-sm text-green-600">Successful</div>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-red-700">{uploadResults.failedCount || 0}</div>
                                        <div className="text-sm text-red-600">Failed</div>
                                    </div>
                                </div>

                                {uploadResults.failedProducts && uploadResults.failedProducts.length > 0 && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h5 className="text-sm font-medium text-yellow-800 mb-2">Failed Products ({uploadResults.failedProducts.length})</h5>
                                        <div className="max-h-32 overflow-y-auto space-y-1">
                                            {uploadResults.failedProducts.slice(0, 5).map((failed, index) => (
                                                <div key={index} className="text-xs text-yellow-700">
                                                    • {failed.productNo || 'Unknown'}: {failed.error || 'Unknown error'}
                                                </div>
                                            ))}
                                            {uploadResults.failedProducts.length > 5 && <div className="text-xs text-yellow-600 italic">... and {uploadResults.failedProducts.length - 5} more</div>}
                                        </div>
                                    </div>
                                )}

                                <div className="text-center">
                                    <div className="inline-flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium">Upload completed successfully</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Upload Error */}
                    {uploadStatus === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-center space-x-2 text-red-700">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-sm font-medium">Upload failed. Please try again.</span>
                            </div>
                        </div>
                    )}
                </div>
            </ModelViewBox>

            {/* Product Modal */}
            <ModelViewBox
                modal={modal}
                setModel={closeModel}
                modelHeader={isEdit ? 'Edit Product' : 'Add Product'}
                modelSize="2xl"
                handleSubmit={onFormSubmit}
                isEdit={isEdit}
                saveBtn={true}
                btnName={isEdit ? 'Update Product' : 'Create Product'}
                loading={loading || uplodeLoading}
            >
                <ProductFormContainer
                    ref={formRef}
                    product={selectedProduct}
                    isEdit={isEdit}
                    onSubmit={(data) => {
                        // Update the state when form data changes
                        setState((prev) => ({
                            ...prev,
                            ...data,
                            productImageFile: data.productImageFile,
                        }));
                    }}
                    loading={loading}
                />
            </ModelViewBox>
        </div>
    );
};

export default Products;