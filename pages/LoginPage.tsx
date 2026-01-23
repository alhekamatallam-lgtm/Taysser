
import React, { useState } from 'react';
import type { User } from '../types';
import { login } from '../services/authService';
import { BookOpenIcon } from '../components/IconComponents';

interface LoginPageProps {
    onLoginSuccess: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const user = login(username, password);
            setIsLoading(false);
            if (user) {
                onLoginSuccess(user);
            } else {
                setError('اسم المستخدم أو كلمة المرور غير صحيحة');
            }
        }, 500);
    };

    return (
        <div dir="rtl" className="flex items-center justify-center min-h-screen bg-stone-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
                <div className="text-center">
                    <div className="flex justify-center items-center mb-4">
                       <BookOpenIcon className="w-12 h-12 text-teal-700" />
                    </div>
                    <h2 className="text-2xl font-bold text-teal-800">نظام التيسير لإدارة الحلقات</h2>
                    <p className="mt-2 text-sm text-stone-600">الرجاء تسجيل الدخول للمتابعة</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username-address" className="sr-only">اسم المستخدم</label>
                            <input
                                id="username-address"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                                placeholder="اسم المستخدم"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">كلمة المرور</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                                placeholder="كلمة المرور"
                            />
                        </div>
                    </div>

                    {error && (
                         <div className="text-red-600 text-sm text-center">{error}</div>
                    )}
                    
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400"
                        >
                            {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                        </button>
                    </div>
                </form>
                 <div className="text-center text-xs text-gray-500">
                    <p>admin / admin123</p>
                    <p>teacher / teacher123</p>
                    <p>supervisor / supervisor123</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
