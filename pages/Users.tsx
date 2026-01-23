
import React, { useState } from 'react';
import { mockUsers as initialUsers } from '../data/mockData';
import type { User, Role } from '../types';
import { Modal } from '../components/Modal';

interface UsersProps {
    user: User;
}

const Users: React.FC<UsersProps> = ({ user }) => {
    const [users, setUsers] = useState(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ username: '', password: '', role: 'Teacher' });

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        setUsers([...users, { ...newUser, id: users.length + 1 }]);
        setIsModalOpen(false);
        setNewUser({ username: '', password: '', role: 'Teacher' });
    };

    return (
        <div dir="rtl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-teal-800">إدارة المستخدمين</h1>
                {user.role === 'Admin' && (
                     <button onClick={() => setIsModalOpen(true)} className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition">
                        إضافة مستخدم جديد
                    </button>
                )}
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-base text-right text-stone-600">
                        <thead className="text-sm text-stone-700 uppercase bg-stone-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم المستخدم</th>
                                <th scope="col" className="px-6 py-3">الدور/الصلاحية</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="bg-white border-b hover:bg-stone-50">
                                    <td className="px-6 py-4 font-bold text-stone-900">{u.username}</td>
                                    <td className="px-6 py-4">{u.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal title="إضافة مستخدم جديد" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleAddUser} className="space-y-4">
                     <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">اسم المستخدم</label>
                        <input type="text" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" required />
                    </div>
                     <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">كلمة المرور</label>
                        <input type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5" required />
                    </div>
                     <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">الدور</label>
                        <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value as Role})} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5">
                            <option value="Teacher">معلم</option>
                            <option value="Supervisor">مشرف</option>
                             <option value="Admin">مدير</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">إضافة</button>
                </form>
            </Modal>
        </div>
    );
};

export default Users;
