---
name: Feedback and Status
description: Guidelines and specifications for using alert messages, loaders, and other status indicators within the Cloud Data App Skills.
type: component
tags:
  - components
  - ui
  - feedback
  - alerts
  - loaders
  - status
---

# Feedback & Status Components

Feedback and status components are essential for communicating application state, contextual information, and processing indicators to users. They include Alert Banners/Inline Messages and Loaders/Spinners.

## Component Types

### Status Alerts
Status alerts communicate a message with a semantic state (Info, Success, Warning, Error).

*   **Info:** Used for neutral informational messages. (e.g., "New features are available.")
*   **Success:** Used to confirm a completed action or positive state. (e.g., "Settings saved successfully.")
*   **Warning:** Used to inform users of a situation that might require their attention or caution. (e.g., "Your license expires in 3 days.")
*   **Error:** Used to communicate critical failures, errors, or destructive actions. (e.g., "Failed to connect to the database.")

**Structure:**
*   **Icon:** A semantic icon indicating the alert type.
*   **Title/Header (Optional):** A brief summary of the message.
*   **Body:** A detailed description or instructions.

**Customization Properties:**
*   `infoBg`, `successBg`, `warningBg`, `errorBg`: The background color of the alert container.
*   `infoBorder`, `successBorder`, `warningBorder`, `errorBorder`: The border color of the alert container.
*   `infoIcon`, `successIcon`, `warningIcon`, `errorIcon`: The color of the semantic icon.
*   `infoTitle`, `successTitle`, `warningTitle`, `errorTitle`: The text color of the alert's title/header.
*   `infoText`, `successText`, `warningText`, `errorText`: The text color of the alert's body content.
*   `borderRadius`: The corner radius of the alert container.

### Loaders (Spinners & Progress Bars)
Loaders indicate that an operation is currently processing or data is being fetched.

*   **Spinners:** Indeterminate loaders (e.g., `lucide-react`'s `Loader2` with `animate-spin` utility) used for short, unspecified wait times.
*   **Progress Bars:** Determinate or indeterminate bars indicating progress of a longer-running task.

**Customization Properties:**
*   `spinnerColor`: Primary color used for main spinners.
*   `spinnerSecondaryColor`: Secondary or muted color used for inline or less prominent spinners.
*   `spinnerSuccessColor`: Color used for spinners indicating a positive but ongoing process.
*   `progressBg`: The background (track) color of a progress bar.
*   `progressFill`: The foreground (fill) color of a progress bar.
*   `borderRadius`: Corner styling for loaders (mainly affects progress bars).

## Implementation Rules

1.  **Editable Consistency**: Feedback & Status components MUST use the config properties mapped to standard web color strings in standard Javascript/React inline `style` tags to ensure dynamic updates reflect accurately. Do not hardcode Tailwind text or background colors if a `var(...)` implementation pattern is established.
2.  **Semantic Icons**: Ensure that when switching states, semantic icons roughly follow these defaults for consistency unless changed by a user explicitly. Always include an `aria-hidden="true"` attribute on decorative icons.
3.  **Contrast**: Ensure adequate color contrast ratios between background colors, texts, and icons, especially in both Light and Dark themes.

## Usage Example

```jsx
import { Info } from 'lucide-react';

<div className="p-4 border" style={{ backgroundColor: 'var(--info-bg)', borderColor: 'var(--info-border)', borderRadius: 'var(--alert-rad)' }}>
    <div className="flex">
        <div className="flex-shrink-0">
            <Info className="h-5 w-5" style={{ color: 'var(--info-icon)' }} aria-hidden="true" />
        </div>
        <div className="ml-3">
            <h3 className="text-sm font-medium" style={{ color: 'var(--info-title)' }}>Alert Title</h3>
            <div className="mt-2 text-sm" style={{ color: 'var(--info-text)' }}>
                <p>Alert descriptive body copy goes here.</p>
            </div>
        </div>
    </div>
</div>
```
