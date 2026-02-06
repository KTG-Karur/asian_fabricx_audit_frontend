import IconMenuAuthentication from '../Icon/Menu/IconMenuAuthentication';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation';
import IconMoney from '../Icon/IconMoney';
import IconUsersGroup from '../Icon/IconUsersGroup';
import IconLayerGroup from '../Icon/IconLayerGroup';
import IconUserFriends from '../Icon/IconUserFriends';
import IconDatabase from '../Icon/IconDatabase';
import IconMenuDashboards from '../Icon/IconMenuDashboard';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../redux/themeStore/themeConfigSlice';
import { IRootState } from '../../redux/themeStore';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconMinus from '../Icon/IconMinus';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';

// Existing Icons
import IconShield from '../Icon/IconShield';
import IconUsers from '../Icon/IconUsers';
import IconBuilding from '../Icon/IconBuilding';
import IconCalculator from '../Icon/IconCalculator';
import IconGavel from '../Icon/IconGavel';
import IconReceipt from '../Icon/IconReceipt';
import IconClock from '../Icon/IconClock';
import IconMoneyBillWave from '../Icon/IconMoneyBillWave';
import IconBook from '../Icon/IconBook';
import IconHandHoldingUsd from '../Icon/IconHandHoldingUsd';
import IconChartBar from '../Icon/IconChartBar';
import Navigation from './navigation';
import IconDollarSign from '../Icon/IconDollarSign';
import IconNotes from '../Icon/IconNotes';

// ============ NEWLY ADDED ICONS ============
// Dashboard and Layout
import IconHome from '../Icon/IconHome';
import IconMenu from '../Icon/IconMenu';
import IconSettings from '../Icon/IconSettings';

// Audit and Checklist
import IconClipboardCheck from '../Icon/IconClipboardCheck';
import IconClipboardList from '../Icon/IconClipboardList';
import IconFileCheck from '../Icon/IconFileCheck';
// import IconFileReport from '../Icon/IconFileReport';
import IconCheckCircle from '../Icon/IconCircleCheck';
import IconChecklist from '../Icon/IconChecklist';

// Suppliers and Scheduling
import IconTruck from '../Icon/IconTruck';
import IconBuildingWarehouse from '../Icon/IconBuildingWarehouse';
import IconCalendar from '../Icon/IconCalendar';
import IconCalendarEdit from '../Icon/IconCalendarEdit';
import IconCalendarEvent from '../Icon/IconCalendarEvent';

// General Actions
import IconSearch from '../Icon/IconSearch';
import IconPlus from '../Icon/IconPlus';
import IconTrashLines from '../Icon/IconTrashLines';
import IconDownload from '../Icon/IconDownload';
import IconEdit from '../Icon/IconEdit';
import IconRefresh from '../Icon/IconRefresh';

// Reports and Status
// import IconFileText from '../Icon/IconFileText';
import IconFlag from '../Icon/IconFlag';

// Optional alternative icons
import IconLayoutDashboard from '../Icon/IconLayoutDashboard';
import IconBriefcase from '../Icon/IconBriefcase';
import IconClipboardData from '../Icon/IconClipboardData';
import IconCalendarClock from '../Icon/IconCalendarClock';
import IconUserCheck from '../Icon/IconUserCheck';
import IconIdBadge from '../Icon/IconIdBadge';
// ============ END OF NEW ICONS ============

const getIcon = (name?: string) => {
    switch (name) {
        case 'fe-document':
            return IconMenuDocumentation;
        case 'fe-grid':
            return IconMenuDashboards;
        case 'fe-shield':
            return IconShield;
        case 'fe-users':
            return IconUsersGroup;
        case 'fe-notes':
            return IconNotes;
        case 'fe-friends':
            return IconUserFriends;
        case 'fe-group':
            return IconLayerGroup;
        case 'fe-book':
            return IconBook;
        case 'fe-check-square':
            return IconCalculator;
        case 'fe-gavel':
            return IconGavel;
        case 'fe-receipt':
            return IconReceipt;
        case 'fe-clock':
            return IconClock;
        case 'fe-money':
            return IconDollarSign;
        case 'fe-moneys':
            return IconMoney;
        case 'fe-hand-holding-usd':
            return IconHandHoldingUsd;
        case 'fe-chart':
            return IconChartBar;
        case 'fe-settings':
            return IconMenuAuthentication;
        case 'fe-company':
            return IconDatabase;
            
        // ============ NEW MAPPINGS FOR AUDIT SYSTEM ============
        // Dashboard and Layout
        case 'fe-home':
            return IconHome;
        case 'fe-menu':
            return IconMenu;
        case 'fe-settings':
            return IconSettings;
        case 'fe-building':
            return IconBuilding;
            
        // User and Role Management
        case 'fe-user':
            return IconUsers; // Single user
        case 'fe-id-badge':
            return IconIdBadge;
        case 'fe-users':
            return IconUsersGroup; // Multiple users
            
        // Audit and Checklist
        case 'fe-clipboard-check':
            return IconClipboardCheck;
        case 'fe-clipboard-list':
            return IconClipboardList;
        case 'fe-file-check':
            return IconFileCheck;
        // case 'fe-file-report':
        //     return IconFileReport;
        case 'fe-check-circle':
            return IconCheckCircle;
        case 'fe-checklist':
            return IconChecklist;
            
        // Suppliers and Scheduling
        case 'fe-truck':
            return IconTruck;
        case 'fe-warehouse':
            return IconBuildingWarehouse;
        case 'fe-calendar':
            return IconCalendar;
        case 'fe-calendar-edit':
            return IconCalendarEdit;
        case 'fe-calendar-event':
            return IconCalendarEvent;
            
        // Reports
        // case 'fe-file-text':
        //     return IconFileText;
        case 'fe-flag':
            return IconFlag;
            
        // Actions
        case 'fe-search':
            return IconSearch;
        case 'fe-plus':
            return IconPlus;
        case 'fe-trash':
            return IconTrashLines;
        case 'fe-download':
            return IconDownload;
        case 'fe-edit':
            return IconEdit;
        case 'fe-refresh':
            return IconRefresh;
            
        // Alternative icons
        case 'fe-layout-dashboard':
            return IconLayoutDashboard;
        case 'fe-briefcase':
            return IconBriefcase;
        case 'fe-clipboard-data':
            return IconClipboardData;
        case 'fe-calendar-clock':
            return IconCalendarClock;
        case 'fe-user-check':
            return IconUserCheck;
            
        default:
            return IconMinus; // fallback
    }
};

type SidebarItemType = 'title' | 'dropdown' | 'list';

interface BaseSidebarItem {
    type: SidebarItemType;
    label: string;
    icon: React.ComponentType<any>;
    key?: string;
}

interface DropdownSidebarItem extends BaseSidebarItem {
    type: 'dropdown';
    items: {
        label: string;
        to: string;
        icon: React.ComponentType<any>;
    }[];
}

interface ListSidebarItem extends BaseSidebarItem {
    type: 'list';
    to: string;
}

interface TitleSidebarItem extends BaseSidebarItem {
    type: 'title';
}

type SidebarItem = DropdownSidebarItem | ListSidebarItem | TitleSidebarItem;

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => (oldValue === value ? '' : value));
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location]);

    // 🔹 Load sidebar items from localStorage (after login)
    useEffect(() => {
        const userDetails = localStorage.getItem('loginInfo');
        if (userDetails) {
            const parsed = JSON.parse(userDetails);
            const permissions = parsed ? parsed?.pagePermission || [] : [];

            // transform backend -> frontend sidebar items
            const mapped: SidebarItem[] = permissions.map((item: any) => {
                if (item.isTitle) {
                    return {
                        type: 'title',
                        label: item.label,
                        icon: IconMinus,
                    };
                }

                if (item.children && item.children.length > 0) {
                    return {
                        type: 'dropdown',
                        label: item.label,
                        key: item.label,
                        icon: getIcon(item.icon),
                        items: item.children.map((child: any) => ({
                            label: child.label,
                            to: child.url,
                            icon: getIcon(child.icon),
                        })),
                    };
                }

                return {
                    type: 'list',
                    label: item.label,
                    to: item.url,
                    icon: getIcon(item.icon),
                };
            });

            setSidebarItems(mapped);
        }
    }, []);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px]  z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-[#e4e4e4] dark:bg-black h-full">
                    {/* logo */}
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img style={{ width: '200px', height: '40px' }} className="flex-none" src="/assets/images/Asian logo_02.png" alt="logo" />
                            {/* <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('Chittu')}</span> */}
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>

                    {/* sidebar menu */}
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            {sidebarItems.map((item, idx) => {
                                const key = String(item.key ?? `nav-${idx}`);

                                if (item.type === 'title') {
                                    return <Navigation key={key} type="title" label={item.label} icon={item.icon} />;
                                }

                                if (item.type === 'dropdown') {
                                    return (
                                        <Navigation
                                            key={key}
                                            type="dropdown"
                                            label={item.label}
                                            icon={item.icon}
                                            items={item.items}
                                            isOpen={currentMenu === item.key}
                                            onToggle={() => toggleMenu(item.key!)}
                                        />
                                    );
                                }

                                return <Navigation key={key} type="list" label={item.label} icon={item.icon} to={'to' in item ? item.to : ''} />;
                            })}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
