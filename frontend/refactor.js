const fs = require('fs');
let code = fs.readFileSync('src/components/EditorSidebar.jsx', 'utf8');

// 1. Add isDarkMode prop
code = code.replace(
    'export default function EditorSidebar() {',
    'export default function EditorSidebar({ isDarkMode }) {'
);

const lightProps = [
    'secondaryBg', 'secondaryHoverBg', 'secondaryText', 'secondaryBorder',
    'ghostHoverBg', 'ghostText',
    'bg', 'borderColor', 'titleColor', 'valueColor',
    'activeText', 'inactiveText', 'hoverText',
    'headerText', 'rowText', 'rowBorder'
];

// 2. We can wrap the divs! Let's find every `<div>` whose immediate next line has `<label`.
// Since the file is well formatted:
// "                                <div>\n                                    <label"

const lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
    // Detect <label>Dark Mode Overrides</label>
    if (lines[i].includes('>Dark Mode Overrides</label>')) {
        let match = lines[i].match(/^(\s*)(.+)/);
        if (match) {
            lines[i] = `${match[1]}{isDarkMode && ${match[2]}}`;
        }
        continue;
    }

    if (lines[i].match(/^\s*<div>\s*$/) && i + 1 < lines.length && lines[i + 1].includes('<label')) {
        // Collect the block until matching </div>
        let divIndent = lines[i].match(/^\s*/)[0].length;
        let j = i + 1;
        let isDark = false;
        let isLightOnly = false;

        while (j < lines.length) {
            if (lines[j].includes('updateGlobalSpec(')) {
                // e.g., updateGlobalSpec('button', 'primaryBg', e.target.value)
                const match = lines[j].match(/updateGlobalSpec\('[^']+',\s*'([^']+)'/);
                if (match) {
                    const propName = match[1];
                    if (propName.toLowerCase().includes('dark')) {
                        isDark = true;
                    } else if (lightProps.includes(propName)) {
                        isLightOnly = true;
                    }
                }
            }
            if (lines[j].match(/^\s*<\/div>\s*$/) && lines[j].match(/^\s*/)[0].length === divIndent) {
                break;
            }
            j++;
        }

        if (isDark || isLightOnly) {
            // wrap it!
            const indent = lines[i].match(/^\s*/)[0];
            lines[i] = `${indent}{${isDark ? 'isDarkMode' : '!isDarkMode'} && (\n${lines[i]}`;
            lines[j] = `${lines[j]}\n${indent})}\n`;
        }

        // Skip ahead
        i = j;
    }
}

fs.writeFileSync('src/components/EditorSidebar.jsx', lines.join('\n'), 'utf8');
console.log("Refactored properly!");
