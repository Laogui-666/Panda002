const ole = require('ole-doc');
const fs = require('fs');

async function extractDocContent(filePath) {
    try {
        console.log(`Reading file: ${filePath}`);
        
        const oleDoc = new ole.OleCompoundFile(filePath);
        
        // Try to find and extract WordDocument stream
        // OLE compound documents store Word data in "WordDocument" stream
        if (oleDoc.streams.includes('WordDocument')) {
            console.log("Found WordDocument stream");
            const stream = oleDoc.openStream('WordDocument');
            
            // Read some data
            const buffer = Buffer.alloc(stream.length);
            stream.read(buffer, 0, buffer.length);
            
            console.log("Stream length:", stream.length);
            console.log("First 500 bytes (hex):", buffer.slice(0, 500).toString('hex'));
            console.log("First 500 bytes (utf16):", buffer.slice(0, 500).toString('utf16le'));
        } else {
            console.log("Available streams:", oleDoc.streams);
        }
        
        oleDoc.close();
        
    } catch (error) {
        console.error("Error reading document:", error);
    }
}

// Read Chinese template
console.log("=== READING CHINESE TEMPLATE ===");
extractDocContent("C:/Users/Administrator/Desktop/muhai001/muhai001/在职中文模板.doc");
