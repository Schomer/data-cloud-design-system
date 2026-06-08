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
      "background_primary": "#F4EFF4",
      "background_secondary": "#CAC4D0",
      "text_primary": "#1D1B20",
      "text_secondary": "#1D1B20",
      "border": "#CAC4D0",
      "chart_palette": [
        "#6750A4",
        "#9E2A2B",
        "#006874",
        "#B3261E",
        "#3A5A92",
        "#7D5260",
        "#4A4458",
        "#1D1B20",
        "#386A20",
        "#B3261E"
      ]
    },
    "dark": {
      "background_primary": "#2B2930",
      "background_secondary": "#938F99",
      "text_primary": "#E6E0E9",
      "text_secondary": "#E6E0E9",
      "border": "#938F99",
      "chart_palette": [
        "#6750A4",
        "#9E2A2B",
        "#006874",
        "#B3261E",
        "#3A5A92",
        "#7D5260",
        "#4A4458",
        "#1D1B20",
        "#386A20",
        "#B3261E"
      ]
    }
  },
  "typography": {
    "font_family": "Inter, sans-serif"
  },
  "components": {
    "light": {
      "button": {
        "primaryBg": "#6750A4",
        "primaryHoverBg": "#EADDFF",
        "primaryText": "#FFFFFF",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#F4EFF4",
        "secondaryHoverBg": "#f8fafc",
        "secondaryText": "#1D1B20",
        "secondaryBorder": "#CAC4D0",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#B3261E",
        "destructiveHoverBg": "#a91439",
        "destructiveText": "#ffffff",
        "destructiveLabel": "Destructive",
        "ghostText": "#598dc5",
        "ghostHoverBg": "#e9edf1",
        "ghostLabel": "Ghost Button",
        "borderRadius": 16,
        "paddingX": 24,
        "paddingY": 10,
        "fontWeight": "500",
        "typographyVariant": "buttonText",
        "fontSize": 14,
        "fontFamily": "'Roboto', sans-serif",
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
        "bg": "#F4EFF4",
        "borderColor": "#CAC4D0",
        "focusRingColor": "#3b82f6",
        "borderRadius": 16,
        "paddingX": 20,
        "paddingY": 10,
        "placeholder": "Enter text...",
        "textColor": "#1D1B20",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#6750A4",
        "borderColor": "#CAC4D0",
        "textColor": "#49454F",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#F4EFF4",
        "dotColor": "#6750A4",
        "textColor": "#49454F",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#6750A4",
        "bgOff": "#CAC4D0",
        "circleOn": "#FFFFFF",
        "circleOff": "#F4EFF4"
      },
      "segmented": {
        "bg": "#FEF7FF",
        "selectedBg": "#F4EFF4",
        "selectedText": "#6750A4",
        "textColor": "#49454F",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#F4EFF4",
        "borderColor": "#CAC4D0",
        "borderRadius": 16,
        "padding": 24,
        "titleColor": "#49454F",
        "valueColor": "#6750A4",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#F4EFF4",
        "borderColor": "#CAC4D0",
        "activeText": "#6750A4",
        "activeBorder": "#6750A4",
        "inactiveText": "#49454F",
        "hoverText": "#1D1B20",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#F4EFF4",
        "stepBorder": "#CAC4D0",
        "activeBg": "#EADDFF",
        "activeBorder": "#6750A4",
        "activeText": "#21005D",
        "completedBg": "#386A20",
        "completedBorder": "#386A20",
        "completedText": "#047857",
        "inactiveText": "#49454F"
      },
      "overlay": {
        "bg": "#F4EFF4",
        "borderColor": "#CAC4D0",
        "textColor": "#49454F",
        "headerTextColor": "#1D1B20",
        "footerBg": "#FEF7FF",
        "borderRadius": 16,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#F4EFF4",
        "borderColor": "#CAC4D0",
        "headerText": "#49454F",
        "rowText": "#1D1B20",
        "rowBorder": "#CAC4D0",
        "borderRadius": 16,
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
        "bg": "#EADDFF",
        "borderColor": "#6750A4",
        "textColor": "#21005D",
        "borderRadius": 9999
      },
      "tooltip": {
        "bg": "#ffffff",
        "textColor": "#484747",
        "typographyVariant": "xs"
      },
      "typography": {
        "h1": {
          "fontSize": 39,
          "fontWeight": "500",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#1D1B20",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#1D1B20",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 33,
          "fontWeight": "500",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#1D1B20",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#1D1B20",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 26,
          "fontWeight": "500",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#1D1B20",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#1D1B20",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 22,
          "fontWeight": "500",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#1D1B20",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#1D1B20",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 19,
          "fontWeight": "500",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#1D1B20",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#1D1B20",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 17,
          "fontWeight": "500",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#1D1B20",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#1D1B20",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 17,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#1D1B20",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#49454F",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 13,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#49454F",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#1D1B20",
          "bg": "#f1f5f9",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#1D1B20",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#49454F",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#49454F"
        },
        "bodyBase": {
          "fontSize": 17,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#1D1B20",
          "darkColor": "#1D1B20",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#49454F",
          "darkColor": "#49454F",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 13,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#49454F",
          "darkColor": "#49454F",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#EADDFF",
        "infoBorder": "#6750A4",
        "infoIcon": "#60a5fa",
        "infoTitle": "#6750A4",
        "infoText": "#21005D",
        "successBg": "#386A20",
        "successBorder": "#386A20",
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
        "borderRadius": 16
      },
      "loader": {
        "spinnerColor": "#6750A4",
        "spinnerSecondaryColor": "#457bb5",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#CAC4D0",
        "progressFill": "#6750A4",
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
        "primaryBg": "#D0BCFF",
        "primaryHoverBg": "#4A4458",
        "primaryText": "#381E72",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#2B2930",
        "secondaryHoverBg": "#122940",
        "secondaryText": "#E6E0E9",
        "secondaryBorder": "#938F99",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#F2B8B5",
        "destructiveHoverBg": "#610f24",
        "destructiveText": "#cfcfcf",
        "destructiveLabel": "Destructive",
        "ghostText": "#9ea5ae",
        "ghostHoverBg": "#eff6ff",
        "ghostLabel": "Ghost Button",
        "borderRadius": 16,
        "paddingX": 24,
        "paddingY": 10,
        "fontWeight": "500",
        "typographyVariant": "buttonText",
        "fontSize": 14,
        "fontFamily": "'Roboto', sans-serif",
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
        "bg": "#2B2930",
        "borderColor": "#938F99",
        "focusRingColor": "#3b82f6",
        "borderRadius": 16,
        "paddingX": 20,
        "paddingY": 10,
        "placeholder": "Enter text...",
        "textColor": "#E6E0E9",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#D0BCFF",
        "borderColor": "#938F99",
        "textColor": "#CAC4D0",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#2B2930",
        "dotColor": "#D0BCFF",
        "textColor": "#CAC4D0",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#D0BCFF",
        "bgOff": "#938F99",
        "circleOn": "#381E72",
        "circleOff": "#2B2930"
      },
      "segmented": {
        "bg": "#141218",
        "selectedBg": "#2B2930",
        "selectedText": "#D0BCFF",
        "textColor": "#CAC4D0",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#2B2930",
        "borderColor": "#938F99",
        "borderRadius": 16,
        "padding": 24,
        "titleColor": "#CAC4D0",
        "valueColor": "#D0BCFF",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#2B2930",
        "borderColor": "#938F99",
        "activeText": "#D0BCFF",
        "activeBorder": "#D0BCFF",
        "inactiveText": "#CAC4D0",
        "hoverText": "#E6E0E9",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#2B2930",
        "stepBorder": "#938F99",
        "activeBg": "#4A4458",
        "activeBorder": "#D0BCFF",
        "activeText": "#E8DEF8",
        "completedBg": "#9CD67D",
        "completedBorder": "#9CD67D",
        "completedText": "#a7f3d0",
        "inactiveText": "#CAC4D0"
      },
      "overlay": {
        "bg": "#2B2930",
        "borderColor": "#938F99",
        "textColor": "#CAC4D0",
        "headerTextColor": "#E6E0E9",
        "footerBg": "#141218",
        "borderRadius": 16,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#2B2930",
        "borderColor": "#938F99",
        "headerText": "#CAC4D0",
        "rowText": "#E6E0E9",
        "rowBorder": "#938F99",
        "borderRadius": 16,
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
        "bg": "#4A4458",
        "borderColor": "#D0BCFF",
        "textColor": "#E8DEF8",
        "borderRadius": 9999
      },
      "tooltip": {
        "bg": "#334155",
        "textColor": "#f8fafc",
        "typographyVariant": "xs"
      },
      "typography": {
        "h1": {
          "fontSize": 39,
          "fontWeight": "500",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#E6E0E9",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#E6E0E9",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 33,
          "fontWeight": "500",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#E6E0E9",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#E6E0E9",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 26,
          "fontWeight": "500",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#E6E0E9",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#E6E0E9",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 22,
          "fontWeight": "500",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#E6E0E9",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#E6E0E9",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 19,
          "fontWeight": "500",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#E6E0E9",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#E6E0E9",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 17,
          "fontWeight": "500",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#E6E0E9",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#E6E0E9",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 17,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#E6E0E9",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#CAC4D0",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 13,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#CAC4D0",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#E6E0E9",
          "bg": "#1e293b",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#E6E0E9",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#CAC4D0",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#CAC4D0"
        },
        "bodyBase": {
          "fontSize": 17,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#E6E0E9",
          "darkColor": "#E6E0E9",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#CAC4D0",
          "darkColor": "#CAC4D0",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 13,
          "fontWeight": "400",
          "fontFamily": "'Roboto', sans-serif",
          "color": "#CAC4D0",
          "darkColor": "#CAC4D0",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#4A4458",
        "infoBorder": "#D0BCFF",
        "infoIcon": "#3b82f6",
        "infoTitle": "#D0BCFF",
        "infoText": "#E8DEF8",
        "successBg": "#9CD67D",
        "successBorder": "#9CD67D",
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
        "borderRadius": 16
      },
      "loader": {
        "spinnerColor": "#D0BCFF",
        "spinnerSecondaryColor": "#64748b",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#938F99",
        "progressFill": "#D0BCFF",
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
