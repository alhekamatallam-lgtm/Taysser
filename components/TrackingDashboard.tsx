
import React, { useState, useMemo, useEffect } from 'react';
import type { StudentProgress, RecitationLog, SurahInfo } from '../types';
import { ProgressChart } from './ProgressChart';

interface TrackingDashboardProps {
    studentProgress: StudentProgress;
    dailyPlan: number;
    recitationHistory: RecitationLog[];
    onLogRecitation: (startSurah: number, startAyah: number, endSurah: number, endAyah: number) => void;
    surahs: SurahInfo[];
}

export const TrackingDashboard: React.FC<TrackingDashboardProps> = ({
    studentProgress,
    dailyPlan,
    recitationHistory,
    onLogRecitation,
    surahs
}) => {
    const [startSurahNum, setStartSurahNum] = useState(studentProgress.surahNumber);
    const [startAyah, setStartAyah] = useState('');
    const [endSurahNum, setEndSurahNum] = useState(studentProgress.surahNumber);
    const [endAyah, setEndAyah] = useState('');

    useEffect(() => {
        const currentSurahInfo = surahs.find(s => s.number === studentProgress.surahNumber);
        if (!currentSurahInfo) return;

        const suggestedStartAyah = studentProgress.ayahNumber + 1;
        
        if (suggestedStartAyah > currentSurahInfo.numberOfAyahs) {
            const nextSurah = studentProgress.surahNumber + 1;
            setStartSurahNum(nextSurah);
            setStartAyah('1');
            setEndSurahNum(nextSurah);
        } else {
            setStartSurahNum(studentProgress.surahNumber);
            setStartAyah(String(suggestedStartAyah));
            setEndSurahNum(studentProgress.surahNumber);
        }
        setEndAyah('');
    }, [studentProgress, surahs]);

    const startSurahInfo = useMemo(() => surahs.find(s => s.number === startSurahNum), [startSurahNum, surahs]);
    const endSurahInfo = useMemo(() => surahs.find(s => s.number === endSurahNum), [endSurahNum, surahs]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const startAyahNum = parseInt(startAyah, 10);
        const endAyahNum = parseInt(endAyah, 10);
        
        if (isNaN(startAyahNum) || isNaN(endAyahNum) || startAyahNum <= 0 || endAyahNum <= 0) {
            return; 
        }
        onLogRecitation(startSurahNum, startAyahNum, endSurahNum, endAyahNum);
        setEndAyah('');
    };
    
    const latestRecitation = recitationHistory[0];

    const currentSurahName = useMemo(() => {
        return surahs.find(s => s.number === studentProgress.surahNumber)?.name || '';
    }, [studentProgress.surahNumber, surahs]);


    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-stone-200">
            <h2 className="text-xl font-bold mb-4 text-teal-700">لوحة متابعة الحفظ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-right">
                <div className="bg-stone-100 p-4 rounded-lg">
                    <p className="text-sm text-stone-500 font-medium">اسم الطالب (مثال)</p>
                    <p className="text-lg font-bold text-stone-800">عبد الله</p>
                </div>
                 <div className="bg-stone-100 p-4 rounded-lg">
                    <p className="text-sm text-stone-500 font-medium">آخر ما تم حفظه</p>
                    <p className="text-lg font-bold text-stone-800">
                        سورة {currentSurahName}، آية {studentProgress.ayahNumber}
                    </p>
                </div>
            </div>

             <div className="mt-6 border-t pt-6">
                <h3 className="font-bold text-lg text-stone-700 mb-4">خطة اليوم</h3>
                 <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-sm text-green-600">الخطة اليومية</p>
                    <p className="text-2xl font-bold text-green-800">{dailyPlan} أسطر</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 border-t pt-6">
                <h3 className="font-bold text-lg text-stone-700 mb-4">رصد تسميع جديد</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-medium text-stone-600">البداية</legend>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="start-surah" className="sr-only">سورة البداية</label>
                                <select id="start-surah" value={startSurahNum} onChange={e => setStartSurahNum(Number(e.target.value))} className="w-full p-3 bg-stone-100 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition">
                                    {surahs.map(s => <option key={s.number} value={s.number}>{s.number} - {s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="start-ayah" className="sr-only">آية البداية</label>
                                <input type="number" id="start-ayah" value={startAyah} onChange={e => setStartAyah(e.target.value)} required min="1" max={startSurahInfo?.numberOfAyahs} className="w-full p-3 bg-stone-100 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" placeholder="رقم الآية" />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-medium text-stone-600">النهاية</legend>
                         <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="end-surah" className="sr-only">سورة النهاية</label>
                                <select id="end-surah" value={endSurahNum} onChange={e => setEndSurahNum(Number(e.target.value))} className="w-full p-3 bg-stone-100 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition">
                                    {surahs.map(s => <option key={s.number} value={s.number}>{s.number} - {s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="end-ayah" className="sr-only">آية النهاية</label>
                                <input type="number" id="end-ayah" value={endAyah} onChange={e => setEndAyah(e.target.value)} required min="1" max={endSurahInfo?.numberOfAyahs} className="w-full p-3 bg-stone-100 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" placeholder="رقم الآية" />
                            </div>
                        </div>
                    </fieldset>
                </div>
                <button type="submit" className="mt-6 w-full bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition">
                    رصد وحفظ
                </button>
            </form>

            {latestRecitation && (
                <div className="mt-6 border-t pt-6">
                    <h3 className="font-bold text-lg text-stone-700 mb-2">إنجاز آخر تسميع</h3>
                    <ProgressChart plan={latestRecitation.plan} actual={latestRecitation.recited} unit="أسطر" />
                </div>
            )}
            
            {recitationHistory.length > 0 && (
                <div className="mt-6 border-t pt-6">
                    <h3 className="font-bold text-lg text-stone-700 mb-4">سجل التسميع</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right text-stone-600">
                            <thead className="text-xs text-stone-700 uppercase bg-stone-100">
                                <tr>
                                    <th scope="col" className="px-4 py-3">التاريخ</th>
                                    <th scope="col" className="px-4 py-3">من</th>
                                    <th scope="col" className="px-4 py-3">إلى</th>
                                    <th scope="col" className="px-4 py-3">المقدار</th>
                                    <th scope="col" className="px-4 py-3">الخطة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recitationHistory.map((log, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-stone-50">
                                        <td className="px-4 py-4 font-medium text-stone-900 whitespace-nowrap">{log.date}</td>
                                        <td className="px-4 py-4">{log.startSurah} ({log.startAyah})</td>
                                        <td className="px-4 py-4">{log.endSurah} ({log.endAyah})</td>
                                        <td className="px-4 py-4 font-bold">{log.recited}</td>
                                        <td className="px-4 py-4">{log.plan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
