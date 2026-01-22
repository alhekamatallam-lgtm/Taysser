
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { SurahInfo, Ayah } from './types';
import { RepeatMode } from './types';
import { getAllSurahs, getAyahsForSurah } from './services/quranService';
import { getTafsirForAyahs } from './services/geminiService';
import { QuranPlayer } from './components/QuranPlayer';
import { Spinner } from './components/Spinner';

export default function App() {
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

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const surahList = await getAllSurahs();
        setSurahs(surahList);
        setSelectedSurah(surahList[0]); // Set Al-Fatiha as default
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
    setTafsir('');
    setIsTafsirVisible(false);

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
    // Automatically load Al-Fatiha on initial load
    if (surahs.length > 0 && ayahs.length === 0) {
      handleFetchAyahs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahs, handleFetchAyahs]);


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
    setIsTafsirVisible(true);
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

  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const surahNumber = parseInt(e.target.value, 10);
    const surah = surahs.find(s => s.number === surahNumber);
    if(surah) {
      setSelectedSurah(surah);
      setStartAyah('1');
      setEndAyah(String(Math.min(7, surah.numberOfAyahs))); // Default to 7 or less
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen text-gray-800">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-teal-800">التيسير في حفظ القرآن الكريم</h1>
      </header>
      
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">اختر السورة والآيات</h2>
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
            onGetTafsir={handleGetTafsir}
            isTafsirVisible={isTafsirVisible}
            isTafsirLoading={isTafsirLoading}
            tafsir={tafsir}
          />
        )}
      </main>
      <footer className="text-center p-4 text-stone-500 text-sm">
        <p>صُنع بحب للمساعدة في حفظ كتاب الله</p>
      </footer>
    </div>
  );
}
