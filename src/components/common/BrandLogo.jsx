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

    return (
        <div className={`inline-flex flex-col ${className}`}>
            <span
                className={`
                    font-bold tracking-tight
                    ${sizeClasses[size]}
                    ${animated ? 'group' : ''}
                `}
            >
                <span
                    className={`
                        text-accent
                        ${animated ? 'inline-block transition-transform duration-300 group-hover:scale-110' : ''}
                    `}
                    style={{
                        fontWeight: 800,
                        letterSpacing: '-0.02em'
                    }}
                >
                    car
                </span>
                <span
                    className={`
                        text-current
                        ${animated ? 'inline-block transition-transform duration-300 group-hover:translate-x-0.5' : ''}
                    `}
                    style={{
                        fontWeight: 700,
                        letterSpacing: '-0.01em'
                    }}
                >
                    astani
                </span>
            </span>
            {showTagline && (
                <span className="text-xs text-gray-400 tracking-widest uppercase mt-1">
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
    <span className={`font-bold ${className}`}>
        <span className="text-accent" style={{ fontWeight: 800 }}>car</span>
        <span style={{ fontWeight: 700 }}>astani</span>
    </span>
);

export default BrandLogo;
