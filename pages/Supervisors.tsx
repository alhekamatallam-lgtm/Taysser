
import React, { useState } from 'react';
import { mockSupervisors as initialSupervisors } from '../data/mockData';
import type { User, Supervisor } from '../types';
import { Modal } from '../components/Modal';

interface SupervisorsProps {
    user: User;
}

const Supervisors: React.FC<SupervisorsProps> = ({ user }) => {
    const [supervisors, setSupervisors] = useState(initialSupervisors);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSupervisor, setNewSupervisor] = useState<Omit<Supervisor, 'id'>>({ name: '', role: 'مشرف تعليمي' });

    const handleAddSupervisor = (e: React.FormEvent) => {
        e.preventDefault();
        setSupervisors([...supervisors, { ...newSupervisor, id: supervisors.length + 1 }]);
        setIsModalOpen(false);
        setNewSupervisor({ name: '', role: 'مشرف تعليمي' });
    };

    return (
        <div dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-teal-800">المشرفون</h1>
                {user.role === 'Admin' && (
                     <button onClick={() => setIsModalOpen(true)} className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition">
                        إضافة مشرف جديد
                    </button>
                )}
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-base text-right text-stone-600">
                        <thead className="text-sm text-stone-700 uppercase bg-stone-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم المشرف</th>
                                <th scope="col" className="px-6 py-3">الدور</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supervisors.map((supervisor) => (
                                <tr key={supervisor.id} className="bg-white border-b hover:bg-stone-50">
                                    <td className="px-6 py-4 font-bold text-stone-900">{supervisor.name}</td>
                                    <td className="px-6 py-4">{supervisor.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal title="إضافة مشرف جديد" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleAddSupervisor} className="space-y-4">
                     <div>
                        <label htmlFor="supervisorName" className="block mb-2 text-sm font-medium text-gray-900">اسم المشرف</label>
                        <input type="text" id="supervisorName" value={newSupervisor.name} onChange={(e) => setNewSupervisor({...newSupervisor, name: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" required />
                    </div>
                     <div>
                        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">الدور</label>
                        <select id="role" value={newSupervisor.role} onChange={(e) => setNewSupervisor({...newSupervisor, role: e.target.value as 'مشرف تعليمي' | 'مشرف شؤون طلاب'})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5">
                            <option value="مشرف تعليمي">مشرف تعليمي</option>
                            <option value="مشرف شؤون طلاب">مشرف شؤون طلاب</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">إضافة</button>
                </form>
            </Modal>
        </div>
    );
};

export default Supervisors;
