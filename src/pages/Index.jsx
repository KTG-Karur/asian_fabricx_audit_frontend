import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showMessage } from '../util/AllFunction';
import IconUsers from '../components/Icon/IconUsers';
import IconShoppingCart from '../components/Icon/IconShoppingCart';
import IconGlobe from '../components/Icon/IconGlobe';
import IconTrendingUp from '../components/Icon/IconTrendingUp';
import IconEye from '../components/Icon/IconEye';
import IconDollarSign from '../components/Icon/IconDollarSign';
import IconStar from '../components/Icon/IconStar';
import IconHeart from '../components/Icon/IconHeart';
import IconMessage from '../components/Icon/IconMessage';
import IconGift from '../components/Icon/IconGift';
import IconPlus from '../components/Icon/IconPlus';
import IconBuilding from '../components/Icon/IconBuilding';
import IconCalendar from '../components/Icon/IconCalendar';
import { getDashboardData, resetDashboardStatus } from '../redux/dashboardSlice';
import _ from 'lodash';
import { findArrObj } from '../util/AllFunction';

const Dashboard = () => {
    const loginInfo = localStorage.getItem('loginInfo');
    const localData = JSON.parse(loginInfo);
    const pageAccessData = findArrObj(localData?.pagePermission, 'label','Dashboard');
    const accessIds = (pageAccessData[1]?.access || '').split(',').map((id) => id.trim());
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Brand colors
    const brandColors = {
        primary: '#2e3092', // Dark Blue
        secondary: '#f16521', // Orange
        primaryLight: '#2e3092', // Lighter blue for backgrounds
        secondaryLight: '#f16521', // Lighter orange for accents
    };

    // Get all data from Redux store
    const { dashboardData, statistics, recentEnquiries, topProducts, countrySummary, expoPerformance, quickStats, loading, error } = useSelector((state) => state.DashboardSlice);

    // Fetch all dashboard data on component mount
    useEffect(() => {
        dispatch(getDashboardData());
    }, [dispatch]);

    // Handle errors
    useEffect(() => {
        if (error) {
            showMessage('error', error);
            dispatch(resetDashboardStatus());
        }
    }, [error, dispatch]);

    // Calculate metrics based ONLY on actual backend data
    const calculateMetrics = useMemo(() => {
        // Use only the actual data from your API
        const totalVisitors = statistics?.totalVisitors || 0;
        const activeEnquiries = statistics?.activeEnquiries || 0;
        const totalProductsCount = statistics?.totalProducts || 0;
        const sampleRequests = statistics?.sampleRequests || 0;

        // Calculate percentages based on actual data
        const activeEnquiryRate = totalVisitors > 0 ? Math.round((activeEnquiries / totalVisitors) * 100) : 0;

        const sampleRequestRate = totalVisitors > 0 ? Math.round((sampleRequests / totalVisitors) * 100) : 0;

        return {
            activeEnquiries: {
                value: activeEnquiries.toLocaleString(),
                percentage: activeEnquiryRate,
                description: 'Active Enquiries',
            },
            sampleRequests: {
                value: sampleRequests.toLocaleString(),
                percentage: sampleRequestRate,
                description: 'Sample Requests',
            },
            totalProducts: {
                value: totalProductsCount.toLocaleString(),
                percentage: Math.min(totalProductsCount / 10, 100),
                description: 'Total Products',
            },
            totalVisitors: {
                value: totalVisitors.toLocaleString(),
                percentage: Math.min(totalVisitors / 50, 100),
                description: 'Total Visitors',
            },
        };
    }, [statistics]);

    // Calculate circle metrics based ONLY on actual backend data
    const circleMetrics = useMemo(() => {
        const totalVisitors = statistics?.totalVisitors || 1;

        return {
            enquiryConversion: statistics?.activeEnquiries ? Math.round((statistics.activeEnquiries / totalVisitors) * 100) : 0,
            sampleRate: statistics?.sampleRequests ? Math.round((statistics.sampleRequests / totalVisitors) * 100) : 0,
            productEngagement: topProducts.length > 0 ? Math.round((topProducts.reduce((sum, product) => sum + (product.enquiryCount || 0), 0) / totalVisitors) * 100) : 0,
            globalReach: countrySummary.length > 0 ? Math.round((countrySummary.length / 50) * 100) : 0,
        };
    }, [statistics, topProducts, countrySummary]);

    // Main Stats Cards - Using only real data
    const MainStatCard = ({ title, value, percentage, description, icon: Icon, delay, onClick }) => (
        <div
            className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" // Added cursor-pointer
            style={{ animationDelay: `${delay}ms` }}
            onClick={onClick} 
        >
            {/* Background Pattern with brand colors */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundColor: brandColors.primary }}></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl transition-all duration-300" style={{ backgroundColor: `${brandColors.primary}15` }}>
                        <Icon style={{ color: brandColors.primary }} className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                        <div className="flex items-center space-x-2 justify-end">
                            <span className="text-sm font-semibold" style={{ color: brandColors.secondary }}>
                                Live
                            </span>
                        </div>
                    </div>
                </div>

                <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                        className="h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: brandColors.primary,
                        }}
                    ></div>
                </div>

                <p className="text-xs text-gray-500">{description}</p>
            </div>
        </div>
    );

    // Circle Progress Cards - Using only real data
    const CircleProgressCard = ({ title, percentage, value, subtitle, icon: Icon, size = 'medium' }) => {
        const circleSize = size === 'large' ? 100 : 80;
        const strokeWidth = size === 'large' ? 8 : 6;
        const radius = (circleSize - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
                        <p className="text-xs text-gray-500">{subtitle}</p>
                    </div>

                    <div className="relative" style={{ width: circleSize, height: circleSize }}>
                        <svg width={circleSize} height={circleSize} className="transform -rotate-90">
                            {/* Background Circle */}
                            <circle cx={circleSize / 2} cy={circleSize / 2} r={radius} stroke={brandColors.primary} strokeWidth={strokeWidth} fill="none" opacity="0.2" />
                            {/* Progress Circle */}
                            <circle
                                cx={circleSize / 2}
                                cy={circleSize / 2}
                                r={radius}
                                stroke={brandColors.secondary}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="p-2 rounded-xl" style={{ backgroundColor: `${brandColors.primary}15` }}>
                                <Icon style={{ color: brandColors.primary }} className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Metric Card for smaller stats - Using only real data
    const MetricCard = ({ title, value, description, icon: Icon }) => (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">{title}</p>
                    <p className="text-xl font-bold mt-1" style={{ color: brandColors.primary }}>
                        {value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                </div>
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${brandColors.primary}15` }}>
                    <Icon style={{ color: brandColors.primary }} className="w-4 h-4" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Animated Background Elements with brand colors */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-20 h-20 rounded-full opacity-10 animate-pulse" style={{ backgroundColor: brandColors.primary }}></div>
                <div className="absolute top-40 right-20 w-16 h-16 rounded-full opacity-15 animate-bounce" style={{ backgroundColor: brandColors.secondary }}></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full opacity-10 animate-ping" style={{ backgroundColor: brandColors.primary }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2" style={{ color: brandColors.primary }}>
                            Asian Fabricx
                        </h1>
                        <p className="text-gray-600">Real-time exhibition performance and visitor analytics</p>
                    </div>
                    {_.includes(accessIds,'10') ? (
                        <button
                            onClick={() => navigate('/join/product-enquiry')}
                            className="mt-4 lg:mt-0 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-3 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                            style={{ backgroundColor: brandColors.secondary }}
                        >
                            <IconPlus className="w-5 h-5" />
                            <span>New Enquiry</span>
                        </button>
                    ) : (
                        ''
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: brandColors.primary }}></div>
                        <p className="text-gray-600 mt-2">Loading dashboard data...</p>
                    </div>
                )}

                {/* Main Stats Grid - Using only real backend data */}
                {!loading && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                            <MainStatCard
                                onClick={() => navigate('/join/product-enquiry')}
                                title="ACTIVE ENQUIRIES"
                                value={calculateMetrics.activeEnquiries.value}
                                percentage={calculateMetrics.activeEnquiries.percentage}
                                description={calculateMetrics.activeEnquiries.description}
                                icon={IconUsers}
                                delay={0}
                            />
                            <MainStatCard
                                onClick={() => navigate('/join/product-enquiry')}
                                title="SAMPLE REQUESTS"
                                value={calculateMetrics.sampleRequests.value}
                                percentage={calculateMetrics.sampleRequests.percentage}
                                description={calculateMetrics.sampleRequests.description}
                                icon={IconEye}
                                delay={200}
                            />
                            <MainStatCard
                                onClick={() => navigate('/master/products')}
                                title="TOTAL PRODUCTS"
                                value={calculateMetrics.totalProducts.value}
                                percentage={calculateMetrics.totalProducts.percentage}
                                description={calculateMetrics.totalProducts.description}
                                icon={IconShoppingCart}
                                delay={400}
                            />
                            <MainStatCard
                                onClick={() => navigate('/join/product-enquiry')}
                                title="TOTAL VISITORS"
                                value={calculateMetrics.totalVisitors.value}
                                percentage={calculateMetrics.totalVisitors.percentage}
                                description={calculateMetrics.totalVisitors.description}
                                icon={IconTrendingUp}
                                delay={600}
                            />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                            {/* Left Column - Circle Progress Cards */}
                            <div className="xl:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CircleProgressCard
                                        title="ENQUIRY CONVERSION"
                                        percentage={circleMetrics.enquiryConversion}
                                        value={`${circleMetrics.enquiryConversion}%`}
                                        subtitle="Active vs Total Visitors"
                                        icon={IconTrendingUp}
                                        size="large"
                                    />
                                    <CircleProgressCard
                                        title="SAMPLE RATE"
                                        percentage={circleMetrics.sampleRate}
                                        value={`${circleMetrics.sampleRate}%`}
                                        subtitle="Sample Requests Rate"
                                        icon={IconEye}
                                        size="large"
                                    />
                                    <CircleProgressCard
                                        title="PRODUCT ENGAGEMENT"
                                        percentage={circleMetrics.productEngagement}
                                        value={`${circleMetrics.productEngagement}%`}
                                        subtitle="Product Interest Level"
                                        icon={IconShoppingCart}
                                    />
                                    <CircleProgressCard
                                        title="GLOBAL REACH"
                                        percentage={circleMetrics.globalReach}
                                        value={`${circleMetrics.globalReach}%`}
                                        subtitle="International Coverage"
                                        icon={IconGlobe}
                                    />
                                </div>
                            </div>

                            {/* Right Column - Quick Metrics */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <MetricCard title="COUNTRIES" value={countrySummary?.length?.toString() || '0'} description="Countries Represented" icon={IconGlobe} />
                                    <MetricCard title="EXPOS" value={expoPerformance?.length?.toString() || '0'} description="Active Exhibitions" icon={IconBuilding} />
                                    <MetricCard title="TOP PRODUCT" value={topProducts[0]?.enquiryCount?.toString() || '0'} description="Most Enquired Product" icon={IconStar} />
                                    <MetricCard title="CONVERSION RATE" value={`${quickStats?.conversionRate || '0'}%`} description="Enquiry Success Rate" icon={IconHeart} />
                                </div>
                            </div>
                        </div>

                        {/* Performance Metrics Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">AVG PRODUCTS PER ENQUIRY</h3>
                                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${brandColors.primary}15` }}>
                                        <IconShoppingCart style={{ color: brandColors.primary }} className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-gray-900 mb-2">{quickStats?.avgProducts || '0.0'}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${(parseFloat(quickStats?.avgProducts || 0) / 10) * 100}%`,
                                                backgroundColor: brandColors.primary,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">TOP COUNTRY</h3>
                                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${brandColors.primary}15` }}>
                                        <IconGlobe style={{ color: brandColors.primary }} className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900 mb-2 truncate">{quickStats?.topCountry || 'N/A'}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full"
                                            style={{
                                                width: '100%',
                                                backgroundColor: brandColors.secondary,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">TOTAL ENQUIRIES</h3>
                                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${brandColors.primary}15` }}>
                                        <IconUsers style={{ color: brandColors.primary }} className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-gray-900 mb-2">{statistics?.totalVisitors?.toLocaleString() || '0'}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${((statistics?.totalVisitors || 0) / 1000) * 100}%`,
                                                backgroundColor: brandColors.primary,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">ACTIVE RATE</h3>
                                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${brandColors.primary}15` }}>
                                        <IconTrendingUp style={{ color: brandColors.primary }} className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-gray-900 mb-2">{quickStats?.conversionRate || '0'}%</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${quickStats?.conversionRate || '0'}%`,
                                                backgroundColor: brandColors.secondary,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider mb-4">EXPO PERFORMANCE</h3>
                                <div className="space-y-4">
                                    {expoPerformance.slice(0, 4).map((expo, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">{expo.expo}</span>
                                                <span className="font-semibold text-gray-900">{expo.count} enquiries</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${expo.percentage}%`,
                                                        backgroundColor: brandColors.primary,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider mb-4">TOP PRODUCTS</h3>
                                <div className="space-y-4">
                                    {topProducts.slice(0, 4).map((product, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${brandColors.primary}15` }}>
                                                    <IconShoppingCart style={{ color: brandColors.primary }} className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-700 block">{product.productName}</span>
                                                    <span className="text-xs text-gray-500">{product.productNo}</span>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold" style={{ color: brandColors.secondary }}>
                                                {product.enquiryCount} enquiries
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Country Distribution */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mt-8">
                            <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider mb-4">TOP COUNTRIES</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {countrySummary.slice(0, 5).map((country, index) => (
                                    <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${brandColors.primary}15` }}>
                                            <IconGlobe style={{ color: brandColors.primary }} className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 block">{country.country}</span>
                                        <span className="text-xs text-gray-500">{country.count} visitors</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
