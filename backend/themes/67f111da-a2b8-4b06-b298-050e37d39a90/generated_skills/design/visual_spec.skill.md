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
      "background_secondary": "#D7D7D1",
      "text_primary": "#282A36",
      "text_secondary": "#282A36",
      "border": "#D7D7D1",
      "chart_palette": [
        "#FF79C6",
        "#BD93F9",
        "#50FA7B",
        "#FFB86C",
        "#FF5555",
        "#F1FA8C",
        "#8BE9FD",
        "#6272A4",
        "#44475A",
        "#F8F8F2"
      ]
    },
    "dark": {
      "background_primary": "#44475A",
      "background_secondary": "#6272A4",
      "text_primary": "#F8F8F2",
      "text_secondary": "#F8F8F2",
      "border": "#6272A4",
      "chart_palette": [
        "#FF79C6",
        "#BD93F9",
        "#50FA7B",
        "#FFB86C",
        "#FF5555",
        "#F1FA8C",
        "#8BE9FD",
        "#6272A4",
        "#44475A",
        "#F8F8F2"
      ]
    }
  },
  "typography": {
    "font_family": "Inter, sans-serif"
  },
  "components": {
    "light": {
      "button": {
        "primaryBg": "#FF79C6",
        "primaryHoverBg": "#E2E2DC",
        "primaryText": "#FFFFFF",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#FFFFFF",
        "secondaryHoverBg": "#f8fafc",
        "secondaryText": "#282A36",
        "secondaryBorder": "#D7D7D1",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#FF5555",
        "destructiveHoverBg": "#a91439",
        "destructiveText": "#ffffff",
        "destructiveLabel": "Destructive",
        "ghostText": "#598dc5",
        "ghostHoverBg": "#e9edf1",
        "ghostLabel": "Ghost Button",
        "borderRadius": 8,
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
        "borderColor": "#D7D7D1",
        "focusRingColor": "#3b82f6",
        "borderRadius": 8,
        "paddingX": 12,
        "paddingY": 8,
        "placeholder": "Enter text...",
        "textColor": "#282A36",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#FF79C6",
        "borderColor": "#D7D7D1",
        "textColor": "#44475A",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#FFFFFF",
        "dotColor": "#FF79C6",
        "textColor": "#44475A",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#FF79C6",
        "bgOff": "#D7D7D1",
        "circleOn": "#FFFFFF",
        "circleOff": "#FFFFFF"
      },
      "segmented": {
        "bg": "#F8F8F2",
        "selectedBg": "#FFFFFF",
        "selectedText": "#FF79C6",
        "textColor": "#44475A",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#FFFFFF",
        "borderColor": "#D7D7D1",
        "borderRadius": 8,
        "padding": 20,
        "titleColor": "#44475A",
        "valueColor": "#FF79C6",
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
        "borderColor": "#D7D7D1",
        "activeText": "#FF79C6",
        "activeBorder": "#FF79C6",
        "inactiveText": "#44475A",
        "hoverText": "#282A36",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#FFFFFF",
        "stepBorder": "#D7D7D1",
        "activeBg": "#E2E2DC",
        "activeBorder": "#FF79C6",
        "activeText": "#6272A4",
        "completedBg": "#50FA7B",
        "completedBorder": "#50FA7B",
        "completedText": "#047857",
        "inactiveText": "#44475A"
      },
      "overlay": {
        "bg": "#FFFFFF",
        "borderColor": "#D7D7D1",
        "textColor": "#44475A",
        "headerTextColor": "#282A36",
        "footerBg": "#F8F8F2",
        "borderRadius": 8,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#FFFFFF",
        "borderColor": "#D7D7D1",
        "headerText": "#44475A",
        "rowText": "#282A36",
        "rowBorder": "#D7D7D1",
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
        "bg": "#E2E2DC",
        "borderColor": "#FF79C6",
        "textColor": "#6272A4",
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
          "fontFamily": "'Inter', sans-serif",
          "color": "#282A36",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#282A36",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 30,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#282A36",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#282A36",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 24,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#282A36",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#282A36",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 20,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#282A36",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#282A36",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 18,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#282A36",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#282A36",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 16,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#282A36",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#282A36",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#282A36",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#44475A",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#44475A",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#282A36",
          "bg": "#f1f5f9",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#282A36",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#44475A",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#44475A"
        },
        "bodyBase": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#282A36",
          "darkColor": "#282A36",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#44475A",
          "darkColor": "#44475A",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#44475A",
          "darkColor": "#44475A",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#E2E2DC",
        "infoBorder": "#FF79C6",
        "infoIcon": "#60a5fa",
        "infoTitle": "#FF79C6",
        "infoText": "#6272A4",
        "successBg": "#50FA7B",
        "successBorder": "#50FA7B",
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
        "spinnerColor": "#FF79C6",
        "spinnerSecondaryColor": "#457bb5",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#D7D7D1",
        "progressFill": "#FF79C6",
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
        "primaryBg": "#FF79C6",
        "primaryHoverBg": "#6272A4",
        "primaryText": "#282A36",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#44475A",
        "secondaryHoverBg": "#122940",
        "secondaryText": "#F8F8F2",
        "secondaryBorder": "#6272A4",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#FF5555",
        "destructiveHoverBg": "#610f24",
        "destructiveText": "#cfcfcf",
        "destructiveLabel": "Destructive",
        "ghostText": "#9ea5ae",
        "ghostHoverBg": "#eff6ff",
        "ghostLabel": "Ghost Button",
        "borderRadius": 8,
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
        "bg": "#44475A",
        "borderColor": "#6272A4",
        "focusRingColor": "#3b82f6",
        "borderRadius": 8,
        "paddingX": 12,
        "paddingY": 8,
        "placeholder": "Enter text...",
        "textColor": "#F8F8F2",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#FF79C6",
        "borderColor": "#6272A4",
        "textColor": "#BFBFBF",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#44475A",
        "dotColor": "#FF79C6",
        "textColor": "#BFBFBF",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#FF79C6",
        "bgOff": "#6272A4",
        "circleOn": "#282A36",
        "circleOff": "#44475A"
      },
      "segmented": {
        "bg": "#282A36",
        "selectedBg": "#44475A",
        "selectedText": "#FF79C6",
        "textColor": "#BFBFBF",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#44475A",
        "borderColor": "#6272A4",
        "borderRadius": 8,
        "padding": 20,
        "titleColor": "#BFBFBF",
        "valueColor": "#FF79C6",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#44475A",
        "borderColor": "#6272A4",
        "activeText": "#FF79C6",
        "activeBorder": "#FF79C6",
        "inactiveText": "#BFBFBF",
        "hoverText": "#F8F8F2",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#44475A",
        "stepBorder": "#6272A4",
        "activeBg": "#6272A4",
        "activeBorder": "#FF79C6",
        "activeText": "#F8F8F2",
        "completedBg": "#50FA7B",
        "completedBorder": "#50FA7B",
        "completedText": "#a7f3d0",
        "inactiveText": "#BFBFBF"
      },
      "overlay": {
        "bg": "#44475A",
        "borderColor": "#6272A4",
        "textColor": "#BFBFBF",
        "headerTextColor": "#F8F8F2",
        "footerBg": "#282A36",
        "borderRadius": 8,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#44475A",
        "borderColor": "#6272A4",
        "headerText": "#BFBFBF",
        "rowText": "#F8F8F2",
        "rowBorder": "#6272A4",
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
        "bg": "#6272A4",
        "borderColor": "#FF79C6",
        "textColor": "#F8F8F2",
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
          "fontFamily": "'Inter', sans-serif",
          "color": "#F8F8F2",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#F8F8F2",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 30,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#F8F8F2",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#F8F8F2",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 24,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#F8F8F2",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#F8F8F2",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 20,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#F8F8F2",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#F8F8F2",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 18,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#F8F8F2",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#F8F8F2",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 16,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#F8F8F2",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#F8F8F2",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#F8F8F2",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#BFBFBF",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#BFBFBF",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#F8F8F2",
          "bg": "#1e293b",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#F8F8F2",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#BFBFBF",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#BFBFBF"
        },
        "bodyBase": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#F8F8F2",
          "darkColor": "#F8F8F2",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#BFBFBF",
          "darkColor": "#BFBFBF",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#BFBFBF",
          "darkColor": "#BFBFBF",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#6272A4",
        "infoBorder": "#FF79C6",
        "infoIcon": "#3b82f6",
        "infoTitle": "#FF79C6",
        "infoText": "#F8F8F2",
        "successBg": "#50FA7B",
        "successBorder": "#50FA7B",
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
        "spinnerColor": "#FF79C6",
        "spinnerSecondaryColor": "#64748b",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#6272A4",
        "progressFill": "#FF79C6",
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
