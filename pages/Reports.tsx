
import React from 'react';
import type { User } from '../types';

interface ReportsProps {
    user: User;
}

const Reports: React.FC<ReportsProps> = ({ user }) => {
    return (
        <div dir="rtl">
            <h1 className="text-3xl font-bold text-teal-800 mb-6">التقارير</h1>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200 text-center">
                <h2 className="text-xl font-bold text-teal-700 mb-4">قيد الإنشاء</h2>
                <p className="text-stone-600">
                    سيتم إضافة قسم التقارير قريباً لتوفير رؤى تفصيلية حول أداء الطلاب والحلقات.
                </p>
            </div>
        </div>
    );
};

export default Reports;
