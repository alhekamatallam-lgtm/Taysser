
import React, { useState, useEffect } from 'react';
import type { Student, SurahInfo } from '../types';
import { Modal } from './Modal';
import { calculateLines } from '../services/quranMetaDataService';

interface RecitationModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student;
    surahs: SurahInfo[];
    onSave: (studentId: number, newRecitation: string) => void;
}

export const RecitationModal: React.FC<RecitationModalProps> = ({ isOpen, onClose, student, surahs, onSave }) => {
    const [startSurahNum, setStartSurahNum] = useState(1);
    const [startAyah, setStartAyah] = useState('');
    const [endSurahNum, setEndSurahNum] = useState(1);
    const [endAyah, setEndAyah] = useState('');
    const [recitedLines, setRecitedLines] = useState(0);
    const [error, setError] = useState('');
    
    useEffect(() => {
        // Reset form when modal opens or student changes
        if(isOpen) {
            setStartSurahNum(1);
            setStartAyah('');
            setEndSurahNum(1);
            setEndAyah('');
            setRecitedLines(0);
            setError('');
        }
    }, [isOpen, student]);

    useEffect(() => {
        // Auto-calculate lines
        const sAyah = parseInt(startAyah, 10);
        const eAyah = parseInt(endAyah, 10);

        if (!isNaN(sAyah) && !isNaN(eAyah) && sAyah > 0 && eAyah > 0 && surahs.length > 0) {
            if (startSurahNum > endSurahNum || (startSurahNum === endSurahNum && sAyah > eAyah)) {
                 setError("البداية يجب أن تكون قبل النهاية");
                 setRecitedLines(0);
                 return;
            }
            const lines = calculateLines(startSurahNum, sAyah, endSurahNum, eAyah, surahs);
            if (lines > 0) {
                setRecitedLines(lines);
                setError('');
            } else {
                setRecitedLines(0);
            }
        } else {
            setRecitedLines(0);
            setError('');
        }
    }, [startSurahNum, startAyah, endSurahNum, endAyah, surahs]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (recitedLines > 0 && !error) {
            const startSurahName = surahs.find(s => s.number === startSurahNum)?.name || '';
            const endSurahName = surahs.find(s => s.number === endSurahNum)?.name || '';
            const recitationString = startSurahNum === endSurahNum
                ? `${startSurahName}: ${startAyah}-${endAyah}`
                : `${startSurahName}: ${startAyah} - ${endSurahName}: ${endAyah}`;
            onSave(student.id, recitationString);
        } else {
            setError("الرجاء إدخال نطاق صحيح للتسميع.")
        }
    };
    
    const startSurahInfo = surahs.find(s => s.number === startSurahNum);
    const endSurahInfo = surahs.find(s => s.number === endSurahNum);

    return (
        <Modal title={`رصد تسميع: ${student.name}`} isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <fieldset className="border p-3 rounded-lg">
                        <legend className="px-2 text-sm font-medium text-stone-600">من</legend>
                        <div className="space-y-2">
                            <select value={startSurahNum} onChange={e => setStartSurahNum(Number(e.target.value))} className="w-full p-2 bg-stone-50 border border-stone-300 rounded-md">
                                {surahs.map(s => <option key={s.number} value={s.number}>{s.number}. {s.name}</option>)}
                            </select>
                            <input type="number" value={startAyah} onChange={e => setStartAyah(e.target.value)} placeholder="آية" min="1" max={startSurahInfo?.numberOfAyahs} className="w-full p-2 bg-stone-50 border border-stone-300 rounded-md" required/>
                        </div>
                     </fieldset>
                     <fieldset className="border p-3 rounded-lg">
                        <legend className="px-2 text-sm font-medium text-stone-600">إلى</legend>
                        <div className="space-y-2">
                             <select value={endSurahNum} onChange={e => setEndSurahNum(Number(e.target.value))} className="w-full p-2 bg-stone-50 border border-stone-300 rounded-md">
                                {surahs.map(s => <option key={s.number} value={s.number}>{s.number}. {s.name}</option>)}
                            </select>
                            <input type="number" value={endAyah} onChange={e => setEndAyah(e.target.value)} placeholder="آية" min="1" max={endSurahInfo?.numberOfAyahs} className="w-full p-2 bg-stone-50 border border-stone-300 rounded-md" required/>
                        </div>
                     </fieldset>
                </div>
                
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                
                <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-sm text-green-600">مجموع الأسطر المحسوبة</p>
                    <p className="text-2xl font-bold text-green-800">{recitedLines} أسطر</p>
                </div>

                <button type="submit" className="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-teal-400" disabled={recitedLines === 0 || !!error}>
                    حفظ الرصد
                </button>
            </form>
        </Modal>
    );
};
