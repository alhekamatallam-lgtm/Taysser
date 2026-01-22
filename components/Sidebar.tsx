
import React from 'react';
import type { Page, User } from '../types';
import { DashboardIcon, HalaqaIcon, TeacherIcon, SupervisorIcon, StudentIcon, ReportIcon, TrackerIcon, BookOpenIcon } from './IconComponents';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    activePage: Page;
    setActivePage: (page: Page) => void;
    user: User;
    onLogout: () => void;
}

const NavItem: React.FC<{
    pageName: Page;
    label: string;
    icon: React.ReactElement;
    activePage: Page;
    onClick: (page: Page) => void;
}> = ({ pageName, label, icon, activePage, onClick }) => {
    const isActive = activePage === pageName;
    return (
        <li>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onClick(pageName);
                }}
                className={`flex items-center p-3 my-1 text-base font-normal rounded-lg transition duration-75 hover:bg-teal-100 hover:text-teal-800 ${isActive ? 'bg-teal-200 text-teal-900' : 'text-stone-700'}`}
            >
                {icon}
                <span className="flex-1 whitespace-nowrap">{label}</span>
            </a>
        </li>
    );
};

const LogoutIcon = () => (
    <svg className="w-6 h-6 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
)

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activePage, setActivePage, user, onLogout }) => {
    
    const allNavItems = [
        { page: 'Dashboard', label: 'لوحة المعلومات', icon: <DashboardIcon />, roles: ['Admin', 'Supervisor'] },
        { page: 'TeacherDashboard', label: 'واجهة المعلم', icon: <DashboardIcon />, roles: ['Teacher'] },
        { page: 'Halaqat', label: 'الحلقات', icon: <HalaqaIcon />, roles: ['Admin', 'Supervisor'] },
        { page: 'Teachers', label: 'المعلمون', icon: <TeacherIcon />, roles: ['Admin', 'Supervisor'] },
        { page: 'Supervisors', label: 'المشرفون', icon: <SupervisorIcon />, roles: ['Admin'] },
        { page: 'Students', label: 'الطلاب', icon: <StudentIcon />, roles: ['Admin', 'Teacher', 'Supervisor'] },
        { page: 'Reports', label: 'التقارير', icon: <ReportIcon />, roles: ['Admin', 'Supervisor'] },
        { page: 'Tracker', label: 'متابعة طالب', icon: <TrackerIcon />, roles: ['Admin', 'Teacher', 'Supervisor'] },
        { page: 'Users', label: 'المستخدمون', icon: <TeacherIcon />, roles: ['Admin'] },
    ];

    const visibleNavItems = allNavItems.filter(item => item.roles.includes(user.role));

    const handleNavItemClick = (page: Page) => {
        setActivePage(page);
        if (window.innerWidth < 768) { // md breakpoint is 768px
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Overlay */}
             <div
                className={`fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            ></div>

            <aside 
                className={`fixed top-0 right-0 z-40 h-screen w-64 bg-white shadow-md flex flex-col transition-transform duration-300 ease-in-out md:sticky md:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                aria-label="Sidebar"
            >
                <div className="overflow-y-auto py-4 px-3 flex-1">
                    <div className="flex items-center justify-between pl-2.5 mb-5 border-b pb-4">
                        <div className="flex items-center">
                            <BookOpenIcon className="w-8 h-8 mr-0 ml-3 text-teal-700" />
                            <span className="text-xl font-bold text-teal-800">نظام التيسير</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-stone-500 hover:text-stone-800" aria-label="Close menu">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {visibleNavItems.map(item => (
                            <NavItem
                                key={item.page}
                                pageName={item.page as Page}
                                label={item.label}
                                icon={item.icon}
                                activePage={activePage}
                                onClick={handleNavItemClick}
                            />
                        ))}
                    </ul>
                </div>
                <div className="p-4 border-t">
                    <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}
                    className="flex items-center p-3 text-base font-normal text-stone-700 rounded-lg transition duration-75 hover:bg-red-100 hover:text-red-800"
                    >
                        <LogoutIcon />
                        <span className="flex-1 whitespace-nowrap">تسجيل الخروج</span>
                    </a>
                </div>
            </aside>
        </>
    );
};