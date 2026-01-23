
import React, { useState } from 'react';
import { mockTeachers as initialTeachers } from '../data/mockData';
import type { User, Teacher } from '../types';
import { Modal } from '../components/Modal';

interface TeachersProps {
    user: User;
}

const Teachers: React.FC<TeachersProps> = ({ user }) => {
    const [teachers, setTeachers] = useState(initialTeachers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTeacher, setNewTeacher] = useState<Omit<Teacher, 'id'>>({ name: '', phone: '', halaqa: '' });

    const handleAddTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        setTeachers([...teachers, { ...newTeacher, id: teachers.length + 1 }]);
        setIsModalOpen(false);
        setNewTeacher({ name: '', phone: '', halaqa: '' });
    };

    return (
        <div dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-teal-800">المعلمون</h1>
                {user.role === 'Admin' && (
                     <button onClick={() => setIsModalOpen(true)} className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition">
                        إضافة معلم جديد
                    </button>
                )}
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-base text-right text-stone-600">
                        <thead className="text-sm text-stone-700 uppercase bg-stone-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم المعلم</th>
                                <th scope="col" className="px-6 py-3">رقم الجوال</th>
                                <th scope="col" className="px-6 py-3">الحلقة المسندة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map((teacher) => (
                                <tr key={teacher.id} className="bg-white border-b hover:bg-stone-50">
                                    <td className="px-6 py-4 font-bold text-stone-900">{teacher.name}</td>
                                    <td className="px-6 py-4">{teacher.phone}</td>
                                    <td className="px-6 py-4">{teacher.halaqa}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal title="إضافة معلم جديد" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleAddTeacher} className="space-y-4">
                     <div>
                        <label htmlFor="teacherName" className="block mb-2 text-sm font-medium text-gray-900">اسم المعلم</label>
                        <input type="text" id="teacherName" value={newTeacher.name} onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" required />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">رقم الجوال</label>
                        <input type="tel" id="phone" value={newTeacher.phone} onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" required />
                    </div>
                     <div>
                        <label htmlFor="halaqa" className="block mb-2 text-sm font-medium text-gray-900">الحلقة</label>
                        <input type="text" id="halaqa" value={newTeacher.halaqa} onChange={(e) => setNewTeacher({...newTeacher, halaqa: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" required />
                    </div>
                    <button type="submit" className="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">إضافة</button>
                </form>
            </Modal>
        </div>
    );
};

export default Teachers;
