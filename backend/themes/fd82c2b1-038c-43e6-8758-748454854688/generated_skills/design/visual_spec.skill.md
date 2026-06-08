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
      "background_secondary": "#FED7AA",
      "text_primary": "#7C2D12",
      "text_secondary": "#7C2D12",
      "border": "#FED7AA",
      "chart_palette": [
        "#EA580C",
        "#C2410C",
        "#F59E0B",
        "#D97706",
        "#E11D48",
        "#9A3412",
        "#B45309",
        "#BE123C",
        "#F97316",
        "#F43F5E"
      ]
    },
    "dark": {
      "background_primary": "#7C2D12",
      "background_secondary": "#EA580C",
      "text_primary": "#FFF7ED",
      "text_secondary": "#FFF7ED",
      "border": "#EA580C",
      "chart_palette": [
        "#EA580C",
        "#C2410C",
        "#F59E0B",
        "#D97706",
        "#E11D48",
        "#9A3412",
        "#B45309",
        "#BE123C",
        "#F97316",
        "#F43F5E"
      ]
    }
  },
  "typography": {
    "font_family": "Inter, sans-serif"
  },
  "components": {
    "light": {
      "button": {
        "primaryBg": "#EA580C",
        "primaryHoverBg": "#FFEDD5",
        "primaryText": "#FFFFFF",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#FFFFFF",
        "secondaryHoverBg": "#f8fafc",
        "secondaryText": "#7C2D12",
        "secondaryBorder": "#FED7AA",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#E11D48",
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
        "borderColor": "#FED7AA",
        "focusRingColor": "#3b82f6",
        "borderRadius": 16,
        "paddingX": 20,
        "paddingY": 10,
        "placeholder": "Enter text...",
        "textColor": "#7C2D12",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#EA580C",
        "borderColor": "#FED7AA",
        "textColor": "#EA580C",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#FFFFFF",
        "dotColor": "#EA580C",
        "textColor": "#EA580C",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#EA580C",
        "bgOff": "#FED7AA",
        "circleOn": "#FFFFFF",
        "circleOff": "#FFFFFF"
      },
      "segmented": {
        "bg": "#FFF7ED",
        "selectedBg": "#FFFFFF",
        "selectedText": "#EA580C",
        "textColor": "#EA580C",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#FFFFFF",
        "borderColor": "#FED7AA",
        "borderRadius": 16,
        "padding": 24,
        "titleColor": "#EA580C",
        "valueColor": "#EA580C",
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
        "borderColor": "#FED7AA",
        "activeText": "#EA580C",
        "activeBorder": "#EA580C",
        "inactiveText": "#EA580C",
        "hoverText": "#7C2D12",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#FFFFFF",
        "stepBorder": "#FED7AA",
        "activeBg": "#FFEDD5",
        "activeBorder": "#EA580C",
        "activeText": "#C2410C",
        "completedBg": "#16A34A",
        "completedBorder": "#16A34A",
        "completedText": "#047857",
        "inactiveText": "#EA580C"
      },
      "overlay": {
        "bg": "#FFFFFF",
        "borderColor": "#FED7AA",
        "textColor": "#EA580C",
        "headerTextColor": "#7C2D12",
        "footerBg": "#FFF7ED",
        "borderRadius": 16,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#FFFFFF",
        "borderColor": "#FED7AA",
        "headerText": "#EA580C",
        "rowText": "#7C2D12",
        "rowBorder": "#FED7AA",
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
        "bg": "#FFEDD5",
        "borderColor": "#EA580C",
        "textColor": "#C2410C",
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
          "fontWeight": "700",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#7C2D12",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#7C2D12",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 33,
          "fontWeight": "700",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#7C2D12",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#7C2D12",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 26,
          "fontWeight": "700",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#7C2D12",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#7C2D12",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 22,
          "fontWeight": "700",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#7C2D12",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#7C2D12",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 19,
          "fontWeight": "700",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#7C2D12",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#7C2D12",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 17,
          "fontWeight": "700",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#7C2D12",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#7C2D12",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 17,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#7C2D12",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#EA580C",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 13,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#EA580C",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#7C2D12",
          "bg": "#f1f5f9",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#7C2D12",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#EA580C",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#EA580C"
        },
        "bodyBase": {
          "fontSize": 17,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#7C2D12",
          "darkColor": "#7C2D12",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#EA580C",
          "darkColor": "#EA580C",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 13,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#EA580C",
          "darkColor": "#EA580C",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#FFEDD5",
        "infoBorder": "#EA580C",
        "infoIcon": "#60a5fa",
        "infoTitle": "#EA580C",
        "infoText": "#C2410C",
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
        "borderRadius": 16
      },
      "loader": {
        "spinnerColor": "#EA580C",
        "spinnerSecondaryColor": "#457bb5",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#FED7AA",
        "progressFill": "#EA580C",
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
        "primaryBg": "#FB923C",
        "primaryHoverBg": "#C2410C",
        "primaryText": "#431407",
        "primaryLabel": "Primary Action",
        "secondaryBg": "#7C2D12",
        "secondaryHoverBg": "#122940",
        "secondaryText": "#FFF7ED",
        "secondaryBorder": "#EA580C",
        "secondaryLabel": "Secondary",
        "destructiveBg": "#FDA4AF",
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
        "bg": "#7C2D12",
        "borderColor": "#EA580C",
        "focusRingColor": "#3b82f6",
        "borderRadius": 16,
        "paddingX": 20,
        "paddingY": 10,
        "placeholder": "Enter text...",
        "textColor": "#FFF7ED",
        "typographyVariant": "p",
        "darkBg": "#121212",
        "darkBorderColor": "#1e293b"
      },
      "checkbox": {
        "bg": "#FB923C",
        "borderColor": "#EA580C",
        "textColor": "#FED7AA",
        "typographyVariant": "p"
      },
      "radio": {
        "bg": "#7C2D12",
        "dotColor": "#FB923C",
        "textColor": "#FED7AA",
        "typographyVariant": "p"
      },
      "switch": {
        "bgOn": "#FB923C",
        "bgOff": "#EA580C",
        "circleOn": "#431407",
        "circleOff": "#7C2D12"
      },
      "segmented": {
        "bg": "#431407",
        "selectedBg": "#7C2D12",
        "selectedText": "#FB923C",
        "textColor": "#FED7AA",
        "typographyVariant": "small"
      },
      "card": {
        "bg": "#7C2D12",
        "borderColor": "#EA580C",
        "borderRadius": 16,
        "padding": 24,
        "titleColor": "#FED7AA",
        "valueColor": "#FB923C",
        "defaultTitle": "KPI Metric",
        "titleTypography": "xs",
        "valueTypography": "h2",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b",
        "darkTitleColor": "#94a3b8",
        "darkValueColor": "#3b82f6"
      },
      "nav": {
        "bg": "#7C2D12",
        "borderColor": "#EA580C",
        "activeText": "#FB923C",
        "activeBorder": "#FB923C",
        "inactiveText": "#FED7AA",
        "hoverText": "#FFF7ED",
        "defaultText": "Nav Item",
        "typographyVariant": "small",
        "darkActiveText": "#60a5fa",
        "darkInactiveText": "#cbd5e1",
        "darkHoverText": "#e2e8f0"
      },
      "wizard": {
        "stepBg": "#7C2D12",
        "stepBorder": "#EA580C",
        "activeBg": "#C2410C",
        "activeBorder": "#FB923C",
        "activeText": "#FFEDD5",
        "completedBg": "#4ADE80",
        "completedBorder": "#4ADE80",
        "completedText": "#a7f3d0",
        "inactiveText": "#FED7AA"
      },
      "overlay": {
        "bg": "#7C2D12",
        "borderColor": "#EA580C",
        "textColor": "#FED7AA",
        "headerTextColor": "#FFF7ED",
        "footerBg": "#431407",
        "borderRadius": 16,
        "title": "Overlay Modal",
        "darkBg": "#1a1a1a",
        "darkBorderColor": "#1e293b"
      },
      "table": {
        "bg": "#7C2D12",
        "borderColor": "#EA580C",
        "headerText": "#FED7AA",
        "rowText": "#FFF7ED",
        "rowBorder": "#EA580C",
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
        "bg": "#C2410C",
        "borderColor": "#FB923C",
        "textColor": "#FFEDD5",
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
          "fontWeight": "700",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FFF7ED",
          "letterSpacing": "normal",
          "lineHeight": "1",
          "content": "Display Headline",
          "darkColor": "#FFF7ED",
          "textTransform": "none"
        },
        "h2": {
          "fontSize": 33,
          "fontWeight": "700",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FFF7ED",
          "letterSpacing": "normal",
          "lineHeight": "1.25",
          "content": "Page Title",
          "darkColor": "#FFF7ED",
          "textTransform": "none"
        },
        "h3": {
          "fontSize": 26,
          "fontWeight": "700",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FFF7ED",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Section Header",
          "darkColor": "#FFF7ED",
          "textTransform": "none"
        },
        "h4": {
          "fontSize": 22,
          "fontWeight": "700",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FFF7ED",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Card Title",
          "darkColor": "#FFF7ED",
          "textTransform": "none"
        },
        "h5": {
          "fontSize": 19,
          "fontWeight": "700",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FFF7ED",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subsection",
          "darkColor": "#FFF7ED",
          "textTransform": "none"
        },
        "h6": {
          "fontSize": 17,
          "fontWeight": "700",
          "fontFamily": "'Outfit', sans-serif",
          "color": "#FFF7ED",
          "letterSpacing": "normal",
          "lineHeight": "1.375",
          "content": "Subtitle",
          "darkColor": "#FFF7ED",
          "textTransform": "none"
        },
        "p": {
          "fontSize": 17,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FFF7ED",
          "letterSpacing": "normal",
          "lineHeight": "1.6",
          "content": "Standard body text for reading descriptions."
        },
        "small": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FED7AA",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Caption or fine print."
        },
        "xs": {
          "fontSize": 13,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FED7AA",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "Extra small and utility text."
        },
        "mono": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "monospace",
          "color": "#FFF7ED",
          "bg": "#1e293b",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "UUID-8472-A9F3-XYZ",
          "darkColor": "#FFF7ED",
          "darkBg": "#1e293b"
        },
        "muted": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FED7AA",
          "fontStyle": "italic",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "No data available for the selected period.",
          "darkColor": "#FED7AA"
        },
        "bodyBase": {
          "fontSize": 17,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FFF7ED",
          "darkColor": "#FFF7ED",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. This base text size is used for primary article content, long descriptions, or modal body text. It offers the best readability for long-form reading."
        },
        "bodySmall": {
          "fontSize": 15,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FED7AA",
          "darkColor": "#FED7AA",
          "letterSpacing": "normal",
          "lineHeight": "1.625",
          "content": "The quick brown fox jumps over the lazy dog. Small text is commonly used for data table rows, secondary descriptions, or UI element labels where space is tighter."
        },
        "bodyXs": {
          "fontSize": 13,
          "fontWeight": "400",
          "fontFamily": "'Inter', sans-serif",
          "color": "#FED7AA",
          "darkColor": "#FED7AA",
          "letterSpacing": "normal",
          "lineHeight": "1.5",
          "content": "The quick brown fox jumps over the lazy dog. Extra small text is reserved for metadata, timestamps, chart axis labels, and subtle helper text below inputs."
        }
      },
      "alert": {
        "infoBg": "#C2410C",
        "infoBorder": "#FB923C",
        "infoIcon": "#3b82f6",
        "infoTitle": "#FB923C",
        "infoText": "#FFEDD5",
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
        "borderRadius": 16
      },
      "loader": {
        "spinnerColor": "#FB923C",
        "spinnerSecondaryColor": "#64748b",
        "spinnerSuccessColor": "#10b981",
        "progressBg": "#EA580C",
        "progressFill": "#FB923C",
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
