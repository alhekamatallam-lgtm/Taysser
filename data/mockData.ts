
import type { Halaqa, Teacher, Supervisor, Student, User } from '../types';

export const mockUsers: User[] = [
    { id: 1, username: 'admin', password: 'admin123', role: 'Admin' },
    { id: 2, username: 'teacher', password: 'teacher123', role: 'Teacher' },
    { id: 3, username: 'supervisor', password: 'supervisor123', role: 'Supervisor' },
    // FIX: Removed 'name' property as it does not exist in the User type definition.
    { id: 4, username: 'ahmed.k', password: 'password', role: 'Teacher'},
];

export let mockHalaqat: Halaqa[] = [
    { id: 1, name: 'حلقة الأترجة', teacher: 'أحمد خالد', studentCount: 12, period: 'صباحية' },
    { id: 2, name: 'حلقة الإتقان', teacher: 'محمد عبد الله', studentCount: 15, period: 'مسائية' },
    { id: 3, name: 'حلقة الفرقان', teacher: 'علي سعد', studentCount: 10, period: 'صباحية' },
    { id: 4, name: 'حلقة البيان', teacher: 'يوسف إبراهيم', studentCount: 18, period: 'مسائية' },
];

export let mockTeachers: Teacher[] = [
    { id: 1, name: 'أحمد خالد', phone: '0501234567', halaqa: 'حلقة الأترجة' },
    { id: 2, name: 'محمد عبد الله', phone: '0502345678', halaqa: 'حلقة الإتقان' },
    { id: 3, name: 'علي سعد', phone: '0503456789', halaqa: 'حلقة الفرقان' },
    { id: 4, name: 'يوسف إبراهيم', phone: '0504567890', halaqa: 'حلقة البيان' },
];

export let mockSupervisors: Supervisor[] = [
    { id: 1, name: 'خالد الفيصل', role: 'مشرف تعليمي' },
    { id: 2, name: 'سلطان القحطاني', role: 'مشرف شؤون طلاب' },
    { id: 3, name: 'عبدالعزيز الحمد', role: 'مشرف تعليمي' },
];

export let mockStudents: Student[] = [
    {
        id: 1, name: 'عبد الرحمن صالح', phone: '0551112222', guardianPhone: '0551112223',
        username: 'abdulrahman.s', halaqa: 'حلقة الإتقان', teacherId: 2, lastRecitation: 'البقرة: 1-15',
        plan: { lines: 15, start: 'سورة البقرة', direction: 'من الفاتحة إلى الناس' }
    },
    {
        id: 2, name: 'فيصل حمد', phone: '0553334444', guardianPhone: '0553334445',
        username: 'faisal.h', halaqa: 'حلقة الأترجة', teacherId: 1, lastRecitation: 'آل عمران: 20-35',
        plan: { lines: 10, start: 'سورة الناس', direction: 'من الناس إلى الفاتحة' }
    },
    {
        id: 3, name: 'نواف تركي', phone: '0555556666', guardianPhone: '0555556667',
        username: 'nawaf.t', halaqa: 'حلقة الفرقان', teacherId: 3, lastRecitation: 'النساء: 1-10',
        plan: { lines: 20, start: 'سورة الكهف', direction: 'من الفاتحة إلى الناس' }
    },
    {
        id: 4, name: 'سعود فهد', phone: '0557778888', guardianPhone: '0557778889',
        username: 'saud.f', halaqa: 'حلقة الإتقان', teacherId: 2, lastRecitation: 'المائدة: 5-20',
        plan: { lines: 15, start: 'سورة آل عمران', direction: 'من الفاتحة إلى الناس' }
    },
    {
        id: 5, name: 'خالد وليد', phone: '0559990000', guardianPhone: '0559990001',
        username: 'khalid.w', halaqa: 'حلقة الإتقان', teacherId: 2, lastRecitation: 'الأنعام: 1-15',
        plan: { lines: 15, start: 'سورة المائدة', direction: 'من الفاتحة إلى الناس' }
    },
];
