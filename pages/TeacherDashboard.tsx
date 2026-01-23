
import React, { useState, useMemo, useEffect } from 'react';
import { mockStudents } from '../data/mockData';
import type { User, Student, AttendanceStatus, SurahInfo } from '../types';
import { RecitationModal } from '../components/RecitationModal';
import { getAllSurahs } from '../services/quranService';

interface TeacherDashboardProps {
    user: User;
}

type StudentWithAttendance = Student & { 
    attendance: AttendanceStatus;
    recitationLogged: boolean;
};

const AttendanceButton: React.FC<{
    status: AttendanceStatus;
    currentStatus: AttendanceStatus;
    onClick: (status: AttendanceStatus) => void;
    children: React.ReactNode;
}> = ({ status, currentStatus, onClick, children }) => {
    const baseClasses = "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200";
    const statusClasses = {
        'حاضر': 'bg-green-100 text-green-800 hover:bg-green-200',
        'غائب': 'bg-red-100 text-red-800 hover:bg-red-200',
        'متأخر': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
        'إجازة': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        'لم يحضر': 'bg-stone-100 text-stone-800 hover:bg-stone-200'
    };
    const activeClasses = {
        'حاضر': 'bg-green-600 text-white',
        'غائب': 'bg-red-600 text-white',
        'متأخر': 'bg-amber-500 text-white',
        'إجازة': 'bg-blue-500 text-white',
        'لم يحضر': 'bg-stone-500 text-white'
    };

    const isActive = status === currentStatus;

    return (
        <button onClick={() => onClick(status)} className={`${baseClasses} ${isActive ? activeClasses[status] : statusClasses[status]}`}>
            {children}
        </button>
    );
};


const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user }) => {
    const [students, setStudents] = useState<StudentWithAttendance[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [surahs, setSurahs] = useState<SurahInfo[]>([]);

    useEffect(() => {
        // Filter students for the current teacher and add attendance status
        const teacherStudents = mockStudents
            .filter(s => s.teacherId === user.id)
            .map(s => ({ ...s, attendance: 'لم يحضر' as AttendanceStatus, recitationLogged: false }));
        setStudents(teacherStudents);
        
        // Fetch surahs for the recitation modal
        getAllSurahs().then(setSurahs).catch(console.error);

    }, [user.id]);

    const handleAttendanceChange = (studentId: number, status: AttendanceStatus) => {
        setStudents(prevStudents =>
            prevStudents.map(s => s.id === studentId ? { ...s, attendance: status } : s)
        );
    };

    const handleOpenRecitationModal = (student: Student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleSaveRecitation = (studentId: number, newRecitation: string) => {
        let updatedStudent: StudentWithAttendance | undefined;
        
        // Mark recitation as logged for the student
        const newStudentsList = students.map(s => {
            if (s.id === studentId) {
                updatedStudent = { ...s, lastRecitation: newRecitation, recitationLogged: true };
                return updatedStudent;
            }
            return s;
        });

        // If the student was found, reorder the list
        if (updatedStudent) {
            const otherStudents = newStudentsList.filter(s => s.id !== studentId);
            const reorderedStudents = [...otherStudents, updatedStudent];
            setStudents(reorderedStudents);
        } else {
            setStudents(newStudentsList);
        }

        setIsModalOpen(false);
    };
    
    const today = new Date().toLocaleDateString('ar-EG-u-nu-latn', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div dir="rtl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-teal-800 md:text-4xl">واجهة المعلم</h1>
                <p className="text-stone-500 mt-1">{today}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map(student => (
                    <div key={student.id} className="bg-white p-4 rounded-xl shadow-lg border border-stone-200 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-stone-800">{student.name}</h3>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    {'حاضر': 'bg-green-100 text-green-800', 'غائب': 'bg-red-100 text-red-800', 'متأخر': 'bg-amber-100 text-amber-800', 'إجازة': 'bg-blue-100 text-blue-800', 'لم يحضر': 'bg-stone-100 text-stone-700'}[student.attendance]
                                }`}>
                                    {student.attendance}
                                </span>
                            </div>
                            <p className="text-sm text-stone-500 mt-1">آخر تسميع: {student.lastRecitation || 'لا يوجد'}</p>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                             <div className="mb-3">
                                <p className="text-xs font-medium text-stone-500 mb-2">تسجيل الحضور:</p>
                                <div className="flex flex-wrap gap-2">
                                    <AttendanceButton status="حاضر" currentStatus={student.attendance} onClick={(s) => handleAttendanceChange(student.id, s)}>حاضر</AttendanceButton>
                                    <AttendanceButton status="غائب" currentStatus={student.attendance} onClick={(s) => handleAttendanceChange(student.id, s)}>غائب</AttendanceButton>
                                    <AttendanceButton status="متأخر" currentStatus={student.attendance} onClick={(s) => handleAttendanceChange(student.id, s)}>متأخر</AttendanceButton>
                                    <AttendanceButton status="إجازة" currentStatus={student.attendance} onClick={(s) => handleAttendanceChange(student.id, s)}>إجازة</AttendanceButton>
                                </div>
                            </div>
                            
                            {student.recitationLogged ? (
                                <div className="w-full mt-2 bg-green-200 text-green-800 font-bold py-2 px-4 rounded-lg text-center transition duration-300">
                                    تم الرصد
                                </div>
                            ) : (
                                (student.attendance === 'حاضر' || student.attendance === 'متأخر') && (
                                    <button 
                                        onClick={() => handleOpenRecitationModal(student)}
                                        className="w-full mt-2 bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition"
                                    >
                                        رصد التسميع
                                    </button>
                                )
                            )}

                        </div>
                    </div>
                ))}
            </div>
            
            {selectedStudent && (
                 <RecitationModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    student={selectedStudent}
                    surahs={surahs}
                    onSave={handleSaveRecitation}
                />
            )}
        </div>
    );
};

export default TeacherDashboard;
