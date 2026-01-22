
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export async function getTafsirForAyahs(ayahsText: string, surahName: string, startAyah: string, endAyah: string): Promise<string> {
    const model = 'gemini-3-flash-preview';

    const prompt = `
    أنت عالم في تفسير القرآن الكريم. مهمتك هي تقديم شرح واضح وموجز ومؤثر للآيات القرآنية لمساعدة المسلمين على فهمها وحفظها.
    
    اشرح الآيات التالية من سورة ${surahName} (الآيات ${startAyah} إلى ${endAyah}) شرحاً مبسطاً يركز على المعاني الأساسية والدروس المستفادة. اجعل الشرح مناسباً لشخص يريد أن يتدبر الآيات لتسهيل حفظها.
    
    الآيات:
    "${ayahsText}"
    
    ابدأ الشرح مباشرة دون مقدمات إضافية.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        if (response && response.text) {
            return response.text;
        } else {
            throw new Error("No text response from Gemini API");
        }
    } catch (error) {
        console.error("Error fetching tafsir from Gemini API:", error);
        throw new Error("Failed to generate tafsir.");
    }
}
