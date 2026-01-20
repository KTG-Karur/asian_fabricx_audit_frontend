import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import IconSearch from '../../../components/Icon/IconSearch';
import IconPrinter from '../../../components/Icon/IconPrinter';
import IconCalendar from '../../../components/Icon/IconCalendar';
import IconEye from '../../../components/Icon/IconEye';
import IconWhatsapp from '../../../components/Icon/IconWhatsapp';
import IconMail from '../../../components/Icon/IconMail';
import IconExternalLink from '../../../components/Icon/IconExternalLink';
import Table from '../../../util/Table';
import ModelViewBox from '../../../util/ModelViewBox';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { findArrObj } from '../../../util/AllFunction';
import { getReport, resetReportStatus } from '../../../redux/reportSlice';
import { getExpo, resetExpoStatus } from '../../../redux/expoSlice';
import { getProducts, resetProductStatus } from '../../../redux/productSlice';
import { baseURL } from '../../../api/ApiConfig';
import _ from 'lodash';

const Index = () => {
    const loginInfo = localStorage.getItem('loginInfo');
    const localData = JSON.parse(loginInfo);
    const pageAccessData = findArrObj(localData?.pagePermission, 'label', 'Enquiry Report');
    const accessIds = (pageAccessData[0]?.access || '').split(',').map((id) => id.trim());
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { getExpoSuccess, getExpoFailed, expoData, productData, getProductsSuccess, getProductsFailed, error, loading, getReportSuccess, getReportFailed, reportData } = useSelector((state) => ({
        getReportSuccess: state.ReportSlice.getReportSuccess,
        getReportFailed: state.ReportSlice.getReportFailed,
        error: state.ReportSlice.error,
        loading: state.ReportSlice.loading,
        reportData: state.ReportSlice.reportData,
        getExpoSuccess: state.ExpoSlice.getExpoSuccess,
        getExpoFailed: state.ExpoSlice.getExpoFailed,
        expoData: state.ExpoSlice.expoData,
        productData: state.ProductSlice.productData,
        getProductsSuccess: state.ProductSlice.getProductsSuccess,
        getProductsFailed: state.ProductSlice.getProductsFailed,
    }));

    const [enquiryData, setEnquiryData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [showProductsModal, setShowProductsModal] = useState(false);

    const [filters, setFilters] = useState({
        searchQuery: '',
        selectedExpo: null,
        selectedProduct: null,
        startDate: '',
        toDate: '',
    });

    const [optionListState, setOptionListState] = useState({
        expoList: [],
        productList: [],
    });

    const [appliedFilters, setAppliedFilters] = useState(null);
    const [showSearch, setShowSearch] = useState(true);
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const parseVisitingCard = (visitingCard) => {
        if (!visitingCard) return [];

        try {
            if (Array.isArray(visitingCard)) {
                return visitingCard;
            }

            // If it's a string, try to parse it as JSON
            if (typeof visitingCard === 'string') {
                const parsed = JSON.parse(visitingCard);
                return Array.isArray(parsed) ? parsed : [parsed];
            }

            return [visitingCard];
        } catch (error) {
            console.error('Error parsing visiting card:', error);
            return [visitingCard];
        }
    };

    const getSafeValue = (value) => {
        return value !== null && value !== undefined && value !== '' ? value : 'N/A';
    };

    const transformEnquiryData = (apiData) => {
        const data = apiData?.data || apiData || [];

        return data.map((enquiry, index) => {
            const visitingCards = parseVisitingCard(enquiry.visitingCard);

            return {
                id: enquiry.enquiryId || enquiry.id,
                enquiryNo: getSafeValue(enquiry.enquiryNo),
                expoName: getSafeValue(enquiry.expoName),
                name: getSafeValue(enquiry.visitorName || enquiry.name),
                companyName: getSafeValue(enquiry.companyName),
                visitingCard: visitingCards,
                city: getSafeValue(enquiry.city),
                country: getSafeValue(enquiry.country),
                email: getSafeValue(enquiry.email),
                mobileNumber: getSafeValue(enquiry.contactNumber || enquiry.mobileNumber),
                natureOfEnquiry: getSafeValue(enquiry.natureOfEnquiry),
                products: (enquiry.products || []).map((product) => ({
                    productId: product.productId,
                    productCode: getSafeValue(product.productNo || product.productCode),
                    productName: getSafeValue(product.productName),
                    productImage: getSafeValue(product.productImage),
                    composition: getSafeValue(product.productComposition || product.composition),
                    size: getSafeValue(product.size),
                    fabricName: getSafeValue(product.fabricName),
                    washingDetails: getSafeValue(product.washingDetails),
                    fillingMaterial: getSafeValue(product.fillingMaterial),
                    price: getSafeValue(product.price),
                    priceType: product.priceType ? formatPriceType(product.priceType) : 'N/A',
                    sampleRequiredQty: product.quantity || product.sampleRequiredQty || 0,
                    sampleRequired: product.sampleRequired || false,
                    remarks: getSafeValue(product.remarks),
                })),
                remarks: getSafeValue(enquiry.remarks),
                enquiryDate: enquiry.enquiryDate,
                followUpDate: enquiry.followUpDate,
                status: getSafeValue(enquiry.status),
                totalSampleQty: (enquiry.products || []).reduce((sum, product) => sum + (product.quantity || product.sampleRequiredQty || 0), 0),
                isActive: enquiry.isActive,
                expoId: enquiry.expoId,
                createdByName: getSafeValue(enquiry.createdByName),
                updatedByName: getSafeValue(enquiry.updatedByName),
            };
        });
    };

    const formatPriceType = (priceType) => {
        if (!priceType) return 'N/A';

        return priceType.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    };

    useEffect(() => {
        if (expoData) {
            const expoList = expoData?.data || expoData || [];
            const expoOptions = expoList.map((expo) => ({
                value: expo.id || expo.expoId,
                label: expo.expoName,
            }));
            setOptionListState((prev) => ({ ...prev, expoList: expoOptions }));
        }

        if (productData) {
            const productList = productData?.data || productData || [];
            const productOptions = productList.map((product) => ({
                value: product.productId,
                label: product.productNo || product.productCode,
            }));
            setOptionListState((prev) => ({ ...prev, productList: productOptions }));
        }
    }, [expoData, productData]);

    useEffect(() => {
        dispatch(getReport());
        dispatch(getExpo());
        dispatch(getProducts());
    }, [dispatch]);

    useEffect(() => {
        if (getReportSuccess && reportData) {
            const transformedData = transformEnquiryData(reportData);

            if (isInitialLoad) {
                setEnquiryData(transformedData);
                setFilteredData(transformedData);
                setIsInitialLoad(false);
            } else {
                setFilteredData(transformedData);
            }

            setSearchLoading(false);

            setTimeout(() => {
                dispatch(resetReportStatus());
            }, 1000);
        }

        if (getExpoSuccess) {
            setTimeout(() => {
                dispatch(resetExpoStatus());
            }, 1000);
        }

        if (getProductsSuccess) {
            setTimeout(() => {
                dispatch(resetProductStatus());
            }, 1000);
        }
    }, [getReportSuccess, reportData, dispatch, isInitialLoad]);

    useEffect(() => {
        if (getReportFailed) {
            console.error('API Error:', error);
            setSearchLoading(false);
            setTimeout(() => {
                dispatch(resetReportStatus());
            }, 1000);
        }
    }, [getReportFailed, error, dispatch]);

    const enquiryColumns = [
        {
            Header: 'S.No',
            accessor: 'sno',
            sort: true,
            width: 80,
            Cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        },
        {
            Header: 'Enquiry No',
            accessor: 'enquiryNo',
            sort: true,
            Cell: ({ value }) => <span className="font-semibold text-blue-600">{value}</span>,
        },
        {
            Header: 'Expo Name',
            accessor: 'expoName',
            sort: true,
        },
        {
            Header: 'Customer Name',
            accessor: 'name',
            sort: true,
            Cell: ({ value }) => <span className="font-medium text-gray-900">{value}</span>,
        },
        {
            Header: 'Company',
            accessor: 'companyName',
            sort: true,
        },
        {
            Header: 'Mobile',
            accessor: 'mobileNumber',
            sort: true,
        },
        {
            Header: 'Email',
            accessor: 'email',
            sort: true,
        },
        {
            Header: 'Country',
            accessor: 'country',
            sort: true,
        },
        {
            Header: 'Visiting Cards',
            accessor: 'visitingCard',
            sort: false,
            Cell: ({ value }) => {
                const visitingCards = Array.isArray(value) ? value : [];
                return (
                    <div className="text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full border border-purple-200">
                            {visitingCards.length} Cards
                        </span>
                    </div>
                );
            },
        },
        {
            Header: 'Products',
            accessor: 'products',
            sort: false,
            Cell: ({ value }) => (
                <div className="text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200">
                        {(value || []).length} Products
                    </span>
                </div>
            ),
        },
        {
            Header: 'Total Sample Qty',
            accessor: 'totalSampleQty',
            sort: true,
            Cell: ({ value }) => <div className="text-center font-semibold text-green-600">{value || 0}</div>,
        },
        {
            Header: 'Enquiry Date',
            accessor: 'enquiryDate',
            sort: true,
            Cell: ({ value }) => (value ? moment(value).format('DD/MM/YYYY') : 'N/A'),
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            width: 180,
            Cell: ({ row }) => {
                const data = row.original;
                const visitingCards = Array.isArray(data.visitingCard) ? data.visitingCard : [];

                return (
                    <div className="flex items-center justify-center space-x-2">
                        {/* Open All Visiting Cards in New Windows */}
                        {visitingCards.length > 0 && _.includes(accessIds, '1') && (
                            <button
                                onClick={() => handleOpenAllCardsInNewWindows(data)}
                                className="flex items-center justify-center w-8 h-8 text-purple-600 hover:text-purple-800 transition-colors relative"
                                title={`Open all ${visitingCards.length} visiting cards in separate windows`}
                            >
                                <IconExternalLink className="w-4 h-4" />
                                {visitingCards.length > 1 && (
                                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                        {visitingCards.length}
                                    </span>
                                )}
                            </button>
                        )}

                        {/* WhatsApp */}
                        {data.mobileNumber && data.mobileNumber !== 'N/A' && _.includes(accessIds, '7') && (
                            <button
                                onClick={() => handleWhatsApp(data)}
                                className="flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-800 transition-colors"
                                title="Send WhatsApp Message"
                            >
                                <IconWhatsapp className="w-4 h-4" />
                            </button>
                        )}

                        {/* Email */}
                        {data.email && data.email !== 'N/A' && _.includes(accessIds, '8') && (
                            <button onClick={() => handleEmail(data)} className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 transition-colors" title="Send Email">
                                <IconMail className="w-4 h-4" />
                            </button>
                        )}

                        {/* View Products */}
                        {data.products && data.products.length > 0 && _.includes(accessIds, '1') && (
                            <button
                                onClick={() => handleViewProducts(data)}
                                className="flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-800 transition-colors"
                                title="View Products"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSearchLoading(true);

        if (showDateFilter) {
            if (!filters.startDate || !filters.toDate) {
                alert('Please select both From Date and To Date');
                setSearchLoading(false);
                return;
            }

            const start = moment(filters.startDate);
            const end = moment(filters.toDate);

            if (end.isBefore(start)) {
                alert('To Date cannot be before From Date');
                setSearchLoading(false);
                return;
            }
        }

        const queryParams = {};

        if (filters.searchQuery) {
            queryParams.search = filters.searchQuery;
        }

        if (filters.selectedExpo) {
            queryParams.expoId = filters.selectedExpo.value;
        }

        if (filters.selectedProduct) {
            queryParams.productId = filters.selectedProduct.value;
        }

        if (showDateFilter && filters.startDate && filters.toDate) {
            queryParams.fromDate = filters.startDate;
            queryParams.toDate = filters.toDate;
        }

        try {
            dispatch(getReport(queryParams));
            setAppliedFilters({ ...filters });
            setCurrentPage(0);
        } catch (error) {
            console.error('Error filtering data:', error);
            setSearchLoading(false);
        }
    };

    const handleClear = () => {
        setFilters({
            searchQuery: '',
            selectedExpo: null,
            selectedProduct: null,
            startDate: '',
            toDate: '',
        });
        setAppliedFilters(null);
        setShowDateFilter(false);
        setSearchLoading(false);
        setCurrentPage(0);

        dispatch(getReport());
    };

    const toggleDateFilter = () => {
        setShowDateFilter(!showDateFilter);
        if (!showDateFilter) {
            setFilters((prev) => ({
                ...prev,
                startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                toDate: moment().format('YYYY-MM-DD'),
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                startDate: '',
                toDate: '',
            }));
        }
    };

    // Open all visiting cards in separate new windows/tabs
    const handleOpenAllCardsInNewWindows = (enquiry) => {
        const visitingCards = Array.isArray(enquiry.visitingCard) ? enquiry.visitingCard : [];

        if (visitingCards.length === 0) {
            alert('No visiting cards available');
            return;
        }

        console.log('Opening visiting cards:', {
            enquiryNo: enquiry.enquiryNo,
            totalCards: visitingCards.length,
            cards: visitingCards,
        });

        let openedWindows = 0;
        let failedWindows = 0;

        visitingCards.forEach((card, index) => {
            setTimeout(() => {
                const cardUrl = baseURL + card;
                const windowName = `visitingCard_${enquiry.enquiryNo}_${index + 1}`;

                console.log(`Opening card ${index + 1}:`, cardUrl);

                try {
                    const newWindow = window.open(cardUrl, windowName, 'width=800,height=600,scrollbars=yes,resizable=yes,location=yes');

                    if (newWindow) {
                        openedWindows++;
                        console.log(`Successfully opened window for card ${index + 1}`);

                        setTimeout(() => {
                            if (newWindow && !newWindow.closed) {
                                newWindow.focus();
                            }
                        }, 100);
                    } else {
                        console.log(`Window blocked, opening card ${index + 1} in new tab`);
                        const newTab = window.open(cardUrl, '_blank');
                        if (newTab) {
                            openedWindows++;
                        } else {
                            failedWindows++;
                            console.error(`Failed to open card ${index + 1} in new tab`);
                        }
                    }
                } catch (error) {
                    failedWindows++;
                    console.error(`Error opening card ${index + 1}:`, error);
                }

                if (index === visitingCards.length - 1) {
                    setTimeout(() => {
                        let message = '';
                        if (openedWindows === visitingCards.length) {
                            message = `Successfully opened all ${openedWindows} visiting cards in separate windows/tabs.`;
                        } else if (openedWindows > 0) {
                            message = `Opened ${openedWindows} out of ${visitingCards.length} visiting cards. ${failedWindows} cards failed to open. Please check your pop-up blocker settings.`;
                        } else {
                            message = 'Failed to open visiting cards. Please disable your pop-up blocker and try again.';
                        }

                        if (failedWindows > 0) {
                            alert(message);
                        }
                    }, 1000);
                }
            }, index * 300);
        });

        if (visitingCards.length > 1) {
            setTimeout(() => {
                alert(`Opening ${visitingCards.length} visiting cards in separate windows/tabs...\n\nIf windows don't appear, please check your pop-up blocker settings.`);
            }, 500);
        }
    };

    const handleWhatsApp = (enquiry) => {
        let phone = String(enquiry.mobileNumber || '').trim();

        if (phone === 'N/A') {
            alert('No phone number available');
            return;
        }

        phone = phone.replace(/\D/g, '');
        if (phone.length < 8 || phone.length > 15) {
            alert('Invalid phone number');
            return;
        }
        const message = `Hello ${enquiry.name}, regarding your enquiry for ${enquiry.products?.length || 0} product(s) from ${enquiry.companyName}.`;
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    };

    const handleEmail = (enquiry) => {
        if (enquiry.email === 'N/A') {
            alert('No email address available');
            return;
        }

        const subject = `Regarding your enquiry - ${enquiry.expoName}`;
        const body = `Dear ${enquiry.visitorName || enquiry.name},\n\nThank you for your enquiry regarding our products.\n\nBest regards,\nAsian Fabricx Private Limited`;

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${enquiry.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.open(gmailUrl, '_blank');
    };

    const handleViewProducts = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setShowProductsModal(true);
    };

    const closeProductsModal = () => {
        setShowProductsModal(false);
        setSelectedEnquiry(null);
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            minHeight: '42px',
            '&:hover': {
                borderColor: '#d1d5db',
            },
        }),
    };

    const onDownload = () => {
        const yearMonth = showDateFilter && filters.startDate && filters.toDate ? `${moment(filters.startDate).format('DD MMM YYYY')} to ${moment(filters.toDate).format('DD MMM YYYY')}` : 'All Time';

        const additionalDetails = `Enquiry Management Report for ${yearMonth}`;
        const reportGeneratedDate = `Report Generated On: ${moment().format('DD-MM-YYYY')}`;

        const wb = XLSX.utils.book_new();

        const header = [
            [additionalDetails],
            [reportGeneratedDate],
            [],
            [
                'S.No',
                'Enquiry No',
                'Expo Name',
                'Customer Name',
                'Company Name',
                'Mobile Number',
                'Email ID',
                'City',
                'Country',
                'Visiting Cards',
                'Product Code',
                'Product Name',
                'Price Type',
                'Composition',
                'Size',
                'Fabric Name',
                'Washing Details',
                'Filling Material',
                'Price',
                'Sample Required Qty',
                'Nature of Enquiry',
                'Remarks',
                'Enquiry Date',
            ],
        ];

        const data = [];
        let totalSampleQty = 0;
        let totalProducts = 0;
        let totalVisitingCards = 0;
        let rowIndex = header.length;

        filteredData.forEach((item, i) => {
            const visitingCards = parseVisitingCard(item.visitingCard);
            totalVisitingCards += visitingCards.length;
            const hasVisitingCards = visitingCards.length > 0;

            if (item.products && item.products.length > 0) {
                item.products.forEach((product, productIndex) => {
                    totalSampleQty += product.sampleRequiredQty || 0;
                    totalProducts++;

                    data.push({
                        'S.No': data.length + 1,
                        enquiryNo: item.enquiryNo,
                        expoName: item.expoName,
                        customerName: item.name,
                        companyName: item.companyName,
                        mobileNumber: item.mobileNumber,
                        email: item.email,
                        city: item.city,
                        country: item.country,
                        visitingCards: hasVisitingCards ? visitingCards.map((card) => baseURL + card).join('\n') : 'No Cards',
                        visitingCardsCount: visitingCards.length,
                        productCode: product.productCode,
                        productName: product.productName,
                        priceType: product.priceType || 'N/A',
                        composition: product.composition,
                        size: product.size,
                        fabricName: product.fabricName,
                        washingDetails: product.washingDetails,
                        fillingMaterial: product.fillingMaterial,
                        price: product.price,
                        sampleRequiredQty: product.sampleRequiredQty || 0,
                        natureOfEnquiry: item.natureOfEnquiry,
                        remarks: item.remarks,
                        enquiryDate: moment(item.enquiryDate).format('DD/MM/YYYY'),
                        rowNumber: rowIndex + data.length,
                        visitingCardUrls: visitingCards.map((card) => baseURL + card),
                    });
                });
            } else {
                data.push({
                    'S.No': i + 1,
                    enquiryNo: item.enquiryNo,
                    expoName: item.expoName,
                    customerName: item.name,
                    companyName: item.companyName,
                    mobileNumber: item.mobileNumber,
                    email: item.email,
                    city: item.city,
                    country: item.country,
                    visitingCards: hasVisitingCards ? visitingCards.map((card) => baseURL + card).join('\n') : 'No Cards',
                    visitingCardsCount: visitingCards.length,
                    productCode: 'N/A',
                    productName: 'N/A',
                    composition: 'N/A',
                    size: 'N/A',
                    fabricName: 'N/A',
                    washingDetails: 'N/A',
                    fillingMaterial: 'N/A',
                    price: 'N/A',
                    sampleRequiredQty: 0,
                    natureOfEnquiry: item.natureOfEnquiry,
                    remarks: item.remarks,
                    enquiryDate: moment(item.enquiryDate).format('DD/MM/YYYY'),
                    rowNumber: rowIndex + data.length,
                    visitingCardUrls: visitingCards.map((card) => baseURL + card),
                });
            }
        });

        const rows = data.map((item) => [
            item['S.No'],
            item.enquiryNo,
            item.expoName,
            item.customerName,
            item.companyName,
            item.mobileNumber,
            item.email,
            item.city,
            item.country,
            item.visitingCardsCount > 0 ? `${item.visitingCardsCount} card(s)` : 'No Cards',
            item.productCode,
            item.productName,
            item.priceType,
            item.composition,
            item.size,
            item.fabricName,
            item.washingDetails,
            item.fillingMaterial,
            item.price,
            item.sampleRequiredQty,
            item.natureOfEnquiry,
            item.remarks,
            item.enquiryDate,
        ]);

        const allRows = [...header, ...rows];

        const imgSheetRows = [['VISITING CARD IMAGES'], ['Click on the links below to view visiting card images:'], [], ['Enquiry No', 'Customer Name', 'Card No', 'Image Link']];

        filteredData.forEach((item) => {
            const visitingCards = parseVisitingCard(item.visitingCard);
            if (visitingCards.length > 0) {
                imgSheetRows.push([item.enquiryNo, item.name, `Total: ${visitingCards.length} cards`, '']);

                visitingCards.forEach((card, index) => {
                    const fullUrl = baseURL + card;
                    imgSheetRows.push([
                        '',
                        '',
                        `Card ${index + 1}`,
                        {
                            f: `HYPERLINK("${fullUrl}", "Click to open Card ${index + 1}")`,
                            v: `Click to open Card ${index + 1}`,
                            l: { Target: fullUrl, Tooltip: `Open visiting card ${index + 1} for ${item.name}` },
                        },
                    ]);
                });

                imgSheetRows.push(['', '', '', '']);
            }
        });

        const ws = XLSX.utils.aoa_to_sheet(allRows);

        // Set column widths
        ws['!cols'] = [
            { wch: 8 }, // S.No
            { wch: 12 }, // Enquiry No
            { wch: 15 }, // Expo Name
            { wch: 20 }, // Customer Name
            { wch: 20 }, // Company Name
            { wch: 15 }, // Mobile Number
            { wch: 25 }, // Email ID
            { wch: 12 }, // City
            { wch: 15 }, // Country
            { wch: 25 }, // Visiting Cards (with hyperlink)
            { wch: 12 }, // Product Code
            { wch: 20 }, // Product Name
            { wch: 18 }, // Price Type
            { wch: 15 }, // Composition
            { wch: 8 }, // Size
            { wch: 15 }, // Fabric Name
            { wch: 15 }, // Washing Details
            { wch: 15 }, // Filling Material
            { wch: 10 }, // Price
            { wch: 15 }, // Sample Required Qty
            { wch: 20 }, // Nature of Enquiry
            { wch: 30 }, // Remarks
            { wch: 12 }, // Enquiry Date
        ];

        // Merge cells for headers
        if (!ws['!merges']) ws['!merges'] = [];

        // Merge title cells
        ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 21 } });
        ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 21 } });

        // Add hyperlinks for visiting cards in main sheet
        data.forEach((item, index) => {
            if (item.visitingCardsCount > 0) {
                const cellAddress = XLSX.utils.encode_cell({ r: header.length + index, c: 9 });

                // Create a clickable hyperlink to the image sheet
                const hyperlinkText = `${item.visitingCardsCount} card(s)`;

                if (!ws[cellAddress]) {
                    ws[cellAddress] = {
                        t: 's',
                        v: hyperlinkText,
                        l: { Target: `'Visiting Card Images'!A1`, Tooltip: `Click to view ${item.visitingCardsCount} visiting card(s)` },
                    };
                } else {
                    ws[cellAddress].l = {
                        Target: `'Visiting Card Images'!A1`,
                        Tooltip: `Click to view ${item.visitingCardsCount} visiting card(s)`,
                    };
                }

                // Add hyperlink formula for Excel
                ws[cellAddress].f = `HYPERLINK("#'Visiting Card Images'!A1", "${hyperlinkText}")`;
            }
        });

        // Add summary rows
        const summaryStartRow = allRows.length;
        const summaryRows = [
            [],
            ['SUMMARY', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Total Enquiries', filteredData.length, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Total Products', totalProducts, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Total Sample Quantity', totalSampleQty, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Total Visiting Cards', totalVisitingCards, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        ];

        // Add summary to main worksheet
        const finalRows = [...allRows, ...summaryRows];
        XLSX.utils.sheet_add_aoa(ws, summaryRows, { origin: -1 });

        ws['!merges'].push({ s: { r: summaryStartRow + 1, c: 0 }, e: { r: summaryStartRow + 1, c: 21 } });

        XLSX.utils.book_append_sheet(wb, ws, 'Enquiry Report');

        const imgWs = XLSX.utils.aoa_to_sheet(imgSheetRows);

        // Set column widths for image sheet
        imgWs['!cols'] = [
            { wch: 12 }, // Enquiry No
            { wch: 20 }, // Customer Name
            { wch: 15 }, // Card No
            { wch: 60 }, // Image Link (wider for URLs)
        ];

        // Merge title cells in image sheet
        imgWs['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
        ];

        // Add style to hyperlinks (blue text with underline)
        Object.keys(imgWs).forEach((cellAddress) => {
            if (cellAddress.startsWith('D') && imgWs[cellAddress] && imgWs[cellAddress].l) {
                // Set cell style for hyperlinks
                imgWs[cellAddress].s = {
                    font: {
                        color: { rgb: '0563C1' },
                        underline: true,
                    },
                };
            }
        });

        XLSX.utils.book_append_sheet(wb, imgWs, 'Visiting Card Images');

        // Generate file name
        const fileName =
            showDateFilter && filters.startDate && filters.toDate
                ? `Enquiry-Report-${moment(filters.startDate).format('DD-MM-YYYY')}-to-${moment(filters.toDate).format('DD-MM-YYYY')}.xlsx`
                : `Enquiry-Report-All-Time.xlsx`;

        XLSX.writeFile(wb, fileName);
    };

    const onDownloadPDF = () => {
        navigate('/documents/print-enquiry', {
            state: {
                filteredData: filteredData,
                filters: filters,
                showDateFilter: showDateFilter,
            },
        });
    };

    const handlePaginationChange = (pageIndex, newPageSize) => {
        setCurrentPage(pageIndex);
        setPageSize(newPageSize);
    };

    const getPaginatedData = () => {
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredData.slice(startIndex, endIndex);
    };

    const getTotalCount = () => {
        return filteredData.length;
    };

    return (
        <div className="p-6">
            <div className="p-6 text-center">
                <h1 className="text-3xl font-extrabold text-gray-800">Enquiry Management Report</h1>
            </div>

            {showSearch && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Search & Filter</h2>
                        <button onClick={() => setShowSearch(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                            ▲ Hide
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* Date Filter Toggle Button */}
                            <div className="md:col-span-2 lg:col-span-4">
                                <button
                                    type="button"
                                    onClick={toggleDateFilter}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                                        showDateFilter ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <IconCalendar className="w-4 h-4" />
                                    <span className="font-medium">{showDateFilter ? 'Hide Date Filter' : 'Add Date Filter'}</span>
                                </button>
                            </div>

                            {/* Date Filters */}
                            {showDateFilter && (
                                <>
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <label className="block text-sm font-medium text-blue-800 mb-1">From Date</label>
                                        <input
                                            type="date"
                                            className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            value={filters.startDate}
                                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <label className="block text-sm font-medium text-blue-800 mb-1">To Date</label>
                                        <input
                                            type="date"
                                            className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                            value={filters.toDate}
                                            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Expo Filter */}
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expo Name</label>
                                <Select
                                    options={optionListState.expoList}
                                    value={filters.selectedExpo}
                                    onChange={(selectedOption) => setFilters({ ...filters, selectedExpo: selectedOption })}
                                    placeholder="Select Expo"
                                    isSearchable
                                    isClearable
                                    styles={customStyles}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            {/* Product Filter */}
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                <Select
                                    options={optionListState.productList}
                                    value={filters.selectedProduct}
                                    onChange={(selectedOption) => setFilters({ ...filters, selectedProduct: selectedOption })}
                                    placeholder="Select Product"
                                    isSearchable
                                    isClearable
                                    styles={customStyles}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            {/* Search Input */}
                            <div className="md:col-span-2 bg-white p-3 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <IconSearch className="inline w-4 h-4 mr-1" />
                                    Search
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search by customer name, company, mobile, email, or enquiry no..."
                                    value={filters.searchQuery}
                                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button type="button" onClick={handleClear} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium">
                                Clear All
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm flex items-center justify-center min-w-[120px]"
                                disabled={searchLoading || (showDateFilter && (!filters.startDate || !filters.toDate))}
                            >
                                {searchLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Searching...
                                    </>
                                ) : (
                                    'Search'
                                )}
                            </button>
                            {appliedFilters && filteredData.length > 0 && (
                                <>
                                    {_.includes(accessIds, '5') && (
                                        <button
                                            type="button"
                                            onClick={onDownload}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-sm flex items-center"
                                        >
                                            <IconPrinter className="mr-2 w-4 h-4" />
                                            Export Excel
                                        </button>
                                    )}
                                    {_.includes(accessIds, '9') && (
                                        <button
                                            type="button"
                                            onClick={onDownloadPDF}
                                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-sm flex items-center"
                                        >
                                            <IconPrinter className="mr-2 w-4 h-4" />
                                            Export PDF
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {!showSearch && (
                <div className="flex justify-center mb-6">
                    <button onClick={() => setShowSearch(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center">
                        <IconSearch className="mr-2 w-4 h-4" />
                        Show Search Panel
                    </button>
                </div>
            )}

            {/* Loading States and Table */}
            {searchLoading ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-6"></div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Searching Enquiry Data</h3>
                        <p className="text-gray-500">Please wait while we fetch the enquiry information based on your criteria</p>
                    </div>
                </div>
            ) : appliedFilters && filteredData.length > 0 ? (
                <>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">Enquiry Report</h3>
                                    <p className="text-gray-600">
                                        Showing {filteredData.length} records
                                        {showDateFilter && filters.startDate && filters.toDate
                                            ? ` from ${moment(filters.startDate).format('DD MMM YYYY')} to ${moment(filters.toDate).format('DD MMM YYYY')}`
                                            : ' (All Time)'}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 text-sm">
                                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                                        <span className="text-gray-600">Total Records: </span>
                                        <span className="font-semibold text-blue-600">{filteredData.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <Table
                                columns={enquiryColumns}
                                data={getPaginatedData()}
                                Title=""
                                pageSize={pageSize}
                                pageIndex={currentPage}
                                totalCount={getTotalCount()}
                                totalPages={Math.ceil(getTotalCount() / pageSize)}
                                onPaginationChange={handlePaginationChange}
                                isSortable={true}
                                pagination={true}
                                isSearchable={false}
                                tableClass="min-w-full rounded-lg overflow-hidden"
                                theadClass="bg-gray-50"
                            />
                        </div>
                    </div>
                </>
            ) : appliedFilters && filteredData.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                            <IconSearch className="w-12 h-12 text-yellow-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Data Found</h3>
                        <p className="text-gray-600 text-lg max-w-md mb-6">No enquiry records match your current search criteria. Try adjusting your filters or search terms.</p>
                        <button onClick={handleClear} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold">
                            Clear Filters
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <IconSearch className="w-12 h-12 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Enquiry Report Dashboard</h3>
                        <p className="text-gray-600 text-lg max-w-md mb-6">
                            {enquiryData.length > 0
                                ? `Ready to search through ${enquiryData.length} enquiry records. Use the search filters above to generate detailed reports.`
                                : 'Loading enquiry data...'}
                        </p>
                        <button
                            onClick={() => setShowSearch(true)}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg"
                        >
                            Start Searching
                        </button>
                    </div>
                </div>
            )}

            {/* Products Modal using ModelViewBox */}
            <ModelViewBox
                modal={showProductsModal}
                modelHeader={`Products for ${selectedEnquiry?.name || 'Customer'}`}
                setModel={closeProductsModal}
                modelSize="max-w-4xl"
                submitBtnText="Close"
                loading={false}
                hideSubmit={true}
                saveBtn={false}
            >
                {selectedEnquiry && (
                    <div className="p-4">
                        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold text-gray-700">Company:</span> {selectedEnquiry.companyName}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Enquiry No:</span> {selectedEnquiry.enquiryNo}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Total Products:</span> {selectedEnquiry.products?.length || 0}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Total Samples:</span> {selectedEnquiry.totalSampleQty || 0}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Enquiry Date:</span> {moment(selectedEnquiry.enquiryDate).format('DD/MM/YYYY')}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {selectedEnquiry.products && selectedEnquiry.products.length > 0 ? (
                                selectedEnquiry.products.map((product, index) => (
                                    <div key={product.productId || index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex space-x-4">
                                            {product.productImage && product.productImage !== 'N/A' && (
                                                <img
                                                    src={baseURL + product.productImage}
                                                    alt={product.productName}
                                                    crossOrigin="anonymous"
                                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                    onError={(e) => {
                                                        e.target.src = '/assets/images/default-product.jpg';
                                                    }}
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold text-gray-800 text-lg">{product.productName}</h4>
                                                    <div className="flex flex-col items-end space-y-1">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">Code: {product.productCode}</span>
                                                        {/* Display formatted price type */}
                                                        {product.priceType && product.priceType !== 'N/A' && (
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">Price Type: {product.priceType}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="font-medium text-gray-600">Composition:</span> {product.composition}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-600">Size:</span> {product.size}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-600">Fabric:</span> {product.fabricName}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-600">Price:</span>
                                                        <span className="ml-1 font-semibold text-green-600">${product.price}</span>
                                                        {product.priceType && product.priceType !== 'N/A' && <span className="ml-2 text-xs text-gray-500">({product.priceType})</span>}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-600">Washing:</span> {product.washingDetails}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-600">Filling:</span> {product.fillingMaterial}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="font-medium text-gray-600">Sample Qty:</span>
                                                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">{product.sampleRequiredQty || 0} pieces</span>
                                                    </div>
                                                    {product.remarks && product.remarks !== 'N/A' && (
                                                        <div className="col-span-2">
                                                            <span className="font-medium text-gray-600">Remarks:</span> {product.remarks}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">No products found for this enquiry</div>
                            )}
                        </div>
                    </div>
                )}
            </ModelViewBox>
        </div>
    );
};

export default Index;
