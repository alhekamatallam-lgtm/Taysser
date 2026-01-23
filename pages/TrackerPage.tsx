
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { SurahInfo, Ayah, RecitationLog, StudentProgress } from '../types';
import { RepeatMode } from '../types';
import { getAllSurahs, getAyahsForSurah } from '../services/quranService';
import { getTafsirForAyahs } from '../services/geminiService';
import { calculateLines } from '../services/quranMetaDataService';
import { QuranPlayer } from '../components/QuranPlayer';
import { Spinner } from '../components/Spinner';
import { TrackingDashboard } from '../components/TrackingDashboard';

export default function TrackerPage() {
  const [surahs, setSurahs] = useState<SurahInfo[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahInfo | null>(null);
  const [startAyah, setStartAyah] = useState('1');
  const [endAyah, setEndAyah] = useState('7');
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.None);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tafsir, setTafsir] = useState('');
  const [isTafsirLoading, setIsTafsirLoading] = useState(false);
  const [isTafsirVisible, setIsTafsirVisible] = useState(false);

  const [studentProgress, setStudentProgress] = useState<StudentProgress>({ surahNumber: 1, ayahNumber: 7 }); // Start after Al-Fatiha
  const [dailyPlan, setDailyPlan] = useState(15); // 15 lines (one page) per day
  const [recitationHistory, setRecitationHistory] = useState<RecitationLog[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const surahList = await getAllSurahs();
        setSurahs(surahList);
        setSelectedSurah(surahList[0]);
      } catch (err) {
        setError('فشل في تحميل قائمة السور');
      }
    }
    fetchSurahs();
  }, []);

  const handleFetchAyahs = useCallback(async () => {
    if (!selectedSurah) return;
    setIsLoading(true);
    setError(null);
    setAyahs([]);
    setIsPlaying(false);

    try {
      const start = parseInt(startAyah, 10);
      const end = parseInt(endAyah, 10);
      if (isNaN(start) || isNaN(end) || start <= 0 || end > selectedSurah.numberOfAyahs || start > end) {
        setError('الرجاء إدخال نطاق آيات صحيح');
        setIsLoading(false);
        return;
      }
      const fetchedAyahs = await getAyahsForSurah(selectedSurah.number);
      const slicedAyahs = fetchedAyahs.slice(start - 1, end);
      setAyahs(slicedAyahs);
      setCurrentAyahIndex(0);
    } catch (err) {
      setError('فشل في تحميل الآيات');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSurah, startAyah, endAyah]);

  useEffect(() => {
    if (surahs.length > 0 && selectedSurah && ayahs.length === 0) {
      handleFetchAyahs();
    }
  }, [surahs, selectedSurah, ayahs.length, handleFetchAyahs]);


  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setError("فشل تشغيل الصوت"));
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    if (repeatMode === RepeatMode.Ayah) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => setError("فشل تشغيل الصوت"));
      }
    } else {
      const isLastAyah = currentAyahIndex === ayahs.length - 1;
      if (isLastAyah) {
        if (repeatMode === RepeatMode.Range) {
          setCurrentAyahIndex(0);
        } else {
          setIsPlaying(false);
        }
      } else {
        setCurrentAyahIndex(prev => prev + 1);
      }
    }
  };

  const handleGetTafsir = async () => {
    if (!ayahs.length) return;
    setIsTafsirLoading(true);
    setTafsir('');
    try {
      const ayahsText = ayahs.map(a => a.text).join(' ');
      const result = await getTafsirForAyahs(ayahsText, selectedSurah?.name || '', startAyah, endAyah);
      setTafsir(result);
    } catch (err) {
      setTafsir('عذراً، حدث خطأ أثناء جلب التفسير.');
    } finally {
      setIsTafsirLoading(false);
    }
  };

  const handleToggleTafsir = () => {
    if (!isTafsirVisible && !tafsir) {
      handleGetTafsir();
    }
    setIsTafsirVisible(prev => !prev);
  };
  
  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const surahNumber = parseInt(e.target.value, 10);
    const surah = surahs.find(s => s.number === surahNumber);
    if(surah) {
      setSelectedSurah(surah);
      setStartAyah('1');
      setEndAyah(String(Math.min(7, surah.numberOfAyahs)));
    }
  };

  const handleLogRecitation = (startSurahNum: number, startAyahNum: number, endSurahNum: number, endAyahNum: number) => {
    const startSurahInfo = surahs.find(s => s.number === startSurahNum);
    const endSurahInfo = surahs.find(s => s.number === endSurahNum);

    if (!startSurahInfo || !endSurahInfo) {
        setError("السور المختارة غير صالحة.");
        return;
    }
    
    if (startSurahNum > endSurahNum || (startSurahNum === endSurahNum && startAyahNum > endAyahNum)) {
        setError("نقطة البداية يجب أن تكون قبل نقطة النهاية.");
        return;
    }

    const recitedCount = calculateLines(startSurahNum, startAyahNum, endSurahNum, endAyahNum, surahs);

    if (recitedCount < 0) {
        setError("لا يمكن حساب عدد الأسطر. البيانات لهذه الآيات غير متوفرة حالياً في هذا الإصدار التجريبي.");
        return;
    }

    const newHistoryEntry: RecitationLog = {
        date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }),
        startSurah: startSurahInfo.name,
        endSurah: endSurahInfo.name,
        startAyah: startAyahNum,
        endAyah: endAyahNum,
        recited: recitedCount,
        plan: dailyPlan
    };

    setRecitationHistory(prev => [newHistoryEntry, ...prev]);
    setStudentProgress({ surahNumber: endSurahNum, ayahNumber: endAyahNum });
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">مشغل القرآن</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col">
              <label htmlFor="surah-select" className="mb-2 font-medium text-stone-600">السورة</label>
              <select 
                id="surah-select"
                value={selectedSurah?.number || ''} 
                onChange={handleSurahChange}
                className="p-3 bg-stone-100 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              >
                {surahs.map(surah => (
                  <option key={surah.number} value={surah.number}>
                    {surah.number} - {surah.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="start-ayah" className="mb-2 font-medium text-stone-600">من آية</label>
              <input 
                type="number" 
                id="start-ayah"
                value={startAyah}
                onChange={e => setStartAyah(e.target.value)}
                min="1"
                max={selectedSurah?.numberOfAyahs}
                className="p-3 bg-stone-100 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="end-ayah" className="mb-2 font-medium text-stone-600">إلى آية</label>
              <input 
                type="number" 
                id="end-ayah"
                value={endAyah}
                onChange={e => setEndAyah(e.target.value)}
                min={startAyah}
                max={selectedSurah?.numberOfAyahs}
                className="p-3 bg-stone-100 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
          <button 
            onClick={handleFetchAyahs}
            disabled={isLoading}
            className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 ease-in-out disabled:bg-teal-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading && <Spinner />}
            {isLoading ? 'جاري التحميل...' : 'عرض الآيات'}
          </button>
        </div>

        {error && <div className="mt-4 bg-red-100 border-r-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">{error}</div>}

        {!isLoading && ayahs.length > 0 && (
          <QuranPlayer
            ayahs={ayahs}
            currentAyahIndex={currentAyahIndex}
            setCurrentAyahIndex={setCurrentAyahIndex}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            repeatMode={repeatMode}
            setRepeatMode={setRepeatMode}
            audioRef={audioRef}
            onPlayPause={handlePlayPause}
            onAudioEnded={handleAudioEnded}
            onToggleTafsir={handleToggleTafsir}
            isTafsirVisible={isTafsirVisible}
            isTafsirLoading={isTafsirLoading}
            tafsir={tafsir}
          />
        )}

        {surahs.length > 0 && (
           <TrackingDashboard
            studentProgress={studentProgress}
            dailyPlan={dailyPlan}
            recitationHistory={recitationHistory}
            onLogRecitation={handleLogRecitation}
            surahs={surahs}
          />
        )}
    </div>
  );
}
