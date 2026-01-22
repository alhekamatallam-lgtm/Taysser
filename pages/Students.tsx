
import React, { useState } from 'react';
import { mockStudents as initialStudents } from '../data/mockData';
import type { User, Student } from '../types';
import { Modal } from '../components/Modal';

interface StudentsProps {
    user: User;
}

const Students: React.FC<StudentsProps> = ({ user }) => {
    const [students, setStudents] = useState(initialStudents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
        name: '', phone: '', guardianPhone: '', username: '', halaqa: '',
        plan: { lines: 15, start: 'سورة الفاتحة', direction: 'من الفاتحة إلى الناس' }
    });

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        setStudents([...students, { ...newStudent, id: students.length + 1 }]);
        setIsModalOpen(false);
        setNewStudent({
            name: '', phone: '', guardianPhone: '', username: '', halaqa: '',
            plan: { lines: 15, start: 'سورة الفاتحة', direction: 'من الفاتحة إلى الناس' }
        });
    };

    return (
        <div dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-teal-800">شؤون الطلاب</h1>
                {user.role === 'Admin' && (
                     <button onClick={() => setIsModalOpen(true)} className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition">
                        إضافة طالب جديد
                    </button>
                )}
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-base text-right text-stone-600">
                        <thead className="text-sm text-stone-700 uppercase bg-stone-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم الطالب</th>
                                <th scope="col" className="px-6 py-3">الحلقة</th>
                                <th scope="col" className="px-6 py-3">خطة الحفظ (أسطر)</th>
                                <th scope="col" className="px-6 py-3">اتجاه الحفظ</th>
                                <th scope="col" className="px-6 py-3">رقم جوال ولي الأمر</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="bg-white border-b hover:bg-stone-50">
                                    <td className="px-6 py-4 font-bold text-stone-900">{student.name}</td>
                                    <td className="px-6 py-4">{student.halaqa}</td>
                                    <td className="px-6 py-4 text-center">{student.plan.lines}</td>
                                    <td className="px-6 py-4 text-sm">{student.plan.direction}</td>
                                    <td className="px-6 py-4">{student.guardianPhone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal title="إضافة طالب جديد" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleAddStudent} className="space-y-4">
                     <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">اسم الطالب</label>
                        <input type="text" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" required />
                    </div>
                     <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">الحلقة</label>
                        <input type="text" value={newStudent.halaqa} onChange={(e) => setNewStudent({...newStudent, halaqa: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" required />
                    </div>
                     <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">رقم جوال ولي الأمر</label>
                        <input type="tel" value={newStudent.guardianPhone} onChange={(e) => setNewStudent({...newStudent, guardianPhone: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" required />
                    </div>
                    <button type="submit" className="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">إضافة</button>
                </form>
            </Modal>
        </div>
    );
};

export default Students;
