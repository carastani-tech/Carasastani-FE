import React from 'react';

/**
 * Reusable Carastani Brand Logo Component
 * Renders the brand name with consistent styling across the app
 */
const BrandLogo = ({
    size = 'md',
    animated = false,
    className = '',
    showTagline = false
}) => {
    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl',
        xl: 'text-4xl',
        '2xl': 'text-5xl'
    };

    const iconSizes = {
        sm: 'w-5 h-5 mr-1.5',
        md: 'w-7 h-7 mr-2',
        lg: 'w-8 h-8 mr-2.5',
        xl: 'w-10 h-10 mr-3',
        '2xl': 'w-12 h-12 mr-3.5'
    };

    return (
        <div className={`inline-flex flex-col ${className}`}>
            <div className={`flex items-center tracking-tight ${animated ? 'group cursor-pointer' : ''}`}>
                <img 
                    src="/logo.png" 
                    alt="Carastani Logo" 
                    className={`${iconSizes[size]} object-contain ${animated ? 'transition-transform duration-500 group-hover:rotate-180' : ''}`} 
                />
                <span className={`${sizeClasses[size]} flex items-center`}>
                    <span
                        className={`text-accent ${animated ? 'inline-block transition-transform duration-300 group-hover:-translate-y-0.5' : ''}`}
                        style={{ fontWeight: 800, letterSpacing: '-0.02em' }}
                    >
                        car
                    </span>
                    <span
                        className={`text-current ${animated ? 'inline-block transition-transform duration-300 group-hover:translate-x-0.5' : ''}`}
                        style={{ fontWeight: 700, letterSpacing: '-0.01em' }}
                    >
                        astani
                    </span>
                </span>
            </div>
            {showTagline && (
                <span className="text-xs text-gray-400 tracking-widest uppercase mt-1 pl-8">
                    Compare. Choose. Drive.
                </span>
            )}
        </div>
    );
};

/**
 * Inline brand text for use within sentences
 * Matches the brand styling but works inline
 */
export const BrandText = ({ className = '' }) => (
    <span className={`font-bold inline-flex items-center gap-1 ${className}`}>
        <img src="/logo.png" alt="Carastani Icon" className="w-[1.2em] h-[1.2em] object-contain" />
        <span>
            <span className="text-accent" style={{ fontWeight: 800 }}>car</span>
            <span style={{ fontWeight: 700 }}>astani</span>
        </span>
    </span>
);

export default BrandLogo;
