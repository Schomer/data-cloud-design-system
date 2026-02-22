import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from 'fs';
import path from 'path';

// Custom plugin to act as a backend route for the "Update Skills" button
const templateUpdatePlugin = () => ({
    name: 'template-updater',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            if (req.url === '/api/update-template' && req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        const specs = data.specs;

                        const templatePath = path.resolve(__dirname, '../ui_prompt_template.md');
                        let content = fs.readFileSync(templatePath, 'utf8');

                        const btnSpec = specs.button;
                        const primaryClasses = `bg-[${btnSpec.primaryBg}] hover:bg-[${btnSpec.primaryHoverBg}] text-[${btnSpec.primaryText}] rounded-[${btnSpec.borderRadius}px] px-[${btnSpec.paddingX}px] py-[${btnSpec.paddingY}px] font-[${btnSpec.fontWeight}] transition-colors shadow-sm`;
                        const secondaryClasses = `bg-[${btnSpec.secondaryBg}] dark:bg-[${btnSpec.secondaryDarkBg}] hover:bg-[${btnSpec.secondaryHoverBg}] dark:hover:bg-[${btnSpec.secondaryDarkHoverBg}] text-[${btnSpec.secondaryText}] dark:text-[${btnSpec.secondaryDarkText}] border border-[${btnSpec.secondaryBorder}] dark:border-[${btnSpec.secondaryDarkBorder}] rounded-[${btnSpec.borderRadius}px] px-[${btnSpec.paddingX}px] py-[${btnSpec.paddingY}px] font-[${btnSpec.fontWeight}] transition-colors shadow-sm`;
                        const destructiveClasses = `bg-[${btnSpec.destructiveBg}] hover:bg-[${btnSpec.destructiveHoverBg}] text-[${btnSpec.destructiveText}] rounded-[${btnSpec.borderRadius}px] px-[${btnSpec.paddingX}px] py-[${btnSpec.paddingY}px] font-[${btnSpec.fontWeight}] transition-colors shadow-sm`;
                        const ghostClasses = `text-[${btnSpec.ghostText}] dark:text-[${btnSpec.ghostDarkText}] hover:bg-[${btnSpec.ghostHoverBg}] dark:hover:bg-[${btnSpec.ghostDarkHoverBg}] rounded-[${btnSpec.borderRadius}px] px-[${btnSpec.paddingX}px] py-[${btnSpec.paddingY}px] font-[${btnSpec.fontWeight}] transition-colors bg-transparent border border-transparent shadow-none`;

                        // Regex to find and replace the buttons section
                        const buttonRegex = /- \*\*Buttons:\*\*[\s\S]*?- Primary: `(.*?)`\.[\s\S]*?- Secondary: `(.*?)`\.[\s\S]*?- Destructive: `(.*?)`\.[\s\S]*?- Ghost: `(.*?)`\./;
                        const btnReplacement = `- **Buttons:** \n  - Primary: \`${primaryClasses}\`.\n  - Secondary: \`${secondaryClasses}\`.\n  - Destructive: \`${destructiveClasses}\`.\n  - Ghost: \`${ghostClasses}\`.`;

                        content = content.replace(buttonRegex, btnReplacement);

                        // INPUTS Export Logic
                        const inputSpec = specs.input;
                        const inputClasses = `w-full bg-[${inputSpec.bg}] dark:bg-[${inputSpec.darkBg}] border border-[${inputSpec.borderColor}] dark:border-[${inputSpec.darkBorderColor}] rounded-[${inputSpec.borderRadius}px] px-[${inputSpec.paddingX}px] py-[${inputSpec.paddingY}px] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[${inputSpec.focusRingColor}]/50 focus:border-[${inputSpec.focusRingColor}] text-slate-900 dark:text-slate-100 transition-all`;

                        // Regex to find and replace the inputs section - look for the specific starting text and stop at the next bullet
                        const inputRegex = /- \*\*Inputs:\*\* `(.*?)`\. Provide a `label` with `(.*?)`\./;
                        const inputReplacement = `- **Inputs:** \`${inputClasses}\`. Provide a \`label\` with \`text-xs font-medium text-slate-500 mb-1.5\`.`;

                        content = content.replace(inputRegex, inputReplacement);

                        // CARDS Export Logic
                        const cardSpec = specs.card;
                        // 1. Update Global Visuals & Theming -> Cards / Containers
                        const containerRegex = /- Cards \/ Containers: `bg-\[\#(.*?)\]`/g;
                        const containerReplacement = `- Cards / Containers: \`bg-[${cardSpec.darkBg}]\``;
                        content = content.replace(containerRegex, containerReplacement);

                        // 2. Update KPI Cards section specifically
                        const kpiCardRegex = /#### 1\. KPI Cards[\s\S]*?- Should have a subtle border \(`(.*?)`\)\.[\s\S]*?- Display a small icon \(e\.g\., a trend arrow or lucide icon\) next to a large numeric value\.[\s\S]*?- Small text labels for the value title \(`(.*?)` or `(.*?)`\)\.[\s\S]*?- \*\*Trend Indicator:\*\* Should use a pill-style background based on value: `(.*?)` and `(.*?)` for positive trends\. Negative trends should use `(.*?)` equivalents\. Include small embedded trend arrows\./;

                        const kpiReplacement = `#### 1. KPI Cards\n- Should have a subtle border (\`border-[${cardSpec.darkBorderColor}]\`).\n- Display a small icon (e.g., a trend arrow or lucide icon) next to a large numeric value.\n- Small text labels for the value title (\`text-[${cardSpec.titleColor}]\` or \`text-[${cardSpec.darkTitleColor}]\`).\n- **Trend Indicator:** Should use a pill-style background based on value: \`bg-emerald-100 text-emerald-700\` and \`dark:bg-emerald-900/30 dark:text-emerald-400\` for positive trends. Negative trends should use \`bg-rose-100 dark:bg-rose-900/30\` equivalents. Include small embedded trend arrows.`;

                        content = content.replace(kpiCardRegex, kpiReplacement);

                        fs.writeFileSync(templatePath, content, 'utf8');

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ success: true }));
                    } catch (e) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: e.message }));
                    }
                });
                return;
            }
            next();
        });
    }
});

export default defineConfig({
    plugins: [react(), templateUpdatePlugin()],
});
