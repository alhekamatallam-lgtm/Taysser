
import React, { useEffect, useState } from 'react';
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
    const [audioLoading, setAudioLoading] = useState(false);
    const currentAyah = ayahs[currentAyahIndex];

    useEffect(() => {
        if (audioRef.current && currentAyah) {
            setAudioLoading(true);
            audioRef.current.src = currentAyah.audio;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Play prevented:", e));
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
        const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
        setRepeatMode(nextMode);
    };

    return (
        <div className="mt-8 animate-fade-in">
            <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-xl border border-stone-200 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                        {repeatMode === RepeatMode.Ayah ? 'تكرار الآية' : repeatMode === RepeatMode.Range ? 'تكرار النطاق' : 'تشغيل متتالي'}
                    </span>
                </div>

                <p className="text-sm font-medium text-stone-400 mb-6 uppercase tracking-widest">
                    الآية {currentAyah.numberInSurah} من {ayahs.length}
                </p>
                
                <div className="relative min-h-[180px] flex items-center justify-center">
                    <p className="arabic-text text-3xl md:text-5xl lg:text-6xl text-stone-800 px-2 leading-[1.8] md:leading-[1.8]">
                        {currentAyah.text}
                    </p>
                </div>

                <audio 
                    ref={audioRef} 
                    onEnded={onAudioEnded} 
                    onPlay={() => setIsPlaying(true)} 
                    onPause={() => setIsPlaying(false)}
                    onCanPlay={() => setAudioLoading(false)}
                    onWaiting={() => setAudioLoading(true)}
                />
                
                <div className="flex items-center justify-center gap-4 md:gap-8 mt-10">
                    <button onClick={toggleRepeatMode} className="p-3 rounded-full hover:bg-stone-100 transition-colors" title="وضع التكرار">
                       {repeatMode === RepeatMode.Ayah ? <RepeatOneIcon active /> : <RepeatIcon active={repeatMode === RepeatMode.Range} />}
                    </button>
                    
                    <button onClick={handlePrevious} disabled={currentAyahIndex === 0} className="p-3 rounded-full hover:bg-stone-100 disabled:opacity-30 transition-all">
                        <SkipPreviousIcon />
                    </button>

                    <button 
                        onClick={onPlayPause} 
                        className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transform active:scale-95 transition-all ${isPlaying ? 'bg-stone-800' : 'bg-teal-600 hover:bg-teal-700'}`}
                    >
                        {audioLoading ? (
                            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isPlaying ? (
                            <PauseIcon className="w-10 h-10" />
                        ) : (
                            <PlayIcon className="w-10 h-10" />
                        )}
                    </button>

                    <button onClick={handleNext} disabled={currentAyahIndex === ayahs.length - 1} className="p-3 rounded-full hover:bg-stone-100 disabled:opacity-30 transition-all">
                        <SkipNextIcon />
                    </button>

                    <button onClick={onToggleTafsir} className={`p-3 rounded-full transition-all ${isTafsirVisible ? 'bg-teal-50 text-teal-600' : 'hover:bg-stone-100'}`} title="التفسير">
                        <BookOpenIcon className="w-7 h-7" />
                    </button>
                </div>
            </div>
            
            {isTafsirVisible && (
                <div className="mt-6 bg-white p-8 rounded-[2rem] shadow-lg border border-teal-100 animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-8 bg-teal-500 rounded-full"></div>
                        <h3 className="text-2xl font-bold text-teal-900">بصيرة الآيات</h3>
                    </div>
                    {isTafsirLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
                            <p className="text-teal-600 animate-pulse font-medium">يتدبر المساعد في معاني الآيات...</p>
                        </div>
                    ) : (
                        <div className="text-stone-700 arabic-text text-xl leading-[2] md:leading-[2.2] space-y-4">
                            {tafsir.split('\n').filter(line => line.trim()).map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
