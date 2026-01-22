
import type { SurahInfo } from '../types';

export interface AyahLocation {
    page: number;
    line: number;
}

// This data represents the starting page and line for each ayah in the 15-line Madinah Mushaf.
// Data is simplified for demonstration. A full app would need a complete, validated dataset.
const AYAH_LOCATIONS: { [surah: number]: { [ayah: number]: AyahLocation } } = {
    1: { // Al-Fatihah
        1: { page: 1, line: 1 }, // Bismillah
        2: { page: 1, line: 3 },
        3: { page: 1, line: 4 },
        4: { page: 1, line: 5 },
        5: { page: 1, line: 6 },
        6: { page: 1, line: 7 },
        7: { page: 1, line: 8 },
    },
    2: { // Al-Baqarah
        1: { page: 2, line: 1 },
        2: { page: 2, line: 2 },
        3: { page: 2, line: 3 },
        4: { page: 2, line: 4 },
        5: { page: 2, line: 5 },
        6: { page: 3, line: 1 },
        7: { page: 3, line: 3 },
        8: { page: 3, line: 4 },
        9: { page: 3, line: 5 },
        10: { page: 3, line: 6 },
        11: { page: 3, line: 8 },
        12: { page: 3, line: 9 },
        13: { page: 3, line: 10 },
        14: { page: 3, line: 12 },
        15: { page: 3, line: 13 },
        16: { page: 3, line: 14 },
        17: { page: 4, line: 1 },
    }
};

function getAyahLocation(surah: number, ayah: number): AyahLocation | null {
    // A production app should have a full dataset. We simulate a lookup here.
    if (AYAH_LOCATIONS[surah]?.[ayah]) {
        return AYAH_LOCATIONS[surah][ayah];
    }
    // Fallback for missing data in this demo
    if (surah === 2 && ayah > 17) {
        // Rough programmatic generation for demo purposes
        let lastKnownAyah = 17;
        let loc = { ...AYAH_LOCATIONS[2][lastKnownAyah] };
        while(lastKnownAyah < ayah) {
            loc.line += 2; // Assume 2 lines per ayah on average
            if (loc.line > 15) {
                loc.page++;
                loc.line = loc.line - 15;
            }
            lastKnownAyah++;
        }
        return loc;
    }
    return null;
}

export function calculateLines(startSurah: number, startAyah: number, endSurah: number, endAyah: number, surahs: SurahInfo[]): number {
    const endSurahInfo = surahs.find(s => s.number === endSurah);
    if (!endSurahInfo) return -1;

    let nextAyah = endAyah + 1;
    let nextSurah = endSurah;

    if (nextAyah > endSurahInfo.numberOfAyahs) {
        nextAyah = 1;
        nextSurah = endSurah + 1;
        // Handle end of Quran
        if (nextSurah > 114) {
            nextSurah = -1; // Flag to indicate end
        }
    }

    const startLoc = getAyahLocation(startSurah, startAyah);
    let endBoundaryLoc: AyahLocation | null;

    if (nextSurah === -1) {
        // It's the end of the Quran, approximate the end line of the last ayah
        const endLoc = getAyahLocation(endSurah, endAyah);
        if (endLoc) {
            endBoundaryLoc = { page: endLoc.page, line: endLoc.line + 2 }; // Assume 2 lines
             if (endBoundaryLoc.line > 15) {
                endBoundaryLoc.page += 1;
                endBoundaryLoc.line = 1;
            }
        } else {
            endBoundaryLoc = null;
        }
    } else {
        endBoundaryLoc = getAyahLocation(nextSurah, nextAyah);
    }
    
    if (!startLoc || !endBoundaryLoc) {
        console.error("Could not find location data for the given range.");
        return -1;
    }

    const startPage = startLoc.page;
    const startLine = startLoc.line;
    const endPage = endBoundaryLoc.page;
    const endLine = endBoundaryLoc.line;

    if (startPage === endPage) {
        return endLine - startLine;
    }

    const linesOnStartPage = 15 - startLine + 1;
    const linesOnIntermediatePages = (endPage - startPage - 1) * 15;
    const linesOnEndPage = endLine - 1;
    
    const totalLines = linesOnStartPage + linesOnIntermediatePages + linesOnEndPage;

    return totalLines > 0 ? totalLines : 1; // Ensure at least 1 line is counted
}
