
import React from 'react';

export const PlayIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const PauseIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

export const SkipNextIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);

export const SkipPreviousIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
);

export const RepeatIcon = ({ className = "w-6 h-6", active = false }: { className?: string, active?: boolean }) => (
  <svg className={`${className} ${active ? 'text-teal-500' : 'text-stone-500'}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
  </svg>
);

export const RepeatOneIcon = ({ className = "w-6 h-6", active = false }: { className?: string, active?: boolean }) => (
    <svg className={`${className} ${active ? 'text-teal-500' : 'text-stone-500'}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2h-1v-4h-1v5h2v1h-3v-2h1v-3h-1v-2h3v1z" />
    </svg>
);

export const BookOpenIcon = ({ className = "w-5 h-5 ml-2" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm2 0v12h6V4H7z" />
        <path d="M3 4a1 1 0 011-1h1v14H4a1 1 0 01-1-1V4zm14 0a1 1 0 00-1-1h-1v14h1a1 1 0 001-1V4z" />
    </svg>
);
