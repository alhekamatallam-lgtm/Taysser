
import React, { useEffect } from 'react';
import type { Ayah } from '../types';
import { RepeatMode } from '../types';
import { PlayIcon, PauseIcon, SkipNextIcon, SkipPreviousIcon, RepeatIcon, RepeatOneIcon, BookOpenIcon } from './IconComponents';

interface QuranPlayerProps {
    ayahs: Ayah[];
    currentAyahIndex: number;
    setCurrentAyahIndex: (index: number) => void;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    repeatMode: RepeatMode;
    setRepeatMode: (mode: RepeatMode) => void;
    audioRef: React.RefObject<HTMLAudioElement>;
    onPlayPause: () => void;
    onAudioEnded: () => void;
    onToggleTafsir: () => void;
    isTafsirVisible: boolean;
    isTafsirLoading: boolean;
    tafsir: string;
}

export const QuranPlayer: React.FC<QuranPlayerProps> = ({
    ayahs,
    currentAyahIndex,
    setCurrentAyahIndex,
    isPlaying,
    setIsPlaying,
    repeatMode,
    setRepeatMode,
    audioRef,
    onPlayPause,
    onAudioEnded,
    onToggleTafsir,
    isTafsirVisible,
    isTafsirLoading,
    tafsir
}) => {
    
    const currentAyah = ayahs[currentAyahIndex];

    useEffect(() => {
        if (audioRef.current && currentAyah) {
            audioRef.current.src = currentAyah.audio;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Error playing audio:", e));
            }
        }
    }, [currentAyah, audioRef, isPlaying]);

    const handleNext = () => {
        if (currentAyahIndex < ayahs.length - 1) {
            setCurrentAyahIndex(currentAyahIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentAyahIndex > 0) {
            setCurrentAyahIndex(currentAyahIndex - 1);
        }
    };
    
    const toggleRepeatMode = () => {
        const modes = [RepeatMode.None, RepeatMode.Range, RepeatMode.Ayah];
        const currentIndex = modes.indexOf(repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setRepeatMode(modes[nextIndex]);
    };

    const RepeatButton = () => {
        switch (repeatMode) {
            case RepeatMode.Ayah:
                return <RepeatOneIcon active={true} />;
            case RepeatMode.Range:
                return <RepeatIcon active={true} />;
            default:
                return <RepeatIcon />;
        }
    };

    const formatTafsir = (text: string) => {
      return text.split('\n').map((line, index) => (
        <p key={index} className="mb-4 leading-relaxed">{line}</p>
      ));
    };

    return (
        <div className="mt-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200 text-center">
                <p className="text-lg text-stone-500 mb-4">
                    الآية {currentAyah.numberInSurah} من {ayahs.length}
                </p>
                <p 
                  className="arabic-text text-3xl md:text-4xl lg:text-5xl leading-loose md:leading-loose lg:leading-loose text-stone-800 px-4 py-8 min-h-[150px] flex items-center justify-center"
                  aria-live="polite"
                >
                    {currentAyah.text}
                </p>

                <audio ref={audioRef} onEnded={onAudioEnded} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                
                <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse mt-6">
                    <button onClick={toggleRepeatMode} title="تغيير وضع التكرار" className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                       <RepeatButton />
                    </button>
                    <button onClick={handlePrevious} disabled={currentAyahIndex === 0} title="الآية السابقة" className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-700 disabled:text-stone-300 disabled:cursor-not-allowed">
                        <SkipPreviousIcon />
                    </button>
                    <button onClick={onPlayPause} title={isPlaying ? "إيقاف مؤقت" : "تشغيل"} className="bg-teal-600 text-white rounded-full p-4 hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all">
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button onClick={handleNext} disabled={currentAyahIndex === ayahs.length - 1} title="الآية التالية" className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-700 disabled:text-stone-300 disabled:cursor-not-allowed">
                        <SkipNextIcon />
                    </button>
                    <button onClick={onToggleTafsir} title="إظهار/إخفاء التفسير" className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                        <BookOpenIcon className={`w-6 h-6 transition-colors ${isTafsirVisible ? 'text-teal-500' : 'text-stone-500'}`}/>
                    </button>
                </div>
            </div>
            
            {isTafsirVisible && (
                <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border border-stone-200 animate-fade-in">
                    <h3 className="text-xl font-bold mb-4 text-teal-700 arabic-text">تفسير الآيات</h3>
                    {isTafsirLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                        </div>
                    ) : (
                        <div className="text-stone-700 arabic-text text-lg leading-loose prose max-w-none">
                            {formatTafsir(tafsir)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
