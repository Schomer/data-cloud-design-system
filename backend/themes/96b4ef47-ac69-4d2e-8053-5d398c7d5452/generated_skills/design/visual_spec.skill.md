---
name: visual_spec
description: Global design tokens, typography, color palettes, and strict theming rules
---

# Visual Specification & Theme Configuration

You MUST use these exact design tokens for Light/Dark modes.

## Rules for Styling & Theming
1.  **Read and Apply Exact Hex Codes**: This is CRITICAL. You MUST NOT use generic Tailwind classes like `bg-white`, `dark:bg-slate-900`, `text-gray-100`, etc. for structural colors. Instead, you MUST look up the exact hex codes for `background_primary`, `background_secondary`, `text_primary`, `text_secondary`, and `border`, and apply them as explicit Tailwind arbitrary values.
2.  **Support Both Light and Dark Modes**: You must provide both the light and dark mode hex code for every color. Example: `<div className="bg-[#ffffff] dark:bg-[#1a1a1a] border-[#e2e8f0] dark:border-[#1e293b] text-[#0f172a] dark:text-[#f8fafc]">`.
3.  **100% Standalone Code**: The generated React code must be completely standalone. Do NOT rely on custom CSS variables. Every color must be an explicit arbitrary value derived strictly from this specification.
4.  **App Container Background**: Look up the `background_primary` hex values for both light and dark modes and apply them to the root `className` (e.g. `min-h-screen bg-[#ffffff] dark:bg-[#1a1a1a]`).
5.  **Exact Typography Enforcement**: You MUST NOT use generic Tailwind text classes like `text-xl` or `font-bold`. For EVERY text element (headings, paragraphs, buttons, etc.), look up its designated typography token (like `h1`, `p`, `small`, `muted`, etc.) in this specification and explicitly apply its `fontSize` (in px), `fontWeight`, and `color` as inline styles or explicit Tailwind values.

## Guidelines
- **background_primary**: Use for the main application background.
- **background_secondary**: Use for alternate row colors, card backgrounds, or sidebars.
- **text_primary**: Use for primary text like headings and main content.
- **text_secondary**: Use for secondary text like subtitles, descriptions, or less important info.
- **border**: Use for borders of cards, tables, inputs, and dividers.
- **chart_palette**: Use these hex codes sequentially for visualization colors.
- **components**: Look here for component-specific overrides like button border radius, input height, or table cell padding.

## Raw Tokens
```json
{
  "theme": "dark",
  "colors": {
    "light": {
      "background_primary": "#FFFFFF",
      "background_secondary": "#000000",
      "text_primary": "#000000",
      "text_secondary": "#000000",
      "border": "#000000",
      "chart_palette": [
        "#0000FF",
        "#FFFF00",
        "#FF0000",
        "#008000",
        "#800080",
        "#FFA500",
        "#00FFFF",
        "#000000",
        "#FF00FF",
        "#000080"
      ]
    },
    "dark": {
      "background_primary": "#000000",
      "background_secondary": "#FFFFFF",
      "text_primary": "#FFFFFF",
      "text_secondary": "#FFFFFF",
      "border": "#FFFFFF",
      "chart_palette": [
        "#0000FF",
        "#FFFF00",
        "#FF0000",
        "#008000",
        "#800080",
        "#FFA500",
        "#00FFFF",
        "#000000",
        "#FF00FF",
        "#000080"
      ]
    }
  },
  "typography": {
    "font_family": "Inter, sans-serif"
  },
  "components": {
    "light": {
      "button": {
        "primaryBg": "#0000FF",
        "primaryHoverBg": "#E5E5E5",
        "primaryText": "#FFFFFF",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#FFFFFF",
        "secondaryHoverBg": "#f8fafc",
        "secondaryText": "#000000",
        "secondaryBorder": "#000000",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#FF0000",
        "destructiveHoverBg": "#a91439",
        "destructiveText": "#ffffff",
        "destructiveLabel": "Destructive",
        "ghostText": "#598dc5",
        "ghostHoverBg": "#e9edf1",
        "ghostLabel": "Ghost Button",
        "borderRadius": 0,
        "paddingX": 16,
        "paddingY": 8,
        "fontWeight": "500",
        "typographyVariant": "buttonText",
        "fontSize": 14,
        "fontFamily": "'Inter', sans-serif",
        "letterSpacing": "normal",
        "textTransform": "none",
        "secondaryDarkBg": "#262626",
        "secondaryDarkHoverBg": "#1e293b",
        "secondaryDarkText": "#e2e8f0",
        "secondaryDarkBorder": "#334155",
        "ghostDarkText": "#60a5fa",
        "ghostDarkHoverBg": "#1e3a8a"
      },
      "input": {
        "bg": "#FFFFFF",
        "borderColor": "#000000",
        "focusRingColor": "#3b82f6",
        "borderRadius": 0,
        "paddingX": 12,
        "paddingY": 8,
        "placeholder": "Enter text...",
        "textColor": "#000000",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#0000FF",
        "borderColor": "#000000",
        "textColor": "#333333",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#FFFFFF",
        "dotColor": "#0000FF",
        "textColor": "#333333",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#0000FF",
        "bgOff": "#000000",
        "circleOn": "#FFFFFF",
        "circleOff": "#FFFFFF"
      },
      "segmented": {
        "bg": "#FFFFFF",
        "selectedBg": "#FFFFFF",
        "selectedText": "#0000FF",
        "textColor": "#333333",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#FFFFFF",
        "borderColor": "#000000",
        "borderRadius": 0,
        "padding": 12,
        "titleColor": "#333333",
        "valueColor": "#0000FF",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#FFFFFF",
        "borderColor": "#000000",
        "activeText": "#0000FF",
        "activeBorder": "#0000FF",
        "inactiveText": "#333333",
        "hoverText": "#000000",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#FFFFFF",
        "stepBorder": "#000000",
        "activeBg": "#E5E5E5",
        "activeBorder": "#0000FF",
        "activeText": "#000000",
        "completedBg": "#008000",
        "completedBorder": "#008000",
        "completedText": "#047857",
        "inactiveText": "#333333"
      },
      "overlay": {
        "bg": "#FFFFFF",
        "borderColor": "#000000",
        "textColor": "#333333",
        "headerTextColor": "#000000",
        "footerBg": "#FFFFFF",
        "borderRadius": 0,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#FFFFFF",
        "borderColor": "#000000",
        "headerText": "#333333",
        "rowText": "#000000",
        "rowBorder": "#000000",
        "borderRadius": 0,
        "headerTypography": "p",
        "rowTypography": "p",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkHeaderText": "#94a3b8",
        "darkRowText": "#cbd5e1",
        "darkRowBorder": "#262626",
        "headerContent": "Column Header"
      },
      "filterChip": {
        "bg": "#E5E5E5",
        "borderColor": "#0000FF",
        "textColor": "#000000",
        "borderRadius": 0
      },
      "tooltip": {
        "bg": "#ffffff",
        "textColor": "#484747",
        "typographyVariant": "xs"
      },
      "typography": {
        "h1": {
          "fontSize": 43,
          "fontWeight": "700",
          "fontFamily": "'Inter', sans-serif",
          "color": "#000000",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#000000",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 36,
          "fontWeight": "700",
          "fontFamily": "'Inter', sans-serif",
          "color": "#000000",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#000000",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 28,
          "fontWeight": "700",
          "fontFamily": "'Inter', sans-serif",
          "color": "#000000",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#000000",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 24,
          "fontWeight": "700",
          "fontFamily": "'Inter', sans-serif",
          "color": "#000000",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#000000",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 21,
          "fontWeight": "700",
          "fontFamily": "'Inter', sans-serif",
          "color": "#000000",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#000000",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 19,
          "fontWeight": "700",
          "fontFamily": "'Inter', sans-serif",
          "color": "#000000",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#000000",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 19,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#000000",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#333333",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 14,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#333333",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#000000",
          "bg": "#f1f5f9",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#000000",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#333333",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#333333"
        },
        "bodyBase": {
          "fontSize": 19,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#000000",
          "darkColor": "#000000",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#333333",
          "darkColor": "#333333",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 14,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#333333",
          "darkColor": "#333333",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#E5E5E5",
        "infoBorder": "#0000FF",
        "infoIcon": "#60a5fa",
        "infoTitle": "#0000FF",
        "infoText": "#000000",
        "successBg": "#008000",
        "successBorder": "#008000",
        "successIcon": "#34d399",
        "successTitle": "#065f46",
        "successText": "#047857",
        "warningBg": "#fffbeb",
        "warningBorder": "#fde68a",
        "warningIcon": "#fbbf24",
        "warningTitle": "#92400e",
        "warningText": "#b45309",
        "errorBg": "#fff1f2",
        "errorBorder": "#fecdd3",
        "errorIcon": "#fb7185",
        "errorTitle": "#9f1239",
        "errorText": "#be123c",
        "borderRadius": 0
      },
      "loader": {
        "spinnerColor": "#0000FF",
        "spinnerSecondaryColor": "#457bb5",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#000000",
        "progressFill": "#0000FF",
        "borderRadius": 4
      },
      "chart": {
        "titleTypography": "h5",
        "subtitleTypography": "small",
        "headerPaddingY": 10
      }
    },
    "dark": {
      "button": {
        "primaryBg": "#FFFF00",
        "primaryHoverBg": "#333333",
        "primaryText": "#000000",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#000000",
        "secondaryHoverBg": "#122940",
        "secondaryText": "#FFFFFF",
        "secondaryBorder": "#FFFFFF",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#FF0000",
        "destructiveHoverBg": "#610f24",
        "destructiveText": "#cfcfcf",
        "destructiveLabel": "Destructive",
        "ghostText": "#9ea5ae",
        "ghostHoverBg": "#eff6ff",
        "ghostLabel": "Ghost Button",
        "borderRadius": 0,
        "paddingX": 16,
        "paddingY": 8,
        "fontWeight": "500",
        "typographyVariant": "buttonText",
        "fontSize": 14,
        "fontFamily": "'Inter', sans-serif",
        "letterSpacing": "normal",
        "textTransform": "none",
        "secondaryDarkBg": "#262626",
        "secondaryDarkHoverBg": "#1e293b",
        "secondaryDarkText": "#e2e8f0",
        "secondaryDarkBorder": "#334155",
        "ghostDarkText": "#60a5fa",
        "ghostDarkHoverBg": "#1e3a8a"
      },
      "input": {
        "bg": "#000000",
        "borderColor": "#FFFFFF",
        "focusRingColor": "#3b82f6",
        "borderRadius": 0,
        "paddingX": 12,
        "paddingY": 8,
        "placeholder": "Enter text...",
        "textColor": "#FFFFFF",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#FFFF00",
        "borderColor": "#FFFFFF",
        "textColor": "#CCCCCC",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#000000",
        "dotColor": "#FFFF00",
        "textColor": "#CCCCCC",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#FFFF00",
        "bgOff": "#FFFFFF",
        "circleOn": "#000000",
        "circleOff": "#000000"
      },
      "segmented": {
        "bg": "#000000",
        "selectedBg": "#000000",
        "selectedText": "#FFFF00",
        "textColor": "#CCCCCC",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#000000",
        "borderColor": "#FFFFFF",
        "borderRadius": 0,
        "padding": 12,
        "titleColor": "#CCCCCC",
        "valueColor": "#FFFF00",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#000000",
        "borderColor": "#FFFFFF",
        "activeText": "#FFFF00",
        "activeBorder": "#FFFF00",
        "inactiveText": "#CCCCCC",
        "hoverText": "#FFFFFF",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#000000",
        "stepBorder": "#FFFFFF",
        "activeBg": "#333333",
        "activeBorder": "#FFFF00",
        "activeText": "#FFFFFF",
        "completedBg": "#00FF00",
        "completedBorder": "#00FF00",
        "completedText": "#a7f3d0",
        "inactiveText": "#CCCCCC"
      },
      "overlay": {
        "bg": "#000000",
        "borderColor": "#FFFFFF",
        "textColor": "#CCCCCC",
        "headerTextColor": "#FFFFFF",
        "footerBg": "#000000",
        "borderRadius": 0,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#000000",
        "borderColor": "#FFFFFF",
        "headerText": "#CCCCCC",
        "rowText": "#FFFFFF",
        "rowBorder": "#FFFFFF",
        "borderRadius": 0,
        "headerTypography": "xs",
        "rowTypography": "p",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkHeaderText": "#94a3b8",
        "darkRowText": "#cbd5e1",
        "darkRowBorder": "#262626",
        "headerContent": "Column Header"
      },
      "filterChip": {
        "bg": "#333333",
        "borderColor": "#FFFF00",
        "textColor": "#FFFFFF",
        "borderRadius": 0
      },
      "tooltip": {
        "bg": "#334155",
        "textColor": "#f8fafc",
        "typographyVariant": "xs"
      },
      "typography": {
        "h1": {
          "fontSize": 43,
          "fontWeight": "700",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FFFFFF",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#FFFFFF",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 36,
          "fontWeight": "700",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FFFFFF",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#FFFFFF",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 28,
          "fontWeight": "700",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FFFFFF",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#FFFFFF",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 24,
          "fontWeight": "700",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FFFFFF",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#FFFFFF",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 21,
          "fontWeight": "700",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FFFFFF",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#FFFFFF",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 19,
          "fontWeight": "700",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FFFFFF",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#FFFFFF",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 19,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FFFFFF",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#CCCCCC",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 14,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#CCCCCC",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#FFFFFF",
          "bg": "#1e293b",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#FFFFFF",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#CCCCCC",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#CCCCCC"
        },
        "bodyBase": {
          "fontSize": 19,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FFFFFF",
          "darkColor": "#FFFFFF",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#CCCCCC",
          "darkColor": "#CCCCCC",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 14,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#CCCCCC",
          "darkColor": "#CCCCCC",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#333333",
        "infoBorder": "#FFFF00",
        "infoIcon": "#3b82f6",
        "infoTitle": "#FFFF00",
        "infoText": "#FFFFFF",
        "successBg": "#00FF00",
        "successBorder": "#00FF00",
        "successIcon": "#10b981",
        "successTitle": "#6ee7b7",
        "successText": "#34d399",
        "warningBg": "#78350f",
        "warningBorder": "#92400e",
        "warningIcon": "#f59e0b",
        "warningTitle": "#fcd34d",
        "warningText": "#fbbf24",
        "errorBg": "#881337",
        "errorBorder": "#9f1239",
        "errorIcon": "#f43f5e",
        "errorTitle": "#fda4af",
        "errorText": "#fb7185",
        "borderRadius": 0
      },
      "loader": {
        "spinnerColor": "#FFFF00",
        "spinnerSecondaryColor": "#64748b",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#FFFFFF",
        "progressFill": "#FFFF00",
        "borderRadius": 4
      },
      "chart": {
        "titleTypography": "h3",
        "subtitleTypography": "small",
        "headerPaddingY": 16
      }
    }
  }
}
```
