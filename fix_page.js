const fs = require('fs');
let content = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\muhai001\\muhai001\\src\\app\\page.tsx', 'utf8');

// 只替换在职/在读证明文件生成后面的 status
const oldStr = `description: '在职/在读证明文件生成',
    status: 'coming_soon',
    color: 'from-morandi-clay to-morandi-sand',
    iconBg: 'bg-morandi-clay',
  },
  {
    id: 5,`;

const newStr = `description: '在职/在读证明文件生成',
    status: 'new',
    href: '/proof',
    color: 'from-morandi-clay to-morandi-sand',
    iconBg: 'bg-morandi-clay',
  },
  {
    id: 5,`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('C:\\Users\\Administrator\\Desktop\\muhai001\\muhai001\\src\\app\\page.tsx', content);
console.log('Done');
