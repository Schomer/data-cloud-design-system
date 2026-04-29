const fs = require('fs');
const babel = require('@babel/core');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

const code = fs.readFileSync('src/components/EditorSidebar.jsx', 'utf8');

// Replace export default function EditorSidebar() {
// with export default function EditorSidebar({ isDarkMode }) {
let newCode = code.replace(
    'export default function EditorSidebar() {',
    'export default function EditorSidebar({ isDarkMode }) {'
);

const ast = parser.parse(newCode, {
    sourceType: 'module',
    plugins: ['jsx']
});

const lightPropsWithDarkOverrides = {
    button: ['secondaryBg', 'secondaryHoverBg', 'secondaryText', 'secondaryBorder', 'ghostHoverBg', 'ghostText'],
    input: ['bg', 'borderColor'],
    card: ['bg', 'borderColor', 'titleColor', 'valueColor'],
    nav: ['activeText', 'inactiveText', 'hoverText'],
    overlay: ['bg', 'borderColor'],
    table: ['bg', 'borderColor', 'headerText', 'rowText', 'rowBorder']
};

const wrappedElements = new Set();

traverse(ast, {
    JSXElement(path) {
        if (wrappedElements.has(path.node)) return;

        // Check if this is a div containing a label and updateGlobalSpec
        const isSettingDiv = path.node.openingElement.name.name === 'div' && path.node.children.some(c =>
            c.type === 'JSXElement' && c.openingElement.name.name === 'label'
        );

        if (isSettingDiv) {
            // Find the component type and property name
            let compType = '';
            let propName = '';

            path.traverse({
                CallExpression(cp) {
                    if (cp.node.callee.name === 'updateGlobalSpec' && cp.node.arguments.length >= 2) {
                        compType = cp.node.arguments[0].value;
                        propName = cp.node.arguments[1].value;
                    }
                }
            });

            if (!compType || !propName) return;

            let isDarkInput = propName.toLowerCase().includes('dark');
            let isLightOnlyInput = lightPropsWithDarkOverrides[compType] && lightPropsWithDarkOverrides[compType].includes(propName);

            if (isDarkInput) {
                const exp = t.jsxExpressionContainer(
                    t.logicalExpression('&&', t.identifier('isDarkMode'), path.node)
                );
                wrappedElements.add(path.node);
                path.replaceWith(exp);
            } else if (isLightOnlyInput) {
                const exp = t.jsxExpressionContainer(
                    t.logicalExpression('&&', t.unaryExpression('!', t.identifier('isDarkMode')), path.node)
                );
                wrappedElements.add(path.node);
                path.replaceWith(exp);
            }
        }
    },

    // Also hide the label "Dark Mode Overrides"
    JSXElement(path) {
        if (wrappedElements.has(path.node)) return;
        if (path.node.openingElement.name.name === 'label') {
            const textNode = path.node.children.find(c => c.type === 'JSXText');
            if (textNode && textNode.value.trim() === 'Dark Mode Overrides') {
                const exp = t.jsxExpressionContainer(
                    t.logicalExpression('&&', t.identifier('isDarkMode'), path.node)
                );
                wrappedElements.add(path.node);
                path.replaceWith(exp);
            }
        }
    }
});

const output = generator(ast, { retainLines: false }, newCode);
fs.writeFileSync('src/components/EditorSidebar.jsx', output.code, 'utf8');
console.log('Done refactoring EditorSidebar.jsx');
