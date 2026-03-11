const fs = require('fs');
let content = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\muhai001\\muhai001\\src\\app\\page.tsx', 'utf8');

// 1. 调整hero区域 - pt-4改为pt-1, 添加mt-2
content = content.replace(
  /className="flex-1 flex flex-col justify-start pt-4 md:pt-8"/,
  'className="flex-1 flex flex-col justify-start pt-1 md:pt-2"'
);

content = content.replace(
  /className="text-center mb-1 md:mb-2"/,
  'className="text-center mb-1 md:mb-2 mt-2"'
);

fs.writeFileSync('C:\\Users\\Administrator\\Desktop\\muhai001\\muhai001\\src\\app\\page.tsx', content);
console.log('Done - hero section adjusted');
