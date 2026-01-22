import React from 'react';

// Player Icons
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

// Dashboard & Sidebar Icons
// FIX: Using React.FC to make the `children` prop optional, resolving a typing issue
// with React.cloneElement which doesn't correctly pass through children for type checking.
const IconWrapper: React.FC<{ className?: string }> = ({ children, className }) => (
  <svg className={className || "w-6 h-6 ml-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
);

// FIX: Changed icon components to use React.FC to resolve typing errors when using React.cloneElement, which was causing a "missing children" error.
export const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconWrapper className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
  </IconWrapper>
);

export const HalaqaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.001 3.001 0 015.688 0M12 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconWrapper>
);

export const TeacherIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </IconWrapper>
);

export const SupervisorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </IconWrapper>
);

export const StudentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        {/* FIX: Added fill="currentColor" to the path to make the icon visible, as the parent IconWrapper sets fill="none" by default. */}
        <path fill="currentColor" fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </IconWrapper>
);

export const ReportIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </IconWrapper>
);

export const TrackerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </IconWrapper>
);