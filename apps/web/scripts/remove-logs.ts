import * as fs from 'fs';
import * as path from 'path';

// Configuration
const extensions: string[] = ['.ts', '.tsx', '.js', '.jsx'];
const excludeDirs: string[] = ['node_modules', '.next', '.git', 'dist', 'build', '.turbo'];

function removeConsoleLogs(content: string): string {
    let result = content;

    const consoleTypes = ['log', 'info', 'debug'];

    for (const type of consoleTypes) {
        const regex = new RegExp(`console\\.${type}\\s*\\(`, 'g');
        let match;

        while ((match = regex.exec(result)) !== null) {
            const startIndex = match.index;
            const openParenIndex = match.index + match[0].length - 1;

            let parenCount = 1;
            let currentIndex = openParenIndex + 1;
            let inString = false;
            let stringChar = '';
            let inTemplate = false;
            let escaped = false;

            while (currentIndex < result.length && parenCount > 0) {
                const char = result[currentIndex];

                if (escaped) {
                    escaped = false;
                    currentIndex++;
                    continue;
                }

                if (char === '\\') {
                    escaped = true;
                    currentIndex++;
                    continue;
                }

                // Handle template literals
                if (char === '`' && !inString) {
                    inTemplate = !inTemplate;
                } else if ((char === '"' || char === "'") && !inTemplate) {
                    if (!inString) {
                        inString = true;
                        stringChar = char;
                    } else if (char === stringChar) {
                        inString = false;
                        stringChar = '';
                    }
                } else if (!inString && !inTemplate) {
                    if (char === '(') {
                        parenCount++;
                    } else if (char === ')') {
                        parenCount--;
                    }
                }

                currentIndex++;
            }

            if (parenCount === 0) {
                let endIndex = currentIndex;
                while (endIndex < result.length && /\s/.test(result[endIndex]!)) {
                    endIndex++;
                }
                if (endIndex < result.length && result[endIndex] === ';') {
                    endIndex++;
                }

                const beforeStatement = result.substring(0, startIndex);
                const afterStatement = result.substring(endIndex);
                result = beforeStatement + afterStatement;

                regex.lastIndex = 0;
            }
        }
    }

    return result;
}

function shouldProcessFile(filePath: string): boolean {
    const ext = path.extname(filePath);
    return extensions.includes(ext);
}

function shouldSkipDirectory(dirName: string): boolean {
    return excludeDirs.includes(dirName) || dirName.startsWith('.');
}

function processFile(filePath: string): boolean {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const processedContent = removeConsoleLogs(content);

        if (content !== processedContent) {
            fs.writeFileSync(filePath, processedContent);

            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        return false;
    }
}

function processDirectory(dirPath: string): number {
    let processedFiles = 0;

    try {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                if (!shouldSkipDirectory(item)) {
                    processedFiles += processDirectory(fullPath);
                }
            } else if (stats.isFile() && shouldProcessFile(fullPath)) {
                if (processFile(fullPath)) {
                    processedFiles++;
                }
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
    }

    return processedFiles;
}

// Main execution
function main(): void {
    const projectRoot = process.cwd();
    processDirectory(projectRoot);
}

main();