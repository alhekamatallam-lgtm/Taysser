
import type { SurahInfo, Ayah } from '../types';

const API_BASE_URL = 'https://api.alquran.cloud/v1';

// Caches
let surahsCache: SurahInfo[] | null = null;
const ayahsCache = new Map<number, Ayah[]>();

export async function getAllSurahs(): Promise<SurahInfo[]> {
  if (surahsCache) {
    return surahsCache;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/surah`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.code !== 200 || !Array.isArray(data.data)) {
      throw new Error('Invalid API response for surahs');
    }
    surahsCache = data.data;
    return surahsCache!;
  } catch (error) {
    console.error("Failed to fetch surahs:", error);
    throw error;
  }
}

export async function getAyahsForSurah(surahNumber: number): Promise<Ayah[]> {
  if (ayahsCache.has(surahNumber)) {
    return ayahsCache.get(surahNumber)!;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,ar.alafasy`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.code !== 200 || !Array.isArray(data.data) || data.data.length < 2) {
      throw new Error('Invalid API response for ayahs');
    }

    const textData = data.data[0];
    const audioData = data.data[1];

    if (textData.ayahs.length !== audioData.ayahs.length) {
      throw new Error('Mismatch in ayah count between text and audio editions');
    }

    const combinedAyahs: Ayah[] = textData.ayahs.map((ayahText: any, index: number) => ({
      ...ayahText,
      audio: audioData.ayahs[index].audio,
    }));

    ayahsCache.set(surahNumber, combinedAyahs);
    return combinedAyahs;
  } catch (error) {
    console.error(`Failed to fetch ayahs for surah ${surahNumber}:`, error);
    throw error;
  }
}
