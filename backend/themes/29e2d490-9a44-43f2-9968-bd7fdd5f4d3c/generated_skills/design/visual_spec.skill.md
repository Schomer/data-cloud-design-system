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
      "background_primary": "#F0F0F0",
      "background_secondary": "#000000",
      "text_primary": "#000000",
      "text_secondary": "#000000",
      "border": "#000000",
      "chart_palette": [
        "#00FF41",
        "#FF003C",
        "#FCEE09",
        "#00FFFF",
        "#FF00FF",
        "#008F11",
        "#990024",
        "#FF8C00",
        "#008B8B",
        "#800080"
      ]
    },
    "dark": {
      "background_primary": "#121212",
      "background_secondary": "#00FF41",
      "text_primary": "#00FF41",
      "text_secondary": "#00FF41",
      "border": "#00FF41",
      "chart_palette": [
        "#00FF41",
        "#FF003C",
        "#FCEE09",
        "#00FFFF",
        "#FF00FF",
        "#008F11",
        "#990024",
        "#FF8C00",
        "#008B8B",
        "#800080"
      ]
    }
  },
  "typography": {
    "font_family": "Inter, sans-serif"
  },
  "components": {
    "light": {
      "button": {
        "primaryBg": "#FF003C",
        "primaryHoverBg": "#00FFFF",
        "primaryText": "#FFFFFF",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#F0F0F0",
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
        "paddingX": 20,
        "paddingY": 8,
        "fontWeight": "500",
        "typographyVariant": "buttonText",
        "fontSize": 14,
        "fontFamily": "'Courier New', Courier, monospace",
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
        "bg": "#F0F0F0",
        "borderColor": "#000000",
        "focusRingColor": "#3b82f6",
        "borderRadius": 0,
        "paddingX": 16,
        "paddingY": 8,
        "placeholder": "Enter text...",
        "textColor": "#000000",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#FF003C",
        "borderColor": "#000000",
        "textColor": "#333333",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#F0F0F0",
        "dotColor": "#FF003C",
        "textColor": "#333333",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#FF003C",
        "bgOff": "#000000",
        "circleOn": "#FFFFFF",
        "circleOff": "#F0F0F0"
      },
      "segmented": {
        "bg": "#FFFFFF",
        "selectedBg": "#F0F0F0",
        "selectedText": "#FF003C",
        "textColor": "#333333",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#F0F0F0",
        "borderColor": "#000000",
        "borderRadius": 0,
        "padding": 16,
        "titleColor": "#333333",
        "valueColor": "#FF003C",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#F0F0F0",
        "borderColor": "#000000",
        "activeText": "#FF003C",
        "activeBorder": "#FF003C",
        "inactiveText": "#333333",
        "hoverText": "#000000",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#F0F0F0",
        "stepBorder": "#000000",
        "activeBg": "#00FFFF",
        "activeBorder": "#FF003C",
        "activeText": "#000000",
        "completedBg": "#00FF41",
        "completedBorder": "#00FF41",
        "completedText": "#047857",
        "inactiveText": "#333333"
      },
      "overlay": {
        "bg": "#F0F0F0",
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
        "bg": "#F0F0F0",
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
        "bg": "#00FFFF",
        "borderColor": "#FF003C",
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
          "fontSize": 36,
          "fontWeight": "700",
          "fontFamily": "monospace",
          "color": "#000000",
          "letterSpacing": "0.05em",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#000000",
          "textTransform": "uppercase"
        },
        "h2": {
          "fontSize": 30,
          "fontWeight": "700",
          "fontFamily": "monospace",
          "color": "#000000",
          "letterSpacing": "0.05em",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#000000",
          "textTransform": "uppercase"
        },
        "h3": {
          "fontSize": 24,
          "fontWeight": "700",
          "fontFamily": "monospace",
          "color": "#000000",
          "letterSpacing": "0.05em",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#000000",
          "textTransform": "uppercase"
        },
        "h4": {
          "fontSize": 20,
          "fontWeight": "700",
          "fontFamily": "monospace",
          "color": "#000000",
          "letterSpacing": "0.05em",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#000000",
          "textTransform": "uppercase"
        },
        "h5": {
          "fontSize": 18,
          "fontWeight": "700",
          "fontFamily": "monospace",
          "color": "#000000",
          "letterSpacing": "0.05em",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#000000",
          "textTransform": "uppercase"
        },
        "h6": {
          "fontSize": 16,
          "fontWeight": "700",
          "fontFamily": "monospace",
          "color": "#000000",
          "letterSpacing": "0.05em",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#000000",
          "textTransform": "uppercase"
        },
        "p": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#000000",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#333333",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#333333",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 14,
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
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#333333",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#333333"
        },
        "bodyBase": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#000000",
          "darkColor": "#000000",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#333333",
          "darkColor": "#333333",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#333333",
          "darkColor": "#333333",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#00FFFF",
        "infoBorder": "#FF003C",
        "infoIcon": "#60a5fa",
        "infoTitle": "#FF003C",
        "infoText": "#000000",
        "successBg": "#00FF41",
        "successBorder": "#00FF41",
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
        "spinnerColor": "#FF003C",
        "spinnerSecondaryColor": "#457bb5",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#000000",
        "progressFill": "#FF003C",
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
        "primaryBg": "#00FF41",
        "primaryHoverBg": "#FF003C",
        "primaryText": "#0D0208",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#121212",
        "secondaryHoverBg": "#122940",
        "secondaryText": "#00FF41",
        "secondaryBorder": "#00FF41",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#FF003C",
        "destructiveHoverBg": "#610f24",
        "destructiveText": "#cfcfcf",
        "destructiveLabel": "Destructive",
        "ghostText": "#9ea5ae",
        "ghostHoverBg": "#eff6ff",
        "ghostLabel": "Ghost Button",
        "borderRadius": 0,
        "paddingX": 20,
        "paddingY": 8,
        "fontWeight": "500",
        "typographyVariant": "buttonText",
        "fontSize": 14,
        "fontFamily": "'Courier New', Courier, monospace",
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
        "bg": "#121212",
        "borderColor": "#00FF41",
        "focusRingColor": "#3b82f6",
        "borderRadius": 0,
        "paddingX": 16,
        "paddingY": 8,
        "placeholder": "Enter text...",
        "textColor": "#00FF41",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#00FF41",
        "borderColor": "#00FF41",
        "textColor": "#008F11",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#121212",
        "dotColor": "#00FF41",
        "textColor": "#008F11",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#00FF41",
        "bgOff": "#00FF41",
        "circleOn": "#0D0208",
        "circleOff": "#121212"
      },
      "segmented": {
        "bg": "#0D0208",
        "selectedBg": "#121212",
        "selectedText": "#00FF41",
        "textColor": "#008F11",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#121212",
        "borderColor": "#00FF41",
        "borderRadius": 0,
        "padding": 16,
        "titleColor": "#008F11",
        "valueColor": "#00FF41",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#121212",
        "borderColor": "#00FF41",
        "activeText": "#00FF41",
        "activeBorder": "#00FF41",
        "inactiveText": "#008F11",
        "hoverText": "#00FF41",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#121212",
        "stepBorder": "#00FF41",
        "activeBg": "#FF003C",
        "activeBorder": "#00FF41",
        "activeText": "#FFFFFF",
        "completedBg": "#00FF41",
        "completedBorder": "#00FF41",
        "completedText": "#a7f3d0",
        "inactiveText": "#008F11"
      },
      "overlay": {
        "bg": "#121212",
        "borderColor": "#00FF41",
        "textColor": "#008F11",
        "headerTextColor": "#00FF41",
        "footerBg": "#0D0208",
        "borderRadius": 0,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#121212",
        "borderColor": "#00FF41",
        "headerText": "#008F11",
        "rowText": "#00FF41",
        "rowBorder": "#00FF41",
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
        "bg": "#FF003C",
        "borderColor": "#00FF41",
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
          "fontSize": 36,
          "fontWeight": "700",
          "fontFamily": "monospace",
          "color": "#00FF41",
          "letterSpacing": "0.05em",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#00FF41",
          "textTransform": "uppercase"
        },
        "h2": {
          "fontSize": 30,
          "fontWeight": "700",
          "fontFamily": "monospace",
          "color": "#00FF41",
          "letterSpacing": "0.05em",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#00FF41",
          "textTransform": "uppercase"
        },
        "h3": {
          "fontSize": 24,
          "fontWeight": "700",
          "fontFamily": "monospace",
          "color": "#00FF41",
          "letterSpacing": "0.05em",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#00FF41",
          "textTransform": "uppercase"
        },
        "h4": {
          "fontSize": 20,
          "fontWeight": "700",
          "fontFamily": "monospace",
          "color": "#00FF41",
          "letterSpacing": "0.05em",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#00FF41",
          "textTransform": "uppercase"
        },
        "h5": {
          "fontSize": 18,
          "fontWeight": "700",
          "fontFamily": "monospace",
          "color": "#00FF41",
          "letterSpacing": "0.05em",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#00FF41",
          "textTransform": "uppercase"
        },
        "h6": {
          "fontSize": 16,
          "fontWeight": "700",
          "fontFamily": "monospace",
          "color": "#00FF41",
          "letterSpacing": "0.05em",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#00FF41",
          "textTransform": "uppercase"
        },
        "p": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#00FF41",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#008F11",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#008F11",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#00FF41",
          "bg": "#1e293b",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#00FF41",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#008F11",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#008F11"
        },
        "bodyBase": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#00FF41",
          "darkColor": "#00FF41",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#008F11",
          "darkColor": "#008F11",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#008F11",
          "darkColor": "#008F11",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#FF003C",
        "infoBorder": "#00FF41",
        "infoIcon": "#3b82f6",
        "infoTitle": "#00FF41",
        "infoText": "#FFFFFF",
        "successBg": "#00FF41",
        "successBorder": "#00FF41",
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
        "spinnerColor": "#00FF41",
        "spinnerSecondaryColor": "#64748b",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#00FF41",
        "progressFill": "#00FF41",
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
