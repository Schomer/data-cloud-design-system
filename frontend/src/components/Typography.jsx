import React from 'react';
import { useEditor } from '../context/EditorContext';

/**
 * Centered Typography component that consumes global specifications.
 * Supports all variants defined in the design system.
 */
export default function Typography({
    variant = 'p',
    children,
    className = '',
    style = {},
    as, // Optional tag override
    ...props
}) {
    const { theme, globalSpecs } = useEditor();
    const typoSpec = globalSpecs?.[theme]?.typography?.[variant];

    if (!typoSpec) {
        // Fallback to basic tag if variant not found
        const Tag = as || 'p';
        return <Tag className={className} style={style} {...props}>{children}</Tag>;
    }

    // Determine the HTML tag to use
    const Tag = as || (variant.startsWith('h') && variant.length === 2 ? variant : 'p');

    const combinedStyle = {
        ...(typoSpec.fontSize && { fontSize: `${typoSpec.fontSize}px` }),
        ...(typoSpec.fontWeight && { fontWeight: typoSpec.fontWeight }),
        ...(typoSpec.fontFamily && { fontFamily: typoSpec.fontFamily }),
        ...(typoSpec.color && { color: typoSpec.color }),
        ...(typoSpec.letterSpacing && { letterSpacing: typoSpec.letterSpacing }),
        ...(typoSpec.lineHeight && { lineHeight: typoSpec.lineHeight }),
        textTransform: typoSpec.textTransform || 'none',
        fontStyle: typoSpec.fontStyle || 'normal',
        textDecoration: typoSpec.textDecoration || 'none',
        ...(typoSpec.bg && { backgroundColor: typoSpec.bg }),
        ...style
    };

    return (
        <Tag
            className={`transition-colors duration-200 ${className}`}
            style={combinedStyle}
            {...props}
        >
            {children || typoSpec.content}
        </Tag>
    );
}
