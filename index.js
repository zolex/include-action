const fs = require('fs')
const path = require('path')
const process = require('process')
const core = require('@actions/core');

const processIncludes = fileName => {
    const fileContent = fs.readFileSync(fileName, 'utf8');
    const currentPath = path.dirname(fileName);
    core.info("processing file: " + fileName);

    return fileContent.replace(/^#include "([^"]+)"/m, (match, includeFile) => {
        const realPath = path.resolve(currentPath + '/' + includeFile);
        core.info('#include "'+ includeFile +'"');
        return processIncludes(realPath);
    });
};

const inputFile = core.getInput('input') || process.argv[2];
const outputFile = core.getInput('output') || process.argv[3];

try {
    const processedContent = processIncludes(inputFile);

    if (outputFile) {
        fs.writeFileSync(outputFile, processedContent);
        core.info("Writing processed file contents to: "+ outputFile);
    }

    core.info(processedContent);
    core.setOutput('dockerfile', processedContent);
} catch (err) {
    core.error(err);
    process.exit(1);
}
