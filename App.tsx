
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Halaqat from './pages/Halaqat';
import Teachers from './pages/Teachers';
import Supervisors from './pages/Supervisors';
import Students from './pages/Students';
import Reports from './pages/Reports';
import TrackerPage from './pages/TrackerPage';
import Users from './pages/Users';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import type { Page, User } from './types';
import { getCurrentUser, logout } from './services/authService';


export default function App() {
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check for logged-in user on initial load
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Set initial page based on role
      if (user.role === 'Teacher') {
        setActivePage('TeacherDashboard');
      } else {
        setActivePage('Dashboard');
      }
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    // Redirect based on role
    if (user.role === 'Teacher') {
      setActivePage('TeacherDashboard');
    } else {
      setActivePage('Dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }
  
  const pageTitles: { [key in Page]?: string } = {
    Dashboard: 'لوحة المعلومات الرئيسية',
    TeacherDashboard: 'واجهة المعلم',
    Halaqat: 'إدارة الحلقات',
    Teachers: 'المعلمون',
    Supervisors: 'المشرفون',
    Students: 'شؤون الطلاب',
    Reports: 'التقارير',
    Tracker: 'متابعة طالب',
    Users: 'إدارة المستخدمين',
  };


  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard user={currentUser} />;
      case 'TeacherDashboard':
        return <TeacherDashboard user={currentUser} />;
      case 'Halaqat':
        return <Halaqat user={currentUser} />;
      case 'Teachers':
        return <Teachers user={currentUser} />;
      case 'Supervisors':
        return <Supervisors user={currentUser} />;
      case 'Students':
        return <Students user={currentUser} />;
      case 'Reports':
        return <Reports user={currentUser} />;
      case 'Tracker':
        return <TrackerPage />;
      case 'Users':
        return <Users user={currentUser} />;
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  return (
    <div dir="rtl" className="flex min-h-screen bg-stone-100 text-gray-800">
      <Sidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activePage={activePage} 
        setActivePage={setActivePage} 
        user={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-1 flex flex-col w-full">
         {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-10">
            <h1 className="text-lg font-bold text-teal-800">{pageTitles[activePage] || 'نظام التيسير'}</h1>
            <button onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
                 <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
        </header>
        <div className="p-4 md:p-8 flex-1">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}