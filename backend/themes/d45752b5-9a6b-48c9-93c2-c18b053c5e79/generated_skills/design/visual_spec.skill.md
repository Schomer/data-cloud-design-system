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
      "background_secondary": "#D8DEE9",
      "text_primary": "#2E3440",
      "text_secondary": "#2E3440",
      "border": "#D8DEE9",
      "chart_palette": [
        "#88C0D0",
        "#81A1C1",
        "#5E81AC",
        "#A3BE8C",
        "#B48EAD",
        "#EBCB8B",
        "#D08770",
        "#BF616A",
        "#4C566A",
        "#ECEFF4"
      ]
    },
    "dark": {
      "background_primary": "#3B4252",
      "background_secondary": "#4C566A",
      "text_primary": "#ECEFF4",
      "text_secondary": "#ECEFF4",
      "border": "#4C566A",
      "chart_palette": [
        "#88C0D0",
        "#81A1C1",
        "#5E81AC",
        "#A3BE8C",
        "#B48EAD",
        "#EBCB8B",
        "#D08770",
        "#BF616A",
        "#4C566A",
        "#ECEFF4"
      ]
    }
  },
  "typography": {
    "font_family": "Inter, sans-serif"
  },
  "components": {
    "light": {
      "button": {
        "primaryBg": "#5E81AC",
        "primaryHoverBg": "#E5E9F0",
        "primaryText": "#FFFFFF",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#FFFFFF",
        "secondaryHoverBg": "#f8fafc",
        "secondaryText": "#2E3440",
        "secondaryBorder": "#D8DEE9",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#BF616A",
        "destructiveHoverBg": "#a91439",
        "destructiveText": "#ffffff",
        "destructiveLabel": "Destructive",
        "ghostText": "#598dc5",
        "ghostHoverBg": "#e9edf1",
        "ghostLabel": "Ghost Button",
        "borderRadius": 6,
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
        "borderColor": "#D8DEE9",
        "focusRingColor": "#3b82f6",
        "borderRadius": 6,
        "paddingX": 12,
        "paddingY": 8,
        "placeholder": "Enter text...",
        "textColor": "#2E3440",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#5E81AC",
        "borderColor": "#D8DEE9",
        "textColor": "#4C566A",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#FFFFFF",
        "dotColor": "#5E81AC",
        "textColor": "#4C566A",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#5E81AC",
        "bgOff": "#D8DEE9",
        "circleOn": "#FFFFFF",
        "circleOff": "#FFFFFF"
      },
      "segmented": {
        "bg": "#ECEFF4",
        "selectedBg": "#FFFFFF",
        "selectedText": "#5E81AC",
        "textColor": "#4C566A",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#FFFFFF",
        "borderColor": "#D8DEE9",
        "borderRadius": 6,
        "padding": 20,
        "titleColor": "#4C566A",
        "valueColor": "#5E81AC",
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
        "borderColor": "#D8DEE9",
        "activeText": "#5E81AC",
        "activeBorder": "#5E81AC",
        "inactiveText": "#4C566A",
        "hoverText": "#2E3440",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#FFFFFF",
        "stepBorder": "#D8DEE9",
        "activeBg": "#E5E9F0",
        "activeBorder": "#5E81AC",
        "activeText": "#4C566A",
        "completedBg": "#A3BE8C",
        "completedBorder": "#A3BE8C",
        "completedText": "#047857",
        "inactiveText": "#4C566A"
      },
      "overlay": {
        "bg": "#FFFFFF",
        "borderColor": "#D8DEE9",
        "textColor": "#4C566A",
        "headerTextColor": "#2E3440",
        "footerBg": "#ECEFF4",
        "borderRadius": 6,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#FFFFFF",
        "borderColor": "#D8DEE9",
        "headerText": "#4C566A",
        "rowText": "#2E3440",
        "rowBorder": "#D8DEE9",
        "borderRadius": 6,
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
        "bg": "#E5E9F0",
        "borderColor": "#5E81AC",
        "textColor": "#4C566A",
        "borderRadius": 6
      },
      "tooltip": {
        "bg": "#ffffff",
        "textColor": "#484747",
        "typographyVariant": "xs"
      },
      "typography": {
        "h1": {
          "fontSize": 36,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#2E3440",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#2E3440",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 30,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#2E3440",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#2E3440",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 24,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#2E3440",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#2E3440",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 20,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#2E3440",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#2E3440",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 18,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#2E3440",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#2E3440",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#2E3440",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#2E3440",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#2E3440",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#4C566A",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#4C566A",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#2E3440",
          "bg": "#f1f5f9",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#2E3440",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#4C566A",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#4C566A"
        },
        "bodyBase": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#2E3440",
          "darkColor": "#2E3440",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#4C566A",
          "darkColor": "#4C566A",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#4C566A",
          "darkColor": "#4C566A",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#E5E9F0",
        "infoBorder": "#5E81AC",
        "infoIcon": "#60a5fa",
        "infoTitle": "#5E81AC",
        "infoText": "#4C566A",
        "successBg": "#A3BE8C",
        "successBorder": "#A3BE8C",
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
        "borderRadius": 6
      },
      "loader": {
        "spinnerColor": "#5E81AC",
        "spinnerSecondaryColor": "#457bb5",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#D8DEE9",
        "progressFill": "#5E81AC",
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
        "primaryBg": "#88C0D0",
        "primaryHoverBg": "#434C5E",
        "primaryText": "#2E3440",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#3B4252",
        "secondaryHoverBg": "#122940",
        "secondaryText": "#ECEFF4",
        "secondaryBorder": "#4C566A",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#BF616A",
        "destructiveHoverBg": "#610f24",
        "destructiveText": "#cfcfcf",
        "destructiveLabel": "Destructive",
        "ghostText": "#9ea5ae",
        "ghostHoverBg": "#eff6ff",
        "ghostLabel": "Ghost Button",
        "borderRadius": 6,
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
        "bg": "#3B4252",
        "borderColor": "#4C566A",
        "focusRingColor": "#3b82f6",
        "borderRadius": 6,
        "paddingX": 12,
        "paddingY": 8,
        "placeholder": "Enter text...",
        "textColor": "#ECEFF4",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#88C0D0",
        "borderColor": "#4C566A",
        "textColor": "#E5E9F0",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#3B4252",
        "dotColor": "#88C0D0",
        "textColor": "#E5E9F0",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#88C0D0",
        "bgOff": "#4C566A",
        "circleOn": "#2E3440",
        "circleOff": "#3B4252"
      },
      "segmented": {
        "bg": "#2E3440",
        "selectedBg": "#3B4252",
        "selectedText": "#88C0D0",
        "textColor": "#E5E9F0",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#3B4252",
        "borderColor": "#4C566A",
        "borderRadius": 6,
        "padding": 20,
        "titleColor": "#E5E9F0",
        "valueColor": "#88C0D0",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#3B4252",
        "borderColor": "#4C566A",
        "activeText": "#88C0D0",
        "activeBorder": "#88C0D0",
        "inactiveText": "#E5E9F0",
        "hoverText": "#ECEFF4",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#3B4252",
        "stepBorder": "#4C566A",
        "activeBg": "#434C5E",
        "activeBorder": "#88C0D0",
        "activeText": "#ECEFF4",
        "completedBg": "#A3BE8C",
        "completedBorder": "#A3BE8C",
        "completedText": "#a7f3d0",
        "inactiveText": "#E5E9F0"
      },
      "overlay": {
        "bg": "#3B4252",
        "borderColor": "#4C566A",
        "textColor": "#E5E9F0",
        "headerTextColor": "#ECEFF4",
        "footerBg": "#2E3440",
        "borderRadius": 6,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#3B4252",
        "borderColor": "#4C566A",
        "headerText": "#E5E9F0",
        "rowText": "#ECEFF4",
        "rowBorder": "#4C566A",
        "borderRadius": 6,
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
        "bg": "#434C5E",
        "borderColor": "#88C0D0",
        "textColor": "#ECEFF4",
        "borderRadius": 6
      },
      "tooltip": {
        "bg": "#334155",
        "textColor": "#f8fafc",
        "typographyVariant": "xs"
      },
      "typography": {
        "h1": {
          "fontSize": 36,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#ECEFF4",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#ECEFF4",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 30,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#ECEFF4",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#ECEFF4",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 24,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#ECEFF4",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#ECEFF4",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 20,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#ECEFF4",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#ECEFF4",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 18,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#ECEFF4",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#ECEFF4",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Inter', sans-serif",
          "color": "#ECEFF4",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#ECEFF4",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#ECEFF4",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#E5E9F0",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#E5E9F0",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#ECEFF4",
          "bg": "#1e293b",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#ECEFF4",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#E5E9F0",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#E5E9F0"
        },
        "bodyBase": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#ECEFF4",
          "darkColor": "#ECEFF4",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#E5E9F0",
          "darkColor": "#E5E9F0",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#E5E9F0",
          "darkColor": "#E5E9F0",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#434C5E",
        "infoBorder": "#88C0D0",
        "infoIcon": "#3b82f6",
        "infoTitle": "#88C0D0",
        "infoText": "#ECEFF4",
        "successBg": "#A3BE8C",
        "successBorder": "#A3BE8C",
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
        "borderRadius": 6
      },
      "loader": {
        "spinnerColor": "#88C0D0",
        "spinnerSecondaryColor": "#64748b",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#4C566A",
        "progressFill": "#88C0D0",
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
