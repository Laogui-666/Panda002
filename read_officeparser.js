const officeparser = require('officeparser');

async function extractDocContent(filePath) {
    try {
        console.log(`Reading file: ${filePath}`);
        
        // Parse the Office document
        const data = await officeparser.parseOfficeAsync(filePath);
        
        console.log("=== DOCUMENT CONTENT ===");
        console.log(data);
        console.log("=== END OF CONTENT ===");
        
        return data;
    } catch (error) {
        console.error("Error reading document:", error);
    }
}

// Read Chinese template
console.log("=== READING CHINESE TEMPLATE ===");
extractDocContent("C:/Users/Administrator/Desktop/muhai001/muhai001/在职中文模板.doc");
