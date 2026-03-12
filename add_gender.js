const fs = require('fs');

let content = fs.readFileSync('src/app/proof/page.tsx', 'utf8');

// Add GENDER_EN after GENDER in FormData interface
content = content.replace(
  "GENDER: string;\n  HIRE_DATE",
  "GENDER: string;\n  GENDER_EN: string;\n  HIRE_DATE"
);

// Add GENDER_EN default value in getDefaultFields
content = content.replace(
  "GENDER: '男',\n  HIRE_DATE",
  "GENDER: '男',\n  GENDER_EN: '',\n  HIRE_DATE"
);

fs.writeFileSync('src/app/proof/page.tsx', content, 'utf8');
console.log('Done!');
