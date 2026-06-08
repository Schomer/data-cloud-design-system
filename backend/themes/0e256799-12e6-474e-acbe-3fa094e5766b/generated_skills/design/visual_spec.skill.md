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
      "background_secondary": "#BAE6FD",
      "text_primary": "#0C4A6E",
      "text_secondary": "#0C4A6E",
      "border": "#BAE6FD",
      "chart_palette": [
        "#0284C7",
        "#0369A1",
        "#075985",
        "#082F49",
        "#38BDF8",
        "#7DD3FC",
        "#0EA5E9",
        "#0284C7",
        "#3B82F6",
        "#1D4ED8"
      ]
    },
    "dark": {
      "background_primary": "#0C4A6E",
      "background_secondary": "#0369A1",
      "text_primary": "#F0F9FF",
      "text_secondary": "#F0F9FF",
      "border": "#0369A1",
      "chart_palette": [
        "#0284C7",
        "#0369A1",
        "#075985",
        "#082F49",
        "#38BDF8",
        "#7DD3FC",
        "#0EA5E9",
        "#0284C7",
        "#3B82F6",
        "#1D4ED8"
      ]
    }
  },
  "typography": {
    "font_family": "Inter, sans-serif"
  },
  "components": {
    "light": {
      "button": {
        "primaryBg": "#0284C7",
        "primaryHoverBg": "#E0F2FE",
        "primaryText": "#FFFFFF",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#FFFFFF",
        "secondaryHoverBg": "#f8fafc",
        "secondaryText": "#0C4A6E",
        "secondaryBorder": "#BAE6FD",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#E11D48",
        "destructiveHoverBg": "#a91439",
        "destructiveText": "#ffffff",
        "destructiveLabel": "Destructive",
        "ghostText": "#598dc5",
        "ghostHoverBg": "#e9edf1",
        "ghostLabel": "Ghost Button",
        "borderRadius": 8,
        "paddingX": 18,
        "paddingY": 10,
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
        "borderColor": "#BAE6FD",
        "focusRingColor": "#3b82f6",
        "borderRadius": 8,
        "paddingX": 14,
        "paddingY": 10,
        "placeholder": "Enter text...",
        "textColor": "#0C4A6E",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#0284C7",
        "borderColor": "#BAE6FD",
        "textColor": "#0284C7",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#FFFFFF",
        "dotColor": "#0284C7",
        "textColor": "#0284C7",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#0284C7",
        "bgOff": "#BAE6FD",
        "circleOn": "#FFFFFF",
        "circleOff": "#FFFFFF"
      },
      "segmented": {
        "bg": "#F0F9FF",
        "selectedBg": "#FFFFFF",
        "selectedText": "#0284C7",
        "textColor": "#0284C7",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#FFFFFF",
        "borderColor": "#BAE6FD",
        "borderRadius": 8,
        "padding": 24,
        "titleColor": "#0284C7",
        "valueColor": "#0284C7",
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
        "borderColor": "#BAE6FD",
        "activeText": "#0284C7",
        "activeBorder": "#0284C7",
        "inactiveText": "#0284C7",
        "hoverText": "#0C4A6E",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#FFFFFF",
        "stepBorder": "#BAE6FD",
        "activeBg": "#E0F2FE",
        "activeBorder": "#0284C7",
        "activeText": "#0369A1",
        "completedBg": "#059669",
        "completedBorder": "#059669",
        "completedText": "#047857",
        "inactiveText": "#0284C7"
      },
      "overlay": {
        "bg": "#FFFFFF",
        "borderColor": "#BAE6FD",
        "textColor": "#0284C7",
        "headerTextColor": "#0C4A6E",
        "footerBg": "#F0F9FF",
        "borderRadius": 8,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#FFFFFF",
        "borderColor": "#BAE6FD",
        "headerText": "#0284C7",
        "rowText": "#0C4A6E",
        "rowBorder": "#BAE6FD",
        "borderRadius": 8,
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
        "bg": "#E0F2FE",
        "borderColor": "#0284C7",
        "textColor": "#0369A1",
        "borderRadius": 8
      },
      "tooltip": {
        "bg": "#ffffff",
        "textColor": "#484747",
        "typographyVariant": "xs"
      },
      "typography": {
        "h1": {
          "fontSize": 36,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0C4A6E",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#0C4A6E",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 30,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0C4A6E",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#0C4A6E",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 24,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0C4A6E",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#0C4A6E",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 20,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0C4A6E",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#0C4A6E",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 18,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0C4A6E",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#0C4A6E",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 16,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0C4A6E",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#0C4A6E",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0C4A6E",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0284C7",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0284C7",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#0C4A6E",
          "bg": "#f1f5f9",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#0C4A6E",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0284C7",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#0284C7"
        },
        "bodyBase": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0C4A6E",
          "darkColor": "#0C4A6E",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0284C7",
          "darkColor": "#0284C7",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#0284C7",
          "darkColor": "#0284C7",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#E0F2FE",
        "infoBorder": "#0284C7",
        "infoIcon": "#60a5fa",
        "infoTitle": "#0284C7",
        "infoText": "#0369A1",
        "successBg": "#059669",
        "successBorder": "#059669",
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
        "borderRadius": 8
      },
      "loader": {
        "spinnerColor": "#0284C7",
        "spinnerSecondaryColor": "#457bb5",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#BAE6FD",
        "progressFill": "#0284C7",
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
        "primaryBg": "#38BDF8",
        "primaryHoverBg": "#0284C7",
        "primaryText": "#082F49",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#0C4A6E",
        "secondaryHoverBg": "#122940",
        "secondaryText": "#F0F9FF",
        "secondaryBorder": "#0369A1",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#FB7185",
        "destructiveHoverBg": "#610f24",
        "destructiveText": "#cfcfcf",
        "destructiveLabel": "Destructive",
        "ghostText": "#9ea5ae",
        "ghostHoverBg": "#eff6ff",
        "ghostLabel": "Ghost Button",
        "borderRadius": 8,
        "paddingX": 18,
        "paddingY": 10,
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
        "bg": "#0C4A6E",
        "borderColor": "#0369A1",
        "focusRingColor": "#3b82f6",
        "borderRadius": 8,
        "paddingX": 14,
        "paddingY": 10,
        "placeholder": "Enter text...",
        "textColor": "#F0F9FF",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#38BDF8",
        "borderColor": "#0369A1",
        "textColor": "#BAE6FD",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#0C4A6E",
        "dotColor": "#38BDF8",
        "textColor": "#BAE6FD",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#38BDF8",
        "bgOff": "#0369A1",
        "circleOn": "#082F49",
        "circleOff": "#0C4A6E"
      },
      "segmented": {
        "bg": "#082F49",
        "selectedBg": "#0C4A6E",
        "selectedText": "#38BDF8",
        "textColor": "#BAE6FD",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#0C4A6E",
        "borderColor": "#0369A1",
        "borderRadius": 8,
        "padding": 24,
        "titleColor": "#BAE6FD",
        "valueColor": "#38BDF8",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#0C4A6E",
        "borderColor": "#0369A1",
        "activeText": "#38BDF8",
        "activeBorder": "#38BDF8",
        "inactiveText": "#BAE6FD",
        "hoverText": "#F0F9FF",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#0C4A6E",
        "stepBorder": "#0369A1",
        "activeBg": "#0284C7",
        "activeBorder": "#38BDF8",
        "activeText": "#E0F2FE",
        "completedBg": "#34D399",
        "completedBorder": "#34D399",
        "completedText": "#a7f3d0",
        "inactiveText": "#BAE6FD"
      },
      "overlay": {
        "bg": "#0C4A6E",
        "borderColor": "#0369A1",
        "textColor": "#BAE6FD",
        "headerTextColor": "#F0F9FF",
        "footerBg": "#082F49",
        "borderRadius": 8,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#0C4A6E",
        "borderColor": "#0369A1",
        "headerText": "#BAE6FD",
        "rowText": "#F0F9FF",
        "rowBorder": "#0369A1",
        "borderRadius": 8,
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
        "bg": "#0284C7",
        "borderColor": "#38BDF8",
        "textColor": "#E0F2FE",
        "borderRadius": 8
      },
      "tooltip": {
        "bg": "#334155",
        "textColor": "#f8fafc",
        "typographyVariant": "xs"
      },
      "typography": {
        "h1": {
          "fontSize": 36,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F0F9FF",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#F0F9FF",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 30,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F0F9FF",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#F0F9FF",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 24,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F0F9FF",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#F0F9FF",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 20,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F0F9FF",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#F0F9FF",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 18,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F0F9FF",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#F0F9FF",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 16,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F0F9FF",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#F0F9FF",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F0F9FF",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#BAE6FD",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#BAE6FD",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#F0F9FF",
          "bg": "#1e293b",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#F0F9FF",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#BAE6FD",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#BAE6FD"
        },
        "bodyBase": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F0F9FF",
          "darkColor": "#F0F9FF",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#BAE6FD",
          "darkColor": "#BAE6FD",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#BAE6FD",
          "darkColor": "#BAE6FD",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#0284C7",
        "infoBorder": "#38BDF8",
        "infoIcon": "#3b82f6",
        "infoTitle": "#38BDF8",
        "infoText": "#E0F2FE",
        "successBg": "#34D399",
        "successBorder": "#34D399",
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
        "borderRadius": 8
      },
      "loader": {
        "spinnerColor": "#38BDF8",
        "spinnerSecondaryColor": "#64748b",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#0369A1",
        "progressFill": "#38BDF8",
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
