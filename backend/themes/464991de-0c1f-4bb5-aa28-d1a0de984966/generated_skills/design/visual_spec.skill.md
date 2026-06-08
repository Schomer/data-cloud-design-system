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
      "background_primary": "#F8F9FA",
      "background_secondary": "#DADCE0",
      "text_primary": "#202124",
      "text_secondary": "#202124",
      "border": "#DADCE0",
      "chart_palette": [
        "#1A73E8",
        "#FBBC04",
        "#a8348f",
        "#EA4335",
        "#F29900",
        "#185ABC",
        "#137333",
        "#B31412",
        "#E8710A",
        "#1E8E3E"
      ]
    },
    "dark": {
      "background_primary": "#303134",
      "background_secondary": "#5F6368",
      "text_primary": "#E8EAED",
      "text_secondary": "#E8EAED",
      "border": "#5F6368",
      "chart_palette": [
        "#1A73E8",
        "#FBBC04",
        "#a8348f",
        "#EA4335",
        "#F29900",
        "#185ABC",
        "#137333",
        "#B31412",
        "#E8710A",
        "#1E8E3E"
      ]
    }
  },
  "typography": {
    "font_family": "Inter, sans-serif"
  },
  "components": {
    "light": {
      "button": {
        "primaryBg": "#1A73E8",
        "primaryHoverBg": "#E8F0FE",
        "primaryText": "#FFFFFF",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#F8F9FA",
        "secondaryHoverBg": "#f8fafc",
        "secondaryText": "#202124",
        "secondaryBorder": "#DADCE0",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#D93025",
        "destructiveHoverBg": "#a91439",
        "destructiveText": "#ffffff",
        "destructiveLabel": "Destructive",
        "ghostText": "#598dc5",
        "ghostHoverBg": "#e9edf1",
        "ghostLabel": "Ghost Button",
        "borderRadius": 4,
        "paddingX": 13,
        "paddingY": 5,
        "fontWeight": "500",
        "typographyVariant": "xs",
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
        "bg": "#F8F9FA",
        "borderColor": "#DADCE0",
        "focusRingColor": "#3b82f6",
        "borderRadius": 4,
        "paddingX": 12,
        "paddingY": 8,
        "placeholder": "Enter text...",
        "textColor": "#202124",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#1A73E8",
        "borderColor": "#DADCE0",
        "textColor": "#5F6368",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#F8F9FA",
        "dotColor": "#1A73E8",
        "textColor": "#5F6368",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#1A73E8",
        "bgOff": "#DADCE0",
        "circleOn": "#FFFFFF",
        "circleOff": "#F8F9FA"
      },
      "segmented": {
        "bg": "#FFFFFF",
        "selectedBg": "#F8F9FA",
        "selectedText": "#1A73E8",
        "textColor": "#5F6368",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#F8F9FA",
        "borderColor": "#DADCE0",
        "borderRadius": 4,
        "padding": 20,
        "titleColor": "#5F6368",
        "valueColor": "#313335",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#F8F9FA",
        "borderColor": "#DADCE0",
        "activeText": "#1A73E8",
        "activeBorder": "#1A73E8",
        "inactiveText": "#5F6368",
        "hoverText": "#202124",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#F8F9FA",
        "stepBorder": "#DADCE0",
        "activeBg": "#E8F0FE",
        "activeBorder": "#1A73E8",
        "activeText": "#1967D2",
        "completedBg": "#1E8E3E",
        "completedBorder": "#1E8E3E",
        "completedText": "#047857",
        "inactiveText": "#5F6368"
      },
      "overlay": {
        "bg": "#F8F9FA",
        "borderColor": "#DADCE0",
        "textColor": "#5F6368",
        "headerTextColor": "#202124",
        "footerBg": "#FFFFFF",
        "borderRadius": 4,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#F8F9FA",
        "borderColor": "#DADCE0",
        "headerText": "#eb0000",
        "rowText": "#202124",
        "rowBorder": "#DADCE0",
        "borderRadius": 4,
        "headerTypography": "xs",
        "rowTypography": "xs",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkHeaderText": "#94a3b8",
        "darkRowText": "#cbd5e1",
        "darkRowBorder": "#262626",
        "headerContent": "Column Header",
        "paddingY": 0,
        "paddingX": 0
      },
      "filterChip": {
        "bg": "#E8F0FE",
        "borderColor": "#1A73E8",
        "textColor": "#1967D2",
        "borderRadius": 4
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
          "color": "#202124",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#202124",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 30,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#202124",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#202124",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 24,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#202124",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#202124",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 20,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#202124",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#202124",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 18,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#202124",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#202124",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 16,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#202124",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#202124",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#202124",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#5F6368",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#5F6368",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#202124",
          "bg": "#f1f5f9",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#202124",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#5F6368",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#5F6368"
        },
        "bodyBase": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#202124",
          "darkColor": "#202124",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#5F6368",
          "darkColor": "#5F6368",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#5F6368",
          "darkColor": "#5F6368",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#E8F0FE",
        "infoBorder": "#1A73E8",
        "infoIcon": "#60a5fa",
        "infoTitle": "#1A73E8",
        "infoText": "#1967D2",
        "successBg": "#1E8E3E",
        "successBorder": "#1E8E3E",
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
        "borderRadius": 4
      },
      "loader": {
        "spinnerColor": "#1A73E8",
        "spinnerSecondaryColor": "#457bb5",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#DADCE0",
        "progressFill": "#1A73E8",
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
        "primaryBg": "#8AB4F8",
        "primaryHoverBg": "#1A73E8",
        "primaryText": "#202124",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#303134",
        "secondaryHoverBg": "#122940",
        "secondaryText": "#E8EAED",
        "secondaryBorder": "#5F6368",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#F28B82",
        "destructiveHoverBg": "#610f24",
        "destructiveText": "#cfcfcf",
        "destructiveLabel": "Destructive",
        "ghostText": "#9ea5ae",
        "ghostHoverBg": "#eff6ff",
        "ghostLabel": "Ghost Button",
        "borderRadius": 4,
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
        "bg": "#303134",
        "borderColor": "#5F6368",
        "focusRingColor": "#3b82f6",
        "borderRadius": 4,
        "paddingX": 12,
        "paddingY": 8,
        "placeholder": "Enter text...",
        "textColor": "#E8EAED",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#8AB4F8",
        "borderColor": "#5F6368",
        "textColor": "#9AA0A6",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#303134",
        "dotColor": "#8AB4F8",
        "textColor": "#9AA0A6",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#8AB4F8",
        "bgOff": "#5F6368",
        "circleOn": "#202124",
        "circleOff": "#303134"
      },
      "segmented": {
        "bg": "#202124",
        "selectedBg": "#303134",
        "selectedText": "#8AB4F8",
        "textColor": "#9AA0A6",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#303134",
        "borderColor": "#5F6368",
        "borderRadius": 4,
        "padding": 20,
        "titleColor": "#9AA0A6",
        "valueColor": "#8AB4F8",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#303134",
        "borderColor": "#5F6368",
        "activeText": "#8AB4F8",
        "activeBorder": "#8AB4F8",
        "inactiveText": "#9AA0A6",
        "hoverText": "#E8EAED",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#303134",
        "stepBorder": "#5F6368",
        "activeBg": "#1A73E8",
        "activeBorder": "#8AB4F8",
        "activeText": "#E8F0FE",
        "completedBg": "#81C995",
        "completedBorder": "#81C995",
        "completedText": "#a7f3d0",
        "inactiveText": "#9AA0A6"
      },
      "overlay": {
        "bg": "#303134",
        "borderColor": "#5F6368",
        "textColor": "#9AA0A6",
        "headerTextColor": "#E8EAED",
        "footerBg": "#202124",
        "borderRadius": 4,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#303134",
        "borderColor": "#5F6368",
        "headerText": "#9AA0A6",
        "rowText": "#E8EAED",
        "rowBorder": "#5F6368",
        "borderRadius": 4,
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
        "bg": "#1A73E8",
        "borderColor": "#8AB4F8",
        "textColor": "#E8F0FE",
        "borderRadius": 4
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
          "color": "#E8EAED",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#E8EAED",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 30,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#E8EAED",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#E8EAED",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 24,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#E8EAED",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#E8EAED",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 20,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#E8EAED",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#E8EAED",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 18,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#E8EAED",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#E8EAED",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 16,
          "fontWeight": "600",
          "fontFamily": "'Inter', sans-serif",
          "color": "#E8EAED",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#E8EAED",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#E8EAED",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#9AA0A6",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#9AA0A6",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#E8EAED",
          "bg": "#1e293b",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#E8EAED",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#9AA0A6",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#9AA0A6"
        },
        "bodyBase": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#E8EAED",
          "darkColor": "#E8EAED",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#9AA0A6",
          "darkColor": "#9AA0A6",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#9AA0A6",
          "darkColor": "#9AA0A6",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#1A73E8",
        "infoBorder": "#8AB4F8",
        "infoIcon": "#3b82f6",
        "infoTitle": "#8AB4F8",
        "infoText": "#E8F0FE",
        "successBg": "#81C995",
        "successBorder": "#81C995",
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
        "borderRadius": 4
      },
      "loader": {
        "spinnerColor": "#8AB4F8",
        "spinnerSecondaryColor": "#64748b",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#5F6368",
        "progressFill": "#8AB4F8",
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
