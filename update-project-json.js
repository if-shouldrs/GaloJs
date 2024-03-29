const fs = require('fs');
const path = require('path');

// Define the paths
const srcDir = './src';
const projectJsonPath = './cocos/project.json';

// Recursive function to read files from a directory
function readJsFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            // Recurse into a subdirectory
            readJsFiles(filePath, fileList);
        } else if (file.endsWith('.js')) {
            // Add the JavaScript file to the list
            // Use replace to ensure forward slashes and remove leading './'
            fileList.push(filePath.replace(/\\/g, '/').replace(/^\.\//, ''));
        }
    });

    return fileList;
}

// Read all JavaScript files from the src directory
const jsFiles = readJsFiles(srcDir);

// Read and parse the project.json file
const projectJson = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));

// Update the jsList array
projectJson.jsList = jsFiles;

// Write the updated project.json back
fs.writeFileSync(projectJsonPath, JSON.stringify(projectJson, null, 4) + "\n", 'utf8');

console.log('Updated project.json with JS files from src/');
