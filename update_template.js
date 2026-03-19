const fs = require('fs');
let content = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\muhai001\\muhai001\\src\\lib\\translation\\proofTemplates.ts', 'utf8');

// 修改中文模板 - 将 {{COMPANY_NATURE}} 改为根据公司性质动态显示
// 修改模板中固定的公司性质为公司/单位
content = content.replace(
  /\{\{COMPANY_NATURE\}\}\{\{COMPANY_NAME\}\}批准他\/她于/g,
  '{{COMPANY_NATURE}}{{COMPANY_NAME}}批准{{GENDER}}于'
);

content = content.replace(
  /我\{\{COMPANY_NATURE\}\}\{\{COMPANY_NAME\}\}同意并承诺/g,
  '我{{COMPANY_NATURE}}{{COMPANY_NAME}}同意并承诺'
);

// 修改费用承担人显示 - 去掉"Expense Bearer:"
content = content.replace(
  /所有差旅费由\{\{EXPENSE_BEARER\}\}承担/g,
  '所有差旅费由{{EXPENSE_BEARER}}承担'
);

fs.writeFileSync('C:\\Users\\Administrator\\Desktop\\muhai001\\muhai001\\src\\lib\\translation\\proofTemplates.ts', content);
console.log('Done - template updated');
