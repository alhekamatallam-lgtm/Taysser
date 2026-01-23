
import { GoogleGenAI } from "@google/genai";

// Cache for Tafsir results to save API tokens
const tafsirCache = new Map<string, string>();

export async function getTafsirForAyahs(ayahsText: string, surahName: string, startAyah: string, endAyah: string): Promise<string> {
    const cacheKey = `${surahName}-${startAyah}-${endAyah}`;
    if (tafsirCache.has(cacheKey)) {
        return tafsirCache.get(cacheKey)!;
    }

    // Creating instance inside the function to ensure the freshest API Key as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';

    const prompt = `
    أنت عالم في تفسير القرآن الكريم. مهمتك هي تقديم شرح واضح وموجز ومؤثر للآيات القرآنية.
    اشرح الآيات التالية من سورة ${surahName} (الآيات ${startAyah} إلى ${endAyah}) شرحاً مبسطاً يركز على المعاني الأساسية والدروس المستفادة.
    
    الآيات:
    "${ayahsText}"
    
    ابدأ الشرح مباشرة، واستخدم لغة رصينة وميسرة تناسب الحفظ.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 0.95,
                // Using a safe thinking budget if needed, but not required for simple text tasks
            }
        });

        const result = response.text || "تعذر الحصول على نص التفسير.";
        tafsirCache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error("Gemini Production Error:", error);
        // Fallback or retry logic can go here
        throw new Error("حدث خطأ في الاتصال بخدمة التدبر الذكي. يرجى المحاولة لاحقاً.");
    }
}
