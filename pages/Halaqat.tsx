
import React, { useState } from 'react';
import { mockHalaqat as initialHalaqat } from '../data/mockData';
import type { User, Halaqa } from '../types';
import { Modal } from '../components/Modal';

interface HalaqatProps {
    user: User;
}

const Halaqat: React.FC<HalaqatProps> = ({ user }) => {
    const [halaqat, setHalaqat] = useState(initialHalaqat);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newHalaqa, setNewHalaqa] = useState<Omit<Halaqa, 'id'>>({ name: '', teacher: '', studentCount: 0, period: 'صباحية' });

    const handleAddHalaqa = (e: React.FormEvent) => {
        e.preventDefault();
        setHalaqat([...halaqat, { ...newHalaqa, id: halaqat.length + 1 }]);
        setIsModalOpen(false);
        setNewHalaqa({ name: '', teacher: '', studentCount: 0, period: 'صباحية' });
    };

    return (
        <div dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-teal-800">إدارة الحلقات</h1>
                {user.role === 'Admin' && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition">
                        إضافة حلقة جديدة
                    </button>
                )}
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-base text-right text-stone-600">
                        <thead className="text-sm text-stone-700 uppercase bg-stone-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم الحلقة</th>
                                <th scope="col" className="px-6 py-3">اسم المعلم</th>
                                <th scope="col" className="px-6 py-3">عدد الطلاب</th>
                                <th scope="col" className="px-6 py-3">فترة الحلقة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {halaqat.map((halaqa) => (
                                <tr key={halaqa.id} className="bg-white border-b hover:bg-stone-50">
                                    <td className="px-6 py-4 font-bold text-stone-900">{halaqa.name}</td>
                                    <td className="px-6 py-4">{halaqa.teacher}</td>
                                    <td className="px-6 py-4">{halaqa.studentCount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-sm rounded-full ${halaqa.period === 'صباحية' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                            {halaqa.period}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal title="إضافة حلقة جديدة" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleAddHalaqa} className="space-y-4">
                     <div>
                        <label htmlFor="halaqaName" className="block mb-2 text-sm font-medium text-gray-900">اسم الحلقة</label>
                        <input type="text" id="halaqaName" value={newHalaqa.name} onChange={(e) => setNewHalaqa({...newHalaqa, name: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" required />
                    </div>
                     <div>
                        <label htmlFor="teacherName" className="block mb-2 text-sm font-medium text-gray-900">اسم المعلم</label>
                        <input type="text" id="teacherName" value={newHalaqa.teacher} onChange={(e) => setNewHalaqa({...newHalaqa, teacher: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" required />
                    </div>
                     <div>
                        <label htmlFor="studentCount" className="block mb-2 text-sm font-medium text-gray-900">عدد الطلاب</label>
                        <input type="number" id="studentCount" value={newHalaqa.studentCount} onChange={(e) => setNewHalaqa({...newHalaqa, studentCount: Number(e.target.value)})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" required />
                    </div>
                    <div>
                        <label htmlFor="period" className="block mb-2 text-sm font-medium text-gray-900">الفترة</label>
                        <select id="period" value={newHalaqa.period} onChange={(e) => setNewHalaqa({...newHalaqa, period: e.target.value as 'صباحية' | 'مسائية'})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5">
                            <option value="صباحية">صباحية</option>
                            <option value="مسائية">مسائية</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">إضافة</button>
                </form>
            </Modal>
        </div>
    );
};

export default Halaqat;
