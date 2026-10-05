import React from 'react';

interface VerboLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'circle' | 'icon' | 'badge';
}

export const VerboLogo: React.FC<VerboLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  variant = 'circle',
}) => {
  const sizeMap = {
    xs: { img: 'w-6 h-6', text: 'text-xs', sub: 'text-[8px]' },
    sm: { img: 'w-8 h-8', text: 'text-sm', sub: 'text-[9px]' },
    md: { img: 'w-10 h-10', text: 'text-base', sub: 'text-[10px]' },
    lg: { img: 'w-14 h-14', text: 'text-xl', sub: 'text-xs' },
    xl: { img: 'w-20 h-20', text: 'text-2xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${currentSize.img} rounded-full overflow-hidden bg-white shadow-2xs shrink-0 border border-stone-200/80`}>
        <img
          src="/logo.png"
          alt="Verbo School"
          className="w-full h-full object-cover object-center select-none"
          loading="eager"
          onError={(e) => {
            // Elegant SVG fallback if image cannot be loaded
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-extrabold tracking-tight text-stone-900 dark:text-white ${currentSize.text}`}>
            VERBO <span className="text-indigo-600 dark:text-indigo-400">SCHOOL</span>
          </span>
          <span className={`font-serif tracking-widest uppercase text-stone-400 dark:text-slate-400 mt-0.5 font-bold ${currentSize.sub}`}>
            EST. 2026
          </span>
        </div>
      )}
    </div>
  );
};
