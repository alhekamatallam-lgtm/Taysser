import React from 'react';
import { HalaqaIcon, StudentIcon, TeacherIcon } from '../components/IconComponents';
import { mockHalaqat, mockStudents, mockTeachers } from '../data/mockData';
import type { User } from '../types';

// FIX: Updated 'icon' prop type to React.ReactElement<{ className?: string }> 
// to ensure React.cloneElement can correctly inject the 'className' property.
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement<{ className?: string }>; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200 flex items-center">
        <div className={`p-4 rounded-full ${color}`}>
            {React.cloneElement(icon, { className: "w-8 h-8 text-white" })}
        </div>
        <div className="mr-4">
            <p className="text-lg font-bold text-stone-800">{value}</p>
            <p className="text-stone-500">{title}</p>
        </div>
    </div>
);

interface DashboardProps {
    user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    // Calculations from mock data
    const totalHalaqat = mockHalaqat.length;
    const totalStudents = mockStudents.length;
    const totalTeachers = mockTeachers.length;
    const totalPeriods = new Set(mockHalaqat.map(h => h.period)).size;
    const completedPlans = mockStudents.filter(s => s.id % 2 === 0).length; // Mock completion
    const attendance = 95; // Mock attendance

    return (
        <div dir="rtl">
            <h1 className="text-3xl font-bold text-teal-800 mb-6">لوحة المعلومات الرئيسية</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="عدد الحلقات" value={totalHalaqat} icon={<HalaqaIcon />} color="bg-teal-500" />
                <StatCard title="عدد الطلاب" value={totalStudents} icon={<StudentIcon />} color="bg-blue-500" />
                <StatCard title="عدد المعلمين" value={totalTeachers} icon={<TeacherIcon />} color="bg-amber-500" />
                <StatCard title="عدد الفترات" value={totalPeriods} icon={<HalaqaIcon />} color="bg-indigo-500" />
                <StatCard title="طلاب منجزون" value={completedPlans} icon={<StudentIcon />} color="bg-green-500" />
                <StatCard title="نسبة الحضور" value={`${attendance}%`} icon={<TeacherIcon />} color="bg-pink-500" />
            </div>

            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-stone-200">
                <h2 className="text-xl font-bold text-teal-700 mb-4">نظرة عامة</h2>
                <p className="text-stone-600">
                    مرحباً بك <span className="font-bold">{user.username}</span>، في لوحة تحكم نظام التيسير لإدارة حلقات القرآن الكريم. من هنا يمكنك متابعة جميع جوانب الحلقات، من الطلاب والمعلمين إلى التقارير والإحصائيات.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;