const fs = require('fs');
const babel = require('@babel/core');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const code = fs.readFileSync('src/components/EditorSidebar.jsx', 'utf8');
const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx']
});

traverse(ast, {
  JSXElement(path) {
    const isSettingDiv = path.node.openingElement.name.name === 'div' && path.node.children.some(c => 
      c.type === 'JSXElement' && c.openingElement.name.name === 'label'
    );
    if (isSettingDiv) {
      let propName = '';
      path.traverse({
        CallExpression(cp) {
          if (cp.node.callee.name === 'updateGlobalSpec') {
            propName = cp.node.arguments[1].value;
          }
        }
      });
      if (propName) console.log(propName);
    }
  }
});
