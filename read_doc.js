const mammoth = require('mammoth');
const fs = require('fs');

async function extractDocContent(filePath) {
    try {
        console.log(`Reading file: ${filePath}`);
        
        const result = await mammoth.extractRawText({ path: filePath });
        const text = result.value;
        
        console.log("=== DOCUMENT CONTENT ===");
        console.log(text);
        console.log("=== END OF CONTENT ===");
        
        return text;
    } catch (error) {
        console.error("Error reading document:", error);
    }
}

// Read Chinese template
console.log("=== READING CHINESE TEMPLATE ===");
extractDocContent("C:/Users/Administrator/Desktop/muhai001/muhai001/在职中文模板.doc");
