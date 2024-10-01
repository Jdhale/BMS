const fs = require('fs');
const path = require('path');

function writeDirectoryStructure(rootDir, file) {
    function writeStructure(currentDir, indent = "") {
        const entries = fs.readdirSync(currentDir);
        const dirs = entries.filter(entry => fs.statSync(path.join(currentDir, entry)).isDirectory());
        const files = entries.filter(entry => fs.statSync(path.join(currentDir, entry)).isFile());

        // Create write stream for the file
        const writeStream = fs.createWriteStream(file, { flags: 'a' });

        // Write files first
        files.forEach((entry, i) => {
            if (['.gitignore', '.DS_Store'].includes(entry)) return; // Skip specific files
            const isLast = i === files.length - 1 && dirs.length === 0;
            if (isLast) {
                writeStream.write(`${indent}└── ${entry}\n`);
            } else {
                writeStream.write(`${indent}├── ${entry}\n`);
            }
        });

        // Write directories
        dirs.forEach((entry, i) => {
            if (['node_modules', '.git'].includes(entry)) return; // Skip specific directories

            const dirPath = path.join(currentDir, entry);
            const isLast = i === dirs.length - 1;
            if (isLast) {
                writeStream.write(`${indent}└── ${entry}\n`);
                writeStructure(dirPath, indent + "    ");
            } else {
                writeStream.write(`${indent}├── ${entry}\n`);
                writeStructure(dirPath, indent + "│   ");
            }
        });

        writeStream.end(); // End the write stream
    }

    fs.writeFileSync(file, `${rootDir}\n`); // Write the root directory at the beginning
    writeStructure(rootDir);
}

function writeJsFilesContents(rootDir, file) {
    function writeJsContents(currentDir) {
        const entries = fs.readdirSync(currentDir);
        const dirs = entries.filter(entry => fs.statSync(path.join(currentDir, entry)).isDirectory());
        const files = entries.filter(entry => fs.statSync(path.join(currentDir, entry)).isFile());

        const writeStream = fs.createWriteStream(file, { flags: 'a' });

        // Write contents of JS and HBS files
        files.forEach(entry => {
            if (entry.endsWith('.js') || entry.endsWith('.hbs')) {
                const filePath = path.join(currentDir, entry);
                const relativePath = path.relative(rootDir, filePath);
                writeStream.write(`${relativePath}\n`);
                writeStream.write(`// Content of ${relativePath}:\n`);
                const content = fs.readFileSync(filePath, 'utf-8');
                writeStream.write(`${content}\n\n`);
            }
        });

        // Process directories
        dirs.forEach(entry => {
            if (['node_modules', '.git'].includes(entry)) return; // Skip specific directories

            const dirPath = path.join(currentDir, entry);
            writeJsContents(dirPath);
        });

        writeStream.end(); // End the write stream
    }

    fs.writeFileSync(file, `JavaScript files in ${rootDir}:\n\n`); // Write header
    writeJsContents(rootDir);
}

// Update folderPath to your specific folder path
const folderPath = 'C:\\Users\\jaydatta\\OneDrive\\Desktop\\Janhvi(Onedrive)\\Project'; // Note the double backslashes
const directoryFile = 'directory_structure.txt';
const jsFilesFile = 'js_files_contents.txt';

// Generate directory structure
writeDirectoryStructure(folderPath, directoryFile);
console.log(`Directory structure has been written to ${directoryFile}`);

// Generate JavaScript files content
writeJsFilesContents(folderPath, jsFilesFile);
console.log(`JavaScript files contents have been written to ${jsFilesFile}`);
