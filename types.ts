
export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  audio: string;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
}

export enum RepeatMode {
    None = 'none',
    Ayah = 'ayah',
    Range = 'range',
}

export interface StudentProgress {
  surahNumber: number;
  ayahNumber: number;
}

export interface RecitationLog {
  date: string;
  startSurah: string;
  endSurah: string;
  startAyah: number;
  endAyah: number;
  recited: number;
  plan: number;
}

// Types for the dashboard
export type Role = 'Admin' | 'Teacher' | 'Supervisor';
export type Page = 'Dashboard' | 'Halaqat' | 'Teachers' | 'Supervisors' | 'Students' | 'Reports' | 'Tracker' | 'Users' | 'TeacherDashboard';
export type AttendanceStatus = 'حاضر' | 'غائب' | 'متأخر' | 'إجازة' | 'لم يحضر';

export interface User {
  id: number;
  username: string;
  password?: string; // Should not be stored in client-side state long-term
  role: Role;
}

export interface Halaqa {
  id: number;
  name: string;
  teacher: string;
  studentCount: number;
  period: 'صباحية' | 'مسائية';
}

export interface Teacher {
  id: number;
  name: string;
  phone: string;
  halaqa: string;
}

export interface Supervisor {
  id: number;
  name: string;
  role: 'مشرف تعليمي' | 'مشرف شؤون طلاب';
}

export interface Student {
  id: number;
  name: string;
  phone: string;
  guardianPhone: string;
  username: string;
  halaqa: string;
  teacherId?: number;
  lastRecitation?: string;
  plan: {
    lines: number;
    start: string;
    direction: 'من الفاتحة إلى الناس' | 'من الناس إلى الفاتحة';
  };
}
