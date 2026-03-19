const fs = require('fs');
let lines = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\muhai001\\muhai001\\src\\app\\page.tsx', 'utf8').split('\n');

// 找到在职/在读证明文件生成所在的行，然后在下一行修改
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("description: '在职/在读证明文件生成'")) {
        console.log('Found at line', i+1);
        // 检查下一行是否是 status
        if (lines[i+1].includes("status: 'coming_soon'")) {
            lines[i+1] = "    status: 'new',";
            // 在后面插入 href 行
            lines.splice(i+2, 0, "    href: '/proof',");
            console.log('Modified');
        }
        break;
    }
}

fs.writeFileSync('C:\\Users\\Administrator\\Desktop\\muhai001\\muhai001\\src\\app\\page.tsx', lines.join('\n'));
console.log('Done');
