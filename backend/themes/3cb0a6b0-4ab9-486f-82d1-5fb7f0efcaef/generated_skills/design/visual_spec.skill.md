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
      "background_secondary": "#FDE68A",
      "text_primary": "#451A03",
      "text_secondary": "#451A03",
      "border": "#FDE68A",
      "chart_palette": [
        "#92400E",
        "#B45309",
        "#D97706",
        "#F59E0B",
        "#78350F",
        "#451A03",
        "#B45309",
        "#92400E",
        "#D97706",
        "#78350F"
      ]
    },
    "dark": {
      "background_primary": "#78350F",
      "background_secondary": "#B45309",
      "text_primary": "#FFFBEB",
      "text_secondary": "#FFFBEB",
      "border": "#B45309",
      "chart_palette": [
        "#92400E",
        "#B45309",
        "#D97706",
        "#F59E0B",
        "#78350F",
        "#451A03",
        "#B45309",
        "#92400E",
        "#D97706",
        "#78350F"
      ]
    }
  },
  "typography": {
    "font_family": "Inter, sans-serif"
  },
  "components": {
    "light": {
      "button": {
        "primaryBg": "#92400E",
        "primaryHoverBg": "#FEF3C7",
        "primaryText": "#FFFFFF",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#FFFFFF",
        "secondaryHoverBg": "#f8fafc",
        "secondaryText": "#451A03",
        "secondaryBorder": "#FDE68A",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#DC2626",
        "destructiveHoverBg": "#a91439",
        "destructiveText": "#ffffff",
        "destructiveLabel": "Destructive",
        "ghostText": "#598dc5",
        "ghostHoverBg": "#e9edf1",
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
        "bg": "#FFFFFF",
        "borderColor": "#FDE68A",
        "focusRingColor": "#3b82f6",
        "borderRadius": 4,
        "paddingX": 12,
        "paddingY": 8,
        "placeholder": "Enter text...",
        "textColor": "#451A03",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#92400E",
        "borderColor": "#FDE68A",
        "textColor": "#92400E",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#FFFFFF",
        "dotColor": "#92400E",
        "textColor": "#92400E",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#92400E",
        "bgOff": "#FDE68A",
        "circleOn": "#FFFFFF",
        "circleOff": "#FFFFFF"
      },
      "segmented": {
        "bg": "#FFFBEB",
        "selectedBg": "#FFFFFF",
        "selectedText": "#92400E",
        "textColor": "#92400E",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#FFFFFF",
        "borderColor": "#FDE68A",
        "borderRadius": 4,
        "padding": 24,
        "titleColor": "#92400E",
        "valueColor": "#92400E",
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
        "borderColor": "#FDE68A",
        "activeText": "#92400E",
        "activeBorder": "#92400E",
        "inactiveText": "#92400E",
        "hoverText": "#451A03",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#FFFFFF",
        "stepBorder": "#FDE68A",
        "activeBg": "#FEF3C7",
        "activeBorder": "#92400E",
        "activeText": "#B45309",
        "completedBg": "#16A34A",
        "completedBorder": "#16A34A",
        "completedText": "#047857",
        "inactiveText": "#92400E"
      },
      "overlay": {
        "bg": "#FFFFFF",
        "borderColor": "#FDE68A",
        "textColor": "#92400E",
        "headerTextColor": "#451A03",
        "footerBg": "#FFFBEB",
        "borderRadius": 4,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#FFFFFF",
        "borderColor": "#FDE68A",
        "headerText": "#92400E",
        "rowText": "#451A03",
        "rowBorder": "#FDE68A",
        "borderRadius": 4,
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
        "bg": "#FEF3C7",
        "borderColor": "#92400E",
        "textColor": "#B45309",
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
          "fontWeight": "500",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#451A03",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#451A03",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 30,
          "fontWeight": "500",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#451A03",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#451A03",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 24,
          "fontWeight": "500",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#451A03",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#451A03",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 20,
          "fontWeight": "500",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#451A03",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#451A03",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 18,
          "fontWeight": "500",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#451A03",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#451A03",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#451A03",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#451A03",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#451A03",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#92400E",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#92400E",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#451A03",
          "bg": "#f1f5f9",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#451A03",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#92400E",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#92400E"
        },
        "bodyBase": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#451A03",
          "darkColor": "#451A03",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#92400E",
          "darkColor": "#92400E",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#92400E",
          "darkColor": "#92400E",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#FEF3C7",
        "infoBorder": "#92400E",
        "infoIcon": "#60a5fa",
        "infoTitle": "#92400E",
        "infoText": "#B45309",
        "successBg": "#16A34A",
        "successBorder": "#16A34A",
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
        "spinnerColor": "#92400E",
        "spinnerSecondaryColor": "#457bb5",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#FDE68A",
        "progressFill": "#92400E",
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
        "primaryBg": "#FCD34D",
        "primaryHoverBg": "#92400E",
        "primaryText": "#451A03",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#78350F",
        "secondaryHoverBg": "#122940",
        "secondaryText": "#FFFBEB",
        "secondaryBorder": "#B45309",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#F87171",
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
        "bg": "#78350F",
        "borderColor": "#B45309",
        "focusRingColor": "#3b82f6",
        "borderRadius": 4,
        "paddingX": 12,
        "paddingY": 8,
        "placeholder": "Enter text...",
        "textColor": "#FFFBEB",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#FCD34D",
        "borderColor": "#B45309",
        "textColor": "#FDE68A",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#78350F",
        "dotColor": "#FCD34D",
        "textColor": "#FDE68A",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#FCD34D",
        "bgOff": "#B45309",
        "circleOn": "#451A03",
        "circleOff": "#78350F"
      },
      "segmented": {
        "bg": "#451A03",
        "selectedBg": "#78350F",
        "selectedText": "#FCD34D",
        "textColor": "#FDE68A",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#78350F",
        "borderColor": "#B45309",
        "borderRadius": 4,
        "padding": 24,
        "titleColor": "#FDE68A",
        "valueColor": "#FCD34D",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#78350F",
        "borderColor": "#B45309",
        "activeText": "#FCD34D",
        "activeBorder": "#FCD34D",
        "inactiveText": "#FDE68A",
        "hoverText": "#FFFBEB",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#78350F",
        "stepBorder": "#B45309",
        "activeBg": "#92400E",
        "activeBorder": "#FCD34D",
        "activeText": "#FEF3C7",
        "completedBg": "#4ADE80",
        "completedBorder": "#4ADE80",
        "completedText": "#a7f3d0",
        "inactiveText": "#FDE68A"
      },
      "overlay": {
        "bg": "#78350F",
        "borderColor": "#B45309",
        "textColor": "#FDE68A",
        "headerTextColor": "#FFFBEB",
        "footerBg": "#451A03",
        "borderRadius": 4,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#78350F",
        "borderColor": "#B45309",
        "headerText": "#FDE68A",
        "rowText": "#FFFBEB",
        "rowBorder": "#B45309",
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
        "bg": "#92400E",
        "borderColor": "#FCD34D",
        "textColor": "#FEF3C7",
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
          "fontWeight": "500",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FFFBEB",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#FFFBEB",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 30,
          "fontWeight": "500",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FFFBEB",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#FFFBEB",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 24,
          "fontWeight": "500",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FFFBEB",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#FFFBEB",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 20,
          "fontWeight": "500",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FFFBEB",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#FFFBEB",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 18,
          "fontWeight": "500",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FFFBEB",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#FFFBEB",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FFFBEB",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#FFFBEB",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FFFBEB",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FDE68A",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FDE68A",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#FFFBEB",
          "bg": "#1e293b",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#FFFBEB",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FDE68A",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#FDE68A"
        },
        "bodyBase": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FFFBEB",
          "darkColor": "#FFFBEB",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 14,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FDE68A",
          "darkColor": "#FDE68A",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 12,
          "fontWeight": "400",
          "fontFamily": "ui-serif, Georgia, serif",
          "color": "#FDE68A",
          "darkColor": "#FDE68A",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#92400E",
        "infoBorder": "#FCD34D",
        "infoIcon": "#3b82f6",
        "infoTitle": "#FCD34D",
        "infoText": "#FEF3C7",
        "successBg": "#4ADE80",
        "successBorder": "#4ADE80",
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
        "spinnerColor": "#FCD34D",
        "spinnerSecondaryColor": "#64748b",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#B45309",
        "progressFill": "#FCD34D",
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
