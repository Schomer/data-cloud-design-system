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
      "background_secondary": "#FBCFE8",
      "text_primary": "#831843",
      "text_secondary": "#831843",
      "border": "#FBCFE8",
      "chart_palette": [
        "#F472B6",
        "#A78BFA",
        "#60A5FA",
        "#34D399",
        "#FBBF24",
        "#FDE047",
        "#FCA5A5",
        "#818CF8",
        "#C084FC",
        "#E879F9"
      ]
    },
    "dark": {
      "background_primary": "#5B21B6",
      "background_secondary": "#8B5CF6",
      "text_primary": "#FDF2F8",
      "text_secondary": "#FDF2F8",
      "border": "#8B5CF6",
      "chart_palette": [
        "#F472B6",
        "#A78BFA",
        "#60A5FA",
        "#34D399",
        "#FBBF24",
        "#FDE047",
        "#FCA5A5",
        "#818CF8",
        "#C084FC",
        "#E879F9"
      ]
    }
  },
  "typography": {
    "font_family": "Inter, sans-serif"
  },
  "components": {
    "light": {
      "button": {
        "primaryBg": "#F472B6",
        "primaryHoverBg": "#FCE7F3",
        "primaryText": "#FFFFFF",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#FFFFFF",
        "secondaryHoverBg": "#f8fafc",
        "secondaryText": "#831843",
        "secondaryBorder": "#FBCFE8",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#FB7185",
        "destructiveHoverBg": "#a91439",
        "destructiveText": "#ffffff",
        "destructiveLabel": "Destructive",
        "ghostText": "#598dc5",
        "ghostHoverBg": "#e9edf1",
        "ghostLabel": "Ghost Button",
        "borderRadius": 24,
        "paddingX": 32,
        "paddingY": 12,
        "fontWeight": "500",
        "typographyVariant": "buttonText",
        "fontSize": 14,
        "fontFamily": "'Outfit', sans-serif",
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
        "borderColor": "#FBCFE8",
        "focusRingColor": "#3b82f6",
        "borderRadius": 24,
        "paddingX": 28,
        "paddingY": 12,
        "placeholder": "Enter text...",
        "textColor": "#831843",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#F472B6",
        "borderColor": "#FBCFE8",
        "textColor": "#F472B6",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#FFFFFF",
        "dotColor": "#F472B6",
        "textColor": "#F472B6",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#F472B6",
        "bgOff": "#FBCFE8",
        "circleOn": "#FFFFFF",
        "circleOff": "#FFFFFF"
      },
      "segmented": {
        "bg": "#FDF2F8",
        "selectedBg": "#FFFFFF",
        "selectedText": "#F472B6",
        "textColor": "#F472B6",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#FFFFFF",
        "borderColor": "#FBCFE8",
        "borderRadius": 24,
        "padding": 32,
        "titleColor": "#F472B6",
        "valueColor": "#F472B6",
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
        "borderColor": "#FBCFE8",
        "activeText": "#F472B6",
        "activeBorder": "#F472B6",
        "inactiveText": "#F472B6",
        "hoverText": "#831843",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#FFFFFF",
        "stepBorder": "#FBCFE8",
        "activeBg": "#FCE7F3",
        "activeBorder": "#F472B6",
        "activeText": "#DB2777",
        "completedBg": "#34D399",
        "completedBorder": "#34D399",
        "completedText": "#047857",
        "inactiveText": "#F472B6"
      },
      "overlay": {
        "bg": "#FFFFFF",
        "borderColor": "#FBCFE8",
        "textColor": "#F472B6",
        "headerTextColor": "#831843",
        "footerBg": "#FDF2F8",
        "borderRadius": 24,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#FFFFFF",
        "borderColor": "#FBCFE8",
        "headerText": "#F472B6",
        "rowText": "#831843",
        "rowBorder": "#FBCFE8",
        "borderRadius": 24,
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
        "bg": "#FCE7F3",
        "borderColor": "#F472B6",
        "textColor": "#DB2777",
        "borderRadius": 9999
      },
      "tooltip": {
        "bg": "#ffffff",
        "textColor": "#484747",
        "typographyVariant": "xs"
      },
      "typography": {
        "h1": {
          "fontSize": 41,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#831843",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#831843",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 34,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#831843",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#831843",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 27,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#831843",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#831843",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 23,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#831843",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#831843",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 20,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#831843",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#831843",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 18,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#831843",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#831843",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 18,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#831843",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F472B6",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 13,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F472B6",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#831843",
          "bg": "#f1f5f9",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#831843",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F472B6",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#F472B6"
        },
        "bodyBase": {
          "fontSize": 18,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#831843",
          "darkColor": "#831843",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F472B6",
          "darkColor": "#F472B6",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 13,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#F472B6",
          "darkColor": "#F472B6",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#FCE7F3",
        "infoBorder": "#F472B6",
        "infoIcon": "#60a5fa",
        "infoTitle": "#F472B6",
        "infoText": "#DB2777",
        "successBg": "#34D399",
        "successBorder": "#34D399",
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
        "borderRadius": 24
      },
      "loader": {
        "spinnerColor": "#F472B6",
        "spinnerSecondaryColor": "#457bb5",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#FBCFE8",
        "progressFill": "#F472B6",
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
        "primaryBg": "#F472B6",
        "primaryHoverBg": "#7C3AED",
        "primaryText": "#4C1D95",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#5B21B6",
        "secondaryHoverBg": "#122940",
        "secondaryText": "#FDF2F8",
        "secondaryBorder": "#8B5CF6",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#FDA4AF",
        "destructiveHoverBg": "#610f24",
        "destructiveText": "#cfcfcf",
        "destructiveLabel": "Destructive",
        "ghostText": "#9ea5ae",
        "ghostHoverBg": "#eff6ff",
        "ghostLabel": "Ghost Button",
        "borderRadius": 24,
        "paddingX": 32,
        "paddingY": 12,
        "fontWeight": "500",
        "typographyVariant": "buttonText",
        "fontSize": 14,
        "fontFamily": "'Outfit', sans-serif",
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
        "bg": "#5B21B6",
        "borderColor": "#8B5CF6",
        "focusRingColor": "#3b82f6",
        "borderRadius": 24,
        "paddingX": 28,
        "paddingY": 12,
        "placeholder": "Enter text...",
        "textColor": "#FDF2F8",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#F472B6",
        "borderColor": "#8B5CF6",
        "textColor": "#E9D5FF",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#5B21B6",
        "dotColor": "#F472B6",
        "textColor": "#E9D5FF",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#F472B6",
        "bgOff": "#8B5CF6",
        "circleOn": "#4C1D95",
        "circleOff": "#5B21B6"
      },
      "segmented": {
        "bg": "#4C1D95",
        "selectedBg": "#5B21B6",
        "selectedText": "#F472B6",
        "textColor": "#E9D5FF",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#5B21B6",
        "borderColor": "#8B5CF6",
        "borderRadius": 24,
        "padding": 32,
        "titleColor": "#E9D5FF",
        "valueColor": "#F472B6",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#5B21B6",
        "borderColor": "#8B5CF6",
        "activeText": "#F472B6",
        "activeBorder": "#F472B6",
        "inactiveText": "#E9D5FF",
        "hoverText": "#FDF2F8",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#5B21B6",
        "stepBorder": "#8B5CF6",
        "activeBg": "#7C3AED",
        "activeBorder": "#F472B6",
        "activeText": "#F5D0FE",
        "completedBg": "#6EE7B7",
        "completedBorder": "#6EE7B7",
        "completedText": "#a7f3d0",
        "inactiveText": "#E9D5FF"
      },
      "overlay": {
        "bg": "#5B21B6",
        "borderColor": "#8B5CF6",
        "textColor": "#E9D5FF",
        "headerTextColor": "#FDF2F8",
        "footerBg": "#4C1D95",
        "borderRadius": 24,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#5B21B6",
        "borderColor": "#8B5CF6",
        "headerText": "#E9D5FF",
        "rowText": "#FDF2F8",
        "rowBorder": "#8B5CF6",
        "borderRadius": 24,
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
        "bg": "#7C3AED",
        "borderColor": "#F472B6",
        "textColor": "#F5D0FE",
        "borderRadius": 9999
      },
      "tooltip": {
        "bg": "#334155",
        "textColor": "#f8fafc",
        "typographyVariant": "xs"
      },
      "typography": {
        "h1": {
          "fontSize": 41,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FDF2F8",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#FDF2F8",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 34,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FDF2F8",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#FDF2F8",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 27,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FDF2F8",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#FDF2F8",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 23,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FDF2F8",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#FDF2F8",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 20,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FDF2F8",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#FDF2F8",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 18,
          "fontWeight": "600",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FDF2F8",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#FDF2F8",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 18,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FDF2F8",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#E9D5FF",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 13,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#E9D5FF",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 16,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#FDF2F8",
          "bg": "#1e293b",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#FDF2F8",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#E9D5FF",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#E9D5FF"
        },
        "bodyBase": {
          "fontSize": 18,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FDF2F8",
          "darkColor": "#FDF2F8",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 16,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#E9D5FF",
          "darkColor": "#E9D5FF",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 13,
          "fontWeight": "500",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#E9D5FF",
          "darkColor": "#E9D5FF",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#7C3AED",
        "infoBorder": "#F472B6",
        "infoIcon": "#3b82f6",
        "infoTitle": "#F472B6",
        "infoText": "#F5D0FE",
        "successBg": "#6EE7B7",
        "successBorder": "#6EE7B7",
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
        "borderRadius": 24
      },
      "loader": {
        "spinnerColor": "#F472B6",
        "spinnerSecondaryColor": "#64748b",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#8B5CF6",
        "progressFill": "#F472B6",
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
