import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';

/**
 * Centered Button component that consumes global specifications.
 * Supports variants: primary, secondary, ghost, destructive.
 */
export default function Button({
    variant = 'primary',
    children,
    className = '',
    style = {},
    ...props
}) {
    const { theme, globalSpecs } = useEditor();
    const btnSpec = globalSpecs[theme]?.button;

    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    if (!btnSpec) {
        return <button className={className} style={style} {...props}>{children}</button>;
    }

    const typoSpec = btnSpec.typographyVariant ? globalSpecs[theme]?.typography?.[btnSpec.typographyVariant] : null;

    // Base styles from global specs
    let baseStyles = {
        borderRadius: `${btnSpec.borderRadius}px`,
        padding: `${btnSpec.paddingY}px ${btnSpec.paddingX}px`,
        fontWeight: typoSpec?.fontWeight || btnSpec.fontWeight,
        fontSize: typoSpec ? `${typoSpec.fontSize}px` : undefined,
        fontFamily: typoSpec?.fontFamily,
        letterSpacing: typoSpec?.letterSpacing,
        lineHeight: typoSpec?.lineHeight,
        textTransform: typoSpec?.textTransform,
        transition: 'all 0.2s transition-colors',
    };

    // Variant specific styles
    let variantStyles = {};
    const label = children || btnSpec[`${variant}Label`];

    switch (variant) {
        case 'primary':
            variantStyles = {
                backgroundColor: isHovered ? btnSpec.primaryHoverBg : btnSpec.primaryBg,
                color: btnSpec.primaryText,
                border: 'none',
            };
            break;
        case 'secondary':
            variantStyles = {
                backgroundColor: isHovered ? btnSpec.secondaryHoverBg : btnSpec.secondaryBg,
                color: btnSpec.secondaryText,
                border: `1px solid ${btnSpec.secondaryBorder}`,
            };
            break;
        case 'destructive':
            variantStyles = {
                backgroundColor: isHovered ? btnSpec.destructiveHoverBg : btnSpec.destructiveBg,
                color: btnSpec.destructiveText,
                border: 'none',
            };
            break;
        case 'ghost':
            variantStyles = {
                backgroundColor: isHovered ? btnSpec.ghostHoverBg : 'transparent',
                color: btnSpec.ghostText,
                border: 'none',
            };
            break;
        default:
            break;
    }

    if (isActive) {
        variantStyles.transform = 'scale(0.98)';
        variantStyles.opacity = '0.9';
    }

    const combinedStyle = { ...baseStyles, ...variantStyles, ...style };

    // Tailwind-like hover classes are hard to do with inline styles for dynamic values
    // but we can use CSS variables or just standard Tailwind for the bits that aren't dynamic
    // For now, these buttons will use the dynamic values from context.

    return (
        <button
            className={`flex items-center justify-center gap-2 disabled:opacity-50 transition-colors ${className}`}
            style={combinedStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            onTouchStart={() => setIsActive(true)}
            onTouchEnd={() => setIsActive(false)}
            {...props}
        >
            {label}
        </button>
    );
}
